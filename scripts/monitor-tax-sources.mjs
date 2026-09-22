#!/usr/bin/env node

/**
 * scripts/monitor-tax-sources.mjs
 *
 * Authoritative Tax Source Change Detection (Section 6, 7, 8, 15).
 *
 * Pipeline:
 *   official source → fetch → normalize → fingerprint/hash
 *     → compare vs. last known state
 *     → no change  → exit 0
 *     → change     → create/update GitHub issue (never auto-merge / auto-publish)
 *
 * Absolute rule: This script NEVER mutates production tax data or triggers deploy.
 */

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import {
  normalizeSourceContent,
  computeFingerprint,
  formatChangeIssuePayload,
} from '../src/lib/tax/monitor-utils.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sourcesPath = resolve(__dirname, '../src/data/tax/india/sources.json');

const USER_AGENT = 'Calcumetrics-Regulatory-Monitor/1.0 (https://calcumetrics.com; compliance@calcumetrics.com)';
const FETCH_TIMEOUT_MS = 15000;

async function fetchSourceWithTimeout(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/pdf;q=0.8,*/*;q=0.7',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('pdf')) {
      const arrayBuffer = await response.arrayBuffer();
      return {
        format: 'pdf',
        content: Buffer.from(arrayBuffer).toString('base64'),
      };
    }

    const text = await response.text();
    return {
      format: 'html',
      content: text,
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

function checkGhCliAvailable() {
  try {
    execSync('gh --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function handleDetectedChange(change) {
  const { title, body } = formatChangeIssuePayload(change);

  console.log(`\n🚨 [CHANGE DETECTED] for ${change.id}`);
  console.log(`Authority: ${change.authority}`);
  console.log(`Source URL: ${change.sourceUrl}`);
  console.log(`Old Hash: ${change.previousFingerprint}`);
  console.log(`New Hash: ${change.newFingerprint}`);

  if (!process.env.GITHUB_ACTIONS || !process.env.GITHUB_TOKEN) {
    console.log('\n[Local / Test Mode] Skipping GitHub issue creation (no GITHUB_TOKEN set).');
    return;
  }

  if (!checkGhCliAvailable()) {
    console.log('[Notice] GitHub CLI (gh) not installed. Issue creation skipped.');
    return;
  }

  try {
    // Check if an open issue already exists for this source to prevent duplicate issue spam (Section 15)
    const existingIssues = execSync(
      `gh issue list --state open --search "${change.id} in:title" --json number,title`,
      { encoding: 'utf8' }
    );
    const parsed = JSON.parse(existingIssues || '[]');

    if (parsed.length > 0) {
      const issueNumber = parsed[0].number;
      console.log(`Found existing open issue #${issueNumber}. Appending notification comment...`);
      execSync(
        `gh issue comment ${issueNumber} --body "Automated check verified change is still pending review on ${change.timestamp}. New fingerprint: \`${change.newFingerprint}\`."`,
        { stdio: 'inherit' }
      );
    } else {
      console.log('Creating new GitHub issue for human review...');
      execSync(
        `gh issue create --title "${title}" --body "${body.replace(/"/g, '\\"')}" --label "tax-source-change"`,
        { stdio: 'inherit' }
      );
    }
  } catch (err) {
    console.error(`Failed to record issue via GitHub CLI: ${err.message}`);
  }
}

async function main() {
  console.log('── Calcumetrics Tax Source Monitor ───────────────────────');
  console.log(`Reading source manifest from: ${sourcesPath}`);

  const raw = readFileSync(sourcesPath, 'utf8');
  const sources = JSON.parse(raw);
  const enabledSources = sources.filter((s) => s.enabled);

  console.log(`Monitoring ${enabledSources.length} active authoritative source(s)...`);

  let detectedChanges = 0;

  for (const source of enabledSources) {
    process.stdout.write(`Checking ${source.id} (${source.url})... `);

    try {
      const { content, format } = await fetchSourceWithTimeout(source.url);
      const normalized = normalizeSourceContent(content, format);
      const newHash = computeFingerprint(normalized);

      if (newHash !== source.contentHash) {
        process.stdout.write('CHANGED\n');
        detectedChanges++;

        handleDetectedChange({
          id: source.id,
          authority: source.authority,
          title: source.title,
          sourceUrl: source.url,
          timestamp: new Date().toISOString(),
          previousFingerprint: source.contentHash,
          newFingerprint: newHash,
          domain: source.taxDomain,
          affectedTaxPeriod: source.applicablePeriods.join(', '),
          requiresManualReview: true,
        });
      } else {
        process.stdout.write('OK (Unchanged)\n');
      }
    } catch (err) {
      process.stdout.write(`SKIPPED / UNREACHABLE (${err.message})\n`);
      // Network failures or site maintenance do not crash the workflow
    }
  }

  console.log('\n── Monitor Run Complete ──────────────────────────────────');
  console.log(`Total checked: ${enabledSources.length}, Discrepancies detected: ${detectedChanges}`);
  console.log('Safe exit: Production data remains byte-for-byte intact.');
  process.exit(0);
}

main().catch((err) => {
  console.error(`Fatal error in monitor script: ${err}`);
  process.exit(1);
});

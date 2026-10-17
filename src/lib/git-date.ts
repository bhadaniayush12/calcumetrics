/**
 * Build-time "last edited" date for a source file, read from git history.
 * Returns an ISO date (YYYY-MM-DD), or null when git or the history is unavailable,
 * so callers can omit the date rather than show a made-up one.
 */
import { execFileSync } from 'node:child_process';

export function gitLastEdited(filePath: string): string | null {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', filePath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    return null;
  }
}

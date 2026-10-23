import type { BlogPost } from './types';
import { PHASE_11_POSTS } from './posts-phase11';
import { BATCH_1_POSTS } from './batch1';
import { BATCH_2_POSTS } from './batch2';
import { BATCH_3_POSTS } from './batch3';
import { BATCH_4_POSTS } from './batch4';
import { BATCH_5_POSTS } from './batch5';
import { BATCH_6_POSTS } from './batch6';

import { JIO_IPO_POST } from './jio-platforms-ipo-listing-gains-tax';

import { SBI_OCTOBER_POST } from './sbi-home-loan-rate-hike-october-2026-emi';

import { SMALL_SAVINGS_POST } from './small-savings-rates-october-december-2026';

import { DIWALI_BONUS_POST } from './diwali-bonus-2026-lump-sum-sip-or-prepay';

import { NEW_TAX_ACT_POST } from './new-income-tax-act-2025-salaried-guide';

import { RBI_FD_NEWS_POST } from './rbi-repo-rate-5-50-fd-returns-october-2026';

import { ITR_AUDIT_NEWS_POST } from './itr-due-date-21-november-2026-late-fee-interest';

import { DHANTERAS_NEWS_POST } from './dhanteras-2026-gold-vs-sip';

import { SECTION_87A_MARGINAL_RELIEF_POST } from './section-87a-marginal-relief-new-regime-example';
import { WDV_DEPRECIATION_NUMERICAL_POST } from './wdv-depreciation-numerical-with-solution';

export const BLOG_POSTS: BlogPost[] = [
  SECTION_87A_MARGINAL_RELIEF_POST,
  WDV_DEPRECIATION_NUMERICAL_POST,
  DHANTERAS_NEWS_POST,
  ITR_AUDIT_NEWS_POST,
  RBI_FD_NEWS_POST,
  NEW_TAX_ACT_POST,
  DIWALI_BONUS_POST,
  SMALL_SAVINGS_POST,
  SBI_OCTOBER_POST,
  JIO_IPO_POST,
  ...PHASE_11_POSTS,
  ...BATCH_1_POSTS,
  ...BATCH_2_POSTS,
  ...BATCH_3_POSTS,
  ...BATCH_4_POSTS,
  ...BATCH_5_POSTS,
  ...BATCH_6_POSTS,
];

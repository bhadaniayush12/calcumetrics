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

export const BLOG_POSTS: BlogPost[] = [
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

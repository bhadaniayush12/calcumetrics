import type { BlogPost } from './types';
import { PHASE_11_POSTS } from './posts-phase11';
import { BATCH_1_POSTS } from './batch1';
import { BATCH_2_POSTS } from './batch2';
import { BATCH_3_POSTS } from './batch3';
import { BATCH_4_POSTS } from './batch4';

export const BLOG_POSTS: BlogPost[] = [
  ...PHASE_11_POSTS,
  ...BATCH_1_POSTS,
  ...BATCH_2_POSTS,
  ...BATCH_3_POSTS,
  ...BATCH_4_POSTS,
];

import type { BlogPost } from './types';
import { PHASE_11_POSTS } from './posts-phase11';
import { BATCH_1_POSTS } from './batch1';

export const BLOG_POSTS: BlogPost[] = [
  ...PHASE_11_POSTS,
  ...BATCH_1_POSTS,
];

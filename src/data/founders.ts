import devAvatar from '../assets/avatars/dev.svg?raw';
import yuvrajAvatar from '../assets/avatars/yuvraj.svg?raw';

export interface Founder {
  id: 'dev' | 'yuvraj';
  name: string;
  role: string;
  bio: string;
  signature: string;
  avatarSvg: string;
  avatarAlt: string;
}

export const FOUNDERS: Record<Founder['id'], Founder> = {
  dev: {
    id: 'dev',
    name: 'Dev',
    role: 'Founder & Editor',
    bio: 'Dev founded Calcumetrics to make Indian tax, loan and business maths easy to check. He researches every rule, designs the calculators and reviews each page against official sources such as the Income Tax Department, RBI and the GST Council.',
    signature: '— Dev, Founder',
    avatarSvg: devAvatar,
    avatarAlt: 'Illustration of Dev',
  },
  yuvraj: {
    id: 'yuvraj',
    name: 'Yuvraj',
    role: 'Co-founder, Design',
    bio: 'Yuvraj co-founded Calcumetrics and refines its interface and user experience, so every calculator is quick to use on any screen.',
    signature: '— Yuvraj, Co-founder',
    avatarSvg: yuvrajAvatar,
    avatarAlt: 'Illustration of Yuvraj',
  },
};

export const FOUNDER_LIST: Founder[] = [FOUNDERS.dev, FOUNDERS.yuvraj];

/** Schema.org Person node for a founder (no sameAs: founders stay anonymous). */
export function founderPerson(founder: Founder) {
  return {
    '@type': 'Person',
    '@id': `https://calcumetrics.com/about#${founder.id}`,
    name: founder.name,
    jobTitle: founder.role,
    url: `https://calcumetrics.com/about#${founder.id}`,
  };
}

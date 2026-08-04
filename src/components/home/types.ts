export type HomeProfile = {
  name: string;
  role: string;
  bio: string;
  avatarUrl: string | null;
  tagline: string | null;
  location: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  resumeUrl: string | null;
} | null;

export type HomeSkill = {
  id: number;
  name: string;
  iconUrl: string;
  level: number;
  category: string;
};

export type HomeExperience = {
  id: number;
  company: string;
  role: string;
  startDate: Date;
  endDate: Date | null;
  summary: string;
  highlights: string;
  tech: string;
  type: string;
};

export type HomeProject = {
  id: number;
  title: string;
  description: string;
  imageUrl: string | null;
  link: string | null;
  problem: string | null;
  solution: string | null;
  result: string | null;
  order: number;
};

export type HomeCaseStudy = HomeProject & {
  problem: string;
  solution: string;
  result: string;
};

export type HomePost = {
  id: number;
  slug: string;
  title: string;
  createdAt: Date;
};

export type HomeData = {
  profile: HomeProfile;
  skills: HomeSkill[];
  projects: HomeProject[];
  experiences: HomeExperience[];
  caseStudies: HomeCaseStudy[];
  latestPosts: HomePost[];
  years: number;
};

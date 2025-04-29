import { projects } from "@/data/projects";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  image?: string;
  tags?: string[];
  category?: string; // Added category property
  link?: string;
  collaborators?: string[];
  starCount?: number;
  startDate?: string;
  endDate?: string;
}

export function getProjects(): Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

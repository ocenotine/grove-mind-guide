
import { projects } from "@/data/projects";

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  image?: string;
  tags?: string[];
  category?: string;
  link?: string;
  collaborators?: string[];
  starCount?: number;
  startDate?: string;
  endDate?: string;
  featured?: boolean;
  date?: string; // Added date property
}

export function getProjects(): Project[] {
  return projects;
}

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

// Added function to get featured projects
export function getFeaturedProjects(count: number = 3): Project[] {
  const featured = projects.filter(project => project.featured);
  const others = projects.filter(project => !project.featured);
  return [...featured, ...others].slice(0, count);
}

// Added function to get project categories
export function getProjectCategories(): string[] {
  const categories = projects.map(project => project.category || 'Uncategorized');
  return ['All', ...Array.from(new Set(categories))];
}

// Added function to get project tags
export function getProjectTags(): string[] {
  const allTags: string[] = [];
  projects.forEach(project => {
    if (project.tags && Array.isArray(project.tags)) {
      allTags.push(...project.tags);
    }
  });
  return ['All', ...Array.from(new Set(allTags))];
}

// Added function to search projects
export function searchProjects(query: string): Project[] {
  if (!query) return projects;
  
  const lowerQuery = query.toLowerCase();
  return projects.filter(project => 
    project.title.toLowerCase().includes(lowerQuery) ||
    project.description.toLowerCase().includes(lowerQuery) ||
    (project.category && project.category.toLowerCase().includes(lowerQuery)) ||
    (Array.isArray(project.tags) && project.tags.some(tag => tag.toLowerCase().includes(lowerQuery)))
  );
}

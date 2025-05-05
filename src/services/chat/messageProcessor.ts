
import { Project } from '@/components/project/ProjectCard';
import { extractKeywords } from './extractKeywords';
import { searchProjectsByKeywords, fetchProjects } from './projectFetcher';
import { findRelevantProjects } from './semanticSearch';

/**
 * Processes user messages and returns appropriate responses with relevant projects
 */
export const processUserMessage = async (
  userMessage: string
): Promise<{
  content: string;
  projects?: Project[];
  showProjects?: boolean;
}> => {
  console.log('Processing user message:', userMessage);
  
  // Check for explicit requests to see projects/portfolio/work
  const showProjectsRegex = /show\s+(?:me\s+)?(?:recent\s+)?(?:work|projects?|portfolio|all)/i;
  const isProjectOrWorkMention = userMessage.toLowerCase().includes('project') || 
                              userMessage.toLowerCase().includes('work') ||
                              userMessage.toLowerCase().includes('portfolio');
  
  // Function to sort projects by year in descending order
  const sortProjectsByYear = (projects: Project[]): Project[] => {
    return [...projects].sort((a, b) => {
      // Sort by year if available, otherwise use creation date
      const yearA = a.year || 0;
      const yearB = b.year || 0;
      return yearB - yearA; // Descending order (newest first)
    });
  };
  
  // Handle direct requests for showing projects
  if (
    showProjectsRegex.test(userMessage.toLowerCase()) ||
    userMessage.toLowerCase().includes('portfolio') ||
    userMessage.toLowerCase().includes('work example')
  ) {
    console.log('User is asking to see projects, fetching all projects');
    const projects = await fetchProjects();
    const sortedProjects = sortProjectsByYear(projects);
    console.log(`Fetched ${sortedProjects.length} projects for display`);
    
    if (sortedProjects.length === 0) {
      return {
        content: "I don't have any projects to show right now. Please check back later.",
        showProjects: false
      };
    }
    
    return {
      content: "Here are some of my recent projects. Click on any of them to learn more:",
      showProjects: true,
      projects: sortedProjects
    };
  }
  
  // Try to use RAG to find relevant content or projects
  const semanticResults = await findRelevantProjects(userMessage);
  
  // If we got a meaningful result with either content or projects, return it
  if (semanticResults.content && semanticResults.content !== "I don't currently have information that matches your specific question. Would you like to see my portfolio instead?") {
    // Only show projects if there are actually relevant projects
    if (semanticResults.projects && semanticResults.projects.length > 0) {
      semanticResults.projects = sortProjectsByYear(semanticResults.projects);
      semanticResults.showProjects = true;
    } else {
      semanticResults.showProjects = false;
    }
    return semanticResults;
  }
  
  // Extract potential keywords from the user message as a fallback
  const potentialKeywords = extractKeywords(userMessage);
  if (potentialKeywords.length > 0) {
    // Try direct keyword search for projects
    const keywordMatchedProjects = await searchProjectsByKeywords(potentialKeywords);
    if (keywordMatchedProjects.length > 0) {
      console.log(`Found ${keywordMatchedProjects.length} projects matching keywords`);
      const sortedProjects = sortProjectsByYear(keywordMatchedProjects);
      return {
        content: `I found some projects related to "${potentialKeywords.join(', ')}" that might interest you:`,
        projects: sortedProjects,
        showProjects: true
      };
    }
  }
  
  // If we reach here with no results yet, check if this is a general work-related query
  // and return all projects as a fallback ONLY if it's work/project related
  if (isProjectOrWorkMention) {
    console.log('Work-related query detected, falling back to all projects');
    const allProjects = await fetchProjects();
    
    if (allProjects.length > 0) {
      const sortedProjects = sortProjectsByYear(allProjects);
      return {
        content: "Here are some projects I've worked on that might be relevant:",
        projects: sortedProjects,
        showProjects: true
      };
    }
  }
  
  // For general questions that don't match any content or keywords, don't show projects
  return {
    content: "I don't have specific information about that. Is there something about my work or projects you'd like to know?",
    showProjects: false
  };
};

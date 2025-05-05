
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
  
  // Handle direct requests for showing projects
  if (
    showProjectsRegex.test(userMessage.toLowerCase()) ||
    userMessage.toLowerCase().includes('portfolio') ||
    userMessage.toLowerCase().includes('work example')
  ) {
    console.log('User is asking to see projects, fetching all projects');
    const projects = await fetchProjects();
    console.log(`Fetched ${projects.length} projects for display`);
    
    if (projects.length === 0) {
      return {
        content: "I don't have any projects to show right now. Please check back later.",
        showProjects: false
      };
    }
    
    return {
      content: "Here are some of my recent projects. Click on any of them to learn more:",
      showProjects: true,
      projects
    };
  }
  
  // Try to use RAG to find relevant content or projects
  const semanticResults = await findRelevantProjects(userMessage);
  
  // If we got a meaningful result with either content or projects, return it
  if (semanticResults.content && semanticResults.content !== "I don't currently have information that matches your specific question. Would you like to see my portfolio instead?") {
    return semanticResults;
  }
  
  // Extract potential keywords from the user message as a fallback
  const potentialKeywords = extractKeywords(userMessage);
  if (potentialKeywords.length > 0) {
    // Try direct keyword search for projects
    const keywordMatchedProjects = await searchProjectsByKeywords(potentialKeywords);
    if (keywordMatchedProjects.length > 0) {
      console.log(`Found ${keywordMatchedProjects.length} projects matching keywords`);
      return {
        content: `I found some projects related to "${potentialKeywords.join(', ')}" that might interest you:`,
        projects: keywordMatchedProjects,
        showProjects: true
      };
    }
  }
  
  // If we reach here with no results yet, check if this is a general work-related query
  // and return all projects as a fallback
  if (isProjectOrWorkMention) {
    console.log('Work-related query detected, falling back to all projects');
    const allProjects = await fetchProjects();
    
    if (allProjects.length > 0) {
      return {
        content: "Here are some projects I've worked on that might be relevant:",
        projects: allProjects,
        showProjects: true
      };
    }
  }
  
  // If no matching projects found, return a helpful message without projects
  return {
    content: "I don't currently have information that matches your specific question. Would you like to see my portfolio to browse all projects?",
    showProjects: false
  };
};

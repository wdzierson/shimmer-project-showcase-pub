
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
                              userMessage.toLowerCase().includes('portfolio') ||
                              userMessage.toLowerCase().includes('ai') ||
                              userMessage.toLowerCase().includes('artificial intelligence');
  
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
  
  // Try to use RAG to find relevant content entries first
  console.log('Searching for relevant content entries first...');
  const contentEntries = await findRelevantContentEntries(userMessage);
  
  if (contentEntries && contentEntries.length > 0) {
    console.log(`Found ${contentEntries.length} relevant content entries, prioritizing these`);
    // If we have content matches, use them to generate a response without showing projects
    // unless the content is specifically about projects
    const context = contentEntries
      .map(entry => `[${entry.type}] ${entry.title}: ${entry.content}`)
      .join('\n\n');
      
    const aiResponse = await getChatCompletion({
      messages: [
        {
          role: 'system',
          content: `You are a helpful portfolio assistant. Use the following information to answer the user's question concisely: ${context}`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      model: 'gpt-4o-mini'
    });
    
    return {
      content: aiResponse,
      showProjects: false // Don't show projects when we have content matches
    };
  }
  
  // If no content entries found, try to find relevant projects
  console.log('No relevant content entries found, searching for projects...');
  const semanticResults = await findRelevantProjects(userMessage);
  
  // Check if the semantic search returned actual relevant projects (not fallback)
  if (semanticResults.projects && 
      semanticResults.projects.length > 0 && 
      semanticResults.relevanceScore > 0.3) {
    console.log('Found relevant projects via semantic search with good relevance score');
    semanticResults.projects = sortProjectsByYear(semanticResults.projects);
    return semanticResults;
  }
  
  // Extract potential keywords from the message for additional search
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
  
  // If this is a work-related query and we've found no matches, show all projects as a fallback
  if (isProjectOrWorkMention) {
    console.log('Work-related query detected, fetching relevant projects');
    const allProjects = await fetchProjects();
    
    if (allProjects.length > 0) {
      // Filter for AI projects if the query contains AI keywords
      const filteredProjects = userMessage.toLowerCase().includes('ai') || 
                              userMessage.toLowerCase().includes('artificial intelligence') ?
                              allProjects.filter(project => 
                                project.title.toLowerCase().includes('ai') || 
                                project.description.toLowerCase().includes('ai') ||
                                project.description.toLowerCase().includes('artificial intelligence') ||
                                project.tags.some(tag => tag.toLowerCase().includes('ai'))) :
                              allProjects;
                              
      if (filteredProjects.length > 0) {
        const sortedProjects = sortProjectsByYear(filteredProjects);
        return {
          content: "Here are some projects that might be relevant to your interest:",
          projects: sortedProjects,
          showProjects: true
        };
      }
    }
  }
  
  // For general questions that don't match any content or keywords,
  // and aren't explicitly work-related, don't show projects
  console.log('Query appears to be general knowledge, not showing projects');
  return {
    content: "I don't have specific information about that. Is there something about my work or projects you'd like to know?",
    showProjects: false
  };
};

// Add the missing import for getChatCompletion
import { getChatCompletion } from '@/services/openai';
import { findRelevantContentEntries } from './semanticSearch';

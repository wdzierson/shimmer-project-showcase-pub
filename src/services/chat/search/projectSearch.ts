import { searchSimilarProjects } from '@/services/openai';
import { getChatCompletion } from '@/services/openai';
import { fetchProjects } from '../projectFetcher';
import { Project } from '@/components/project/ProjectCard';

/**
 * Processes search results and generates an AI response with relevant projects
 */
const processProjectSearchResults = async (
  userMessage: string,
  similarProjects: any[],
  hasRelevantProjects: boolean
): Promise<{
  content: string;
  projects: Project[];
  showProjects: boolean;
  relevanceScore: number;
}> => {
  const projectIds = similarProjects.map(p => p.project_id);
  const projectsToDisplay = await fetchProjects(projectIds);
  const relevanceScore = !hasRelevantProjects ? 0 : 
    similarProjects.reduce((acc, p) => acc + (p.similarity || 0), 0) / similarProjects.length;
  
  if (projectsToDisplay.length > 0) {
    console.log(`Found ${projectsToDisplay.length} similar projects without content entries`);
    
    // Use OpenAI to generate a response based on the relevant projects if they're not fallback results
    if (hasRelevantProjects) {
      const context = similarProjects
        .filter(p => p.content) // Only include projects with content
        .map(p => p.content)
        .join('\n\n');
        
      console.log('Generating AI response with context from similar projects');
      
      let aiResponse;
      if (context) {
        aiResponse = await getChatCompletion({
          messages: [
            {
              role: 'system',
              content: `You are a helpful portfolio assistant. Use the following project information to answer the user's question concisely: ${context}`
            },
            {
              role: 'user',
              content: userMessage
            }
          ],
          model: 'gpt-4o-mini'
        });
      } else {
        aiResponse = "I found some projects that might be relevant to your question:";
      }
      
      return {
        content: aiResponse,
        projects: projectsToDisplay,
        showProjects: true,
        relevanceScore
      };
    } else {
      // For non-project queries, don't show fallback results
      return {
        content: "I don't have specific information about that. Is there something about my work or projects you'd like to know?",
        projects: [],
        showProjects: false,
        relevanceScore: 0
      };
    }
  }

  // No results found
  return { 
    content: "I don't currently have information that matches your specific question. Would you like to see my portfolio instead?", 
    projects: [],
    showProjects: false,
    relevanceScore: 0
  };
};

/**
 * Handles the generation of responses with content entries
 */
const processContentEntryResults = async (
  userMessage: string, 
  contentEntries: any[],
  projectsToDisplay: Project[],
  hasRelevantProjects: boolean,
  relevanceScore: number
): Promise<{
  content: string;
  projects?: Project[];
  showProjects?: boolean;
  relevanceScore: number;
}> => {
  // Use relevant content entries to generate a response
  const context = contentEntries
    .map(entry => `[${entry.type}] ${entry.title}: ${entry.content}`)
    .join('\n\n');
    
  console.log('Generating AI response with context from content entries');
  
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
  
  // If we also have projects to display, show them along with the AI response
  // But only if they're actually relevant
  if (projectsToDisplay.length > 0 && hasRelevantProjects) {
    console.log(`Including ${projectsToDisplay.length} projects with content response`);
    return {
      content: aiResponse,
      projects: projectsToDisplay,
      showProjects: true,
      relevanceScore
    };
  }
  
  // Otherwise just return the AI response
  return {
    content: aiResponse,
    showProjects: false,
    relevanceScore
  };
};

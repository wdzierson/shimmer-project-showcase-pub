
import { searchSimilarProjects } from '@/services/openai';
import { getChatCompletion } from '@/services/openai';
import { fetchProjects } from './projectFetcher';
import { Project } from '@/components/project/ProjectCard';

/**
 * Uses RAG (Retrieval-Augmented Generation) to find semantically relevant projects
 */
export const findRelevantProjects = async (userMessage: string): Promise<{
  content: string;
  projects?: Project[];
  showProjects?: boolean;
}> => {
  console.log('Attempting to find relevant projects using RAG');
  try {
    const similarProjects = await searchSimilarProjects(userMessage);
    
    if (similarProjects && similarProjects.length > 0) {
      console.log(`Found ${similarProjects.length} similar projects via RAG`);
      
      // Check if these are fallback results (similarity = 0)
      const isFallbackResults = similarProjects.every(p => p.similarity === 0);
      
      // Get project IDs to fetch full project data
      const projectIds = similarProjects.map(p => p.project_id);
      const projects = await fetchProjects(projectIds);
      
      if (projects.length > 0) {
        if (isFallbackResults) {
          // These are fallback results, so use a generic response
          return {
            content: "Here are some projects that might be of interest to you:",
            projects,
            showProjects: true
          };
        } else {
          // Use OpenAI to generate a response based on the relevant projects
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
            projects,
            showProjects: true
          };
        }
      }
    }

    // No results found
    return { content: "", showProjects: false };
  } catch (error) {
    console.error('Error during RAG process:', error);
    throw error;
  }
};

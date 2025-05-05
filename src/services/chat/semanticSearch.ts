
import { searchSimilarProjects } from '@/services/openai';
import { getChatCompletion } from '@/services/openai';
import { fetchProjects } from './projectFetcher';
import { Project } from '@/components/project/ProjectCard';
import { supabase } from '@/integrations/supabase/client';

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

    // No project results found, try content entries
    const contentEntries = await findRelevantContentEntries(userMessage);
    if (contentEntries && contentEntries.length > 0) {
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
      
      return {
        content: aiResponse,
        showProjects: false
      };
    }

    // No results found
    return { content: "", showProjects: false };
  } catch (error) {
    console.error('Error during RAG process:', error);
    throw error;
  }
};

/**
 * Finds content entries that are semantically relevant to the user's message
 */
export const findRelevantContentEntries = async (userMessage: string) => {
  try {
    console.log('Searching for relevant content entries...');
    
    // Generate embedding for the query
    const { data: embeddingData } = await supabase.functions.invoke('generate-embeddings', {
      body: { text: userMessage }
    });
    
    if (!embeddingData || !embeddingData.embedding) {
      console.error('Failed to generate embedding for content search');
      return [];
    }
    
    // Use embedding to search for similar content
    const { data: searchData } = await supabase.functions.invoke('search-content', {
      body: { 
        embedding: embeddingData.embedding, 
        threshold: 0.3, 
        limit: 5 
      }
    });
    
    if (!searchData || !searchData.entries) {
      console.log('No relevant content entries found');
      return [];
    }
    
    console.log(`Found ${searchData.entries.length} relevant content entries`);
    
    // Fetch the complete content entries
    const contentIds = searchData.entries.map((entry: any) => entry.content_id);
    
    if (contentIds.length === 0) return [];
    
    const { data: contentEntries } = await supabase
      .from('content_entries')
      .select('*')
      .in('id', contentIds)
      .eq('visible', true);
      
    return contentEntries || [];
  } catch (error) {
    console.error('Error searching for content entries:', error);
    return [];
  }
};

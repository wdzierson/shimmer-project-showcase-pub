
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
    // First try to find relevant content entries
    console.log('Searching for relevant content entries first...');
    const contentEntries = await findRelevantContentEntries(userMessage);
    
    // Also search for similar projects in parallel
    const similarProjects = await searchSimilarProjects(userMessage);
    
    // Process similar projects first to see if we have project matches
    let projectsToDisplay: Project[] = [];
    let hasRelevantProjects = false;
    
    if (similarProjects && similarProjects.length > 0) {
      console.log(`Found ${similarProjects.length} similar projects via RAG`);
      
      // Check if these are fallback results (similarity = 0)
      const isFallbackResults = similarProjects.every(p => p.similarity === 0);
      
      // Get project IDs to fetch full project data
      const projectIds = similarProjects.map(p => p.project_id);
      projectsToDisplay = await fetchProjects(projectIds);
      
      if (projectsToDisplay.length > 0) {
        hasRelevantProjects = !isFallbackResults;
      }
    }
    
    // If we have content entries, use them to generate a response
    if (contentEntries && contentEntries.length > 0) {
      console.log(`Found ${contentEntries.length} relevant content entries`);
      
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
          showProjects: true
        };
      }
      
      // Otherwise just return the AI response
      return {
        content: aiResponse,
        showProjects: false
      };
    }
    
    // If no content entries but we have project results
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
          showProjects: true
        };
      } else {
        // For non-project queries, don't show fallback results
        return {
          content: "I don't have specific information about that. Is there something about my work or projects you'd like to know?",
          showProjects: false 
        };
      }
    }

    // No results found
    return { 
      content: "I don't currently have information that matches your specific question. Would you like to see my portfolio instead?", 
      showProjects: false 
    };
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
    const { data: embeddingData, error: embeddingError } = await supabase.functions.invoke('generate-embeddings', {
      body: { text: userMessage }
    });
    
    if (embeddingError || !embeddingData || !embeddingData.embedding) {
      console.error('Failed to generate embedding for content search:', embeddingError);
      return [];
    }
    
    console.log('Embedding generated successfully, searching for similar content...');
    
    // Use embedding to search for similar content
    const { data: searchData, error: searchError } = await supabase.functions.invoke('search-content', {
      body: { 
        embedding: embeddingData.embedding, 
        threshold: 0.3, 
        limit: 5 
      }
    });
    
    if (searchError) {
      console.error('Error searching for content entries:', searchError);
      return [];
    }
    
    if (!searchData || !searchData.entries || searchData.entries.length === 0) {
      console.log('No relevant content entries found');
      return [];
    }
    
    console.log(`Found ${searchData.entries.length} relevant content entries with IDs:`, 
      searchData.entries.map((entry: any) => entry.content_id));
    
    // Fetch the complete content entries
    const contentIds = searchData.entries.map((entry: any) => entry.content_id);
    
    if (contentIds.length === 0) return [];
    
    const { data: contentEntries, error: contentError } = await supabase
      .from('content_entries')
      .select('*')
      .in('id', contentIds)
      .eq('visible', true);
      
    if (contentError) {
      console.error('Error fetching content entries:', contentError);
      return [];
    }
    
    console.log(`Retrieved ${contentEntries?.length || 0} full content entries`);
    return contentEntries || [];
  } catch (error) {
    console.error('Error searching for content entries:', error);
    return [];
  }
};

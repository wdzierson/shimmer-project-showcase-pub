
import { supabase } from '@/integrations/supabase/client';
import { generateEmbeddings, searchSimilarProjects, getChatCompletion } from '@/services/openai';
import { Project } from '@/components/project/ProjectCard';
import { Message } from '@/types/chat';

// Helper function to fetch projects from Supabase
export const fetchProjects = async (projectIds?: string[]): Promise<Project[]> => {
  try {
    console.log('Fetching projects', projectIds ? `with IDs: ${projectIds.join(', ')}` : 'all projects');
    
    let query = supabase
      .from('projects')
      .select(`
        id,
        title,
        client,
        description,
        created_at,
        project_images (image_url, is_primary),
        project_tags (
          tags (name)
        )
      `)
      .eq('visible', true);
      
    // If specific projectIds are provided, filter by them
    if (projectIds && projectIds.length > 0) {
      query = query.in('id', projectIds);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
    
    console.log(`Found ${data.length} projects`, data);
    
    // Transform data to match Project type
    return data.map(item => ({
      id: item.id,
      title: item.title,
      client: item.client,
      description: item.description,
      imageUrl: item.project_images.find((img: any) => img.is_primary)?.image_url || '',
      tags: item.project_tags.map((tag: any) => tag.tags.name),
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error in fetchProjects:', error);
    return [];
  }
};

export const processUserMessage = async (
  userMessage: string
): Promise<{
  content: string;
  projects?: Project[];
  showProjects?: boolean;
}> => {
  console.log('Processing user message:', userMessage);
  
  // Check for the "show me recent work" or similar commands
  const showProjectsRegex = /show\s+(?:me\s+)?(?:recent\s+)?(?:work|projects?|portfolio)/i;
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
  
  // Try to use RAG to find relevant projects
  console.log('Attempting to find relevant projects using RAG');
  try {
    const similarProjects = await searchSimilarProjects(userMessage);
    
    if (similarProjects && similarProjects.length > 0) {
      console.log(`Found ${similarProjects.length} similar projects via RAG`);
      
      // Get project IDs to fetch full project data
      const projectIds = similarProjects.map(p => p.project_id);
      const projects = await fetchProjects(projectIds);
      
      if (projects.length > 0) {
        // Use OpenAI to generate a response based on the relevant projects
        const context = similarProjects.map(p => p.content).join('\n\n');
        console.log('Generating AI response with context from similar projects');
        
        const aiResponse = await getChatCompletion({
          messages: [
            {
              role: 'system',
              content: `You are a helpful portfolio assistant. Use the following project information to answer the user's question: ${context}`
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
          projects,
          showProjects: true
        };
      }
    }
  } catch (error) {
    console.error('Error during RAG process:', error);
  }
  
  // If no similar projects found via RAG or if an error occurred
  console.log('No similar projects found via RAG or an error occurred, fetching all projects instead');
  const allProjects = await fetchProjects();
  
  if (allProjects.length > 0) {
    return {
      content: "I don't have specific information about that in my projects, but here are some of my recent works that might interest you:",
      projects: allProjects,
      showProjects: true
    };
  }
  
  // If no projects available at all
  return {
    content: "I don't have specific information about that in my projects. Would you like to see my recent work instead? Just type 'show me recent work'.",
    showProjects: false
  };
};

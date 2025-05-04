
import { supabase } from '@/integrations/supabase/client';
import { generateEmbeddings, searchSimilarProjects, getChatCompletion } from '@/services/openai';
import { Project } from '@/components/project/ProjectCard';
import { Message } from '@/types/chat';

// Helper function to fetch projects from Supabase
export const fetchProjects = async (projectIds?: string[]): Promise<Project[]> => {
  try {
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
  // Check for the "show me recent work" command
  if (
    userMessage.toLowerCase().includes('show me recent work') ||
    userMessage.toLowerCase().includes('show projects') ||
    userMessage.toLowerCase().includes('portfolio') ||
    userMessage.toLowerCase().includes('work examples')
  ) {
    const projects = await fetchProjects();
    return {
      content: "Here are some of my recent projects. Click on any of them to learn more:",
      showProjects: true,
      projects
    };
  } else {
    // Try to use RAG to find relevant projects
    const similarProjects = await searchSimilarProjects(userMessage);
    
    if (similarProjects && similarProjects.length > 0) {
      // Get project IDs to fetch full project data
      const projectIds = similarProjects.map(p => p.project_id);
      const projects = await fetchProjects(projectIds);
      
      // Use OpenAI to generate a response based on the relevant projects
      const context = similarProjects.map(p => p.content).join('\n');
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
        projects: projects.length > 0 ? projects : undefined,
        showProjects: projects.length > 0
      };
    } else {
      return {
        content: "I don't have specific information about that in my projects. Would you like to see my recent work instead?",
      };
    }
  }
};

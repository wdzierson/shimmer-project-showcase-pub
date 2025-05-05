
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/components/project/ProjectCard';

/**
 * Fetches projects from Supabase, either all projects or specific ones by ID
 */
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

/**
 * Searches projects by keywords in title, client, description, and tags
 */
export const searchProjectsByKeywords = async (keywords: string[]): Promise<Project[]> => {
  try {
    console.log('Searching projects by keywords:', keywords);
    if (!keywords || keywords.length === 0) return [];
    
    // Get all projects to search through
    const allProjects = await fetchProjects();
    if (!allProjects.length) return [];
    
    // Filter projects that match any of the keywords
    return allProjects.filter(project => {
      const projectContent = `${project.title} ${project.client} ${project.description} ${project.tags.join(' ')}`.toLowerCase();
      
      return keywords.some(keyword => 
        projectContent.includes(keyword.toLowerCase())
      );
    });
  } catch (error) {
    console.error('Error searching projects by keywords:', error);
    return [];
  }
};

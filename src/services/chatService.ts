
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

// Helper function to search projects by keyword in title, client, description, and tags
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

export const processUserMessage = async (
  userMessage: string
): Promise<{
  content: string;
  projects?: Project[];
  showProjects?: boolean;
}> => {
  console.log('Processing user message:', userMessage);
  
  // Check for the "show me recent work" or similar commands
  const showProjectsRegex = /show\s+(?:me\s+)?(?:recent\s+)?(?:work|projects?|portfolio|all)/i;
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
  
  // Extract potential keywords from the user message
  const potentialKeywords = extractKeywords(userMessage);
  if (potentialKeywords.length > 0) {
    // Try direct keyword search first
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
  
  // Try to use RAG to find relevant projects if no direct keyword matches
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
  } catch (error) {
    console.error('Error during RAG process:', error);
  }
  
  // If we reach here with no results yet, check if this is a general work-related query
  // and return all projects as a fallback
  if (userMessage.toLowerCase().includes('work') ||
      userMessage.toLowerCase().includes('project') ||
      userMessage.toLowerCase().includes('portfolio') ||
      userMessage.toLowerCase().includes('experience')) {
    
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
    content: "I don't currently have projects that match your specific question. Would you like to see my portfolio to browse all projects?",
    showProjects: false
  };
};

// Helper function to extract potential keywords from user messages
function extractKeywords(message: string): string[] {
  const lowerMessage = message.toLowerCase();
  
  // Common keywords to look for in project contexts
  const industryKeywords = [
    'healthcare', 'finance', 'tech', 'education', 'retail', 'gaming', 
    'social media', 'travel', 'food', 'sports', 'entertainment', 
    'medical', 'banking', 'insurance', 'automotive', 'real estate',
    'mobile', 'web', 'app', 'application', 'website', 'platform',
    'e-commerce', 'marketing', 'analytics', 'design', 'development',
    'frontend', 'backend', 'fullstack', 'ui', 'ux', 'search'
  ];
  
  // Extract question focus
  // For "Do you have X" or "Have you worked on X" type questions
  let extractedKeywords: string[] = [];
  
  if (lowerMessage.includes('experience with') || 
      lowerMessage.includes('worked on') || 
      lowerMessage.includes('have any') ||
      lowerMessage.includes('do you have') ||
      lowerMessage.includes('work in') ||
      lowerMessage.includes('work with')) {
    
    industryKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        extractedKeywords.push(keyword);
      }
    });
  }
  
  // Look for any keywords that might be in the message
  if (extractedKeywords.length === 0) {
    industryKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        extractedKeywords.push(keyword);
      }
    });
  }
  
  console.log('Extracted keywords from message:', extractedKeywords);
  return extractedKeywords;
}

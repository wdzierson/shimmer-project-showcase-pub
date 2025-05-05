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
  suggestions?: { text: string; delay: number }[];
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
  
  // Check if the message is asking about experience or inquiring about topics
  // that might warrant suggesting to show projects as a follow-up
  const isInquiryAboutExperience = 
    userMessage.toLowerCase().includes('experience') ||
    userMessage.toLowerCase().includes('worked on') ||
    userMessage.toLowerCase().includes('have any') ||
    userMessage.toLowerCase().includes('do you have') ||
    userMessage.toLowerCase().includes('have you done') ||
    userMessage.toLowerCase().includes('work with') ||
    userMessage.toLowerCase().includes('work in');
  
  // Check specifically for AI-related queries that should show projects
  const isAIExperienceQuery = 
    (isInquiryAboutExperience || isProjectOrWorkMention) &&
    (userMessage.toLowerCase().includes('ai') || 
     userMessage.toLowerCase().includes('artificial intelligence'));
  
  // If this is a direct query about AI experience, we should directly show AI projects
  if (isAIExperienceQuery) {
    console.log('AI experience query detected, fetching AI projects directly');
    const allProjects = await fetchProjects();
    
    // Filter for AI projects
    const aiProjects = allProjects.filter(project => 
      project.title.toLowerCase().includes('ai') || 
      project.description.toLowerCase().includes('ai') ||
      project.description.toLowerCase().includes('artificial intelligence') ||
      project.tags.some(tag => tag.toLowerCase().includes('ai')));
    
    if (aiProjects.length > 0) {
      const sortedProjects = sortProjectsByYear(aiProjects);
      
      // If the query is "have you done" or similar, provide a detailed response and suggestion
      if (userMessage.toLowerCase().includes('have you') || userMessage.toLowerCase().includes('do you have')) {
        return {
          content: "Yes, I have experience with AI! Here are some of my AI-related projects:",
          projects: sortedProjects,
          showProjects: true
        };
      } else if (showProjectsRegex.test(userMessage.toLowerCase())) {
        // If it's a direct "show me" query, focus on presenting the projects
        return {
          content: "Here are my AI-related projects. Click on any of them to learn more:",
          projects: sortedProjects,
          showProjects: true
        };
      }
    }
  }
  
  // Process the query as an explicit request to see projects
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
    
    // Check if the query is specifically about AI
    if (userMessage.toLowerCase().includes('ai') || 
        userMessage.toLowerCase().includes('artificial intelligence')) {
      // Filter for AI-related projects
      const aiProjects = sortedProjects.filter(project => 
        project.title.toLowerCase().includes('ai') || 
        project.description.toLowerCase().includes('ai') ||
        project.description.toLowerCase().includes('artificial intelligence') ||
        project.tags.some(tag => tag.toLowerCase().includes('ai')));
      
      if (aiProjects.length > 0) {
        return {
          content: "Here are my AI-related projects. Click on any of them to learn more:",
          showProjects: true,
          projects: aiProjects
        };
      }
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
      
    // Use gpt-4o-mini for better performance with content entries
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
      model: 'gpt-4o-mini' // Using the optimized model
    });
    
    // Determine if we should suggest showing projects as a follow-up
    // This is especially useful for questions about experience in certain areas
    let suggestions = [];
    
    if ((isInquiryAboutExperience || isProjectOrWorkMention) && 
        (userMessage.toLowerCase().includes('ai') || userMessage.toLowerCase().includes('artificial intelligence'))) {
      suggestions.push({ 
        text: "Show me AI-related projects", 
        delay: 500 
      });
    } else if (isInquiryAboutExperience && isProjectOrWorkMention) {
      suggestions.push({ 
        text: "Show me related projects", 
        delay: 500 
      });
    }
    
    return {
      content: aiResponse,
      showProjects: false,
      suggestions: suggestions.length > 0 ? suggestions : undefined
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
    return {
      content: semanticResults.content,
      projects: semanticResults.projects,
      showProjects: true
    };
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
  
  // Special handling for AI-related queries that didn't match content
  // but are clearly asking about AI experience
  if (isInquiryAboutExperience && 
     (userMessage.toLowerCase().includes('ai') || 
      userMessage.toLowerCase().includes('artificial intelligence'))) {
    
    console.log('AI-related experience query detected, fetching AI projects');
    const allProjects = await fetchProjects();
    
    // Filter for AI projects
    const aiProjects = allProjects.filter(project => 
      project.title.toLowerCase().includes('ai') || 
      project.description.toLowerCase().includes('ai') ||
      project.description.toLowerCase().includes('artificial intelligence') ||
      project.tags.some(tag => tag.toLowerCase().includes('ai')));
    
    if (aiProjects.length > 0) {
      const sortedProjects = sortProjectsByYear(aiProjects);
      return {
        content: "Yes, I have experience with AI! Here are some of my AI-related projects:",
        projects: sortedProjects,
        showProjects: true
      };
    }
    
    // If no AI projects found but it was an AI query, suggest showing all projects
    return {
      content: "I have some experience with AI, though my portfolio might not show specific AI-focused projects at the moment.",
      suggestions: [{ text: "Show me your portfolio anyway", delay: 500 }]
    };
  }
  
  // If this is a work-related query and we've found no matches, 
  // provide a response with suggestion to show projects
  if (isProjectOrWorkMention) {
    console.log('Work-related query detected, but no specific matches found');
    return {
      content: "I'd be happy to tell you about my work. What specific aspects of my projects or areas of expertise are you interested in?",
      showProjects: false,
      suggestions: [{ text: "Show me your portfolio", delay: 500 }]
    };
  }
  
  // For general questions that don't match any content or keywords,
  // and aren't explicitly work-related, don't show projects but offer a suggestion
  console.log('Query appears to be general knowledge, not showing projects');
  return {
    content: "I don't have specific information about that. Is there something about my work or projects you'd like to know?",
    showProjects: false,
    suggestions: [{ text: "What kind of work do you do?", delay: 500 }]
  };
};

// Add the missing import for getChatCompletion
import { getChatCompletion } from '@/services/openai';
import { findRelevantContentEntries } from './semanticSearch';

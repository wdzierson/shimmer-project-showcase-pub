
import { getChatCompletion } from '@/services/openai';
import { Project } from '@/components/project/ProjectCard';

/**
 * Generates a response using relevant content entries
 */
export const generateContentBasedResponse = async (
  userMessage: string, 
  contentEntries: any[],
  hasAIQuery: boolean = false
): Promise<{
  content: string;
  showProjects: boolean;
  suggestions?: { text: string; delay: number }[];
}> => {
  console.log(`Found ${contentEntries.length} relevant content entries, prioritizing these`);
  
  // Format the content entries into a context string
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
  
  if (hasAIQuery) {
    suggestions.push({ 
      text: "Show me AI-related projects", 
      delay: 500 
    });
  } else if (userMessage.toLowerCase().includes('experience') && 
    (userMessage.toLowerCase().includes('project') || userMessage.toLowerCase().includes('work'))) {
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
};

/**
 * Generates a response using semantically similar projects
 */
export const generateProjectBasedResponse = async (
  userMessage: string, 
  similarProjects: any[], 
  projectsToDisplay: Project[]
): Promise<{
  content: string;
  projects: Project[];
  showProjects: boolean;
}> => {
  console.log(`Found ${projectsToDisplay.length} similar projects without content entries`);
  
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
    projects: projectsToDisplay,
    showProjects: true
  };
};

/**
 * Generates a fallback response when no relevant content is found
 */
export const generateFallbackResponse = (): {
  content: string;
  showProjects: boolean;
  suggestions: { text: string; delay: number }[];
} => {
  console.log('Query appears to be general knowledge, not showing projects');
  return {
    content: "I don't have specific information about that. Is there something about my work or projects you'd like to know?",
    showProjects: false,
    suggestions: [{ text: "What kind of work do you do?", delay: 500 }]
  };
};

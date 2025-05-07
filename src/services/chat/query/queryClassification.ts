
/**
 * Identifies if the message is asking to see projects
 */
export const isShowProjectsQuery = (message: string): boolean => {
  const showProjectsRegex = /show\s+(?:me\s+)?(?:recent\s+)?(?:work|projects?|portfolio|all)/i;
  return showProjectsRegex.test(message) || 
    message.toLowerCase().includes('portfolio') ||
    message.toLowerCase().includes('work example');
};

/**
 * Identifies if the message is related to projects or work
 */
export const isWorkRelatedQuery = (message: string): boolean => {
  return message.toLowerCase().includes('project') || 
    message.toLowerCase().includes('work') ||
    message.toLowerCase().includes('portfolio');
};

/**
 * Identifies if the message is asking about AI
 */
export const isAIQuery = (message: string): boolean => {
  return message.toLowerCase().includes('ai') || 
    message.toLowerCase().includes('artificial intelligence');
};

/**
 * Checks if the message is asking about experience
 */
export const isExperienceQuery = (message: string): boolean => {
  return message.toLowerCase().includes('experience') ||
    message.toLowerCase().includes('worked on') ||
    message.toLowerCase().includes('have any') ||
    message.toLowerCase().includes('do you have') ||
    message.toLowerCase().includes('have you done') ||
    message.toLowerCase().includes('work with') ||
    message.toLowerCase().includes('work in');
};

/**
 * Checks if the message is asking about AI experience specifically
 */
export const isAIExperienceQuery = (message: string): boolean => {
  return (isExperienceQuery(message) || isWorkRelatedQuery(message)) && isAIQuery(message);
};

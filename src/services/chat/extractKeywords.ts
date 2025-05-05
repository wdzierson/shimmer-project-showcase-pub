
/**
 * Helper function to extract potential keywords from user messages
 */
export function extractKeywords(message: string): string[] {
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

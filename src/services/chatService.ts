
// This file serves as the main entry point for chat services

import { Message } from '@/types/chat';
import { processUserMessage } from './chat/messageProcessor';

// Re-export the main function
export { processUserMessage };

// Re-export the supporting functions for use elsewhere in the application
export { extractKeywords } from './chat/extractKeywords';
export { fetchProjects, searchProjectsByKeywords } from './chat/projectFetcher';

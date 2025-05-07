
import { Project } from '@/components/project/ProjectCard';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showProjects?: boolean;
  projects?: Project[];
  suggestions?: { text: string; delay: number }[];
  isMarkdown?: boolean; // Optional flag to indicate if content contains markdown
}

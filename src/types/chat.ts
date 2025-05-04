
import { Project } from '@/components/project/ProjectCard';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showProjects?: boolean;
  projects?: Project[];
}

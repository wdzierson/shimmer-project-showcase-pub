
import React from 'react';
import { Message } from '@/types/chat';
import ProjectThumbnails from '@/components/project/ProjectThumbnails';
import { Project } from '@/components/project/ProjectCard';
import { cn } from '@/lib/utils';

interface MessageItemProps {
  message: Message;
  onProjectSelect: (project: Project) => void;
}

const MessageItem = ({ message, onProjectSelect }: MessageItemProps) => {
  return (
    <div className="w-full mb-8">
      <div className={`${message.sender === 'user' ? 'ml-auto max-w-[85%]' : 'mr-auto max-w-[90%]'}`}>
        <div className={cn(
          message.sender === 'user' ? 'text-right ml-auto' : 'text-left'
        )}>
          <p className={cn(
            "leading-relaxed",
            message.sender === 'user' 
              ? 'text-foreground font-normal text-lg' 
              : 'text-foreground/90 text-xl font-light'
          )}>
            {message.content}
          </p>
        </div>
        
        {message.showProjects && message.projects && message.projects.length > 0 && (
          <div className="mt-6">
            <ProjectThumbnails projects={message.projects} onSelect={onProjectSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;

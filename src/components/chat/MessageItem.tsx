
import React from 'react';
import { Message } from '@/types/chat';
import ProjectThumbnails from '@/components/project/ProjectThumbnails';
import { Project } from '@/components/project/ProjectCard';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MessageItemProps {
  message: Message;
  onProjectSelect: (project: Project) => void;
}

const MessageItem = ({ message, onProjectSelect }: MessageItemProps) => {
  // Format the timestamp
  const formattedTime = message.timestamp ? 
    format(new Date(message.timestamp), 'h:mm a') : '';

  return (
    <div className="w-full mb-12">
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
          
          <p className={cn(
            "text-xs text-muted-foreground mt-2",
            message.sender === 'user' ? 'text-right' : 'text-left'
          )}>
            {formattedTime}
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

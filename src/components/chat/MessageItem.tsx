
import React from 'react';
import { Message } from '@/types/chat';
import ProjectThumbnails from '@/components/project/ProjectThumbnails';
import { Project } from '@/components/project/ProjectCard';

interface MessageItemProps {
  message: Message;
  onProjectSelect: (project: Project) => void;
}

const MessageItem = ({ message, onProjectSelect }: MessageItemProps) => {
  return (
    <div className="w-full mb-10">
      <div className={`max-w-4xl ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
        <div className={`p-4 rounded-lg ${
          message.sender === 'user' 
            ? 'bg-primary/10 text-right ml-auto' 
            : 'bg-muted/50 text-left mr-auto'
        }`}>
          <p className="text-foreground leading-relaxed">
            {message.content}
          </p>
        </div>
        
        <div className={`text-xs text-muted-foreground mt-2 font-mono ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      
        {message.showProjects && message.projects && message.projects.length > 0 && (
          <div className="mt-6 mb-4">
            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Related projects:</h3>
            <ProjectThumbnails projects={message.projects} onSelect={onProjectSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;

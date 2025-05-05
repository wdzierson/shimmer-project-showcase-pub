
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
    <div className="w-full mb-6">
      <div className={`max-w-4xl ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
        <div className={`${
          message.sender === 'user' 
            ? 'text-right ml-auto' 
            : 'bg-muted/30 p-4 rounded-lg text-left mr-auto'
        }`}>
          <p className={`leading-relaxed ${
            message.sender === 'user' 
              ? 'text-foreground font-medium text-lg' 
              : 'text-foreground/90 text-xl font-light tracking-wide'
          }`}>
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
          <div className="mt-4 mb-2">
            <h3 className="text-sm font-medium mb-2 text-muted-foreground">Related projects:</h3>
            <ProjectThumbnails projects={message.projects} onSelect={onProjectSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;

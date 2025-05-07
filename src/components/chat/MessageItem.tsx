
import React from 'react';
import { Message } from '@/types/chat';
import ProjectThumbnails from '@/components/project/ProjectThumbnails';
import { Project } from '@/components/project/ProjectCard';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';

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
          {message.sender === 'user' ? (
            <p className="text-foreground font-normal text-lg leading-relaxed">
              {message.content}
            </p>
          ) : (
            <div className="text-foreground/90 text-xl font-light prose prose-sm max-w-none prose-headings:font-medium prose-p:leading-relaxed prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          )}
          
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


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
    <div className="w-full">
      <div className={`max-w-4xl ${message.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
        <p className={`${message.sender === 'user' ? 'chat-message-user text-right' : 'chat-message'}`}>
          {message.content}
        </p>
        <div className={`text-sm opacity-50 mt-2 mono ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
          {message.timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      
        {message.showProjects && message.projects && (
          <div className="my-12">
            <ProjectThumbnails projects={message.projects} onSelect={onProjectSelect} />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;

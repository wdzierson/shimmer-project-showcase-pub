
import React, { useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import { Project } from '@/components/project/ProjectCard';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onProjectSelect: (project: Project) => void;
}

const MessageList = ({ messages, isLoading, onProjectSelect }: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-grow overflow-y-auto p-6 md:p-12 lg:p-16 space-y-20">
      {messages.map((msg) => (
        <MessageItem 
          key={msg.id} 
          message={msg} 
          onProjectSelect={onProjectSelect} 
        />
      ))}
      
      {isLoading && (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;

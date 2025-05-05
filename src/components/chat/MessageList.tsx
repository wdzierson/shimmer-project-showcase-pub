
import React, { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';
import { Message } from '@/types/chat';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SuggestionButton {
  text: string;
  delay: number;
}

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onProjectSelect: (project: any) => void;
  suggestions?: SuggestionButton[];
  onSuggestionClick?: (suggestion: string) => void;
}

const MessageList = ({
  messages,
  isLoading,
  onProjectSelect,
  suggestions = [],
  onSuggestionClick
}: MessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new ones come in
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="h-full overflow-y-auto px-4">
      <div className="flex flex-col space-y-6 py-6">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            onProjectSelect={onProjectSelect}
          />
        ))}
        
        {/* Suggestion buttons that fade in */}
        {suggestions.length > 0 && (
          <div className="flex flex-col items-start gap-3 mt-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion.text)}
                className={cn(
                  "bg-zinc-800 text-white hover:bg-zinc-700 rounded-full transition-opacity duration-500 opacity-0 w-auto",
                  "animate-fade-in"
                )}
                style={{ 
                  animationDelay: `${suggestion.delay}ms`,
                  animationFillMode: 'forwards'
                }}
              >
                {suggestion.text}
              </Button>
            ))}
          </div>
        )}
        
        {isLoading && (
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-zinc-400 rounded-full animate-pulse"></div>
            <div className="h-2 w-2 bg-zinc-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-2 w-2 bg-zinc-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;

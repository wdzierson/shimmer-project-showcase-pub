
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  message: string;
  setMessage: (message: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const MessageInput = ({ message, setMessage, handleSubmit, isLoading }: MessageInputProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Focus input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="sticky bottom-0 py-6 px-4 border-t border-gray-300 flex gap-4 items-end bg-background shadow-md"
    >
      <div className="relative flex-1">
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <Mail size={20} />
        </div>
        <Textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask something..."
          className={cn(
            "resize-none min-h-[24px] max-h-32 text-lg bg-white w-full rounded-md",
            "focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none p-3 shadow-sm font-light"
          )}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={isLoading}
          style={{ overflow: 'hidden' }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = '0px';
            target.style.height = target.scrollHeight + 'px';
          }}
        />
      </div>
      <Button 
        type="submit" 
        size="icon" 
        className={cn(
          "h-auto bg-transparent hover:bg-transparent text-foreground",
          "opacity-80 hover:opacity-100 transition-opacity"
        )}
        disabled={isLoading}
      >
        <Send size={24} />
      </Button>
    </form>
  );
};

export default MessageInput;


import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
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
      <Textarea
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask something..."
        className={cn(
          "resize-none min-h-[24px] max-h-32 text-lg bg-transparent w-full",
          "border-none focus-visible:ring-0 p-0 shadow-none font-light"
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

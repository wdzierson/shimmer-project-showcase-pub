
import React, { useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="p-6 md:p-8 border-t border-gray-200 flex gap-4">
      <Textarea
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type something..."
        className="resize-none min-h-[24px] max-h-32 text-lg bg-transparent border-none focus-visible:ring-0 p-0 shadow-none font-light"
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        disabled={isLoading}
      />
      <Button 
        type="submit" 
        size="icon" 
        className="h-auto bg-transparent hover:bg-transparent text-foreground opacity-80 hover:opacity-100 transition-opacity"
        disabled={isLoading}
      >
        <Send size={24} />
      </Button>
    </form>
  );
};

export default MessageInput;

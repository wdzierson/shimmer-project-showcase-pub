
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you with information about the projects?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setMessage('');
    
    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! This is a demo response. In a real implementation, this would be connected to a backend service that processes your query about the portfolio projects.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 shadow-lg"
        aria-label="Toggle chat"
      >
        {isOpen ? <X /> : <MessageCircle />}
      </Button>
      
      {/* Chat window */}
      <div
        className={`fixed bottom-0 right-0 w-full sm:w-96 bg-background border rounded-t-lg shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } z-40`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-medium">Portfolio Chat</h3>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </Button>
        </div>
        
        <div className="h-80 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-[75%] ${
                msg.sender === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted'
              } rounded-lg p-3`}
            >
              <p>{msg.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {msg.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="resize-none"
            rows={1}
          />
          <Button type="submit" size="icon">
            <Send size={18} />
          </Button>
        </form>
      </div>
    </>
  );
};

export default ChatBot;

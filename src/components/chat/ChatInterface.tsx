
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Image } from 'lucide-react';
import ProjectThumbnails from '@/components/project/ProjectThumbnails';
import ProjectDetail from '@/components/project/ProjectDetail';
import { Project } from '@/components/project/ProjectCard';

// Temporary mock data until Supabase is connected
const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Expert Physician Portal',
    client: 'Included Health',
    description: 'Physicians needed to evaluate patient conditions and make recommendations across a telehealth platform.',
    imageUrl: '/lovable-uploads/e818c6cd-0b7f-4e5a-a8b8-5a83f891d04c.png',
    tags: ['UX Research', 'UI Design', 'Healthcare'],
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    title: 'Health Bridge Platform',
    client: 'HealthBridge',
    description: 'A platform connecting patients with healthcare providers for seamless virtual care experiences.',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3',
    tags: ['UI Design', 'Frontend Development', 'Telehealth'],
    createdAt: '2023-03-22',
  },
];

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showProjects?: boolean;
}

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: "Hello! I'm your portfolio assistant. You can ask me about my work, experience, or type 'show me recent work' to see my projects.",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    
    // Process the message and provide a response
    setTimeout(() => {
      let botResponse: Message;
      
      // Check for the "show me recent work" command
      if (message.toLowerCase().includes('show me recent work') || 
          message.toLowerCase().includes('show projects') ||
          message.toLowerCase().includes('portfolio') ||
          message.toLowerCase().includes('work examples')) {
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "Here are some of my recent projects. Click on any of them to learn more:",
          sender: 'bot',
          timestamp: new Date(),
          showProjects: true,
        };
      } else {
        // This will be replaced with actual OpenAI integration
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "Thanks for your message! Once connected to OpenAI and Supabase, I'll be able to provide specific information about my work experience and projects. Try typing 'show me recent work' to see my portfolio projects.",
          sender: 'bot',
          timestamp: new Date(),
        };
      }
      
      setMessages((prev) => [...prev, botResponse]);
    }, 800);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProjectDetail = () => {
    setSelectedProject(null);
  };

  return (
    <div className="flex flex-col h-[600px] bg-card border rounded-lg shadow-lg">
      {selectedProject ? (
        <ProjectDetail project={selectedProject} onClose={handleCloseProjectDetail} />
      ) : (
        <>
          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="flex flex-col">
                <div
                  className={`max-w-[80%] ${
                    msg.sender === 'user'
                      ? 'ml-auto bg-primary text-primary-foreground rounded-tl-lg rounded-bl-lg rounded-tr-lg'
                      : 'bg-muted rounded-tr-lg rounded-br-lg rounded-tl-lg'
                  } p-3 rounded-md shadow-sm`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                
                {msg.showProjects && (
                  <div className="my-4">
                    <ProjectThumbnails projects={mockProjects} onSelect={handleProjectSelect} />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me about my work or type 'show me recent work'..."
              className="resize-none min-h-[60px]"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <Button type="submit" size="icon" className="h-auto">
              <Send size={20} />
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatInterface;

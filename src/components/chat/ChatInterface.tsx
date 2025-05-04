
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';
import ProjectThumbnails from '@/components/project/ProjectThumbnails';
import ProjectDetail from '@/components/project/ProjectDetail';
import { Project } from '@/components/project/ProjectCard';
import { supabase } from '@/integrations/supabase/client';
import { generateEmbeddings, searchSimilarProjects, getChatCompletion } from '@/services/openai';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showProjects?: boolean;
  projects?: Project[];
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
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input field when the component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Helper function to fetch projects from Supabase
  const fetchProjects = async (projectIds?: string[]): Promise<Project[]> => {
    try {
      let query = supabase
        .from('projects')
        .select(`
          id,
          title,
          client,
          description,
          created_at,
          project_images (image_url, is_primary),
          project_tags (
            tags (name)
          )
        `)
        .eq('visible', true);
        
      // If specific projectIds are provided, filter by them
      if (projectIds && projectIds.length > 0) {
        query = query.in('id', projectIds);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching projects:', error);
        return [];
      }
      
      // Transform data to match Project type
      return data.map(item => ({
        id: item.id,
        title: item.title,
        client: item.client,
        description: item.description,
        imageUrl: item.project_images.find((img: any) => img.is_primary)?.image_url || '',
        tags: item.project_tags.map((tag: any) => tag.tags.name),
        createdAt: item.created_at
      }));
    } catch (error) {
      console.error('Error in fetchProjects:', error);
      return [];
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    setIsLoading(true);
    
    try {
      let botResponse: Message;
      
      // Check for the "show me recent work" command
      if (message.toLowerCase().includes('show me recent work') || 
          message.toLowerCase().includes('show projects') ||
          message.toLowerCase().includes('portfolio') ||
          message.toLowerCase().includes('work examples')) {
        
        const projects = await fetchProjects();
        
        botResponse = {
          id: (Date.now() + 1).toString(),
          content: "Here are some of my recent projects. Click on any of them to learn more:",
          sender: 'bot',
          timestamp: new Date(),
          showProjects: true,
          projects
        };
      } else {
        // Try to use RAG to find relevant projects
        const similarProjects = await searchSimilarProjects(message);
        
        if (similarProjects && similarProjects.length > 0) {
          // Get project IDs to fetch full project data
          const projectIds = similarProjects.map(p => p.project_id);
          const projects = await fetchProjects(projectIds);
          
          // Use OpenAI to generate a response based on the relevant projects
          const context = similarProjects.map(p => p.content).join('\n');
          const aiResponse = await getChatCompletion({
            messages: [
              {
                role: 'system',
                content: `You are a helpful portfolio assistant. Use the following project information to answer the user's question: ${context}`
              },
              {
                role: 'user',
                content: message
              }
            ],
            model: 'gpt-4o-mini'
          });
          
          botResponse = {
            id: (Date.now() + 1).toString(),
            content: aiResponse,
            sender: 'bot',
            timestamp: new Date(),
            projects: projects.length > 0 ? projects : undefined,
            showProjects: projects.length > 0
          };
        } else {
          botResponse = {
            id: (Date.now() + 1).toString(),
            content: "I don't have specific information about that in my projects. Would you like to see my recent work instead?",
            sender: 'bot',
            timestamp: new Date(),
          };
        }
      }
      
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error('Error processing message:', error);
      
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCloseProjectDetail = () => {
    setSelectedProject(null);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {selectedProject ? (
        <ProjectDetail project={selectedProject} onClose={handleCloseProjectDetail} />
      ) : (
        <>
          <div className="flex-grow overflow-y-auto p-6 md:p-12 lg:p-16 space-y-20">
            {messages.map((msg) => (
              <div key={msg.id} className="w-full">
                <div className={`max-w-4xl ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}>
                  <p className={`${msg.sender === 'user' ? 'chat-message-user text-right' : 'chat-message'}`}>
                    {msg.content}
                  </p>
                  <div className={`text-sm opacity-50 mt-2 mono ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                
                  {msg.showProjects && msg.projects && (
                    <div className="my-12">
                      <ProjectThumbnails projects={msg.projects} onSelect={handleProjectSelect} />
                    </div>
                  )}
                </div>
              </div>
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
          
          <form onSubmit={handleSubmit} className="p-6 md:p-8 border-t border-border/30 flex gap-4 bg-background/80 backdrop-blur-sm">
            <Textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me about my work or type 'show me recent work'..."
              className="resize-none min-h-[60px] text-lg chat-input bg-transparent border-none focus-visible:ring-0 p-0 shadow-none"
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
              className="h-auto bg-transparent hover:bg-transparent text-foreground"
              disabled={isLoading}
            >
              <Send size={24} />
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatInterface;

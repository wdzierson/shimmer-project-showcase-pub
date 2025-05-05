
import React, { useState } from 'react';
import { Project } from '@/components/project/ProjectCard';
import ProjectDetail from '@/components/project/ProjectDetail';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Message } from '@/types/chat';
import { processUserMessage } from '@/services/chatService';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      content: "Hi, I'm Will's portfolio assistant. Just ask to see recent work, work by industry, role, or whatever you'd like. You're also welcome to ask questions about my skills and interests.",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);

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
      const response = await processUserMessage(message);
      
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: response.content,
        sender: 'bot',
        timestamp: new Date(),
        projects: response.projects,
        showProjects: response.showProjects,
      };
      
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
    setProjectDialogOpen(true);
  };

  const handleCloseProjectDetail = () => {
    setSelectedProject(null);
    setProjectDialogOpen(false);
  };

  return (
    <div className="w-full h-full flex flex-col overflow-hidden bg-background">
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-hidden">
          <MessageList 
            messages={messages} 
            isLoading={isLoading} 
            onProjectSelect={handleProjectSelect} 
          />
        </div>
        <div className="sticky bottom-0">
          <MessageInput 
            message={message}
            setMessage={setMessage}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
      
      {/* Full-screen project detail dialog - updated for 40% transparent header */}
      <Dialog open={projectDialogOpen} onOpenChange={setProjectDialogOpen}>
        <DialogContent className="max-w-full w-full h-[90vh] p-0 rounded-lg">
          {selectedProject && (
            <ProjectDetail project={selectedProject} onClose={handleCloseProjectDetail} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInterface;


import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="absolute top-6 left-6 z-10">
        <h1 className="text-3xl font-medium text-foreground mono tracking-tight">Will's Portfolio</h1>
        <p className="text-sm text-muted-foreground mt-1 font-light tracking-wide">chat with my work</p>
      </div>
      
      <div className="flex-grow flex items-stretch">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;

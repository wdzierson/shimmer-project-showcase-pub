
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="absolute top-6 left-6 z-10">
        <h1 className="text-2xl font-medium text-foreground mono tracking-tight">Will's Portfolio</h1>
        <p className="text-xs text-muted-foreground mt-0.5 font-light tracking-wide">chat with my work</p>
      </div>
      
      <div className="flex-grow flex items-stretch pt-16">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;

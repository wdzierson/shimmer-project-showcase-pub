
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="absolute top-6 left-6">
        <h1 className="text-3xl font-medium text-foreground mono tracking-tight">portfolio</h1>
        <p className="text-sm text-muted-foreground mt-1 font-light tracking-wide">your creative AI assistant</p>
      </div>
      
      <div className="max-w-5xl mx-auto px-4 pt-28 pb-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-medium tracking-tighter mb-4">Showcase your work</h2>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            A beautiful portfolio powered by AI to highlight your projects
          </p>
        </div>
      </div>
      
      <div className="flex-grow flex items-stretch">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;

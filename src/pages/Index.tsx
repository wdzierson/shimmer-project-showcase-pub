
import React, { useState } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import AdminButton from '@/components/admin/AdminButton';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto flex-grow flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <h1 className="text-3xl font-semibold text-center mb-6">Portfolio Chat</h1>
          <p className="text-muted-foreground text-center mb-8">
            Ask me about my work and experience, or type "show me recent work" to see my projects.
          </p>
          <ChatInterface />
        </div>
      </div>
      {/* Admin access button in the bottom right */}
      <AdminButton />
    </div>
  );
};

export default Index;

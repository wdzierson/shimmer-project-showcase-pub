
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import AdminButton from '@/components/admin/AdminButton';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="absolute top-6 left-6">
        <h1 className="text-2xl font-medium text-foreground/80 mono">portfolio</h1>
      </div>
      <div className="flex-grow flex items-stretch">
        <ChatInterface />
      </div>
      {/* Admin access button in the bottom right */}
      <AdminButton />
    </div>
  );
};

export default Index;

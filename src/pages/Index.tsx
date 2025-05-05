
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import HomeHeader from '@/components/home/HomeHeader';
import HomeIntro from '@/components/home/HomeIntro';

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <HomeHeader />
      
      <div className="container mx-auto flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="flex-none lg:w-[380px] pt-24 pb-12 flex flex-col h-full">
          <HomeIntro />
        </div>
        {/* Added gap-12 (48px) between columns for more space */}
        <div className="lg:ml-12 flex-1 min-w-0 pt-24 pb-0">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;

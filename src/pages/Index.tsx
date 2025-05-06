
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import HomeHeader from '@/components/home/HomeHeader';
import HomeIntro from '@/components/home/HomeIntro';

const Index = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <HomeHeader />
      
      <div className="container mx-auto flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="flex-none lg:w-[340px] pt-24 pb-12 flex flex-col h-full">
          <HomeIntro />
        </div>
        {/* Increased the gap and reduced the intro width to make more space for the chat */}
        <div className="lg:ml-16 flex-1 min-w-0 pt-24 pb-0">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;

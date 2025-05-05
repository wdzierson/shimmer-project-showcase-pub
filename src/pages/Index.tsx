
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import HomeHeader from '@/components/home/HomeHeader';
import HomeIntro from '@/components/home/HomeIntro';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8f8f6]">
      <HomeHeader />
      
      <div className="flex flex-col lg:flex-row flex-grow px-6 md:px-16 lg:px-24 pt-32 pb-8 gap-12">
        <HomeIntro />
        <div className="flex-1 min-w-0">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;

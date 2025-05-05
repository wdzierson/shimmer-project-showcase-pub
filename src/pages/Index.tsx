
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import HomeHeader from '@/components/home/HomeHeader';
import HomeIntro from '@/components/home/HomeIntro';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f7]">
      <HomeHeader />
      
      <div className="flex flex-col lg:flex-row flex-grow px-4 md:px-8 lg:px-12 pt-36 pb-12 gap-12 max-w-[1400px] mx-auto">
        <HomeIntro />
        <div className="flex-1 min-w-0">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;

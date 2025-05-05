
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import HomeHeader from '@/components/home/HomeHeader';
import HomeIntro from '@/components/home/HomeIntro';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9f7]">
      <HomeHeader />
      
      <div className="flex flex-col lg:flex-row flex-grow px-6 md:px-16 lg:px-24 pt-36 pb-12 gap-16 max-w-[1400px] mx-auto">
        <HomeIntro />
        <div className="flex-1 min-w-0">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;

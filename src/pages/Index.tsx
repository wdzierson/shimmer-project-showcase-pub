
import React from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import HomeHeader from '@/components/home/HomeHeader';
import HomeIntro from '@/components/home/HomeIntro';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <HomeHeader />
      
      <div className="flex flex-col lg:flex-row flex-grow pt-36 pb-12">
        <div className="lg:w-[380px] bg-gray-200 px-4 md:px-8 lg:px-12">
          <HomeIntro />
        </div>
        <div className="flex-1 min-w-0 px-4 md:px-8 lg:px-12">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;


import React from 'react';
import { cn } from '@/lib/utils';

const HomeIntro = () => {
  return (
    <div className="lg:w-[420px] lg:sticky lg:top-36 space-y-8 mb-12 lg:mb-0">
      <h2 className={cn(
        "font-serif text-4xl md:text-5xl font-medium text-foreground",
        "tracking-tight leading-[1.15]"
      )}>
        Portfolio Chatbot
      </h2>
      
      <p className={cn(
        "text-lg text-foreground/80 leading-relaxed",
        "font-light max-w-prose"
      )}>
        For fun, I built a little AI chatbot that can tell you about my work, 
        history, and personal interests. It only knows stuff about me and 
        my work because it uses RAG to restrict its knowledge.
      </p>
    </div>
  );
};

export default HomeIntro;

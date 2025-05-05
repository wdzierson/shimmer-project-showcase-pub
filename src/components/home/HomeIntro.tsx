
import React from 'react';
import { cn } from '@/lib/utils';
import { Github } from 'lucide-react';

const HomeIntro = () => {
  return (
    <div className="lg:sticky lg:top-24 flex flex-col justify-between h-full">
      <div className="space-y-6">
        <h2 className={cn(
          "font-serif text-4xl md:text-5xl font-medium text-foreground",
          "tracking-tight leading-[1.15]"
        )}>
          AI Portfolio
        </h2>
        
        <p className={cn(
          "text-lg text-foreground/80 leading-relaxed",
          "font-light max-w-prose"
        )}>
          I built this AI version of a portfolio for fun. Ask it about my work or what I like to do, etc.
        </p>
      </div>
      
      <div className="space-y-4 mt-auto pt-12">
        <div>
          <a href="https://github.com/willdzierson" 
             className="flex items-center gap-2 text-foreground/80 hover:text-foreground">
            <Github size={18} />
            <span className="hover:underline">GitHub</span>
          </a>
        </div>
        
        <p className="text-foreground/80">
          Looking for <a 
            href="https://projectariadne.info" 
            className="text-foreground hover:underline"
            target="_blank" 
            rel="noopener noreferrer"
          >Project Ariadne</a>?
        </p>
      </div>
    </div>
  );
};

export default HomeIntro;

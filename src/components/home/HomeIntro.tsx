
import React from 'react';
import { cn } from '@/lib/utils';
import { Github } from 'lucide-react';

const HomeIntro = () => {
  return (
    <div className="lg:w-[380px] lg:sticky lg:top-36 space-y-6 mb-12 lg:mb-0">
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
        For fun, I built a little AI chatbot that can tell you about my work, 
        history, and personal interests. It only knows stuff about me and 
        my work because it uses RAG to restrict its knowledge.
      </p>
      
      <div className="space-y-4">
        <a href="https://github.com/willdzierson" 
           className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
          <Github size={18} />
          <span>View on GitHub</span>
        </a>
        
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

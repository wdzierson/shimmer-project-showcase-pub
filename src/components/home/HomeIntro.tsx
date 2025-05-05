
import React from 'react';

const HomeIntro = () => {
  return (
    <div className="lg:w-96 lg:sticky lg:top-32 space-y-6 mb-12 lg:mb-0">
      <h2 className="text-4xl md:text-5xl font-medium text-foreground tracking-tight">
        Portfolio Chatbot
      </h2>
      
      <p className="text-lg text-foreground/80 leading-relaxed">
        For fun, I built a little AI chatbot that can tell you about my work, history, and personal interests. It only knows stuff about me and my work because it uses RAG to restrict its knowledge.
      </p>
    </div>
  );
};

export default HomeIntro;

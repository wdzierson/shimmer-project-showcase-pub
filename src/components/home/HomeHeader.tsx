
import React from 'react';
import { cn } from '@/lib/utils';

const HomeHeader = () => {
  return (
    <header className="absolute top-0 left-0 w-full px-4 md:px-8 lg:px-12 py-6">
      <div className="max-w-[1400px] mx-auto flex justify-start">
        <h1 className={cn(
          "font-serif text-lg tracking-wide text-foreground",
          "transition-all hover:opacity-70"
        )}>
          WILL DZIERSON
        </h1>
      </div>
    </header>
  );
};

export default HomeHeader;

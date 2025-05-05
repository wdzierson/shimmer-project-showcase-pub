
import React from 'react';
import { cn } from '@/lib/utils';

const HomeHeader = () => {
  return (
    <header className="absolute top-0 left-0 w-full px-6 md:px-16 lg:px-24 py-8">
      <div className="max-w-[1400px] mx-auto">
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

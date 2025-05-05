
import React from 'react';
import { cn } from '@/lib/utils';

const HomeHeader = () => {
  return (
    <header className="absolute top-0 left-0 w-full px-4 md:px-8 lg:px-12 py-6">
      <div className="container mx-auto flex items-center">
        <div className="flex-1">
          {/* Left side empty for balance */}
        </div>
        <div>
          <h1 className={cn(
            "font-serif text-lg tracking-wide text-foreground",
            "transition-all hover:opacity-70"
          )}>
            WILL DZIERSON / DESIGN WORK
          </h1>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;


import React from 'react';

interface ProjectHeaderProps {
  title: string;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ title }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-medium tracking-tight">
          {title}
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;

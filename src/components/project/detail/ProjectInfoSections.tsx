
import React from 'react';

interface ProjectInfoSectionsProps {
  year?: number;
  createdAt?: string;
}

const ProjectInfoSections: React.FC<ProjectInfoSectionsProps> = ({ year, createdAt }) => {
  // Removed challenge, approach, impact sections as requested
  return (
    <div className="mb-16">
      {/* Empty component per user request to remove this content */}
    </div>
  );
};

export default ProjectInfoSections;

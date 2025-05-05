
import React from 'react';

interface ProjectInfoSectionsProps {
  // No specific props needed at this level
}

const ProjectInfoSections: React.FC<ProjectInfoSectionsProps> = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div className="col-span-1">
        <h2 className="case-study-section mb-3">Challenge</h2>
        <p>
          Physicians needed to evaluate patient conditions and make recommendations across a telehealth platform. They were accessing patient images in one of our existing interfaces.
        </p>
      </div>
      
      <div className="col-span-1">
        <h2 className="case-study-section mb-3">Approach</h2>
        <p>
          Human-centered design approach, extensive user research, including interviews and field observations, to understand physicians' existing workflow and pain points.
        </p>
      </div>
      
      <div className="col-span-1">
        <h2 className="case-study-section mb-3">Impact</h2>
        <p>
          Increased physician efficiency, reducing time spent navigating the portal and allowing more focus on patient care.
        </p>
      </div>
    </div>
  );
};

export default ProjectInfoSections;

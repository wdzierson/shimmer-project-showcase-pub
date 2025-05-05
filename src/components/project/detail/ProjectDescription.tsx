
import React from 'react';

interface ProjectDescriptionProps {
  // No specific props needed at this level
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = () => {
  return (
    <div className="prose max-w-none">
      <p className="text-lg mb-6">
        We completed deep research to understand where the pain points for physicians were when reviewing patient information. By documenting the current state, we could all align on what needed to be improved.
      </p>
      
      <p className="mb-6">
        Through a comprehensive design process, we identified key opportunities to streamline the workflow and create a more intuitive interface that aligned with how physicians actually work.
      </p>
      
      <p>
        The resulting solution dramatically improved efficiency and satisfaction among physicians, allowing them to focus more on patient care rather than navigating complex interfaces.
      </p>
    </div>
  );
};

export default ProjectDescription;

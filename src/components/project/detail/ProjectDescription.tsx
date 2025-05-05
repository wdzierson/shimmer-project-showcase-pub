
import React from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

interface ProjectDescriptionProps {
  description: string;
  involvement?: string;
  liveUrl?: string;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ 
  description,
  involvement,
  liveUrl
}) => {
  return (
    <div className="space-y-8">
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

      {involvement && (
        <div>
          <h3 className="text-lg font-medium mb-3">My Involvement</h3>
          <p className="text-muted-foreground">{involvement}</p>
        </div>
      )}
      
      {liveUrl && (
        <div>
          <h3 className="text-lg font-medium mb-3">Live Version</h3>
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              Visit Live Site <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProjectDescription;


import React from 'react';
import { Project } from '@/components/project/ProjectCard';
import { Badge } from '@/components/ui/badge';

interface ProjectThumbnailsProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

const ProjectThumbnails: React.FC<ProjectThumbnailsProps> = ({ projects, onSelect }) => {
  return (
    <div className="space-y-8">
      {projects.map((project) => (
        <div 
          key={project.id}
          className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => onSelect(project)}
        >
          <div className="aspect-[16/9] w-full overflow-hidden rounded-lg mb-4">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="h-full w-full object-cover"
            />
          </div>
          <h3 className="text-xl font-medium text-foreground">{project.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{project.client}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{project.tags.length - 3}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectThumbnails;

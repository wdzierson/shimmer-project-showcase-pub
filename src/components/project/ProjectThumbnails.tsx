
import React from 'react';
import { Project } from '@/components/project/ProjectCard';
import { Badge } from '@/components/ui/badge';

interface ProjectThumbnailsProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

const ProjectThumbnails: React.FC<ProjectThumbnailsProps> = ({ projects, onSelect }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div 
          key={project.id}
          className="overflow-hidden rounded-md border bg-background cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelect(project)}
        >
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-3">
            <h4 className="text-sm font-medium line-clamp-1">{project.title}</h4>
            <div className="flex flex-wrap gap-1 mt-2">
              {project.tags.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs px-1">
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 2 && (
                <span className="text-xs text-muted-foreground">+{project.tags.length - 2}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectThumbnails;

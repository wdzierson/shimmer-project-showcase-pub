
import React from 'react';
import { Project } from '@/components/project/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProjectThumbnailsProps {
  projects: Project[];
  onSelect: (project: Project) => void;
}

const ProjectThumbnails: React.FC<ProjectThumbnailsProps> = ({ projects, onSelect }) => {
  return (
    <div className="space-y-10">
      {projects.map((project) => (
        <div 
          key={project.id}
          className={cn(
            "overflow-hidden cursor-pointer hover:opacity-90 transition-all",
            "group"
          )}
          onClick={() => onSelect(project)}
        >
          <div className="aspect-[16/9] w-full overflow-hidden rounded-xl mb-5">
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className={cn(
                "h-full w-full object-cover",
                "transition-transform duration-700 group-hover:scale-105"
              )}
            />
          </div>
          <h3 className="text-xl font-medium text-foreground font-serif">{project.title}</h3>
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

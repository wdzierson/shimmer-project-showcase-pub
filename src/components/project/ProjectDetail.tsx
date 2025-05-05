
import React from 'react';
import { Project } from '@/components/project/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, X, ChevronRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ProjectDetailProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  // Check if project has multiple images
  const hasMultipleImages = Array.isArray(project.additionalImages) && project.additionalImages.length > 0;
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <ChevronLeft size={20} />
          </Button>
          <h3 className="text-xl font-medium">{project.title}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X size={18} />
        </Button>
      </div>
      
      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-6">
          {hasMultipleImages ? (
            <Carousel className="w-full">
              <CarouselContent>
                {/* Main image */}
                <CarouselItem>
                  <div className="p-1">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full aspect-video object-cover rounded-md"
                    />
                  </div>
                </CarouselItem>
                
                {/* Additional images */}
                {project.additionalImages?.map((imageUrl, index) => (
                  <CarouselItem key={`additional-image-${index}`}>
                    <div className="p-1">
                      <img 
                        src={imageUrl} 
                        alt={`${project.title} - ${index + 1}`} 
                        className="w-full aspect-video object-cover rounded-md"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full aspect-video object-cover rounded-md"
            />
          )}
          
          <div>
            <div className="text-sm text-muted-foreground mb-1">CLIENT</div>
            <p className="font-medium">{project.client}</p>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground mb-1">DESCRIPTION</div>
            <p>{project.description}</p>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground mb-1">TAGS</div>
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-sm text-muted-foreground mb-1">DATE</div>
            <p>{new Date(project.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long'
            })}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

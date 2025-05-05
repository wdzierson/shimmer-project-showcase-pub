
import React from 'react';
import { Project } from '@/components/project/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronLeft, X } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

// Update the Project interface to include the new fields
interface ProjectDetailProps {
  project: Project & {
    year?: number;
    involvement?: string;
  };
  onClose: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onClose }) => {
  // Check if project has multiple images
  const hasMultipleImages = Array.isArray(project.additionalImages) && project.additionalImages.length > 0;
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={onClose} className="mr-2">
            <ChevronLeft size={20} />
          </Button>
          <h3 className="text-xl font-medium font-serif">{project.title}</h3>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
          <X size={18} />
        </Button>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {/* Large hero image or carousel at top */}
        <div className="w-full">
          {hasMultipleImages ? (
            <Carousel className="w-full">
              <CarouselContent>
                <CarouselItem>
                  <div className="w-full">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </CarouselItem>
                
                {project.additionalImages?.map((imageUrl, index) => (
                  <CarouselItem key={`additional-image-${index}`}>
                    <div className="w-full">
                      <img 
                        src={imageUrl} 
                        alt={`${project.title} - ${index + 1}`} 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2">
                  <CarouselPrevious className="relative translate-y-0 left-0 h-7 w-7 mr-2" />
                  <CarouselNext className="relative translate-y-0 right-0 h-7 w-7" />
                </div>
              </div>
            </Carousel>
          ) : (
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-auto object-cover"
            />
          )}
        </div>
        
        {/* Project details in an attractive layout */}
        <div className="max-w-4xl mx-auto p-8">
          <div className="mb-8">
            <div className="text-sm text-muted-foreground uppercase mb-1">{project.client}</div>
            <h2 className="text-3xl font-medium mb-4 font-serif">{project.title}</h2>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-medium mb-3 font-serif">About this project</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm uppercase font-medium text-muted-foreground mb-2">Year</h4>
              <p>{project.year || new Date(project.createdAt).getFullYear()}</p>
            </div>
            
            <div>
              <h4 className="text-sm uppercase font-medium text-muted-foreground mb-2">Date Created</h4>
              <p>{new Date(project.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long'
              })}</p>
            </div>
            
            {project.involvement && (
              <div>
                <h4 className="text-sm uppercase font-medium text-muted-foreground mb-2">Involvement</h4>
                <p>{project.involvement}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

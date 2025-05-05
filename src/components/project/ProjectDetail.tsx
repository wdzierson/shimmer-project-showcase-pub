
import React from 'react';
import { Project } from '@/components/project/ProjectCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
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
    <div className="h-full flex flex-col overflow-y-auto bg-[#f9f9f7]">
      {/* Header with just the X to close */}
      <div className="sticky top-0 z-10 py-4 px-6 flex justify-end bg-[#f9f9f7]/80 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-gray-200/60">
          <X size={20} />
        </Button>
      </div>
      
      <div className="flex-grow px-6 pb-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left column - Images */}
          <div className="space-y-6">
            <div className="rounded-lg overflow-hidden shadow-sm border border-gray-100">
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
          </div>
          
          {/* Right column - Details */}
          <div className="space-y-8">
            <div>
              <div className="text-sm text-muted-foreground font-medium uppercase mb-1.5">
                {project.client}
              </div>
              <h1 className="text-3xl lg:text-4xl font-medium mb-4 font-serif">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-gray-200 text-gray-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="prose prose-slate max-w-none">
              <p className="text-lg mb-6">{project.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-200 pt-8">
              <div>
                <h3 className="text-sm uppercase font-medium text-muted-foreground mb-2">Year</h3>
                <p className="font-medium">{project.year || new Date(project.createdAt).getFullYear()}</p>
              </div>
              
              <div>
                <h3 className="text-sm uppercase font-medium text-muted-foreground mb-2">Date Created</h3>
                <p className="font-medium">{new Date(project.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long'
                })}</p>
              </div>
              
              {project.involvement && (
                <div>
                  <h3 className="text-sm uppercase font-medium text-muted-foreground mb-2">Involvement</h3>
                  <p className="font-medium">{project.involvement}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

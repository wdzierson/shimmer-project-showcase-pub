
import React from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';

interface ProjectImageCarouselProps {
  mainImageUrl: string;
  additionalImages?: string[];
  title: string;
}

const ProjectImageCarousel: React.FC<ProjectImageCarouselProps> = ({ 
  mainImageUrl, 
  additionalImages, 
  title 
}) => {
  const hasMultipleImages = additionalImages && additionalImages.length > 0;
  
  if (!hasMultipleImages) {
    return (
      <img 
        src={mainImageUrl} 
        alt={title} 
        className="w-full h-auto"
      />
    );
  }
  
  return (
    <Carousel className="w-full">
      <CarouselContent>
        {/* Main image */}
        <CarouselItem>
          <div className="p-1">
            <img 
              src={mainImageUrl} 
              alt={title} 
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        </CarouselItem>
        
        {/* Additional images */}
        {additionalImages.map((imageUrl, index) => (
          <CarouselItem key={`additional-image-${index}`}>
            <div className="p-1">
              <img 
                src={imageUrl} 
                alt={`${title} - ${index + 1}`} 
                className="w-full h-auto object-cover rounded-md"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="flex justify-center mt-2">
        <CarouselPrevious className="relative translate-y-0 left-0 mr-2" />
        <CarouselNext className="relative translate-y-0 right-0" />
      </div>
    </Carousel>
  );
};

export default ProjectImageCarousel;

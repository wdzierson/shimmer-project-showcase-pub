
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

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
  const hasAdditionalImages = additionalImages && additionalImages.length > 0;
  
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4">
        {/* Main image */}
        <div>
          <img 
            src={mainImageUrl} 
            alt={title} 
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
        
        {/* Additional images */}
        {hasAdditionalImages && additionalImages.map((imageUrl, index) => (
          <div key={`additional-image-${index}`} className="pt-4">
            <img 
              src={imageUrl} 
              alt={`${title} - ${index + 1}`} 
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ProjectImageCarousel;

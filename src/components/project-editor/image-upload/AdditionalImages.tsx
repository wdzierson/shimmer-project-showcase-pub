
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Images } from 'lucide-react';

interface AdditionalImagesProps {
  images: string[];
  onRemove: (index: number) => void;
  onMakePrimary: (imageUrl: string, index: number) => void;
  primaryImageUrl: string;
}

const AdditionalImages = ({ 
  images, 
  onRemove, 
  onMakePrimary,
  primaryImageUrl 
}: AdditionalImagesProps) => {
  if (images.length === 0) return null;
  
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">Additional Images</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((img, index) => (
          <div key={index} className="relative group">
            <img 
              src={img} 
              alt={`Additional image ${index + 1}`} 
              className="w-full h-40 object-cover rounded-md"
            />
            <div className="absolute -top-2 -right-2 flex gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="rounded-full"
                onClick={() => onMakePrimary(primaryImageUrl, index)}
                title="Make primary"
              >
                <Images className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="rounded-full"
                onClick={() => onRemove(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdditionalImages;

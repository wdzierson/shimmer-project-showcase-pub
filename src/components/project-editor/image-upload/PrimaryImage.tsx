
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface PrimaryImageProps {
  imageUrl: string;
  onRemove: () => void;
}

const PrimaryImage = ({ imageUrl, onRemove }: PrimaryImageProps) => {
  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">Primary Image</div>
      <div className="relative w-full mb-4">
        <img 
          src={imageUrl} 
          alt="Primary project image" 
          className="w-full max-h-64 object-contain rounded-md"
        />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute -top-2 -right-2 rounded-full"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PrimaryImage;

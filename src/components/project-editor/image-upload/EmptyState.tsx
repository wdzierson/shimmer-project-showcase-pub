
import React from 'react';
import { GalleryVertical } from 'lucide-react';

const EmptyState = () => {
  return (
    <div className="py-10 text-center">
      <GalleryVertical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <p className="text-muted-foreground mb-2">Upload images for your project</p>
      <p className="text-xs text-muted-foreground mb-4">PNG, JPG or WebP (max 5MB per image)</p>
    </div>
  );
};

export default EmptyState;

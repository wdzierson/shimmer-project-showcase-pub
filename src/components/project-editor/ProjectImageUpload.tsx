
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface ProjectImageUploadProps {
  imageUrl: string;
  setImageUrl: (value: string) => void;
}

const ProjectImageUpload = ({
  imageUrl,
  setImageUrl
}: ProjectImageUploadProps) => {
  return (
    <div className="space-y-2">
      <Label>Project Image</Label>
      <div className="border rounded-md p-4 flex flex-col items-center justify-center text-center">
        {imageUrl ? (
          <div className="space-y-4">
            <div className="relative w-full max-w-md mx-auto">
              <img 
                src={imageUrl} 
                alt="Project preview" 
                className="w-full h-auto rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 rounded-full"
                onClick={() => setImageUrl('')}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              To replace, upload a new image
            </p>
          </div>
        ) : (
          <div className="py-10">
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Drag and drop an image, or click to browse</p>
            <p className="text-xs text-muted-foreground mb-4">PNG, JPG or WebP (max 5MB)</p>
            <Button type="button" variant="outline">
              Select Image
            </Button>
            <Input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                // In a real app, this would upload to Supabase storage
                if (e.target.files?.[0]) {
                  // Using a sample image for demo purposes
                  setImageUrl('/lovable-uploads/ac6f419a-3a72-4e52-ad89-993c798272e2.png');
                }
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectImageUpload;

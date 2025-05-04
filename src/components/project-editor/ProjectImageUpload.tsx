
import React, { useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ProjectImageUploadProps {
  imageUrl: string;
  setImageUrl: (value: string) => void;
}

const ProjectImageUpload = ({
  imageUrl,
  setImageUrl
}: ProjectImageUploadProps) => {
  // Create a reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Function to trigger the hidden file input
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Function to handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit');
      return;
    }
    
    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('File must be PNG, JPG or WebP format');
      return;
    }
    
    try {
      toast.info('Uploading image...');
      
      // Generate a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('project_images')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        });
        
      if (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image');
        return;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from('project_images')
        .getPublicUrl(filePath);
      
      // Set the image URL
      setImageUrl(publicUrlData.publicUrl);
      toast.success('Image uploaded successfully');
      
    } catch (error) {
      console.error('Error in upload process:', error);
      toast.error('Failed to process image');
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleUploadClick}
            >
              Select Image
            </Button>
            <Input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileUpload}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectImageUpload;

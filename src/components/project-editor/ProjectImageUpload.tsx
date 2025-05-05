
import React, { useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, X, Images, GalleryVertical } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface ProjectImageUploadProps {
  imageUrl: string;
  setImageUrl: (value: string) => void;
  additionalImages: string[];
  setAdditionalImages: (value: string[]) => void;
}

const ProjectImageUpload = ({
  imageUrl,
  setImageUrl,
  additionalImages,
  setAdditionalImages
}: ProjectImageUploadProps) => {
  // Create a reference to the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
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
      setIsUploading(true);
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
      if (!imageUrl) {
        // If no primary image, set this as primary
        setImageUrl(publicUrlData.publicUrl);
      } else {
        // Otherwise add to additional images
        setAdditionalImages([...additionalImages, publicUrlData.publicUrl]);
      }
      toast.success('Image uploaded successfully');
      
    } catch (error) {
      console.error('Error in upload process:', error);
      toast.error('Failed to process image');
    } finally {
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setIsUploading(false);
    }
  };

  // Function to remove an additional image
  const handleRemoveAdditionalImage = (index: number) => {
    const newImages = [...additionalImages];
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
  };

  // Function to make an additional image the primary image
  const handleMakePrimary = (imageUrl: string, index: number) => {
    // Add current primary to additional images
    const newAdditionalImages = [...additionalImages];
    if (imageUrl) {
      newAdditionalImages.push(imageUrl);
    }
    
    // Remove the selected image from additional
    newAdditionalImages.splice(index, 1);
    
    // Set the selected image as primary
    setImageUrl(additionalImages[index]);
    setAdditionalImages(newAdditionalImages);
    toast.success('Set as primary image');
  };

  const hasImages = imageUrl || additionalImages.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Project Images</Label>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={handleUploadClick}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileUpload}
          disabled={isUploading}
        />
      </div>

      <div className="border rounded-md p-4">
        {hasImages ? (
          <div className="space-y-6">
            {/* Primary image */}
            {imageUrl && (
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
                    onClick={() => setImageUrl('')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Additional images */}
            {additionalImages.length > 0 && (
              <div>
                <div className="text-sm text-muted-foreground mb-2">Additional Images</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {additionalImages.map((img, index) => (
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
                          onClick={() => handleMakePrimary(imageUrl, index)}
                          title="Make primary"
                        >
                          <Images className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleRemoveAdditionalImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="py-10 text-center">
            <GalleryVertical className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-2">Upload images for your project</p>
            <p className="text-xs text-muted-foreground mb-4">PNG, JPG or WebP (max 5MB per image)</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectImageUpload;

import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseImageUploadProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  additionalImages: string[];
  setAdditionalImages: (images: string[]) => void;
}

export const useImageUpload = ({
  imageUrl,
  setImageUrl,
  additionalImages,
  setAdditionalImages
}: UseImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

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
      e.target.value = '';
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
  const handleMakePrimary = (currentPrimaryUrl: string, index: number) => {
    // Add current primary to additional images
    const newAdditionalImages = [...additionalImages];
    if (currentPrimaryUrl) {
      newAdditionalImages.push(currentPrimaryUrl);
    }
    
    // Remove the selected image from additional
    newAdditionalImages.splice(index, 1);
    
    // Set the selected image as primary
    setImageUrl(additionalImages[index]);
    setAdditionalImages(newAdditionalImages);
    toast.success('Set as primary image');
  };

  return {
    isUploading,
    handleFileUpload,
    handleRemoveAdditionalImage,
    handleMakePrimary
  };
};

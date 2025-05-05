
import { supabase } from '@/integrations/supabase/client';

export async function saveProjectImages(
  projectId: string, 
  primaryImage: string, 
  additionalImages: string[] = []
): Promise<boolean> {
  try {
    // First, delete existing images
    const { error: deleteImagesError } = await supabase
      .from('project_images')
      .delete()
      .eq('project_id', projectId);
      
    if (deleteImagesError) {
      console.error('Error deleting existing images:', deleteImagesError);
      throw deleteImagesError;
    }
    
    // Save primary image if provided
    if (primaryImage) {
      const { error: primaryImageError } = await supabase
        .from('project_images')
        .insert({
          project_id: projectId,
          image_url: primaryImage,
          is_primary: true,
          display_order: 0
        });
        
      if (primaryImageError) {
        console.error('Error saving primary image:', primaryImageError);
        throw primaryImageError;
      }
    }
    
    // Save additional images
    if (additionalImages && additionalImages.length > 0) {
      const additionalImagesData = additionalImages.map((url, index) => ({
        project_id: projectId,
        image_url: url,
        is_primary: false,
        display_order: index + 1
      }));
      
      const { error: additionalImagesError } = await supabase
        .from('project_images')
        .insert(additionalImagesData);
        
      if (additionalImagesError) {
        console.error('Error saving additional images:', additionalImagesError);
        throw additionalImagesError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error saving project images:', error);
    throw error;
  }
}

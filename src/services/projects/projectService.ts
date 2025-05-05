
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { ProjectSubmitData } from './types';
import { saveProjectTags } from './tagService';
import { saveProjectImages } from './imageService';
import { saveProjectEmbeddings } from './embeddingService';

export async function saveProject({
  id,
  title,
  client,
  description,
  imageUrl,
  additionalImages = [],
  liveUrl = '',
  involvement = '',
  year,
  tags,
  isNew
}: ProjectSubmitData): Promise<boolean> {
  // Validate
  if (!title || !client || !description) {
    toast.error('Please fill in all required fields');
    return false;
  }
  
  try {
    toast.info('Saving project...');
    
    // Create or update project in Supabase
    const projectId = isNew ? uuidv4() : id;
    const projectData = {
      id: projectId,
      title,
      client,
      description,
      year: year || new Date().getFullYear(),
      updated_at: new Date().toISOString(),
      ...(isNew && { created_at: new Date().toISOString() }),
      ...(liveUrl && { liveurl: liveUrl }),
      ...(involvement && { involvement })
    };
    
    console.log('Saving project data:', projectData);
    
    // Insert or update project
    let { error } = isNew 
      ? await supabase.from('projects').insert(projectData)
      : await supabase.from('projects').update(projectData).eq('id', projectId);
    
    if (error) {
      console.error('Error saving project:', error);
      throw error;
    }
    
    // Save tags
    try {
      await saveProjectTags(projectId, tags);
    } catch (error) {
      console.error('Error saving project tags:', error);
      toast.error('Error saving project tags');
      // Continue even if tags fail - don't block the user
    }
    
    // Handle images
    try {
      await saveProjectImages(projectId, imageUrl, additionalImages);
    } catch (error) {
      console.error('Error saving project images:', error);
      toast.error('Error saving project images');
      // Continue even if images fail - don't block the user
    }
    
    // Generate embeddings
    try {
      const embeddingSuccess = await saveProjectEmbeddings(
        projectId,
        title,
        client,
        description,
        year,
        involvement,
        tags
      );
      
      if (!embeddingSuccess) {
        toast.error('Error saving project embeddings, search functionality may be limited.');
      }
    } catch (error) {
      console.error('Error with embeddings process:', error);
      toast.error('Error processing project embeddings, search functionality may be limited.');
      // We don't want embedding errors to prevent project saving
    }
    
    toast.success(`Project ${isNew ? 'created' : 'updated'} successfully!`);
    return true;
  } catch (error) {
    console.error('Error saving project:', error);
    toast.error(`Failed to ${isNew ? 'create' : 'update'} project`);
    return false;
  }
}

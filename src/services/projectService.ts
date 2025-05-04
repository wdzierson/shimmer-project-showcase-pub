
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { createEmbeddings } from '@/services/openai';

export interface ProjectSubmitData {
  id?: string;
  title: string;
  client: string;
  description: string;
  imageUrl: string;
  liveUrl?: string;
  involvement?: string;
  tags: string[];
  isNew: boolean;
}

export const saveProject = async ({
  id,
  title,
  client,
  description,
  imageUrl,
  liveUrl = '',
  involvement = '',
  tags,
  isNew
}: ProjectSubmitData) => {
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
      year: new Date().getFullYear(),
      updated_at: new Date().toISOString(),
      ...(isNew && { created_at: new Date().toISOString() }),
      ...(liveUrl && { liveurl: liveUrl }),
      ...(involvement && { involvement })
    };
    
    // Insert or update project
    let { error } = isNew 
      ? await supabase.from('projects').insert(projectData)
      : await supabase.from('projects').update(projectData).eq('id', projectId);
    
    if (error) throw error;
    
    // Save tags
    // First, get tag IDs or insert new ones
    const tagIds = [];
    for (const tagName of tags) {
      // Check if tag exists
      const { data: existingTags } = await supabase
        .from('tags')
        .select('id')
        .eq('name', tagName)
        .limit(1);
        
      if (existingTags && existingTags.length > 0) {
        tagIds.push(existingTags[0].id);
      } else {
        // Create new tag
        const newTagId = uuidv4();
        const { error: tagError } = await supabase
          .from('tags')
          .insert({ id: newTagId, name: tagName });
          
        if (tagError) throw tagError;
        tagIds.push(newTagId);
      }
    }
    
    // If not a new project, delete existing tag associations
    if (!isNew) {
      const { error: deleteError } = await supabase
        .from('project_tags')
        .delete()
        .eq('project_id', projectId);
        
      if (deleteError) throw deleteError;
    }
    
    // Save tag associations
    if (tagIds.length > 0) {
      const projectTags = tagIds.map(tagId => ({
        project_id: projectId,
        tag_id: tagId
      }));
      
      const { error: projectTagsError } = await supabase
        .from('project_tags')
        .insert(projectTags);
        
      if (projectTagsError) throw projectTagsError;
    }
    
    // Save primary image
    if (imageUrl) {
      // Check if image record exists
      const { data: existingImages } = await supabase
        .from('project_images')
        .select('id')
        .eq('project_id', projectId)
        .eq('is_primary', true)
        .limit(1);
        
      if (existingImages && existingImages.length > 0) {
        // Update existing image
        const { error: imageError } = await supabase
          .from('project_images')
          .update({ image_url: imageUrl })
          .eq('id', existingImages[0].id);
          
        if (imageError) throw imageError;
      } else {
        // Insert new image
        const { error: imageError } = await supabase
          .from('project_images')
          .insert({
            project_id: projectId,
            image_url: imageUrl,
            is_primary: true,
            display_order: 0
          });
          
        if (imageError) throw imageError;
      }
    }
    
    try {
      // Generate content for embeddings - wrap in try/catch so it doesn't block project saving if it fails
      const { data: contentData } = await supabase.rpc('generate_project_content_for_embeddings', {
        project_id: projectId
      });
      
      if (contentData) {
        // Generate embeddings using OpenAI
        const embeddings = await createEmbeddings(contentData);
        
        if (embeddings) {
          // Store embeddings - the embedding is now a JSON string as expected by the database
          const { error: embeddingError } = await supabase
            .from('project_embeddings')
            .upsert({
              project_id: projectId,
              content: contentData,
              embedding: embeddings
            });
            
          if (embeddingError) {
            console.error('Error saving embeddings:', embeddingError);
            // Continue even if embeddings fail - don't block the user
          }
        }
      }
    } catch (embeddingError) {
      console.error('Error with embeddings process:', embeddingError);
      // We don't want embedding errors to prevent project saving
    }
    
    toast.success(`Project ${isNew ? 'created' : 'updated'} successfully!`);
    return true;
  } catch (error) {
    console.error('Error saving project:', error);
    toast.error(`Failed to ${isNew ? 'create' : 'update'} project`);
    return false;
  }
};

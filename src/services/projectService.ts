
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
  additionalImages?: string[];
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
  additionalImages = [],
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
          
        if (tagError) {
          console.error('Error creating tag:', tagError);
          throw tagError;
        }
        tagIds.push(newTagId);
      }
    }
    
    // If not a new project, delete existing tag associations
    if (!isNew) {
      const { error: deleteError } = await supabase
        .from('project_tags')
        .delete()
        .eq('project_id', projectId);
        
      if (deleteError) {
        console.error('Error deleting existing tags:', deleteError);
        throw deleteError;
      }
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
        
      if (projectTagsError) {
        console.error('Error saving project tags:', projectTagsError);
        throw projectTagsError;
      }
    }
    
    // Handle images
    // First, get existing images for non-new projects
    let existingImages: { id: string, is_primary: boolean, image_url: string }[] = [];
    if (!isNew) {
      const { data: currentImages } = await supabase
        .from('project_images')
        .select('id, is_primary, image_url')
        .eq('project_id', projectId);
        
      if (currentImages) {
        existingImages = currentImages;
      }
      
      // Delete all existing images first
      const { error: deleteImagesError } = await supabase
        .from('project_images')
        .delete()
        .eq('project_id', projectId);
        
      if (deleteImagesError) {
        console.error('Error deleting existing images:', deleteImagesError);
        throw deleteImagesError;
      }
    }
    
    // Save primary image if provided
    if (imageUrl) {
      const { error: primaryImageError } = await supabase
        .from('project_images')
        .insert({
          project_id: projectId,
          image_url: imageUrl,
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
    
    // Generate content for embeddings
    try {
      console.log('Generating content for embeddings...');
      
      // Generate content by directly concatenating project data with tags
      const contentData = `${title} ${client} ${description} ${tags.join(' ')}`;
      
      if (contentData) {
        console.log('Content generated:', contentData);
        
        // Generate embeddings using OpenAI
        const embeddings = await createEmbeddings(contentData);
        
        if (embeddings) {
          console.log('Embeddings generated successfully');
          
          // First check if there's an existing embedding
          const { data: existingEmbedding } = await supabase
            .from('project_embeddings')
            .select('id')
            .eq('project_id', projectId)
            .limit(1);
            
          // Store embeddings - ensure embedding is a JSON string
          if (existingEmbedding && existingEmbedding.length > 0) {
            // Update existing embedding
            const { error: embeddingError } = await supabase
              .from('project_embeddings')
              .update({
                content: contentData,
                embedding: embeddings
              })
              .eq('id', existingEmbedding[0].id);
              
            if (embeddingError) {
              console.error('Error updating embeddings:', embeddingError);
              toast.error('Error updating project embeddings, search functionality may be limited.');
              // Continue even if embeddings fail - don't block the user
            }
          } else {
            // Insert new embedding
            const { error: embeddingError } = await supabase
              .from('project_embeddings')
              .insert({
                project_id: projectId,
                content: contentData,
                embedding: embeddings
              });
              
            if (embeddingError) {
              console.error('Error saving embeddings:', embeddingError);
              toast.error('Error saving project embeddings, search functionality may be limited.');
              // Continue even if embeddings fail - don't block the user
            }
          }
        }
      }
    } catch (embeddingError) {
      console.error('Error with embeddings process:', embeddingError);
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
};

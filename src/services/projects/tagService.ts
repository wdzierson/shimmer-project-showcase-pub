
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export async function saveProjectTags(projectId: string, tags: string[]): Promise<boolean> {
  try {
    // Get tag IDs or insert new ones
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
    
    // Delete existing tag associations
    const { error: deleteError } = await supabase
      .from('project_tags')
      .delete()
      .eq('project_id', projectId);
      
    if (deleteError) {
      console.error('Error deleting existing tags:', deleteError);
      throw deleteError;
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
    
    return true;
  } catch (error) {
    console.error('Error saving project tags:', error);
    throw error;
  }
}

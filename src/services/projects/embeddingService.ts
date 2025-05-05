
import { supabase } from '@/integrations/supabase/client';
import { createEmbeddings } from '@/services/openai';

export async function saveProjectEmbeddings(
  projectId: string, 
  title: string, 
  client: string, 
  description: string,
  year: number,
  involvement: string = '',
  tags: string[] = []
): Promise<boolean> {
  try {
    console.log('Generating content for embeddings...');
    
    // Generate content by directly concatenating project data with tags
    const contentData = `${title} ${client} ${description} ${year} ${involvement || ''} ${tags.join(' ')}`;
    
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
            return false;
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
            return false;
          }
        }
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error with embeddings process:', error);
    return false;
  }
}

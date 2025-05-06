
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

// Generate a session ID if none exists
let sessionId = localStorage.getItem('chat_session_id');
if (!sessionId) {
  sessionId = uuidv4();
  localStorage.setItem('chat_session_id', sessionId);
}

/**
 * Saves a user prompt to the database
 */
export const savePrompt = async (content: string, responseContent?: string) => {
  try {
    const { data, error } = await supabase
      .from('user_prompts')
      .insert({
        content,
        session_id: sessionId,
        response_content: responseContent || null,
      });

    if (error) {
      console.error('Error saving prompt:', error);
    }
    
    return data;
  } catch (error) {
    console.error('Exception when saving prompt:', error);
  }
};

/**
 * Retrieves prompts from the database in reverse chronological order
 */
export const fetchPrompts = async (limit = 50, page = 0) => {
  const { data, error, count } = await supabase
    .from('user_prompts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) {
    console.error('Error fetching prompts:', error);
    return { prompts: [], count: 0 };
  }

  return { prompts: data || [], count };
};

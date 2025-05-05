
// This file contains services for interacting with OpenAI API

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionRequest {
  messages: OpenAIMessage[];
  model: string;
}

export async function getChatCompletion(request: ChatCompletionRequest): Promise<string> {
  try {
    console.log('Getting chat completion with model:', request.model);
    
    const response = await fetch('https://uilvozcryifnpldfpwiz.supabase.co/functions/v1/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnon}`,
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      throw new Error(`OpenAI API returned status ${response.status}`);
    }
    
    const data = await response.json();
    return data.generatedText || "I couldn't find relevant information about that.";
  } catch (error) {
    console.error('Error getting chat completion:', error);
    return "Sorry, I encountered an error while processing your request.";
  }
}

// Supabase anon key for edge function calls
const supabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpbHZvemNyeWlmbnBsZGZwd2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTYxMzAsImV4cCI6MjA2MTk3MjEzMH0.7W6t2His-58Hm25fKpaMVkIZ94p4QL39fbg352l-t1Q';

export async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    console.log('Generating embeddings for text:', text.substring(0, 50) + '...');
    
    const response = await fetch('https://uilvozcryifnpldfpwiz.supabase.co/functions/v1/generate-embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnon}`,
      },
      body: JSON.stringify({ 
        text: text,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response from embeddings API:', errorText);
      throw new Error(`Embeddings API returned status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Embeddings generated successfully');
    
    return data.embedding;
  } catch (error) {
    console.error('Error creating embeddings:', error);
    throw error;
  }
}

export async function createEmbeddings(text: string): Promise<string> {
  try {
    const embedding = await generateEmbeddings(text);
    return JSON.stringify(embedding);
  } catch (error) {
    console.error('Error in createEmbeddings:', error);
    throw error;
  }
}

export async function searchSimilarProjects(query: string): Promise<any[]> {
  try {
    console.log('Searching for projects similar to:', query);
    
    // Generate embedding for the query
    const embedding = await generateEmbeddings(query);
    
    // Use embedding to search for similar projects with lower threshold
    const response = await fetch('https://uilvozcryifnpldfpwiz.supabase.co/functions/v1/search-projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnon}`,
      },
      body: JSON.stringify({ 
        embedding, 
        threshold: 0.3, // Lower threshold to get more results (was 0.5)
        limit: 10 // Increase limit to get more potential matches (was 5)
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Search API returned status ${response.status}: ${errorText}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.projects?.length || 0} similar projects`);
    return data.projects || [];
  } catch (error) {
    console.error('Error searching projects:', error);
    return [];
  }
}


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
    
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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

export async function generateEmbeddings(text: string): Promise<number[]> {
  try {
    console.log('Generating embeddings for text:', text.substring(0, 50) + '...');
    
    const response = await fetch('/api/generate-embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
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
    
    const response = await fetch('/api/search-projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        embedding, 
        threshold: 0.6, // Lower threshold to get more results
        limit: 5 
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Search API returned status ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.projects?.length || 0} similar projects`);
    return data.projects || [];
  } catch (error) {
    console.error('Error searching projects:', error);
    return [];
  }
}

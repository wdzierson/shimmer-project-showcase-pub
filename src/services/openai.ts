
// This will be implemented once Supabase is connected

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

export async function createEmbeddings(text: string): Promise<string> {
  try {
    const response = await fetch('/api/generate-embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      throw new Error(`Embeddings API returned status ${response.status}`);
    }
    
    const data = await response.json();
    // Convert the embedding array to a string format that can be stored in Supabase
    return JSON.stringify(data.embedding);
  } catch (error) {
    console.error('Error creating embeddings:', error);
    // Return a mock embedding for fallback (would be removed in production)
    // Stringify the mock array so it matches the expected string type
    return JSON.stringify(Array(1536).fill(0).map(() => Math.random() * 0.01));
  }
}

export async function generateEmbeddings(text: string): Promise<string> {
  return createEmbeddings(text);
}

export async function searchSimilarProjects(query: string): Promise<any[]> {
  try {
    const queryEmbedding = await createEmbeddings(query);
    
    const response = await fetch('/api/search-projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        embedding: queryEmbedding,
        threshold: 0.7,
        limit: 5 
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Search API returned status ${response.status}`);
    }
    
    const data = await response.json();
    return data.projects || [];
  } catch (error) {
    console.error('Error searching projects:', error);
    return [];
  }
}

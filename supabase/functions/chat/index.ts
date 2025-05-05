
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, model = 'gpt-4o-mini' } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Set up streaming response
    const transformStream = new TransformStream();
    const writer = transformStream.writable.getWriter();
    
    // Start the OpenAI API request
    const fetchResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 800,
        temperature: 0.7,
        stream: true, // Enable streaming
      }),
    });

    if (!fetchResponse.ok) {
      const errorData = await fetchResponse.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${fetchResponse.status} ${fetchResponse.statusText}`);
    }

    // Create and return a streaming response
    const streamResponse = new Response(transformStream.readable, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

    // Process the OpenAI stream in the background
    (async () => {
      const reader = fetchResponse.body?.getReader();
      if (!reader) {
        await writer.write(new TextEncoder().encode('event: error\ndata: No response body from OpenAI\n\n'));
        await writer.close();
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices[0].delta.content;
                if (content) {
                  await writer.write(
                    new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`)
                  );
                }
              } catch (error) {
                console.error('Error parsing OpenAI stream:', error, data);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error processing OpenAI stream:', error);
      } finally {
        await writer.write(new TextEncoder().encode('event: done\ndata: Stream finished\n\n'));
        await writer.close();
      }
    })();
    
    return streamResponse;
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

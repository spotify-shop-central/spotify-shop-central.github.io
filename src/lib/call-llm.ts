'use server';

function isFeaturedQuery(query: string): boolean {
  const featuredQueries = ['billboard-top-100', 'vinyl-collections', 'up-and-coming-artists', 'all-time-favorites'];
  return featuredQueries.includes(query.toLowerCase());
}

function getContextForQuery(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Handle predefined featured queries
  if (lowerQuery === 'billboard-top-100') {
    return `Return exactly 8 current Billboard Top 100 artists in this format: ["The Weeknd", "Taylor Swift", "Bad Bunny", "Harry Styles", "Doja Cat", "Post Malone", "Olivia Rodrigo", "Dua Lipa"]`;
  }
  
  if (lowerQuery === 'vinyl-collections') {
    return `Return exactly 8 artists known for vinyl releases in this format: ["Taylor Swift", "Arctic Monkeys", "Fleetwood Mac", "Pink Floyd", "The Beatles", "Radiohead", "Lana Del Rey", "Mac Miller"]`;
  }
  
  if (lowerQuery === 'up-and-coming-artists') {
    return `Return exactly 8 emerging artists in this format: ["Chappell Roan", "Sabrina Carpenter", "Gracie Abrams", "Clairo", "Rex Orange County", "Phoebe Bridgers", "Mitski", "Steve Lacy"]`;
  }
  
  if (lowerQuery === 'all-time-favorites') {
    return `Return exactly 8 legendary artists in this format: ["The Beatles", "Queen", "Led Zeppelin", "Pink Floyd", "The Rolling Stones", "David Bowie", "AC/DC", "Nirvana"]`;
  }
  
  // Handle general queries
  return `Based on the query "${query}", return exactly 8 relevant musical artists in this format: ["Artist Name 1", "Artist Name 2", "Artist Name 3", "Artist Name 4", "Artist Name 5", "Artist Name 6", "Artist Name 7", "Artist Name 8"]`;
}

export async function callLLM(query: string) {
  try {
    // Check if API key is available
    if (!process.env.OPENROUTER_KEY) {
      throw new Error('OPENROUTER_KEY environment variable is not set');
    }

    console.log('Making LLM request for query:', query);
    
    const contextPrompt = getContextForQuery(query);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://spotify-shop-central.github.io',
        'X-Title': 'Spotify Shop Central',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'model': 'google/gemma-3n-e4b-it:free',
        'messages': [
          {
            'role': 'user',
            'content': `${contextPrompt}. Response must be ONLY the JSON array, no additional text.`
          }
        ],
        'provider': {
          'sort': 'throughput'
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const completion = await response.json();
    
    console.log('LLM response received:', completion.choices[0].message.content);
    return completion.choices[0].message;
  } catch (error) {
    console.error('Error in callLLM:', error);
    
    // If it's a fetch error, log more details
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    
    throw error;
  }
}
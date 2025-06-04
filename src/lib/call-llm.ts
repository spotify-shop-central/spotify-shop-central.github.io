'use server';
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_KEY,
  defaultHeaders: {
    "HTTP-Referer": "https://spotify-shop-central.github.io", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "Spotify Shop Central", // Optional. Site title for rankings on openrouter.ai.
  },
});
async function callLLM(query: string) {
  const completion = await openai.chat.completions.create({
    model: "google/gemma-3n-e4b-it:free",
    messages: [
        {
            "role": "system",
            "content": "You are a helpful assistant that can answer questions and help with tasks."
        },
        {
            "role": "user",
            "content": query
        }
    ],
    
  });

  return completion.choices[0].message;
}
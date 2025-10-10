
'use server';

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {config} from 'dotenv';

// Load environment variables from .env file
config();

export const ai = genkit({
  plugins: [googleAI({
    // Explicitly pass the API key from environment variables
    apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
  })],
  model: 'googleai/gemini-2.5-flash',
});

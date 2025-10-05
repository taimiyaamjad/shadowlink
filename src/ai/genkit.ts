import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyCpVcAmZ8GkGtxXXSz-mYT6A98x0WZTdA0'})],
  model: 'googleai/gemini-2.5-flash',
});

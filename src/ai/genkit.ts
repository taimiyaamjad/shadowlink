import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyCSLxsDsHHe4HU92Vx47ImBghjQvsZ_sjs'})],
  model: 'googleai/gemini-2.5-flash',
});

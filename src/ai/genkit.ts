import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({apiKey: 'AIzaSyAMQbVw0VxqOXjxqI338XmsNQRWi3YGhyg'})],
  model: 'googleai/gemini-2.5-flash',
});

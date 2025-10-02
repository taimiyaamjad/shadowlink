'use server';

/**
 * @fileOverview A flow for generating an initial AI personality profile based on a user-provided prompt.
 *
 * - generateInitialPersonality - A function that generates the initial personality profile.
 * - GenerateInitialPersonalityInput - The input type for the generateInitialPersonality function.
 * - GenerateInitialPersonalityOutput - The return type for the generateInitialPersonality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInitialPersonalityInputSchema = z.object({
  prompt: z.string().describe('A description of the desired AI personality.'),
});
export type GenerateInitialPersonalityInput = z.infer<typeof GenerateInitialPersonalityInputSchema>;

const GenerateInitialPersonalityOutputSchema = z.object({
  personalityProfile: z
    .string()
    .describe('The generated AI personality profile based on the prompt.'),
});
export type GenerateInitialPersonalityOutput = z.infer<typeof GenerateInitialPersonalityOutputSchema>;

export async function generateInitialPersonality(
  input: GenerateInitialPersonalityInput
): Promise<GenerateInitialPersonalityOutput> {
  return generateInitialPersonalityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInitialPersonalityPrompt',
  input: {schema: GenerateInitialPersonalityInputSchema},
  output: {schema: GenerateInitialPersonalityOutputSchema},
  prompt: `You are an AI personality generator. Generate an AI personality profile based on the following description: {{{prompt}}}`,
});

const generateInitialPersonalityFlow = ai.defineFlow(
  {
    name: 'generateInitialPersonalityFlow',
    inputSchema: GenerateInitialPersonalityInputSchema,
    outputSchema: GenerateInitialPersonalityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

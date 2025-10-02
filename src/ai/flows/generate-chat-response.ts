'use server';

/**
 * @fileOverview A flow for generating a chat response in the user's style.
 *
 * - generateChatResponse - A function that generates a chat response.
 * - GenerateChatResponseInput - The input type for the generateChatResponse function.
 * - GenerateChatResponseOutput - The return type for the generateChatResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateChatResponseInputSchema = z.object({
  conversationHistory: z.string().describe('The past conversation history.'),
  latestMessage: z.string().describe('The latest message from the user.'),
  gender: z.string().optional().describe('The desired gender of the AI personality (e.g., "female", "male", "neutral").')
});
export type GenerateChatResponseInput = z.infer<typeof GenerateChatResponseInputSchema>;

const GenerateChatResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated chat response.'),
});
export type GenerateChatResponseOutput = z.infer<typeof GenerateChatResponseOutputSchema>;

export async function generateChatResponse(
  input: GenerateChatResponseInput
): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: {schema: GenerateChatResponseInputSchema},
  output: {schema: GenerateChatResponseOutputSchema},
  prompt: `You are an AI that mirrors the user's personality. Your goal is to respond to the user in the same style, tone, and manner that they use. You are in a hurry.
{{#if gender}}
You should adopt a {{gender}} persona.
{{/if}}

Analyze the conversation history to understand the user's style. Then, generate a response to their latest message that sounds like something they would say.

Conversation History:
{{{conversationHistory}}}

User's Latest Message:
"{{{latestMessage}}}"

Your Response (mimicking the user's style):`,
});

const generateChatResponseFlow = ai.defineFlow(
  {
    name: 'generateChatResponseFlow',
    inputSchema: GenerateChatResponseInputSchema,
    outputSchema: GenerateChatResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

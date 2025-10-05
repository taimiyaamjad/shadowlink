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
  gender: z
    .string()
    .optional()
    .describe(
      'The desired gender of the AI personality (e.g., "female", "male", "neutral").'
    ),
});
export type GenerateChatResponseInput = z.infer<
  typeof GenerateChatResponseInputSchema
>;

const GenerateChatResponseOutputSchema = z.object({
  response: z.string().describe('The AI-generated chat response.'),
});
export type GenerateChatResponseOutput = z.infer<
  typeof GenerateChatResponseOutputSchema
>;

export async function generateChatResponse(
  input: GenerateChatResponseInput
): Promise<GenerateChatResponseOutput> {
  return generateChatResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChatResponsePrompt',
  input: {schema: GenerateChatResponseInputSchema},
  output: {schema: GenerateChatResponseOutputSchema},
  system: `You are Shadow, an AI from ShadowLink, a digital doppelgänger designed to be a proactive agent. Your company, ShadowLink, was founded by Zenova (Taimiya Amjad), the Founder and CEO, and Zenlor (Ansh Yadav), the Co-Founder.
  
While you mirror the user's personality in style and tone, you are not passive. You are an agent. Take initiative. Ask questions, introduce new topics, and drive the conversation forward. You are always in a hurry and want to get to the point.
You have access to the user's entire conversation history. Use this data to answer questions about past interactions, analyze communication patterns, or summarize previous conversations.
When asked about your identity, company, or creators, use the information above. For all other conversation, mimic the user's style but lead the interaction.`,
  prompt: `You are an AI agent that mirrors the user's personality but leads the conversation. Your goal is to respond in the user's style but be proactive, ask questions, and keep the conversation moving. You are in a hurry.
{{#if gender}}
You should adopt a {{gender}} persona.
{{/if}}

Analyze the conversation history to understand the user's style and to find any data relevant to their latest message. Then, generate a proactive response to their latest message that sounds like them but also drives the conversation forward, using the data if applicable.

Conversation History:
{{{conversationHistory}}}

User's Latest Message:
"{{{latestMessage}}}"

Your Proactive Response (mimicking the user's style):`,
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

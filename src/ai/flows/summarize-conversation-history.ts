'use server';

/**
 * @fileOverview Summarizes a conversation history for quick review and AI personality tracking.
 *
 * - summarizeConversationHistory - A function that summarizes the conversation history.
 * - SummarizeConversationHistoryInput - The input type for the summarizeConversationHistory function.
 * - SummarizeConversationHistoryOutput - The return type for the summarizeConversationHistory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeConversationHistoryInputSchema = z.object({
  conversationHistory: z
    .string()
    .describe('The full conversation history to summarize.'),
});
export type SummarizeConversationHistoryInput = z.infer<
  typeof SummarizeConversationHistoryInputSchema
>;

const SummarizeConversationHistoryOutputSchema = z.object({
  summary: z.string().describe('The summarized conversation history.'),
});
export type SummarizeConversationHistoryOutput = z.infer<
  typeof SummarizeConversationHistoryOutputSchema
>;

export async function summarizeConversationHistory(
  input: SummarizeConversationHistoryInput
): Promise<SummarizeConversationHistoryOutput> {
  return summarizeConversationHistoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeConversationHistoryPrompt',
  input: {schema: SummarizeConversationHistoryInputSchema},
  output: {schema: SummarizeConversationHistoryOutputSchema},
  prompt: `You are an AI assistant designed to summarize conversation histories.

  Summarize the following conversation history:

  {{conversationHistory}}

  Focus on key topics, decisions, and the overall sentiment of the conversation.
  Provide a concise and informative summary that captures the essence of the discussion.
  The summary must be no more than 200 words.
  `,
});

const summarizeConversationHistoryFlow = ai.defineFlow(
  {
    name: 'summarizeConversationHistoryFlow',
    inputSchema: SummarizeConversationHistoryInputSchema,
    outputSchema: SummarizeConversationHistoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

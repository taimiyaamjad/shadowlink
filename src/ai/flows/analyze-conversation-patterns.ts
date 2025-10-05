'use server';

/**
 * @fileOverview This file defines a Genkit flow for analyzing user conversation patterns.
 *
 * The flow takes conversation history as input and uses an LLM to identify patterns
 * in the user's writing style, tone, and response patterns.
 *
 * @interface AnalyzeConversationPatternsInput - Defines the input schema for the flow, which includes the conversation history.
 * @interface AnalyzeConversationPatternsOutput - Defines the output schema for the flow, which includes the analysis of conversation patterns.
 * @function analyzeConversationPatterns - The main function that triggers the conversation pattern analysis flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeConversationPatternsInputSchema = z.object({
  conversationHistory: z.string().describe('The complete conversation history of the user.'),
});
export type AnalyzeConversationPatternsInput = z.infer<
  typeof AnalyzeConversationPatternsInputSchema
>;

const AnalyzeConversationPatternsOutputSchema = z.object({
  writingStyle: z.string().describe("Analysis of the user's writing style."),
  tone: z.string().describe("Analysis of the user's tone in conversations."),
  responsePatterns: z
    .string()
    .describe("Identified response patterns in the user's conversations."),
});
export type AnalyzeConversationPatternsOutput = z.infer<
  typeof AnalyzeConversationPatternsOutputSchema
>;

export async function analyzeConversationPatterns(
  input: AnalyzeConversationPatternsInput
): Promise<AnalyzeConversationPatternsOutput> {
  return analyzeConversationPatternsFlow(input);
}

const analyzeConversationPatternsPrompt = ai.definePrompt({
  name: 'analyzeConversationPatternsPrompt',
  input: {schema: AnalyzeConversationPatternsInputSchema},
  output: {schema: AnalyzeConversationPatternsOutputSchema},
  prompt: `You are an AI trained to analyze conversation patterns. Analyze the following conversation history to identify the user's writing style, tone, and response patterns. Provide a detailed analysis for each aspect.

Conversation History:
{{{conversationHistory}}}
`,
});

const analyzeConversationPatternsFlow = ai.defineFlow(
  {
    name: 'analyzeConversationPatternsFlow',
    inputSchema: AnalyzeConversationPatternsInputSchema,
    outputSchema: AnalyzeConversationPatternsOutputSchema,
  },
  async input => {
    const {output} = await analyzeConversationPatternsPrompt(input);
    return output!;
  }
);

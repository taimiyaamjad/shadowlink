'use server';

/**
 * @fileOverview This file defines a Genkit flow for projecting a user's future self
 * based on their conversation history. It analyzes conversation themes to generate
 * a potential future scenario.
 *
 * @interface ProjectFutureSelfInput - Defines the input schema for the flow.
 * @interface ProjectFutureSelfOutput - Defines the output schema for the flow.
 * @function projectFutureSelf - The main function that triggers the future self projection flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProjectFutureSelfInputSchema = z.object({
  conversationHistory: z.string().describe('The complete conversation history of the user.'),
});
export type ProjectFutureSelfInput = z.infer<typeof ProjectFutureSelfInputSchema>;

const ProjectFutureSelfOutputSchema = z.object({
  topic: z.string().describe('The main topic identified from the conversation (e.g., Health, Career, Learning).'),
  projection: z.string().describe('A textual projection of a potential future scenario based on the identified topic and conversation patterns.'),
});
export type ProjectFutureSelfOutput = z.infer<typeof ProjectFutureSelfOutputSchema>;

export async function projectFutureSelf(
  input: ProjectFutureSelfInput
): Promise<ProjectFutureSelfOutput> {
  return projectFutureSelfFlow(input);
}


const extractKeyTopics = ai.defineTool(
    {
      name: 'extractKeyTopics',
      description: 'Extracts the most prominent life topics (e.g., Health, Career, Social Life, Learning) from a conversation history.',
      inputSchema: z.object({ conversationHistory: z.string() }),
      outputSchema: z.object({
          topics: z.array(z.string()).describe('A list of 1-3 key topics discussed.')
      })
    },
    async ({ conversationHistory }) => {
      // In a real-world scenario, this could involve more complex NLP.
      // For now, we'll use a simple keyword-based approach as an example.
      const topics: Record<string, string[]> = {
        'Health & Fitness': ['gym', 'workout', 'diet', 'sleep', 'healthy', 'run', 'exercise'],
        'Career & Finance': ['work', 'job', 'project', 'deadline', 'promotion', 'invest', 'budget', 'money'],
        'Learning & Growth': ['learn', 'book', 'course', 'skill', 'study', 'read'],
        'Social Life': ['friends', 'party', 'hang out', 'family', 'relationship'],
      };

      const topicCounts: Record<string, number> = {};
      const lowerCaseHistory = conversationHistory.toLowerCase();

      for (const topic in topics) {
        topicCounts[topic] = 0;
        for (const keyword of topics[topic]) {
          topicCounts[topic] += (lowerCaseHistory.match(new RegExp(`\\b${keyword}\\b`, 'g')) || []).length;
        }
      }

      const sortedTopics = Object.entries(topicCounts).sort(([,a],[,b]) => b - a);
      const topTopics = sortedTopics.filter(([,count]) => count > 0).slice(0,1).map(([topic]) => topic);
      
      return { topics: topTopics.length > 0 ? topTopics : ['General Well-being'] };
    }
  );


const projectFutureSelfPrompt = ai.definePrompt({
  name: 'projectFutureSelfPrompt',
  input: {schema: z.object({conversationHistory: z.string(), topic: z.string()})},
  output: {schema: z.object({
      projection: z.string().describe("A specific, imaginative, and slightly exaggerated future projection (e.g., 'In 2040, your dedication to the gym has made you a local fitness icon.')")
  })},
  system: `You are ChronoMe, a "digital time mirror." Your purpose is to project a user's potential future based on the dominant themes in their recent conversations.
You will be given a key topic and the user's conversation history.
Analyze the user's statements, commitments, and attitudes related to that topic.
Based on this analysis, create a short, single-sentence projection for the year 2040.
Make the projection specific and slightly dramatic. If the user talks about missing the gym, project a negative but plausible outcome. If they talk about starting a new project, project a positive, successful outcome.
Example:
- Topic: Health & Fitness, History: "Ugh, I missed the gym again." -> Projection: "By 2040, your couch has a permanent dent in it, and you've forgotten what a dumbbell looks like."
- Topic: Career, History: "Just started working on that side project!" -> Projection: "By 2040, your side project has become a global phenomenon, and you're giving keynote speeches about it."
`,
  prompt: `Topic: {{{topic}}}
Conversation History:
{{{conversationHistory}}}
`,
});

const projectFutureSelfFlow = ai.defineFlow(
  {
    name: 'projectFutureSelfFlow',
    inputSchema: ProjectFutureSelfInputSchema,
    outputSchema: ProjectFutureSelfOutputSchema,
  },
  async input => {
    const { output, history } = await ai.generate({
        prompt: `Based on this conversation, what is the most important topic to project a future for?`,
        system: `Conversation History:\n${input.conversationHistory}`,
        tools: [extractKeyTopics],
        model: 'googleai/gemini-2.5-flash',
    });

    const toolCall = output?.message.toolCalls?.[0];

    if (toolCall?.name === 'extractKeyTopics' && toolCall.args) {
        const mainTopic = toolCall.args.topics[0] || "General Well-being";

        const projectionResult = await projectFutureSelfPrompt({
            conversationHistory: input.conversationHistory,
            topic: mainTopic,
        });

        return {
            topic: mainTopic,
            projection: projectionResult.output!.projection,
        };
    }
    
    return {
        topic: 'General Well-being',
        projection: "Your future is a blank canvas, full of potential. Your conversations haven't yet painted a clear picture.",
    }
  }
);

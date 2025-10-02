import { config } from 'dotenv';
config();

import '@/ai/flows/generate-initial-personality.ts';
import '@/ai/flows/analyze-conversation-patterns.ts';
import '@/ai/flows/summarize-conversation-history.ts';
import '@/ai/flows/generate-chat-response.ts';

// IMPORTANT: This file is used for local development with `genkit:dev`
// and is not needed for production. It should not be included in the
// final build.

import { config } from 'dotenv';
config();

import '@/ai/flows/categorize-budget-items.ts';
import '@/ai/flows/generate-saving-plan-suggestions.ts';
import '@/ai/flows/analyze-spending-habits.ts';
import '@/ai/flows/analyze-user-text.ts';
import '@/ai/flows/send-email.ts';

'use server';
/**
 * @fileOverview Analyzes user text input to provide financial insights.
 *
 * - analyzeUserText - A function that analyzes user text.
 * - AnalyzeUserTextInput - The input type for the analyzeUserText function.
 * - AnalyzeUserTextOutput - The return type for the analyzeUserText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AnalyzeUserTextInputSchema = z.object({
  text: z.string().describe('The user\'s text input.'),
});
export type AnalyzeUserTextInput = z.infer<typeof AnalyzeUserTextInputSchema>;

const AnalyzeUserTextOutputSchema = z.object({
  analysis: z.string().describe('The AI-generated analysis of the user\'s text.'),
});
export type AnalyzeUserTextOutput = z.infer<typeof AnalyzeUserTextOutputSchema>;

export async function analyzeUserText(input: AnalyzeUserTextInput): Promise<AnalyzeUserTextOutput> {
  return analyzeUserTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeUserTextPrompt',
  input: { schema: AnalyzeUserTextInputSchema },
  output: { schema: AnalyzeUserTextOutputSchema },
  prompt: `You are Bachat Pal, a friendly and encouraging financial assistant for users in Pakistan. Your goal is to analyze the user's message and provide a clear, helpful, and actionable summary or insight.

Analyze the following user message for tone, intent, and key topics. Based on your analysis, provide a friendly and supportive response.

If the user expresses a desire to save money, improve their budget, or has a financial question, offer 1-2 concrete, simple, and actionable tips. Keep the tone conversational and positive. The currency is Pakistani Rupees (PKR).

User message: "{{{text}}}"`,
});

const analyzeUserTextFlow = ai.defineFlow(
  {
    name: 'analyzeUserTextFlow',
    inputSchema: AnalyzeUserTextInputSchema,
    outputSchema: AnalyzeUserTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

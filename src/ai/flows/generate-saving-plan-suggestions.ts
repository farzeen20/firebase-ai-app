'use server';

/**
 * @fileOverview Generates personalized saving plan suggestions based on the user's financial situation and goals.
 *
 * - generateSavingPlanSuggestions - A function that generates personalized saving plan suggestions.
 * - GenerateSavingPlanSuggestionsInput - The input type for the generateSavingPlanSuggestions function.
 * - GenerateSavingPlanSuggestionsOutput - The output type for the generateSavingPlanSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSavingPlanSuggestionsInputSchema = z.object({
  financialSituation: z
    .string()
    .describe('A description of the user\'s current financial situation.'),
  goals: z
    .string()
    .describe('A description of the user\'s saving goals.'),
});
export type GenerateSavingPlanSuggestionsInput = z.infer<
  typeof GenerateSavingPlanSuggestionsInputSchema
>;

const GenerateSavingPlanSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('An array of personalized saving plan suggestions.'),
});
export type GenerateSavingPlanSuggestionsOutput = z.infer<
  typeof GenerateSavingPlanSuggestionsOutputSchema
>;

export async function generateSavingPlanSuggestions(
  input: GenerateSavingPlanSuggestionsInput
): Promise<GenerateSavingPlanSuggestionsOutput> {
  return generateSavingPlanSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSavingPlanSuggestionsPrompt',
  input: {schema: GenerateSavingPlanSuggestionsInputSchema},
  output: {schema: GenerateSavingPlanSuggestionsOutputSchema},
  prompt: `You are a financial advisor specializing in creating personalized saving plans.

  Based on the user's financial situation and goals, generate a list of saving plan suggestions.

  Financial Situation: {{{financialSituation}}}
  Goals: {{{goals}}}

  Suggestions:`,
});

const generateSavingPlanSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateSavingPlanSuggestionsFlow',
    inputSchema: GenerateSavingPlanSuggestionsInputSchema,
    outputSchema: GenerateSavingPlanSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

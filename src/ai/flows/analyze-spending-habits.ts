'use server';

/**
 * @fileOverview Analyzes spending habits based on categorized expenses and provides recommendations for staying within budget.
 *
 * - analyzeSpendingHabits - A function that analyzes spending habits and provides recommendations.
 * - AnalyzeSpendingHabitsInput - The input type for the analyzeSpendingHabits function.
 * - AnalyzeSpendingHabitsOutput - The return type for the analyzeSpendingHabits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSpendingHabitsInputSchema = z.object({
  expenses: z
    .array(
      z.object({
        category: z.string().describe('The category of the expense.'),
        amount: z.number().describe('The amount of the expense.'),
      })
    )
    .describe('A list of categorized expenses.'),
  income: z.number().describe('The user
  budgetId: z.string().describe('The id of the associated budget.'),'),
});

export type AnalyzeSpendingHabitsInput = z.infer<typeof AnalyzeSpendingHabitsInputSchema>;

const AnalyzeSpendingHabitsOutputSchema = z.object({
  analysis: z.string().describe('An analysis of the user spending habits.'),
  recommendations: z.string().describe('Recommendations for staying within budget.'),
});

export type AnalyzeSpendingHabitsOutput = z.infer<typeof AnalyzeSpendingHabitsOutputSchema>;

export async function analyzeSpendingHabits(
  input: AnalyzeSpendingHabitsInput
): Promise<AnalyzeSpendingHabitsOutput> {
  return analyzeSpendingHabitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSpendingHabitsPrompt',
  input: {schema: AnalyzeSpendingHabitsInputSchema},
  output: {schema: AnalyzeSpendingHabitsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending habits and provide recommendations for staying within budget.

User Income: {{{income}}}

Expenses:
{{#each expenses}}
- Category: {{category}}, Amount: {{amount}}
{{/each}}

Analyze the expenses and provide recommendations.

Analysis:
{{analysis}}

Recommendations:
{{recommendations}}`,
});

const analyzeSpendingHabitsFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingHabitsFlow',
    inputSchema: AnalyzeSpendingHabitsInputSchema,
    outputSchema: AnalyzeSpendingHabitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

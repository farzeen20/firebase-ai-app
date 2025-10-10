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
        name: z.string().describe('The name of the expense item.'),
        category: z.string().describe('The category of the expense.'),
        price: z.number().describe('The price of the expense.'),
      })
    )
    .describe('A list of categorized expenses.'),
  budgetId: z.string().describe('The id of the associated budget.'),
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
  prompt: `You are a personal finance advisor for a user in Pakistan. Analyze the user's spending habits based on the following list of expenses from a single receipt and provide recommendations for staying within budget. Provide the analysis and recommendations in a friendly, encouraging, and actionable tone. The currency is Pakistani Rupees (PKR).

Expenses:
{{#each expenses}}
- Item: {{name}}, Category: {{category}}, Price: PKR {{price}}
{{/each}}

Please provide a concise analysis of spending patterns and 1-2 actionable recommendations.`,
});

const analyzeSpendingHabitsFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingHabitsFlow',
    inputSchema: AnalyzeSpendingHabitsInputSchema,
    outputSchema: AnalyzeSpendingHabitsOutputSchema,
  },
  async input => {
    console.log('analyzeSpendingHabitsFlow received input:', JSON.stringify(input, null, 2));
    const {output} = await prompt(input);
    return output!;
  }
);

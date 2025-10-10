'use server';
/**
 * @fileOverview Categorizes budget items from a receipt image using AI.
 *
 * - categorizeBudgetItems - A function that categorizes budget items from a receipt image.
 * - CategorizeBudgetItemsInput - The input type for the categorizeBudgetItems function.
 * - CategorizeBudgetItemsOutput - The return type for the categorizeBudgetItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeBudgetItemsInputSchema = z.object({
  receiptDataUri: z
    .string()
    .describe(
      "A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  budgetCategories: z
    .string()
    .array()
    .describe('An array of budget categories, e.g., ["Groceries", "Utilities", "Entertainment"].'),
});

export type CategorizeBudgetItemsInput = z.infer<typeof CategorizeBudgetItemsInputSchema>;

const CategorizeBudgetItemsOutputSchema = z.object({
  budgetItems: z.array(
    z.object({
      name: z.string().describe('The name of the item.'),
      price: z.number().describe('The price of the item.'),
      quantity: z.number().describe('The quantity of the item.'),
      category: z.string().describe('The category of the item from the provided list.'),
    })
  ).describe('A list of items found on the receipt.'),
});

export type CategorizeBudgetItemsOutput = z.infer<typeof CategorizeBudgetItemsOutputSchema>;


export async function categorizeBudgetItems(input: CategorizeBudgetItemsInput): Promise<CategorizeBudgetItemsOutput> {
    return categorizeBudgetItemsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'categorizeBudgetItemsPrompt',
  input: {schema: CategorizeBudgetItemsInputSchema},
  output: {schema: CategorizeBudgetItemsOutputSchema},
  prompt: `You are an expert receipt processor for a budgeting app used in Pakistan. Analyze the following receipt image and extract all line items. For each item, identify its name, price, and quantity. Categorize each item into one of the provided budget categories. The currency is Pakistani Rupees (PKR).

Available Categories:
{{#each budgetCategories}}
- {{this}}
{{/each}}

Receipt Image:
{{media url=receiptDataUri}}

Extract the items and return them in the specified JSON format. If you cannot determine a field, use a reasonable default or omit it if it's not required.`,
});


const categorizeBudgetItemsFlow = ai.defineFlow(
  {
    name: 'categorizeBudgetItemsFlow',
    inputSchema: CategorizeBudgetItemsInputSchema,
    outputSchema: CategorizeBudgetItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

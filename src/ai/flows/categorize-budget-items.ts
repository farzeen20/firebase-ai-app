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
      'A photo of a receipt, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
  budgetCategories: z
    .string()
    .array()
    .describe('An array of budget categories, eg [\
// src/ai/flows/health-prompt-relevance.ts
'use server';

/**
 * @fileOverview An AI agent that provides personalized health and safety prompts based on the user's medications.
 *
 * - getRelevantHealthPrompt - A function that retrieves a relevant health prompt for the user.
 * - RelevantHealthPromptInput - The input type for the getRelevantHealthPrompt function.
 * - RelevantHealthPromptOutput - The return type for the getRelevantHealthPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RelevantHealthPromptInputSchema = z.object({
  medicationList: z
    .string()
    .describe('A comma-separated list of the user-provided medications.'),
  healthAdvice: z.string().describe('A string of health advice.'),
});
export type RelevantHealthPromptInput = z.infer<
  typeof RelevantHealthPromptInputSchema
>;

const RelevantHealthPromptOutputSchema = z.object({
  isRelevant: z
    .boolean()
    .describe(
      'A boolean that is true if the health advice is relevant to the medication list, and false otherwise.'
    ),
  reason: z
    .string()
    .describe(
      'A short explanation of why the health advice is relevant or irrelevant to the medication list.'
    ),
});
export type RelevantHealthPromptOutput = z.infer<
  typeof RelevantHealthPromptOutputSchema
>;

export async function getRelevantHealthPrompt(
  input: RelevantHealthPromptInput
): Promise<RelevantHealthPromptOutput> {
  return relevantHealthPromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'relevantHealthPrompt',
  input: {schema: RelevantHealthPromptInputSchema},
  output: {schema: RelevantHealthPromptOutputSchema},
  prompt: `You are a pharmacist who determines whether a piece of health advice is relevant to a user, given the medications that they are taking.

  Respond in JSON format.

  Medication list: {{{medicationList}}}
  Health advice: {{{healthAdvice}}}

  Is the health advice relevant to the medication list?  Explain why or why not.
  `,
});

const relevantHealthPromptFlow = ai.defineFlow(
  {
    name: 'relevantHealthPromptFlow',
    inputSchema: RelevantHealthPromptInputSchema,
    outputSchema: RelevantHealthPromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// src/ai/flows/generate-contextual-clues.ts
'use server';
/**
 * @fileOverview Generates contextual clues for the escape room game based on player progress.
 *
 * - generateContextualClue - A function that generates a clue based on the current game state.
 * - GenerateContextualClueInput - The input type for the generateContextualClue function.
 * - GenerateContextualClueOutput - The return type for the generateContextualClue function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContextualClueInputSchema = z.object({
  gameState: z
    .string()
    .describe('The current state of the game, including player progress and recent actions.'),
  puzzleDescription: z.string().describe('A description of the puzzle the player is currently trying to solve.'),
});
export type GenerateContextualClueInput = z.infer<typeof GenerateContextualClueInputSchema>;

const GenerateContextualClueOutputSchema = z.object({
  clue: z.string().describe('A helpful clue to assist the player in solving the current puzzle.'),
});
export type GenerateContextualClueOutput = z.infer<typeof GenerateContextualClueOutputSchema>;

export async function generateContextualClue(input: GenerateContextualClueInput): Promise<GenerateContextualClueOutput> {
  return generateContextualClueFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContextualCluePrompt',
  input: {schema: GenerateContextualClueInputSchema},
  output: {schema: GenerateContextualClueOutputSchema},
  prompt: `You are an expert escape room game master. A player is stuck on a puzzle and needs a helpful clue.

  Here's the current game state:
  {{gameState}}

  Here's a description of the puzzle they are trying to solve:
  {{puzzleDescription}}

  Generate a single, concise, helpful clue that will nudge the player in the right direction without giving away the solution. The clue should be appropriate for the player's current progress and the nature of the puzzle.
  The clue should not be longer than 50 words. If the puzzle is already solved, you can reveal a piece of the story.
  `,
});

const generateContextualClueFlow = ai.defineFlow(
  {
    name: 'generateContextualClueFlow',
    inputSchema: GenerateContextualClueInputSchema,
    outputSchema: GenerateContextualClueOutputSchema,
  },
  async input => {
    // For the notebook game, we have a specific response.
    if (input.puzzleDescription.includes('notebook')) {
        return {
            clue: 'You unlocked the Notebook. To read its content type "Burt the Nerd" in the game.'
        }
    }
    const {output} = await prompt(input);
    return output!;
  }
);

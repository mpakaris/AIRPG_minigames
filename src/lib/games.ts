export type Game = {
  slug: string;
  name: string;
  description: string;
  puzzleDescription: string;
  correctCode: string;
  finalPin?: string;
};

export const games: Game[] = [
  {
    slug: 'the-safe',
    name: 'The Digital Safe',
    description: "A sequence of numbers is required. Four digits will unlock it. The solution is hidden in plain sight, think about the year the world's journey into the web began.",
    puzzleDescription: 'A digital safe that requires a specific four-digit sequence to open. The player has to input numbers on a keypad.',
    correctCode: '1990',
    finalPin: '5527',
  },
  {
    slug: 'the-levers',
    name: 'The Levers of Power',
    description: 'Six levers stand before you, a puzzle of sequence and order. Pull them correctly to reveal the secret they hold.',
    puzzleDescription: 'A set of six levers that must be pulled in a specific order to unlock a mechanism.',
    correctCode: '135246',
    finalPin: '2008',
  },
  {
    slug: 'the-fingerprint',
    name: 'The Fingerprint',
    description: 'The scattered pieces of a fingerprint lie before you. Assemble them to reveal the identity of a person of interest.',
    puzzleDescription: 'A jigsaw-style puzzle where the user must assemble a fingerprint from scattered pieces.',
    correctCode: 'TONY SOMBRERO',
    finalPin: '3121',
  },
  {
    slug: 'the-notebook',
    name: 'The Notebook',
    description: 'A leather-bound notebook holds the next clue, but it is locked by a 4-character password.',
    puzzleDescription: 'A digital notebook locked by a 4-character password. The player must enter the code to unlock it.',
    correctCode: 'ROSE',
  },
];

export const getGameData = (slug: string): Game | undefined => {
  return games.find((game) => game.slug === slug);
};

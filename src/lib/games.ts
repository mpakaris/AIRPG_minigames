export type Game = {
  slug: string;
  name: string;
  description: string;
  puzzleDescription: string;
  correctCode: string;
  finalPin: string;
};

export const games: Game[] = [
  {
    slug: 'the-safe',
    name: 'The Digital Safe',
    description: 'A sequence of numbers is required. Four digits will unlock it. The solution is hidden in plain sight, think about the year the world\'s journey into the web began.',
    puzzleDescription: 'A digital safe that requires a specific four-digit sequence to open. The player has to input numbers on a keypad.',
    correctCode: '1990',
    finalPin: '5527',
  },
];

export const getGameData = (slug: string): Game | undefined => {
  return games.find((game) => game.slug === slug);
};

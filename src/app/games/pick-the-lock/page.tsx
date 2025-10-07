'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { getGameData } from '@/lib/games';
import { GameLayout } from '@/components/game/game-layout';
import { Button } from '@/components/ui/button';

export default function GamePage() {
  const gameData = useMemo(() => getGameData('pick-the-lock'), []);

  if (!gameData) {
    return (
      <GameLayout>
        <div className="text-center">
          <h2 className="font-headline text-2xl font-semibold">Game not found</h2>
          <p className="text-muted-foreground">This puzzle does not exist. Please check the URL.</p>
          <Button asChild variant="link" className="mt-4 text-primary">
            <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Home</Link>
          </Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center text-center p-4">
        <h1 className="font-headline text-3xl font-bold text-primary">{gameData.name}</h1>
        <p className="text-foreground/80 mt-2 mb-8">{gameData.description}</p>
        
        <div className="w-full aspect-[485/402] bg-muted rounded-lg overflow-hidden shadow-lg">
          <iframe
            src="https://scratch.mit.edu/projects/1170163004/embed"
            allowTransparency={true}
            className="w-full h-full border-0"
            scrolling="no"
            allowFullScreen
            title="Pick the Lock Scratch Game"
          ></iframe>
        </div>
      </div>
    </GameLayout>
  );
}

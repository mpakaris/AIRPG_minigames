'use client';

import { useState, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getGameData } from '@/lib/games';
import { GameLayout } from '@/components/game/game-layout';
import ClueReveal from '@/components/game/clue-reveal';
import { generateContextualClue } from '@/ai/flows/generate-contextual-clues';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import FingerprintPuzzle from '@/components/game/fingerprint-puzzle';

export default function GamePage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const gameData = useMemo(() => getGameData('the-fingerprint'), []);

  const [isSolved, setIsSolved] = useState(false);
  const [aiClue, setAiClue] = useState<string | null>(null);
  const [isLoadingClue, setIsLoadingClue] = useState(false);

  const handleSolve = () => {
    if (!gameData) return;
    setIsSolved(true);
    setIsLoadingClue(true);
    startTransition(async () => {
      try {
        const result = await generateContextualClue({
          gameState: `Player has successfully assembled the fingerprint puzzle, revealing the name: ${gameData.correctCode}.`,
          puzzleDescription: gameData.puzzleDescription,
        });
        setAiClue(result.clue);
      } catch (error) {
        console.error('AI clue generation failed:', error);
        setAiClue('The machine whirs, but stays silent. You have the PIN, though.');
        toast({
          title: "AI Error",
          description: "Failed to generate contextual clue.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingClue(false);
      }
    });
  };

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
      <div className="w-full h-full flex-1 flex flex-col items-center justify-center text-center p-4">
        <AnimatePresence mode="wait">
          {!isSolved ? (
            <motion.div
              key="puzzle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <h1 className="font-headline text-3xl font-bold text-primary">{gameData.name}</h1>
              <p className="text-foreground/80 mt-2 mb-8">{gameData.description}</p>
              <div className="relative w-full flex-1 max-w-3xl mx-auto">
                <FingerprintPuzzle onSolve={handleSolve} />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="clue"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-sm"
            >
              <ClueReveal
                isLoading={isLoadingClue || isPending}
                clue={`The name on the reconstructed file is: ${gameData.correctCode}. ${aiClue || ''}`}
                pin={gameData.finalPin}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameLayout>
  );
}

'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getGameData } from '@/lib/games';
import { GameLayout } from '@/components/game/game-layout';
import ClueReveal from '@/components/game/clue-reveal';
import { generateContextualClue } from '@/ai/flows/generate-contextual-clues';
import Lever from '@/components/game/lever';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function GamePage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const gameData = useMemo(() => getGameData('the-levers'), []);

  const [leverSequence, setLeverSequence] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [aiClue, setAiClue] = useState<string | null>(null);
  const [isLoadingClue, setIsLoadingClue] = useState(false);
  const totalLevers = 6;

  useEffect(() => {
    if (!gameData || isSolved) return;

    if (leverSequence.length === gameData.correctCode.length) {
      const sequenceStr = leverSequence.join('');
      if (sequenceStr === gameData.correctCode) {
        setIsSolved(true);
        setIsIncorrect(false);
        setIsLoadingClue(true);
        startTransition(async () => {
          try {
            const result = await generateContextualClue({
              gameState: `Player has successfully pulled the levers in the correct order: ${gameData.correctCode}.`,
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
      } else {
        setIsIncorrect(true);
        setTimeout(() => {
          setIsIncorrect(false);
          setLeverSequence([]);
        }, 1500);
      }
    }
  }, [leverSequence, gameData, toast, isSolved]);

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

  const handleLeverPull = (leverId: number) => {
    if (isSolved || isIncorrect || leverSequence.includes(leverId)) return;
    setLeverSequence(prev => [...prev, leverId]);
  };

  const isLeverPulled = (leverId: number) => {
    return leverSequence.includes(leverId);
  }

  return (
    <GameLayout>
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center p-4">
        {!isSolved ? (
          <>
            <h1 className="font-headline text-3xl font-bold text-primary">{gameData.name}</h1>
            <p className="text-foreground/80 mt-2 mb-8">{gameData.description}</p>
            <div className="flex justify-center items-end gap-4 md:gap-8 h-64">
              {Array.from({ length: totalLevers }, (_, i) => i + 1).map(id => (
                <Lever
                  key={id}
                  id={id}
                  onPull={handleLeverPull}
                  isPulled={isLeverPulled(id)}
                  isDisabled={isSolved || isIncorrect}
                />
              ))}
            </div>
             <AnimatePresence>
              {isIncorrect && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 w-full max-w-sm"
                >
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Sequence Incorrect</AlertTitle>
                    <AlertDescription>
                      The levers spring back to their original position.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <ClueReveal
            isLoading={isLoadingClue || isPending}
            clue={aiClue}
            pin={gameData.finalPin}
          />
        )}
      </div>
    </GameLayout>
  );
}

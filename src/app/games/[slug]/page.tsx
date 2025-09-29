'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import type { Params } from 'next/dist/shared/lib/router/utils/route-matcher';

import { getGameData } from '@/lib/games';
import { GameLayout } from '@/components/game/game-layout';
import PinDisplay from '@/components/game/pin-display';
import Keypad from '@/components/game/keypad';
import ClueReveal from '@/components/game/clue-reveal';
import { generateContextualClue } from '@/ai/flows/generate-contextual-clues';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function GamePage({ params }: { params: Params }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const gameData = useMemo(() => getGameData(params.slug), [params.slug]);

  const [inputCode, setInputCode] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [aiClue, setAiClue] = useState<string | null>(null);
  const [isLoadingClue, setIsLoadingClue] = useState(false);

  useEffect(() => {
    if (!gameData || isSolved) return;

    if (inputCode.length === gameData.correctCode.length) {
      if (inputCode === gameData.correctCode) {
        setIsSolved(true);
        setIsIncorrect(false);
        setIsLoadingClue(true);
        startTransition(async () => {
          try {
            const result = await generateContextualClue({
              gameState: `Player has successfully entered the correct code: ${gameData.correctCode}.`,
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
          setInputCode('');
        }, 820);
      }
    }
  }, [inputCode, gameData, toast, isSolved]);

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

  const handleKeyPress = (key: string) => {
    if (inputCode.length < gameData.correctCode.length && !isSolved && !isIncorrect) {
      setInputCode(prev => prev + key);
    }
  };

  const handleDelete = () => {
    if (!isSolved && !isIncorrect) {
      setInputCode(prev => prev.slice(0, -1));
    }
  };

  return (
    <GameLayout>
      <div className="w-full max-w-sm mx-auto flex flex-col items-center justify-center text-center p-4">
        {!isSolved ? (
          <>
            <h1 className="font-headline text-3xl font-bold text-primary">{gameData.name}</h1>
            <p className="text-foreground/80 mt-2 mb-8">{gameData.description}</p>
            <PinDisplay
              code={inputCode}
              codeLength={gameData.correctCode.length}
              isIncorrect={isIncorrect}
            />
            <Keypad onKeyPress={handleKeyPress} onDelete={handleDelete} />
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

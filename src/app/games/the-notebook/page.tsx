'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getGameData } from '@/lib/games';
import { GameLayout } from '@/components/game/game-layout';
import ClueReveal from '@/components/game/clue-reveal';
import { generateContextualClue } from '@/ai/flows/generate-contextual-clues';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { NotebookIcon } from '@/components/icons/notebook';
import PasswordInput from '@/components/game/password-input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function GamePage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const gameData = useMemo(() => getGameData('the-notebook'), []);

  const [inputCode, setInputCode] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [aiClue, setAiClue] = useState<string | null>(null);
  const [isLoadingClue, setIsLoadingClue] = useState(false);

  useEffect(() => {
    if (!gameData || isSolved) return;

    if (inputCode.length === gameData.correctCode.length) {
      if (inputCode.toUpperCase() === gameData.correctCode) {
        setIsSolved(true);
        setIsIncorrect(false);
        setIsLoadingClue(true);
        startTransition(async () => {
          try {
            const result = await generateContextualClue({
              gameState: `Player has successfully entered the password: ${gameData.correctCode}.`,
              puzzleDescription: gameData.puzzleDescription,
            });
            setAiClue(result.clue);
          } catch (error) {
            console.error('AI clue generation failed:', error);
            setAiClue('The machine whirs, but stays silent. You have the PIN, though.');
            toast({
              title: 'AI Error',
              description: 'Failed to generate contextual clue.',
              variant: 'destructive',
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
        }, 1500);
      }
    }
  }, [inputCode, gameData, toast, isSolved]);

  const handleCodeChange = (code: string) => {
    if (!isSolved && !isIncorrect) {
      setInputCode(code);
    }
  };
  
  const handleCodeComplete = (code: string) => {
    if (!isSolved && !isIncorrect) {
      setInputCode(code);
    }
  };

  if (!gameData) {
    return (
      <GameLayout>
        <div className="text-center">
          <h2 className="font-headline text-2xl font-semibold">Game not found</h2>
          <p className="text-muted-foreground">This puzzle does not exist. Please check the URL.</p>
          <Button asChild variant="link" className="mt-4 text-primary">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center text-center p-4">
        {!isSolved ? (
          <>
            <h1 className="font-headline text-3xl font-bold text-primary">{gameData.name}</h1>
            <p className="text-foreground/80 mt-2 mb-8">{gameData.description}</p>
            <NotebookIcon className="w-48 h-48 text-primary/80" />
            <div className="mt-8">
              <PasswordInput
                codeLength={4}
                onCodeChange={handleCodeChange}
                onCodeComplete={handleCodeComplete}
                isIncorrect={isIncorrect}
                isDisabled={isSolved || isIncorrect}
                value={inputCode}
              />
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
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>
                      Sorry, wrong answer. The correct answer was handed to you in the game. Try again.
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <ClueReveal
            isLoading={isLoadingClue || isPending}
            clue={'You unlocked the Notebook. To read its content type "Burt the Nerd" in the game.'}
            pin={gameData.finalPin}
          />
        )}
      </div>
    </GameLayout>
  );
}

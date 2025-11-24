'use client';

import { useState, useEffect, useMemo, useTransition } from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { getGameData } from '@/lib/games';
import { GameLayout } from '@/components/game/game-layout';
import ClueReveal from '@/components/game/clue-reveal';
import { generateContextualClue } from '@/ai/flows/generate-contextual-clues';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import T9Keypad from '@/components/game/t9-keypad';
import PinDisplay from '@/components/game/pin-display';

export default function GamePage() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const gameData = useMemo(() => getGameData('the-metal-box'), []);

  const [inputCode, setInputCode] = useState('');
  const [isSolved, setIsSolved] = useState(false);
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [aiClue, setAiClue] = useState<string | null>(null);
  const [isLoadingClue, setIsLoadingClue] = useState(false);
  
  const specialPhrase = 'Password for brown notebook "Justice for Silas Bloom"';

  const handleEnter = () => {
    if (!gameData || isSolved || isIncorrect) return;

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
          setAiClue('The machine whirs, but stays silent.');
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
  };

  const handleInput = (value: string) => {
    if (!isSolved && !isIncorrect) {
      setInputCode(value);
    }
  };
  
  const handleDelete = () => {
    if (!isSolved && !isIncorrect) {
      setInputCode(prev => prev.slice(0, -1));
    }
  };

  if (!gameData) {
    return (
      <GameLayout>
        <div className="text-center">
          <h2 className="font-headline text-2xl font-semibold">Game not found</h2>
          <p className="text-muted-foreground">This puzzle does not exist. Please check the URL.</p>
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
            <p className="text-foreground/80 mt-2 mb-4">{gameData.description}</p>
            
            <div className="mt-4">
               <PinDisplay
                code={inputCode}
                codeLength={gameData.correctCode.length}
                isIncorrect={isIncorrect}
              />
              <T9Keypad
                onInput={handleInput}
                onDelete={handleDelete}
                onEnter={handleEnter}
                maxLength={gameData.correctCode.length}
                currentValue={inputCode}
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
                      The lock clicks, but remains shut. Incorrect word.
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
            specialPhrase={specialPhrase}
          />
        )}
      </div>
    </GameLayout>
  );
}

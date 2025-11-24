'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Delete, Check } from 'lucide-react';

const keyMap: { [key: string]: string } = {
  '2': '2ABC',
  '3': '3DEF',
  '4': '4GHI',
  '5': '5JKL',
  '6': '6MNO',
  '7': '7PQRS',
  '8': '8TUV',
  '9': '9WXYZ',
  '0': '0'
};

const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
];

type T9KeypadProps = {
  onInput: (value: string) => void;
  onDelete: () => void;
  onEnter: () => void;
  maxLength: number;
  currentValue: string;
};

export default function T9Keypad({ onInput, onDelete, onEnter, maxLength, currentValue }: T9KeypadProps) {
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [keyPressCount, setKeyPressCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Cleanup timer on component unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleKeyPress = (key: string) => {
    if (timerRef.current) {
        clearTimeout(timerRef.current);
    }
    
    if (key === lastKeyPressed) {
        if (currentValue.length === 0) return; // Should not happen but good practice
        const count = keyPressCount + 1;
        setKeyPressCount(count);
        const chars = keyMap[key];
        const newChar = chars[count % chars.length];
        onInput(currentValue.slice(0, -1) + newChar);
    } else {
        if (currentValue.length >= maxLength) return;
        setKeyPressCount(0);
        const chars = keyMap[key];
        if (chars) {
            onInput(currentValue + chars[0]);
        }
    }

    setLastKeyPressed(key);

    timerRef.current = setTimeout(() => {
        setLastKeyPressed(null);
        setKeyPressCount(0);
    }, 1000); // Reset after 1 second of inactivity
  };


  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[300px] mx-auto mt-4">
      {keys.map((key) => (
        <Button
          key={key}
          onClick={() => keyMap[key] ? handleKeyPress(key) : null}
          variant="outline"
          className="relative aspect-square h-auto w-full text-2xl font-bold bg-muted/30 hover:bg-accent/20 border-foreground/30 text-foreground shadow-lg rounded-2xl flex flex-col justify-center items-center p-1"
          aria-label={`Key ${key}`}
          disabled={!keyMap[key] && key !== '1'}
        >
          <span>{key}</span>
          {keyMap[key] && <span className="text-xs font-normal tracking-widest">{keyMap[key].substring(1)}</span>}
        </Button>
      ))}
       <Button
        onClick={() => {
            onDelete();
            setLastKeyPressed(null);
            setKeyPressCount(0);
            if (timerRef.current) clearTimeout(timerRef.current);
        }}
        variant="outline"
        className="aspect-square h-auto w-full flex items-center justify-center bg-muted/30 hover:bg-accent/20 border-foreground/30 text-foreground shadow-lg rounded-2xl"
        aria-label="Delete last character"
      >
        <Delete className="w-7 h-7 text-accent" />
      </Button>
       <Button
        onClick={() => handleKeyPress('0')}
        variant="outline"
        className="relative aspect-square h-auto w-full text-2xl font-bold bg-muted/30 hover:bg-accent/20 border-foreground/30 text-foreground shadow-lg rounded-2xl flex flex-col justify-center items-center p-1"
        aria-label={`Key 0`}
      >
        0
      </Button>
      <Button
        onClick={onEnter}
        variant="outline"
        className="aspect-square h-auto w-full flex items-center justify-center bg-accent/80 hover:bg-accent text-accent-foreground shadow-lg rounded-2xl"
        aria-label="Enter code"
      >
        <Check className="w-8 h-8" />
      </Button>
    </div>
  );
}

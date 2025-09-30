'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

interface PasswordInputProps {
  codeLength: number;
  onCodeChange: (code: string) => void;
  onCodeComplete: (code: string) => void;
  isIncorrect: boolean;
  isDisabled: boolean;
  value: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  codeLength,
  onCodeChange,
  onCodeComplete,
  isIncorrect,
  isDisabled,
  value
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Reset inputs when value is cleared externally
    if (value === '') {
      for(let i = 0; i < codeLength; i++) {
        const input = inputRefs.current[i];
        if (input) {
          input.value = '';
        }
      }
      inputRefs.current[0]?.focus();
    }
  }, [value, codeLength]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;
    const newCode = [...getValues()];
    newCode[index] = value.slice(-1).toUpperCase();
    
    const fullCode = newCode.join('');
    onCodeChange(fullCode);

    if (value && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (fullCode.length === codeLength) {
      onCodeComplete(fullCode);
    }
  };
  
  const getValues = () => {
    return inputRefs.current.map(ref => ref?.value || '');
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !inputRefs.current[index]?.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').toUpperCase().slice(0, codeLength);
    const newCode = [...getValues()];
    
    for (let i = 0; i < pastedData.length; i++) {
        if (i < codeLength) {
            newCode[i] = pastedData[i];
            if(inputRefs.current[i]) {
                inputRefs.current[i]!.value = pastedData[i];
            }
        }
    }

    const fullCode = newCode.join('');
    onCodeChange(fullCode);

    const nextFocusIndex = Math.min(pastedData.length, codeLength - 1);
    inputRefs.current[nextFocusIndex]?.focus();
    
    if (fullCode.length === codeLength) {
        onCodeComplete(fullCode);
    }
  };

  return (
    <div
      className={cn('flex items-center justify-center gap-2', isIncorrect && 'animate-shake')}
      onPaste={handlePaste}
    >
      {Array.from({ length: codeLength }).map((_, index) => (
        <Input
          key={index}
          ref={el => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          onChange={e => handleInputChange(e, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          disabled={isDisabled}
          className="w-12 h-16 md:w-14 md:h-20 text-center text-3xl md:text-4xl font-headline font-bold text-primary uppercase"
          aria-label={`Character ${index + 1} of password`}
        />
      ))}
    </div>
  );
};

export default PasswordInput;

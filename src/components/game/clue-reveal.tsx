import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ClueRevealProps = {
  isLoading: boolean;
  clue: string | null;
  pin?: string;
  specialPhrase?: string | null;
};

export default function ClueReveal({ isLoading, clue, pin, specialPhrase }: ClueRevealProps) {
  return (
    <Card className="w-full text-center animate-in fade-in duration-500">
      <CardHeader>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 mb-4">
          <CheckCircle2 className="h-10 w-10 text-accent" />
        </div>
        <CardTitle className="font-headline text-2xl">Puzzle Solved!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">AI Generated Clue</h3>
          <div className="mt-2 p-4 min-h-[80px] bg-muted/50 rounded-lg flex items-center justify-center">
            {isLoading ? (
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-[80%] rounded-full" />
              </div>
            ) : (
              <p className="text-foreground italic text-center">"{clue}"</p>
            )}
          </div>
        </div>
        
        {specialPhrase ? (
          <div>
            <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Unlocked Phrase</h3>
            <div className="mt-2 p-4 bg-primary text-primary-foreground rounded-lg">
              <p className="text-lg md:text-xl font-headline font-bold text-center tracking-wider">
                {specialPhrase}
              </p>
            </div>
          </div>
        ) : pin && (
          <div>
            <h3 className="text-sm font-semibold uppercase text-muted-foreground tracking-wider">Your PIN Code</h3>
            <div className="mt-2 flex items-center justify-center space-x-2">
              {pin.split('').map((digit, index) => (
                <div key={index} className="flex h-16 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground text-4xl font-bold shadow-md">
                  {digit}
                </div>
              ))}
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/">Back to Home</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

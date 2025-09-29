import { Button } from "@/components/ui/button";
import { Delete } from "lucide-react";

type KeypadProps = {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
};

const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function Keypad({ onKeyPress, onDelete }: KeypadProps) {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[300px] mx-auto mt-4">
      {keys.map((key) => (
        <Button
          key={key}
          onClick={() => onKeyPress(key)}
          variant="outline"
          className="aspect-square h-auto w-full text-3xl font-bold bg-background/50 hover:bg-accent/20 border-accent/30 text-foreground shadow-sm rounded-2xl"
          aria-label={`Number ${key}`}
        >
          {key}
        </Button>
      ))}
      <div />
      <Button
        onClick={() => onKeyPress('0')}
        variant="outline"
        className="aspect-square h-auto w-full text-3xl font-bold bg-background/50 hover:bg-accent/20 border-accent/30 text-foreground shadow-sm rounded-2xl"
        aria-label="Number 0"
      >
        0
      </Button>
      <Button
        onClick={onDelete}
        variant="outline"
        className="aspect-square h-auto w-full flex items-center justify-center bg-background/50 hover:bg-accent/20 border-accent/30 text-foreground shadow-sm rounded-2xl"
        aria-label="Delete last digit"
      >
        <Delete className="w-8 h-8 text-accent" />
      </Button>
    </div>
  );
}

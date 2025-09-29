import { cn } from "@/lib/utils";

type PinDisplayProps = {
  code: string;
  codeLength: number;
  isIncorrect: boolean;
};

export default function PinDisplay({ code, codeLength, isIncorrect }: PinDisplayProps) {
  const codeArray = code.padEnd(codeLength, ' ').split('');

  return (
    <div aria-label={`PIN input: ${code.length} of ${codeLength} digits entered.`} className={cn(
      "flex items-center justify-center gap-2 md:gap-3 mb-8",
      isIncorrect && "animate-shake"
    )}>
      {codeArray.map((char, index) => {
        const hasValue = char !== ' ';
        return (
          <div
            key={index}
            aria-hidden="true"
            className="w-14 h-20 md:w-16 md:h-24 rounded-lg flex items-center justify-center bg-muted/50 border border-input shadow-inner"
          >
            <span className={cn(
              "text-5xl md:text-6xl font-headline font-bold text-primary transition-opacity duration-200",
              hasValue ? "opacity-100" : "opacity-0"
            )}>
              {hasValue ? char : '0'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

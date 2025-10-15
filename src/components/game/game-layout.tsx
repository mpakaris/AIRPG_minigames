import { ClueCodedLogo } from '@/components/icons/logo';

export function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10">
        <div className="flex items-center justify-center gap-2">
          <ClueCodedLogo className="h-8 w-8 text-primary" />
          <span className="font-headline text-lg font-bold">ClueCoded</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center">
        {children}
      </main>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ClueCodedLogo } from '@/components/icons/logo';
import { ArrowRight } from 'lucide-react';
import { games } from '@/lib/games';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center justify-center gap-2" prefetch={false}>
          <ClueCodedLogo className="h-8 w-8 text-primary" />
          <span className="font-headline text-xl font-bold">ClueCoded</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  data-ai-hint={heroImage.imageHint}
                  width={1200}
                  height={800}
                  className="mx-auto aspect-[4/3] overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                />
              )}
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
                  <h1 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-primary">
                    Unlock the Mystery
                  </h1>
                  <p className="max-w-[600px] text-foreground/80 md:text-xl">
                    Unravel puzzles, crack codes, and test your wits. A new adventure awaits behind every door.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  {games.map((game) => (
                    <Button asChild size="lg" className="shadow-lg shadow-primary/20" key={game.slug}>
                      <Link href={game.slug === 'the-metal-box' ? '/games/the-notebook' : `/games/${game.slug}`}>
                        {game.name}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-foreground/60">&copy; 2024 ClueCoded. All rights reserved.</p>
      </footer>
    </div>
  );
}

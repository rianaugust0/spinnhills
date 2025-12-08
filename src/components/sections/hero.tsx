import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';

export function Hero() {
  return (
    <section id="inicio" className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://picsum.photos/seed/hero-barber-shop/1920/1080"
          alt="Barbeiro da HillsCut em ação"
          fill
          className="object-cover"
          priority
          data-ai-hint="barber working client"
        />
        <div className="absolute inset-0 bg-deep-black/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 animate-fade-in-up">
        <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl text-ice-white uppercase tracking-wider leading-tight">
          HillsCut
        </h1>
        <p className="font-headline text-3xl md:text-4xl lg:text-5xl text-gold uppercase tracking-widest mb-8">
          Onde seu estilo ganha vida
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-gold text-deep-black font-bold uppercase tracking-wider text-base hover:bg-gold/90 hover:shadow-gold-glow transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
            <Link href="#agendar">Agendar Agora</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-2 border-gold text-gold font-bold uppercase tracking-wider text-base bg-transparent hover:bg-gold hover:text-deep-black transition-all duration-300 w-full sm:w-auto">
            <Link href="#servicos">Ver Preços</Link>
          </Button>
        </div>
        
        <div className="mt-10">
          <Badge variant="secondary" className="bg-dark-gray/50 border border-gold/20 text-ice-white py-2 px-4 text-sm font-semibold backdrop-blur-sm">
            Atendimento com hora marcada • Cancelamento fácil • PIX e cartão
          </Badge>
        </div>
      </div>

      {/* Scroll Down Hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-gold/50 rounded-full flex justify-center items-start p-1">
          <div className="w-1 h-2 bg-gold rounded-full animate-bounce"></div>
        </div>
      </div>
    </section>
  );
}

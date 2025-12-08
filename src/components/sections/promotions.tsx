import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift, Scissors, Star } from 'lucide-react';
import Image from 'next/image';

const promotions = [
  {
    icon: <Gift className="h-8 w-8 text-deep-black" />,
    title: 'Primeira Visita',
    description: 'Ganhe 20% de desconto no seu primeiro corte ou barba. Uma boas-vindas ao estilo HillsCut.',
    price: '-20%',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    aiHint: 'man surprised',
  },
  {
    icon: <Scissors className="h-8 w-8 text-deep-black" />,
    title: 'Combo Cabelo + Barba',
    description: 'Renove o visual completo com nosso combo e ganhe um tratamento capilar de hidratação.',
    price: 'Brinde',
    image: 'https://images.unsplash.com/photo-1599351022246-85b5b058a5f3?q=80&w=1887&auto=format&fit=crop',
    aiHint: 'man getting haircut',
  },
  {
    icon: <Star className="h-8 w-8 text-deep-black" />,
    title: 'Programa Fidelidade',
    description: 'A cada 10 serviços, o 11º é por nossa conta. Porque cliente fiel merece ser recompensado.',
    price: 'Grátis',
    image: 'https://images.unsplash.com/photo-1566522649817-2da4483a1b38?q=80&w=1887&auto=format&fit=crop',
    aiHint: 'loyalty card',
  },
];

export function Promotions() {
  return (
    <section id="promocoes" className="py-20 sm:py-32 bg-dark-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl sm:text-6xl text-ice-white uppercase">
            Promoções <span className="text-gold">Especiais</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Condições exclusivas para você cuidar do seu estilo com ainda mais vantagens.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {promotions.map((promo) => (
            <div key={promo.title} className="relative group overflow-hidden rounded-lg">
              <Image
                src={promo.image}
                alt={promo.title}
                width={800}
                height={600}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={promo.aiHint}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black/90 via-deep-black/60 to-transparent"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
                <div className="absolute top-6 right-6 flex items-center justify-center w-20 h-20 rounded-full bg-gold text-deep-black shadow-gold-glow">
                  <span className="font-headline text-3xl">{promo.price}</span>
                </div>
                <h3 className="font-headline text-4xl text-gold uppercase">{promo.title}</h3>
                <p className="text-ice-white/90 mt-2 mb-6">{promo.description}</p>
                <Button variant="secondary" className="bg-ice-white/90 text-deep-black font-bold uppercase tracking-wider hover:bg-ice-white self-start">
                  Saber Mais
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '../ui/button';

const barbers = [
  {
    name: 'João "Navalha" Silva',
    specialty: 'Especialista em Cortes Clássicos e Barba',
    quote: '"Cada corte é uma assinatura. Deixo a minha com precisão e estilo."',
    attended: '2.100+',
    image: 'https://picsum.photos/seed/barber1/500/500',
    aiHint: 'male portrait',
  },
  {
    name: 'Miguel "Fade" Santos',
    specialty: 'Mestre do Degradê e Penteados Modernos',
    quote: '"A transição perfeita é a alma do corte. Eu crio arte em cada degradê."',
    attended: '1.800+',
    image: 'https://picsum.photos/seed/barber2/500/500',
    aiHint: 'man smiling',
  },
  {
    name: 'Pedro "The Detail" Costa',
    specialty: 'Foco em Finalizações e Design de Barba',
    quote: '"O diabo mora nos detalhes. Minha missão é entregar a perfeição."',
    attended: '1.500+',
    image: 'https://picsum.photos/seed/barber3/500/500',
    aiHint: 'serious man',
  },
];

export function Barbers() {
  return (
    <section id="barbeiros" className="py-20 sm:py-32 bg-deep-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl sm:text-6xl text-ice-white uppercase">
            Artistas do Estilo
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Conheça os mestres por trás da tesoura. Profissionais apaixonados, prontos para elevar seu estilo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {barbers.map((barber) => (
            <div
              key={barber.name}
              className="bg-dark-gray rounded-lg overflow-hidden group border border-transparent hover:border-gold/30 transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-80 w-full">
                <Image
                  src={barber.image}
                  alt={`Foto de ${barber.name}`}
                  fill
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={barber.aiHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-gray via-dark-gray/60 to-transparent"></div>
                <Badge className="absolute bottom-4 left-4 bg-gold text-deep-black font-bold uppercase">
                  Atendimentos: {barber.attended}
                </Badge>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-headline text-3xl text-gold tracking-wider">{barber.name}</h3>
                <p className="text-ice-white font-semibold mt-1">{barber.specialty}</p>
                <p className="text-muted-foreground italic text-sm mt-4 h-12">"{barber.quote}"</p>
                <Button variant="outline" className="mt-6 w-full border-gold/50 text-gold hover:bg-gold hover:text-deep-black transition-colors">
                  Agendar com {barber.name.split(' ')[0]}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Crown, Scissors, Gem } from 'lucide-react';
import Image from 'next/image';

const features = [
  {
    icon: <Scissors className="h-8 w-8 text-gold" />,
    title: 'Paixão pelo Corte',
    description: 'Nossa equipe é formada por artistas da tesoura e navalha, dedicados a criar o visual perfeito para você.',
  },
  {
    icon: <Crown className="h-8 w-8 text-gold" />,
    title: 'Missão',
    description: 'Elevar a autoestima masculina através de um serviço de excelência, em um ambiente que inspira confiança e estilo.',
  },
  {
    icon: <Gem className="h-8 w-8 text-gold" />,
    title: 'Visão',
    description: 'Ser a barbearia referência em atendimento premium, inovação e na arte de cuidar do homem moderno.',
  },
];

export function About() {
  return (
    <section id="sobre" className="py-20 sm:py-32 bg-dark-gray">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="relative h-[500px] lg:h-[600px] rounded-lg overflow-hidden shadow-lg order-last lg:order-first">
             <Image 
                src="https://images.unsplash.com/photo-1621607512022-6aecc4fed814?q=80&w=1887&auto=format&fit=crop"
                alt="Interior da Barbearia HillsCut"
                fill
                className="object-cover"
                data-ai-hint="barbershop interior"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-gray via-dark-gray/50 to-transparent"></div>
          </div>
          <div className="space-y-8">
            <h2 className="font-headline text-5xl sm:text-6xl text-ice-white uppercase tracking-wider">
              Nossa <br />
              <span className="text-gold">História</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-xl">
              Na HillsCut, unimos a tradição da barbearia clássica com um toque moderno e sofisticado. Cada detalhe, do ambiente ao atendimento, foi pensado para proporcionar uma experiência única e revigorante. Aqui, você não apenas corta o cabelo, você redescobre seu estilo.
            </p>
            <div className="space-y-6 pt-4">
              {features.slice(1).map((feature) => (
                <div key={feature.title} className="flex items-start space-x-4">
                  <div className="bg-deep-black p-3 rounded-md mt-1">{feature.icon}</div>
                  <div>
                    <h3 className="font-bold text-xl text-ice-white">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

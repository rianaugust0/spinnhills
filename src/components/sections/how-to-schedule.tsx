import { Button } from '@/components/ui/button';
import { Calendar, Scissors, UserCheck } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    icon: <Scissors className="h-10 w-10 text-gold" />,
    step: 'Passo 1',
    title: 'Escolha o Serviço',
    description: 'Navegue por nossa lista de serviços premium e selecione o que mais se adequa a você.',
  },
  {
    icon: <UserCheck className="h-10 w-10 text-gold" />,
    step: 'Passo 2',
    title: 'Selecione o Barbeiro',
    description: 'Veja o perfil de nossos artistas e escolha o profissional que mais combina com seu estilo.',
  },
  {
    icon: <Calendar className="h-10 w-10 text-gold" />,
    step: 'Passo 3',
    title: 'Agende Data e Hora',
    description: 'Encontre o melhor horário em sua agenda e confirme. O pagamento é online e seguro.',
  },
];

export function HowToSchedule() {
  return (
    <section id="agendar" className="py-20 sm:py-32 bg-deep-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl sm:text-6xl text-ice-white uppercase">
            Agendamento <span className="text-gold">Simples e Rápido</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Em apenas 3 passos, você garante seu horário e se prepara para uma experiência única.
          </p>
        </div>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gold/20 -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((item, index) => (
              <div key={item.title} className="relative flex flex-col items-center text-center">
                 {/* Timeline Circle */}
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-dark-gray border-2 border-gold rounded-full items-center justify-center z-10">
                  <span className="text-gold font-bold">{index + 1}</span>
                </div>
                <div className="bg-dark-gray p-4 rounded-full mb-6 inline-block">
                  {item.icon}
                </div>
                <p className="font-bold text-gold uppercase tracking-widest">{item.step}</p>
                <h3 className="font-headline text-3xl text-ice-white mt-2 mb-4">{item.title}</h3>
                <p className="text-muted-foreground max-w-xs">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-20">
          <Button asChild size="lg" className="bg-gold text-deep-black font-bold uppercase tracking-wider text-base hover:bg-gold/90 hover:shadow-gold-glow transition-all duration-300 transform hover:scale-105 w-full sm:w-auto">
            <Link href="#agendar-cta">Agendar Agora</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const services = [
  {
    title: 'Corte Premium',
    description: 'Análise de visagismo, lavagem especial, corte com tesoura e/ou máquina, e finalização com os melhores produtos.',
    price: 'R$ 90',
    image: 'https://images.unsplash.com/photo-1599351022246-85b5b058a5f3?q=80&w=1887&auto=format&fit=crop',
    aiHint: 'men haircut',
  },
  {
    title: 'Barba Terapia',
    description: 'Alinhamento com navalha, esfoliação, toalha quente, hidratação com óleos essenciais e massagem facial.',
    price: 'R$ 70',
    image: 'https://images.unsplash.com/photo-1621607512022-6aecc4fed814?q=80&w=1887&auto=format&fit=crop',
    aiHint: 'man beard trim',
  },
  {
    title: 'Combo HillsCut',
    description: 'A experiência completa: Corte Premium + Barba Terapia. Saia renovado da cabeça aos pés.',
    price: 'R$ 150',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1887&auto=format&fit=crop',
    aiHint: 'stylish man',
  },
  {
    title: 'Tratamento Capilar',
    description: 'Hidratação profunda, reconstrução ou detox do couro cabeludo para fios mais fortes e saudáveis.',
    price: 'A partir de R$ 80',
    image: 'https://images.unsplash.com/photo-1560268833-393c83731443?q=80&w=1887&auto=format&fit=crop',
    aiHint: 'hair treatment',
  },
];

export function Services() {
  return (
    <section id="servicos" className="py-20 sm:py-32 bg-deep-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl sm:text-6xl text-ice-white uppercase">
            Nossos <span className="text-gold">Serviços</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Qualidade e precisão em cada detalhe. Escolha o serviço que define o seu estilo.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <Card key={service.title} className="bg-dark-gray border-gold/20 overflow-hidden group flex flex-col">
              <div className="relative h-64 w-full">
                <Image
                  src={service.image}
                  alt={`Imagem para ${service.title}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={service.aiHint}
                />
              </div>
              <CardHeader className="flex-grow">
                <CardTitle className="font-headline text-3xl text-gold tracking-wider">{service.title}</CardTitle>
                <CardDescription className="text-muted-foreground pt-2 text-sm h-20">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                 <p className="text-2xl font-bold text-ice-white mb-4">{service.price}</p>
                 <Button variant="outline" className="w-full border-gold/50 text-gold hover:bg-gold hover:text-deep-black transition-colors">
                    Ver Detalhes
                 </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

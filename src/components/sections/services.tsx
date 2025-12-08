import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const services = [
  {
    title: 'Corte Premium',
    description: 'Análise de visagismo, lavagem especial, corte com tesoura e/ou máquina, e finalização com os melhores produtos.',
    price: 'R$ 90',
    imageId: 'service-premium-cut',
  },
  {
    title: 'Barba Terapia',
    description: 'Alinhamento com navalha, esfoliação, toalha quente, hidratação com óleos essenciais e massagem facial.',
    price: 'R$ 70',
    imageId: 'service-beard-therapy',
  },
  {
    title: 'Combo HillsCut',
    description: 'A experiência completa: Corte Premium + Barba Terapia. Saia renovado da cabeça aos pés.',
    price: 'R$ 150',
    imageId: 'service-hillscut-combo',
  },
  {
    title: 'Tratamento Capilar',
    description: 'Hidratação profunda, reconstrução ou detox do couro cabeludo para fios mais fortes e saudáveis.',
    price: 'A partir de R$ 80',
    imageId: 'service-hair-treatment',
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
          {services.map((service) => {
            const image = PlaceHolderImages.find(p => p.id === service.imageId);
            return (
              <Card key={service.title} className="bg-dark-gray border-gold/20 overflow-hidden group flex flex-col">
                <div className="relative h-64 w-full bg-dark-gray">
                  {image && (
                    <Image
                      src={image.imageUrl}
                      alt={image.description}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      data-ai-hint={image.imageHint}
                    />
                  )}
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
            )
          })}
        </div>
      </div>
    </section>
  );
}

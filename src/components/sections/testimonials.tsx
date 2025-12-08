import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from 'next/image';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Carlos Andrade',
    handle: '@carlos.dev',
    text: 'A HillsCut não é só uma barbearia, é uma experiência. Profissionais incríveis e um ambiente sem igual. O melhor corte da minha vida!',
    image: 'https://picsum.photos/seed/test1/150/150',
    aiHint: 'smiling man',
  },
  {
    name: 'Pedro Martins',
    handle: '@pedromartins',
    text: 'Finalmente um lugar que entende de barba. A barba terapia é sensacional, saí de lá renovado. Recomendo 100%!',
    image: 'https://picsum.photos/seed/test2/150/150',
    aiHint: 'man with beard',
  },
  {
    name: 'Lucas Ferreira',
    handle: '@lucasferreira',
    text: 'Ambiente sofisticado, atendimento impecável e o resultado final fala por si. Virei cliente fiel desde a primeira visita.',
    image: 'https://picsum.photos/seed/test3/150/150',
    aiHint: 'happy customer',
  },
  {
    name: 'Marcos Almeida',
    handle: '@marcos.a',
    text: 'O combo de cabelo e barba é o melhor custo-benefício. Qualidade absurda, vale cada centavo. O João é um artista!',
    image: 'https://picsum.photos/seed/test4/150/150',
    aiHint: 'satisfied client',
  },
];

const Rating = ({ rating = 5 }: { rating?: number }) => (
  <div className="flex items-center gap-1">
    {[...Array(rating)].map((_, i) => (
      <Star key={i} className="h-5 w-5 text-gold fill-gold" />
    ))}
  </div>
);


export function Testimonials() {
  return (
    <section id="depoimentos" className="py-20 sm:py-32 bg-deep-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl sm:text-6xl text-ice-white uppercase">
            A Voz de <span className="text-gold">Nossos Clientes</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Quem experimenta a HillsCut, não troca. Veja o que dizem sobre nosso trabalho.
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-4">
                  <Card className="bg-dark-gray border border-gold/20 h-full flex flex-col">
                    <CardContent className="p-8 flex-grow flex flex-col justify-between">
                      <div>
                        <Rating />
                        <p className="text-ice-white/90 mt-6 mb-8 italic">"{testimonial.text}"</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={testimonial.image}
                            alt={`Foto de ${testimonial.name}`}
                            fill
                            className="object-cover"
                            data-ai-hint={testimonial.aiHint}
                          />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-ice-white">{testimonial.name}</p>
                          <p className="text-sm text-gold">{testimonial.handle}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-gold border-gold/50 hover:bg-gold hover:text-deep-black" />
          <CarouselNext className="text-gold border-gold/50 hover:bg-gold hover:text-deep-black" />
        </Carousel>
      </div>
    </section>
  );
}

import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';

const beforeAfters = [
  {
    id: 1,
    before: 'https://picsum.photos/seed/ba-before1/600/600',
    after: 'https://picsum.photos/seed/ba-after1/600/600',
    aiHint: 'man before after',
  },
  {
    id: 2,
    before: 'https://picsum.photos/seed/ba-before2/600/600',
    after: 'https://picsum.photos/seed/ba-after2/600/600',
    aiHint: 'man before after haircut',
  },
  {
    id: 3,
    before: 'https://picsum.photos/seed/ba-before3/600/600',
    after: 'https://picsum.photos/seed/ba-after3/600/600',
    aiHint: 'beard trim before after',
  },
];

const galleryImages = [
  { id: 1, src: 'https://picsum.photos/seed/gallery1/600/800', alt: 'Corte de cabelo estiloso', aiHint: 'stylish haircut' },
  { id: 2, src: 'https://picsum.photos/seed/gallery2/600/800', alt: 'Barba sendo aparada', aiHint: 'beard trim' },
  { id: 3, src: 'https://picsum.photos/seed/gallery3/800/600', alt: 'Cliente relaxando na cadeira', aiHint: 'man relaxing barbershop' },
  { id: 4, src: 'https://picsum.photos/seed/gallery4/600/800', alt: 'Detalhe da navalha', aiHint: 'razor detail' },
  { id: 5, src: 'https://picsum.photos/seed/gallery5/800/600', alt: 'Ambiente da barbearia', aiHint: 'barbershop ambient' },
  { id: 6, src: 'https://picsum.photos/seed/gallery6/600/800', alt: 'Finalização de penteado', aiHint: 'hair styling' },
];

export function Gallery() {
  return (
    <section id="galeria" className="py-20 sm:py-32 bg-dark-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl sm:text-6xl text-ice-white uppercase">
            Nossa Arte <span className="text-gold">em Foco</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Veja as transformações e a qualidade que entregamos em cada serviço. O seu próximo estilo está aqui.
          </p>
        </div>

        {/* Before and After Slider */}
        <div className="mb-24">
          <h3 className="font-headline text-4xl text-center text-gold mb-8 tracking-wider">Transformações</h3>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-4xl mx-auto"
          >
            <CarouselContent>
              {beforeAfters.map((item) => (
                <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/2">
                   <div className="p-1">
                    <Card className="bg-transparent border-0 shadow-none">
                      <CardContent className="p-0">
                        <div className="grid grid-cols-2 gap-2 relative">
                          <div className="relative aspect-square">
                            <Image src={item.before} alt="Antes" fill className="rounded-lg object-cover" data-ai-hint={item.aiHint}/>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm font-bold rounded">ANTES</div>
                          </div>
                          <div className="relative aspect-square">
                            <Image src={item.after} alt="Depois" fill className="rounded-lg object-cover" data-ai-hint={item.aiHint}/>
                            <div className="absolute bottom-2 right-2 bg-gold/80 text-deep-black px-2 py-1 text-sm font-bold rounded">DEPOIS</div>
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
        
        {/* Photo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryImages.map((image, index) => (
            <div
              key={image.id}
              className={`relative rounded-lg overflow-hidden group aspect-[3/4] ${
                index === 2 || index === 4 ? 'md:col-span-2 aspect-[4/3] md:aspect-[unset]' : ''
              }`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={image.aiHint}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

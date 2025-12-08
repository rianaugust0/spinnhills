import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const beforeAfters = [
  {
    id: 1,
    beforeId: 'gallery-ba-1-before',
    afterId: 'gallery-ba-1-after',
    aiHint: 'man before after',
  },
  {
    id: 2,
    beforeId: 'gallery-ba-2-before',
    afterId: 'gallery-ba-2-after',
    aiHint: 'man before after haircut',
  },
  {
    id: 3,
    beforeId: 'gallery-ba-3-before',
    afterId: 'gallery-ba-3-after',
    aiHint: 'beard trim before after',
  },
];

const galleryImageIds = [
  'gallery-grid-1',
  'gallery-grid-2',
  'gallery-grid-3',
  'gallery-grid-4',
  'gallery-grid-5',
  'gallery-grid-6',
];

const galleryImages = galleryImageIds.map(id => PlaceHolderImages.find(p => p.id === id)!);

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
              {beforeAfters.map((item) => {
                const beforeImg = PlaceHolderImages.find(p => p.id === item.beforeId)!;
                const afterImg = PlaceHolderImages.find(p => p.id === item.afterId)!;
                return (
                  <CarouselItem key={item.id} className="md:basis-1/2 lg:basis-1/2">
                    <div className="p-1">
                      <Card className="bg-transparent border-0 shadow-none">
                        <CardContent className="p-0">
                          <div className="grid grid-cols-2 gap-2 relative">
                            <div className="relative aspect-square">
                              <Image src={beforeImg.imageUrl} alt="Antes" fill className="rounded-lg object-cover" data-ai-hint={item.aiHint}/>
                              <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 text-sm font-bold rounded">ANTES</div>
                            </div>
                            <div className="relative aspect-square">
                              <Image src={afterImg.imageUrl} alt="Depois" fill className="rounded-lg object-cover" data-ai-hint={item.aiHint}/>
                              <div className="absolute bottom-2 right-2 bg-gold/80 text-deep-black px-2 py-1 text-sm font-bold rounded">DEPOIS</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                )
              })}
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
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={image.imageHint}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

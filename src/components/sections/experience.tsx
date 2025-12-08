
import { Wind, Gem, GlassWater, Scissors } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const differentials = [
  {
    icon: <Wind className="h-10 w-10 text-gold" />,
    title: 'Toalha Quente',
    description: 'Relaxe e prepare sua pele com nossas toalhas quentes e óleos essenciais, um ritual que transforma o barbear.',
    imageId: 'experience-hot-towel',
  },
  {
    icon: <Scissors className="h-10 w-10 text-gold" />,
    title: 'Barba com Navalha',
    description: 'A precisão da navalha para um acabamento impecável e duradouro, executado por mãos experientes.',
    imageId: 'experience-razor-shave',
  },
  {
    icon: <GlassWater className="h-10 w-10 text-gold" />,
    title: 'Bebidas Premium',
    description: 'Aprecie um bom whisky, uma cerveja artesanal ou um café especial enquanto cuidamos do seu visual.',
    imageId: 'experience-premium-drinks',
  },
  {
    icon: <Gem className="h-10 w-10 text-gold" />,
    title: 'Ambiente Exclusivo',
    description: 'Um espaço pensado para o homem moderno, com design sofisticado, conforto e privacidade.',
    imageId: 'experience-exclusive-ambiente',
  },
];

export function Experience() {
  const imageMap = new Map(PlaceHolderImages.map(img => [img.id, img]));

  return (
    <section id="experiencia" className="py-20 sm:py-32 bg-deep-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl sm:text-6xl text-ice-white uppercase">
            A Experiência <span className="text-gold">HillsCut</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Cada detalhe é uma declaração de excelência. Conheça os diferenciais que tornam sua visita inesquecível.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {differentials.map((item, index) => {
            const image = imageMap.get(item.imageId);
            return (
              <div
                key={item.title}
                className="relative group rounded-lg overflow-hidden h-[450px] shadow-lg flex flex-col justify-end p-6 text-white text-center bg-dark-gray"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    className="object-cover transition-all duration-500 group-hover:scale-110"
                    data-ai-hint={image.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-black via-deep-black/70 to-transparent"></div>
                <div className="relative z-10 flex flex-col items-center">
                  <div className="mb-4 transition-transform duration-300 group-hover:-translate-y-2">
                    {item.icon}
                  </div>
                  <h3 className="font-headline text-3xl text-gold uppercase mb-2 transition-transform duration-300 group-hover:-translate-y-2">
                    {item.title}
                  </h3>
                  <p className="text-ice-white/80 h-0 opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-2 transition-all duration-500 text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

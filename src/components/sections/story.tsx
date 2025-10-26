import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Story() {
  const authorImage = PlaceHolderImages.find(p => p.id === 'author-portrait');
  
  return (
    <section id="historia" className="py-16 sm:py-24">
      <div className="container">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              🧠 Como Eu Saí de 920 para 960 na Redação do ENEM
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              Na primeira vez que fiz o Enem, tirei 920. Boa nota, mas eu sabia que podia mais. No ano seguinte, decidi entender o que realmente faz uma redação ser nota alta.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Depois de analisar dezenas de textos nota 1000 e aplicar técnicas de estrutura, repertório e linguagem, cheguei a <strong className="text-foreground">960 pontos</strong> — e percebi que qualquer pessoa pode chegar lá, com o método certo.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Agora, reuni tudo isso num material prático, direto e fácil de aplicar, mesmo faltando poucos dias pro Enem.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            {authorImage && (
              <Image
                src={authorImage.imageUrl}
                alt={authorImage.description}
                width={400}
                height={400}
                className="rounded-lg shadow-lg object-cover"
                data-ai-hint={authorImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

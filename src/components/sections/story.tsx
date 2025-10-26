import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Story() {
  const authorImage = PlaceHolderImages.find(p => p.id === 'author-grades');
  
  return (
    <section id="historia" className="py-16 sm:py-24">
      <div className="container">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              🧠 Como Eu Tirei 980 na Redação do ENEM
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              No meu primeiro Enem pra valer, tirei 920. Uma nota boa, mas eu sabia que dava pra ir além. No ano seguinte, decidi focar em entender a fundo o que os corretores realmente esperam.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Depois de analisar dezenas de redações nota 1000 e criar um método próprio de estrutura, repertório e argumentação, o resultado veio: <strong className="text-foreground">980 pontos</strong>. Foi aí que percebi que qualquer pessoa pode alcançar uma nota alta com o método certo.
            </p>
            <p className="mt-4 text-lg text-muted-foreground">
              Agora, reuni todo esse aprendizado em um guia prático, direto ao ponto e fácil de aplicar, mesmo que faltem poucos dias para o Enem.
            </p>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            {authorImage && (
              <Image
                src={authorImage.imageUrl}
                alt={authorImage.description}
                width={400}
                height={400}
                className="rounded-lg shadow-lg object-contain"
                data-ai-hint={authorImage.imageHint}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

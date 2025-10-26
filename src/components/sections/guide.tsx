import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  "O modelo exato que usei pra tirar 980 pontos.",
  "As 5 competências explicadas de forma simples e estratégica.",
  "Como montar introduções irresistíveis em 5 minutos.",
  "Modelos prontos de redação pra adaptar ao tema.",
  "Frases e conectivos poderosos que impressionam o corretor.",
  "Checklist de revisão final pra garantir perfeição antes da entrega."
];

export function Guide() {
  const guideCoverImage = PlaceHolderImages.find(p => p.id === 'guide-cover');
  return (
    <section id="guia" className="bg-secondary py-16 sm:py-24">
      <div className="container">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="flex justify-center">
            {guideCoverImage && (
              <Image
                src={guideCoverImage.imageUrl}
                alt={guideCoverImage.description}
                width={400}
                height={500}
                className="rounded-lg shadow-2xl transform transition-transform duration-500 hover:scale-105"
                data-ai-hint={guideCoverImage.imageHint}
              />
            )}
          </div>
          <div>
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              📘 Guia Prático — Como Tirar 920+ na Redação do ENEM
            </h2>
            <p className="mt-6 text-lg text-muted-foreground">
              O passo a passo comprovado pra você escrever redações de alto nível e dominar o formato do Enem sem enrolação. <span className="font-bold text-foreground">Você vai aprender:</span>
            </p>
            <ul className="mt-6 space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-primary mt-1" />
                  <span className="text-lg">{feature}</span>
                </li>
              ))}
            </ul>
            <Card className="mt-8 bg-primary/10 border-primary/20">
              <CardContent className="p-4 text-center">
                <p className="font-semibold text-primary">
                  🕒 Leitura rápida: em menos de 2 horas, você já entende e aplica o método.
                </p>
              </CardContent>
            </Card>
            <Button asChild size="lg" className="mt-8 w-full md:w-auto text-lg h-12 px-8">
              <a href="#offer">🔵 QUERO ESSE GUIA AGORA</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

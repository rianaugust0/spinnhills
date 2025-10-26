import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    name: "Beatriz M.",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-beatriz'),
    quote: "Nunca consegui passar de 700. Com o guia, em duas semanas, minha redação saltou pra 920!",
  },
  {
    name: "Lucas R.",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-lucas'),
    quote: "Entendi o que o corretor quer ver. Simples, prático e direto. O melhor investimento que fiz para o Enem.",
  },
  {
    name: "Ana P.",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-ana'),
    quote: "Tô confiante como nunca estive antes do Enem. O guia me deu a segurança que eu precisava.",
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-16 sm:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            💬 O Que Dizem Nossos Alunos
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Resultados reais de quem aplicou o método.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar>
                    {testimonial.image && <AvatarImage src={testimonial.image.imageUrl} alt={testimonial.image.description} data-ai-hint={testimonial.image.imageHint} />}
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <div className="flex items-center gap-0.5 text-yellow-500">
                      {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">"{testimonial.quote}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

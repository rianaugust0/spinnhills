import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { PlaceHolderImages } from '@/lib/placeholder-images';

const testimonials = [
  {
    name: "Beatriz M.",
    title: "Aprovada em Medicina",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-beatriz'),
    quote: "Nunca consegui passar de 700. Com o guia, em duas semanas, minha redação saltou pra 920! Foi o empurrão que faltava para a minha aprovação.",
  },
  {
    name: "Lucas R.",
    title: "Aprovado em Direito",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-lucas'),
    quote: "Entendi o que o corretor quer ver. Simples, prático e direto. O melhor investimento que fiz para o Enem.",
  },
  {
    name: "Ana P.",
    title: "Aprovada em Psicologia",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-ana'),
    quote: "Tô confiante como nunca estive antes do Enem. O guia me deu a segurança que eu precisava para buscar a nota máxima.",
  },
  {
    name: "João V.",
    title: "Aprovado em Engenharia",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-joao'),
    quote: "O método é muito claro. Em poucos dias eu já estava escrevendo redações muito melhores e com mais repertório. Recomendo demais!",
  },
];

export function Testimonials() {
  return (
    <section id="depoimentos" className="py-16 sm:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            💬 De Alunos Desesperados a Aprovados
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Resultados reais de quem aplicou o método e transformou a nota da redação.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.name} className="overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    {testimonial.image && <AvatarImage src={testimonial.image.imageUrl} alt={testimonial.image.description} data-ai-hint={testimonial.image.imageHint} />}
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-lg">{testimonial.name}</p>
                    <p className="text-sm text-primary">{testimonial.title}</p>
                  </div>
                </div>
                <blockquote className="mt-4 border-l-4 border-primary pl-4 italic text-muted-foreground">
                  "{testimonial.quote}"
                </blockquote>
                <div className="mt-4 flex items-center gap-0.5 text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
import { ThumbsUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Guarantee() {
  return (
    <section id="garantia-tempo" className="py-16 sm:py-24">
      <div className="container max-w-4xl mx-auto">
        <Card className="bg-primary/10 border-primary/20 text-center p-6 sm:p-8">
          <CardContent className="p-0">
            <ThumbsUp className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              "Mas ainda dá tempo?"<br/> Sim, e eu garanto.
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Pare de pensar que é tarde demais. O desespero não aprova ninguém, mas um método eficiente, sim. Com o Guia Redação 920+, você aprenderá a criar uma redação de alto nível em <b>menos de 1 semana</b>. 
            </p>
            <p className="mt-4 text-xl font-bold text-foreground">
              O método é direto ao ponto, sem enrolação. Eu garanto que você terá em mãos tudo o que precisa para mudar sua nota. Só depende de você começar agora.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

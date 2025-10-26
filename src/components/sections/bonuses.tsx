import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpenCheck, BrainCircuit, ClipboardList, Clock, Sparkles } from "lucide-react";
import Image from "next/image";

const bonuses = [
  {
    icon: <BookOpenCheck className="h-8 w-8 text-primary" />,
    title: "10 Redações Nota 1000 Analisadas",
    value: "97",
    description: "Aprenda com exemplos reais, analisando cada linha para entender o que o corretor valoriza.",
    image: "https://i.imgur.com/429p8Cj.png"
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Guia de Frases e Conectivos de Ouro",
    value: "47",
    description: "Mais de 100 frases e conectivos estratégicos para deixar sua redação profissional e coerente."
  },
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "Plano Relâmpago: 7 Dias para Dominar",
    value: "67",
    description: "Um cronograma de 7 dias para revisar, treinar e ajustar tudo até o dia da prova."
  },
  {
    icon: <BrainCircuit className="h-8 w-8 text-primary" />,
    title: "Repertórios Socioculturais Prontos",
    value: "57",
    description: "Mais de 30 repertórios atualizados com autores e temas modernos para usar sem medo."
  },
  {
    icon: <ClipboardList className="h-8 w-8 text-primary" />,
    title: "Checklist da Redação Nota 1000",
    value: "27",
    description: "Um guia rápido de revisão para garantir que nada fique de fora antes de entregar sua redação."
  }
];

export function Bonuses() {
  return (
    <section id="bonus" className="py-16 sm:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            🎁 Bônus Exclusivos (Edição Pré-ENEM)
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Disponíveis apenas até a véspera da prova! Todos 100% gratuitos na compra do guia hoje.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bonuses.map((bonus) => (
            <Card key={bonus.title} className="flex flex-col transition-transform duration-300 hover:scale-105 hover:shadow-xl">
              <CardHeader className="flex-row items-start gap-4 space-y-0">
                {bonus.icon}
                <div className="flex-1">
                  <CardTitle>{bonus.title}</CardTitle>
                </div>
                <Badge variant="destructive" className="flex-shrink-0">
                  <span className="line-through">R${bonus.value}</span>
                  <span className="ml-1">GRÁTIS</span>
                </Badge>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{bonus.description}</p>
                {bonus.image && (
                  <div className="mt-4 relative aspect-video">
                    <Image 
                      src={bonus.image} 
                      alt={`Imagem para ${bonus.title}`} 
                      fill
                      className="rounded-md object-contain"
                      data-ai-hint="writing examples"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

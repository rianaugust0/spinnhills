import { Award, BookCopy, CheckSquare, PencilRuler, Sparkles, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const guideContents = [
  {
    icon: <Award className="h-8 w-8 text-primary" />,
    title: "Modelo de Redação 920+",
    description: "O modelo exato que usei para tirar 980, com a estrutura pronta para você adaptar ao tema."
  },
  {
    icon: <PencilRuler className="h-8 w-8 text-primary" />,
    title: "5 Competências Descomplicadas",
    description: "Entenda de forma simples e estratégica o que o corretor realmente espera em cada competência."
  },
  {
    icon: <Star className="h-8 w-8 text-primary" />,
    title: "Introduções Irresistíveis",
    description: "Aprenda a montar parágrafos de introdução que capturam a atenção do corretor em menos de 5 minutos."
  },
  {
    icon: <BookCopy className="h-8 w-8 text-primary" />,
    title: "Modelos Prontos para Adaptar",
    description: "Estruturas de redação pré-montadas para diferentes eixos temáticos, para você nunca mais travar."
  },
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: "Conectivos e Frases de Efeito",
    description: "Um arsenal de conectivos e frases que deixam seu texto mais coeso, profissional e impressionante."
  },
  {
    icon: <CheckSquare className="h-8 w-8 text-primary" />,
    title: "Checklist de Revisão Final",
    description: "Um passo a passo para você revisar sua redação antes de entregar e garantir que nenhum detalhe foi esquecido."
  },
]

export function InsideGuide() {
  return (
    <section id="inside-guide" className="py-16 sm:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            O Que Você Vai Encontrar no Guia
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Um resumo do arsenal que você terá em mãos para garantir sua nota alta.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {guideContents.map((item, index) => (
            <Card key={index} className="flex flex-col">
              <CardHeader className="flex-col items-start gap-4 sm:flex-row sm:items-center">
                {item.icon}
                <CardTitle className="text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

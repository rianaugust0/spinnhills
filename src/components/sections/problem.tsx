import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Frown, HelpCircle } from "lucide-react";

const painPoints = [
  {
    icon: <Clock className="h-8 w-8 text-primary" />,
    title: "O tempo tá acabando.",
    description: "A contagem regressiva para o ENEM pode ser assustadora, mas cada dia é uma nova chance de se preparar.",
  },
  {
    icon: <Frown className="h-8 w-8 text-primary" />,
    title: "Ainda não sabe como começar uma redação nota alta.",
    description: "A folha em branco parece um monstro, mas com a estrutura certa, você começa com confiança e clareza.",
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-primary" />,
    title: "Não entende direito o que o corretor espera.",
    description: "Desvende os mistérios da correção e entregue exatamente o que eles querem ver para uma nota máxima.",
  },
];

export function Problem() {
  return (
    <section id="problema" className="bg-secondary py-16 sm:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            😰 O Desespero de Quem Ainda Não Dominou a Redação
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Você sabe que a redação é decisiva no Enem. Mas talvez esteja sentindo isso agora:
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {painPoints.map((point, index) => (
            <Card key={index} className="flex flex-col items-center text-center">
              <CardHeader>
                {point.icon}
              </CardHeader>
              <CardContent>
                <CardTitle className="mb-2 text-xl font-semibold">{point.title}</CardTitle>
                <p className="text-muted-foreground">{point.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-12 text-center text-xl font-medium">
          kk
        </p>
      </div>
    </section>
  );
}

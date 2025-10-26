import { CheckCircle } from "lucide-react";

const reasons = [
  "Vai fazer o Enem e ainda não se sente pronto pra redação.",
  "Precisa de resultados rápidos e diretos.",
  "Quer seguir um método comprovado por quem já chegou lá.",
  "Quer aumentar sua média e garantir sua vaga.",
];

export function TargetAudience() {
  return (
    <section id="para-voce" className="bg-secondary py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-xl border bg-card p-8 shadow-lg">
          <h2 className="text-center font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            🎯 Esse Guia é Para Você Se...
          </h2>
          <ul className="mt-8 space-y-4">
            {reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-4 text-lg">
                <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

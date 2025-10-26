'use client';

import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

export function LastCall() {
  const [progress, setProgress] = useState(85);

  useEffect(() => {
    // This effect runs only on the client
    const timer = setTimeout(() => {
        if (progress < 95) {
            setProgress(prev => Math.min(95, prev + Math.floor(Math.random() * 3) + 1));
        }
    }, 2000); // Update every 2 seconds

    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <section id="last-call" className="py-16 sm:py-24">
      <div className="container max-w-3xl mx-auto">
        <div className="rounded-lg border bg-card text-card-foreground shadow-lg p-8 text-center">
            <h3 className="font-headline text-2xl font-bold tracking-tight text-primary">
                🔥 Restam Poucas Vagas Com o Valor Promocional!
            </h3>
            <p className="mt-4 text-lg text-muted-foreground">
                Mais de 150 alunos já garantiram o guia só essa semana. O preço vai subir a qualquer momento.
            </p>
            <div className="mt-6">
                <Progress value={progress} className="h-4" />
                <p className="mt-2 text-sm font-bold text-destructive">{progress > 0 ? `${progress}% das vagas preenchidas!` : `Calculando vagas...`}</p>
            </div>
            <p className="mt-6 text-xl font-semibold">
                Você vai ficar de fora e se arrepender depois?
            </p>
        </div>
      </div>
    </section>
  );
}

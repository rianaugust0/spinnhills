"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { gradeEssay, GradeEssayOutput } from "@/ai/flows/grade-essay-flow";
import { Badge } from "../ui/badge";

export function AiCorrector() {
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState<GradeEssayOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCorrection = async () => {
    if (!essay) return;
    setIsLoading(true);
    setResult(null);
    try {
      const correctionResult = await gradeEssay({ essay });
      setResult(correctionResult);
    } catch (error) {
      console.error("Erro ao corrigir redação:", error);
      // Aqui você pode adicionar um toast de erro para o usuário
    }
    setIsLoading(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 920) return "bg-green-500";
    if (score >= 700) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <section id="ai-corrector" className="py-16 sm:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <Badge
            variant="outline"
            className="mb-4 text-sm font-medium text-primary"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Bônus Exclusivo e Interativo
          </Badge>
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            🤖 Corrija Sua Redação com Nossa IA
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Receba uma nota e feedback instantâneo para saber exatamente onde melhorar.
            Cole sua redação abaixo e veja a mágica acontecer.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-xl">
          <CardContent className="p-6">
            <div className="grid gap-6">
              <Textarea
                placeholder="Cole sua redação aqui..."
                rows={15}
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                className="text-base"
                disabled={isLoading}
              />
              <Button
                onClick={handleCorrection}
                disabled={isLoading || !essay}
                size="lg"
                className="w-full text-lg h-12"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-6 w-6" />
                )}
                {isLoading ? "Corrigindo..." : "Corrigir Minha Redação"}
              </Button>
            </div>

            {result && (
              <div className="mt-8 animate-fade-in">
                <h3 className="font-headline text-2xl font-bold text-center mb-6">
                  Sua Nota e Análise Detalhada
                </h3>
                <div className="text-center mb-8">
                    <p className="text-muted-foreground">Nota Final Estimada</p>
                    <div className={`mx-auto my-2 flex items-center justify-center h-28 w-28 rounded-full text-white font-bold text-4xl ${getScoreColor(result.finalScore)}`}>
                        {result.finalScore}
                    </div>
                </div>

                <div className="space-y-4">
                  {result.competencies.map((comp, index) => (
                    <Card key={index} className="bg-secondary/30">
                      <CardContent className="p-4">
                        <h4 className="font-bold text-lg text-primary">
                          Competência {index + 1}: {comp.score} / 200
                        </h4>
                        <p className="mt-2 text-muted-foreground">{comp.feedback}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                 <div className="mt-6 text-center">
                    <h4 className="font-bold text-lg">Recomendações Gerais</h4>
                    <p className="mt-2 text-muted-foreground">{result.generalFeedback}</p>
                 </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

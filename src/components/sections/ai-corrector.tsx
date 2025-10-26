'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { gradeEssay, GradeEssayOutput } from '@/ai/flows/grade-essay-flow';
import { Loader2, Sparkles } from 'lucide-react';

export function AiCorrector() {
  const [essay, setEssay] = useState('');
  const [result, setResult] = useState<GradeEssayOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGradeEssay = async () => {
    if (!essay.trim()) {
      setError('Por favor, insira uma redação para ser avaliada.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await gradeEssay(essay);
      setResult(response);
    } catch (e) {
      console.error(e);
      setError('Ocorreu um erro ao corrigir sua redação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const competenceMapping: { [key: string]: string } = {
      competence1: 'Competência 1: Domínio da norma-padrão',
      competence2: 'Competência 2: Compreensão do tema e estrutura',
      competence3: 'Competência 3: Seleção e organização de informações',
      competence4: 'Competência 4: Conhecimento dos mecanismos linguísticos',
      competence5: 'Competência 5: Proposta de intervenção',
  };

  return (
    <section id="ai-corrector" className="py-16 sm:py-24 bg-secondary">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            Diagnóstico Instantâneo da Sua Redação
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Cole sua redação (ou um parágrafo) e nossa IA te dará uma nota estimada e um feedback instantâneo. <br/>
            <span className='font-bold'>É como ter um corretor particular, 24h por dia.</span>
          </p>
        </div>

        <Card className="shadow-2xl">
          <CardContent className="p-6">
            <Textarea
              placeholder="Cole aqui a sua redação para uma análise instantânea..."
              value={essay}
              onChange={(e) => setEssay(e.target.value)}
              className="min-h-[250px] text-base"
              disabled={isLoading}
            />
            {error && <p className="text-destructive text-sm mt-2 text-center font-medium">{error}</p>}
            <Button
              onClick={handleGradeEssay}
              disabled={isLoading}
              size="lg"
              className="w-full mt-4 text-lg h-12"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analisando...
                </>
              ) : (
                '🔍 Corrigir Minha Redação Agora'
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="mt-8 animate-fade-in-up">
            <CardHeader className='text-center'>
              <CardTitle className="font-headline text-2xl font-bold">
                Seu Diagnóstico está Pronto!
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='text-center mb-6'>
                    <p className='text-muted-foreground text-lg'>Nota Estimada:</p>
                    <p className='font-headline text-7xl font-extrabold text-primary'>{result.overallScore}</p>
                </div>
              <div className="space-y-4">
                {Object.entries(result.competencies).map(([key, value]) => (
                  <div key={key} className="border-l-4 border-primary/50 pl-4 py-2 bg-background rounded-r-md">
                    <p className="font-bold text-lg">{competenceMapping[key]}: <span className='text-primary'>{value.score} / 200</span></p>
                    <p className="text-muted-foreground mt-1">{value.feedback}</p>
                  </div>
                ))}
              </div>
                <div className='text-center mt-8'>
                    <p className='text-lg font-semibold'>Gostou do diagnóstico? 🚀</p>
                    <p className='text-muted-foreground'>Este é só o começo. Nosso guia completo vai te ensinar a transformar esses pontos fracos em notas máximas. Garanta sua vaga e domine a redação do ENEM!</p>
                     <Button asChild size="lg" className="mt-4 text-lg h-12 px-8">
                        <a href="#offer">🔥 QUERO O GUIA COMPLETO AGORA!</a>
                    </Button>
                </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}

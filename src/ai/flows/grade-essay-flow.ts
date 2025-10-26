'use server';
/**
 * @fileOverview Um fluxo de IA para corrigir redações do ENEM.
 *
 * - gradeEssay - A função que analisa a redação.
 * - GradeEssayOutput - O tipo de retorno da função.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CompetenceFeedbackSchema = z.object({
  score: z.number().describe('A nota para esta competência, de 0 a 200.'),
  feedback: z.string().describe('Um feedback conciso e construtivo (1-2 frases) sobre o desempenho do aluno nesta competência específica.'),
});

const GradeEssayOutputSchema = z.object({
  overallScore: z.number().describe('A nota geral da redação, de 0 a 1000. Deve ser a soma das notas das 5 competências.'),
  competencies: z.object({
    competence1: CompetenceFeedbackSchema.describe('Competência 1: Demonstrar domínio da modalidade escrita formal da língua portuguesa.'),
    competence2: CompetenceFeedbackSchema.describe('Competência 2: Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema, dentro dos limites estruturais do texto dissertativo-argumentativo em prosa.'),
    competence3: CompetenceFeedbackSchema.describe('Competência 3: Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista.'),
    competence4: CompetenceFeedbackSchema.describe('Competência 4: Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação.'),
    competence5: CompetenceFeedbackSchema.describe('Competência 5: Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos.'),
  })
});

export type GradeEssayOutput = z.infer<typeof GradeEssayOutputSchema>;

export async function gradeEssay(essay: string): Promise<GradeEssayOutput> {
  return gradeEssayFlow(essay);
}

const prompt = ai.definePrompt({
    name: 'gradeEssayPrompt',
    input: { schema: z.string() },
    output: { schema: GradeEssayOutputSchema },
    prompt: `Você é um corretor especialista em redações do ENEM, treinado para avaliar textos de forma rigorosa e precisa, seguindo as 5 competências oficiais. Sua tarefa é analisar a redação fornecida, atribuir uma nota de 0 a 200 para cada competência e, em seguida, calcular a nota final (de 0 a 1000) somando as notas das competências.

    Para cada competência, forneça um feedback curto, objetivo e construtivo, explicando a razão da nota atribuída e sugerindo pontos de melhoria.

    Analise a seguinte redação:

    ---
    {{{input}}}
    ---
    `,
});


const gradeEssayFlow = ai.defineFlow(
  {
    name: 'gradeEssayFlow',
    inputSchema: z.string(),
    outputSchema: GradeEssayOutputSchema,
  },
  async (essay) => {
    const { output } = await prompt(essay);
    if (!output) {
        throw new Error("A IA não conseguiu gerar uma correção. Tente novamente.");
    }
    // Garante que a nota final seja a soma das competências
    output.overallScore = Object.values(output.competencies).reduce((acc, c) => acc + c.score, 0);
    return output;
  }
);

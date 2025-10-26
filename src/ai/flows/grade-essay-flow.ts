'use server';
/**
 * @fileOverview Um fluxo Genkit para corrigir redações do ENEM.
 *
 * - gradeEssay - A função que lida com a correção da redação.
 * - GradeEssayInput - O tipo de entrada para a função gradeEssay.
 * - GradeEssayOutput - O tipo de retorno para a função gradeEssay.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GradeEssayInputSchema = z.object({
  essay: z.string().describe('O texto completo da redação a ser corrigida.'),
});
export type GradeEssayInput = z.infer<typeof GradeEssayInputSchema>;

const CompetencySchema = z.object({
    score: z.number().min(0).max(200).describe('A nota para esta competência, de 0 a 200.'),
    feedback: z.string().describe('O feedback detalhado para esta competência específica.')
});

const GradeEssayOutputSchema = z.object({
  competencies: z.array(CompetencySchema).length(5).describe('Uma lista de 5 análises, uma para cada competência do ENEM.'),
  finalScore: z.number().min(0).max(1000).describe('A nota final da redação, de 0 a 1000.'),
  generalFeedback: z.string().describe('Um parágrafo com recomendações gerais para o aluno melhorar.'),
});
export type GradeEssayOutput = z.infer<typeof GradeEssayOutputSchema>;

export async function gradeEssay(input: GradeEssayInput): Promise<GradeEssayOutput> {
  return gradeEssayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gradeEssayPrompt',
  input: { schema: GradeEssayInputSchema },
  output: { schema: GradeEssayOutputSchema },
  prompt: `
    Você é um corretor especialista em redações do ENEM, treinado para avaliar textos conforme as 5 competências oficiais. Sua tarefa é analisar a redação fornecida e retornar uma avaliação estruturada.

    **COMPETÊNCIAS DO ENEM:**
    1.  **Competência 1:** Demonstrar domínio da modalidade escrita formal da língua portuguesa. (0 a 200 pontos)
    2.  **Competência 2:** Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema, dentro dos limites estruturais do texto dissertativo-argumentativo em prosa. (0 a 200 pontos)
    3.  **Competência 3:** Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista. (0 a 200 pontos)
    4.  **Competência 4:** Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação. (0 a 200 pontos)
    5.  **Competência 5:** Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos. (0 a 200 pontos)

    **INSTRUÇÕES:**
    1.  Leia atentamente a redação do aluno.
    2.  Para cada uma das 5 competências, atribua uma nota de 0 a 200.
    3.  Para cada competência, escreva um feedback construtivo e claro, explicando os pontos fortes e fracos e como o aluno pode melhorar.
    4.  Calcule a nota final somando as notas das 5 competências.
    5.  Forneça um feedback geral com as recomendações mais importantes para o aluno.
    6.  Retorne o resultado no formato JSON especificado.

    **REDAÇÃO DO ALUNO:**
    ---
    {{{essay}}}
    ---
  `,
});

const gradeEssayFlow = ai.defineFlow(
  {
    name: 'gradeEssayFlow',
    inputSchema: GradeEssayInputSchema,
    outputSchema: GradeEssayOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('A IA não conseguiu gerar uma correção.');
    }
    return output;
  }
);

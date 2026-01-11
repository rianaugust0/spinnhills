
export interface PrizeOption {
  type: 'corte_gratis' | 'hidratacao' | 'esfoliacao' | 'sobrancelha' | 'try_again';
  title: string;
  description: string;
  imageUrl: string;
  validityDays: number;
}

// All possible outcomes, including non-prizes
export const allOutcomes: PrizeOption[] = [
  {
    type: 'corte_gratis',
    title: 'Corte Grátis',
    description: 'Um corte de cabelo completo na faixa!',
    imageUrl: '/prizes/corte.png',
    validityDays: 10,
  },
  {
    type: 'esfoliacao',
    title: 'Esfoliação',
    description: 'Renove sua pele com uma esfoliação facial.',
    imageUrl: '/prizes/esfoliacao.png',
    validityDays: 15,
  },
  {
    type: 'try_again',
    title: 'Tente Novamente',
    description: 'Não foi dessa vez, mais sorte na próxima!',
    imageUrl: '',
    validityDays: 0,
  },
  {
    type: 'hidratacao',
    title: 'Hidratação',
    description: 'Uma hidratação para deixar seu cabelo impecável.',
    imageUrl: '/prizes/hidratacao.png',
    validityDays: 15,
  },
  {
    type: 'sobrancelha',
    title: 'Sobrancelha',
    description: 'Um design de sobrancelha profissional.',
    imageUrl: '/prizes/sobrancelha.png',
    validityDays: 15,
  },
    {
    type: 'try_again',
    title: 'Tente Novamente',
    description: 'Não foi dessa vez, mais sorte na próxima!',
    imageUrl: '',
    validityDays: 0,
  },
];


// Only actual prizes that can be granted
export const grantablePrizes: PrizeOption[] = allOutcomes.filter(p => p.type !== 'try_again');

    
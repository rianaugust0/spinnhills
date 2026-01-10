
export interface PrizeOption {
  type: 'corte_gratis' | 'hidratacao' | 'esfoliacao' | 'sobrancelha' | 'try_again';
  title: string;
  description: string;
  imageUrl: string;
  validityDays: number;
}

export const prizeOptions: PrizeOption[] = [
  {
    type: 'corte_gratis',
    title: 'Corte Grátis',
    description: 'Um corte de cabelo completo na faixa!',
    imageUrl: '/prizes/corte.png',
    validityDays: 10,
  },
  {
    type: 'hidratacao',
    title: 'Hidratação',
    description: 'Uma hidratação para deixar seu cabelo impecável.',
    imageUrl: '/prizes/hidratacao.png',
    validityDays: 15,
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
    title: 'Não foi dessa vez',
    description: 'Mais sorte na próxima!',
    imageUrl: '',
    validityDays: 0,
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
    title: 'Tente de Novo',
    description: 'Quase lá, não desista!',
    imageUrl: '',
    validityDays: 0,
  },
];


export interface PrizeOption {
  type: 'corte_gratis' | 'hidratacao' | 'esfoliacao' | 'sobrancelha' | 'desconto_10' | 'brinde' | 'giro_extra' | 'try_again';
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
    type: 'desconto_10',
    title: '10% OFF',
    description: 'Válido para seu próximo corte.',
    imageUrl: '/prizes/desconto.png',
    validityDays: 30, // Exemplo
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
  {
    type: 'brinde',
    title: 'Brinde Especial',
    description: 'Um mimo da barbearia para você.',
    imageUrl: '/prizes/brinde.png',
    validityDays: 7, // Exemplo
  },
  {
    type: 'giro_extra',
    title: '1 Giro Extra',
    description: 'Corte o cabelo em até 10 dias e ganhe +1 giro!',
    imageUrl: '/prizes/giro_extra.png',
    validityDays: 10,
  },
];


// Only actual prizes that can be granted directly by a barber
export const grantablePrizes: PrizeOption[] = allOutcomes.filter(p => p.type !== 'try_again' && p.type !== 'giro_extra');

    
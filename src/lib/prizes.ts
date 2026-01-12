
export interface PrizeOption {
  type: 'corte_gratis' | 'hidratacao' | 'esfoliacao' | 'sobrancelha' | 'desconto_10' | 'brinde' | 'giro_extra' | 'try_again';
  title: string;
  description: string;
  imageUrl: string; // Mantido para possível uso futuro
  validityDays: number;
}

// All possible outcomes from the physical roulette
export const allOutcomes: PrizeOption[] = [
  {
    type: 'corte_gratis',
    title: 'Corte Grátis',
    description: 'Um corte de cabelo completo na faixa! Válido por 10 dias.',
    imageUrl: '/prizes/corte.png',
    validityDays: 10,
  },
  {
    type: 'hidratacao',
    title: 'Hidratação',
    description: 'Uma hidratação para deixar seu cabelo impecável. Válida por 15 dias.',
    imageUrl: '/prizes/hidratacao.png',
    validityDays: 15,
  },
  {
    type: 'esfoliacao',
    title: 'Esfoliação',
    description: 'Renove sua pele com uma esfoliação facial. Válida por 15 dias.',
    imageUrl: '/prizes/esfoliacao.png',
    validityDays: 15,
  },
  {
    type: 'sobrancelha',
    title: 'Sobrancelha',
    description: 'Um design de sobrancelha profissional. Válida por 15 dias.',
    imageUrl: '/prizes/sobrancelha.png',
    validityDays: 15,
  },
  {
    type: 'desconto_10',
    title: '10% OFF',
    description: 'Válido para seu próximo corte ou serviço. Válido por 30 dias.',
    imageUrl: '/prizes/desconto.png',
    validityDays: 30,
  },
  {
    type: 'brinde',
    title: 'Brinde Especial',
    description: 'Um mimo da barbearia para você. Resgate em até 7 dias.',
    imageUrl: '/prizes/brinde.png',
    validityDays: 7,
  },
  {
    type: 'giro_extra',
    title: '1 Giro Extra',
    description: 'Corte o cabelo em até 10 dias para ganhar +1 giro normal!',
    imageUrl: '/prizes/giro_extra.png',
    validityDays: 10,
  },
  {
    type: 'try_again',
    title: 'Não foi dessa vez',
    description: 'Mais sorte na próxima!',
    imageUrl: '',
    validityDays: 0,
  },
];

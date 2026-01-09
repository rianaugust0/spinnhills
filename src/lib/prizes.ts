
export interface PrizeOption {
  nome: string;
  tipo: 'servico' | 'desconto';
  validadeDias: number;
}

export const prizeOptions: PrizeOption[] = [
  { nome: 'Corte Grátis', tipo: 'servico', validadeDias: 10 },
  { nome: 'Hidratação', tipo: 'servico', validadeDias: 15 },
  { nome: 'Esfoliação', tipo: 'servico', validadeDias: 15 },
  { nome: 'Não foi dessa vez', tipo: 'desconto', validadeDias: 0 },
  { nome: 'Sobrancelha', tipo: 'servico', validadeDias: 15 },
  { nome: '10% OFF no Corte', tipo: 'desconto', validadeDias: 30 },
];

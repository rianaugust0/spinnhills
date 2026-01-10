export interface Prize {
    id: string;
    type: 'corte_gratis' | 'hidratacao' | 'esfoliacao' | 'sobrancelha' | 'try_again';
    title: string;
    description: string;
    imageUrl: string;
    status: 'active' | 'used' | 'expired';
    validityDays: number;
    createdAt: any; // Usually a Timestamp
    expiresAt: Date;
    usedAt?: any;
    usedByBarberId?: string;
  }
  
  export interface UserWithPrizes {
    userId: string;
    userName: string;
    userPhone: string;
    prizes: Prize[];
  }
  
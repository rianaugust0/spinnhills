
'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PartyPopper } from 'lucide-react';
import { PrizeOption } from '@/lib/prizes';
import { useRouter } from 'next/navigation';

interface PrizeModalProps {
  prize: PrizeOption | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PrizeModal({ prize, isOpen, onClose }: PrizeModalProps) {
  const router = useRouter();

  if (!prize) return null;

  const handleClose = () => {
    onClose();
    router.push('/dashboard');
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-dark-gray border-gold/20 text-center">
        <DialogHeader>
          {prize.nome !== 'Não foi dessa vez' ? (
            <>
              <PartyPopper className='h-16 w-16 text-gold mx-auto animate-bounce' />
              <DialogTitle className='text-3xl text-gold mt-4'>Parabéns!</DialogTitle>
              <DialogDescription className='text-xl text-ice-white mt-2'>Você ganhou</DialogDescription>
              <p className='text-4xl font-bold text-gold font-headline tracking-wider'>{prize.nome}</p>
            </>
          ) : (
            <>
              <DialogTitle className='text-3xl'>Quase!</DialogTitle>
              <DialogDescription className='text-xl mt-2'>Não foi dessa vez, mas o próximo giro pode ser o da sorte!</DialogDescription>
            </>
          )}
        </DialogHeader>
        <Button onClick={handleClose} className='mt-6 w-full'>
          {prize.nome !== 'Não foi dessa vez' ? 'Ir para
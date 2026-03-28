'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Scissors, CheckCircle, Sparkles } from 'lucide-react';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, serverTimestamp, Timestamp, writeBatch, increment } from 'firebase/firestore';
import { isAfter } from 'date-fns';
import ReactConfetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const { firestore } = initializeFirebase();

interface ConfirmCutModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientPhone: string;
  clientName: string;
}

export function ConfirmCutModal({ isOpen, onClose, clientPhone, clientName }: ConfirmCutModalProps) {
  const { toast } = useToast();
  const { width, height } = useWindowSize();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{ cortesAtuais: number; spinsEarned: number } | null>(null);

  const handleConfirm = async () => {
    if (pin.length < 4) {
      toast({ variant: 'destructive', title: 'PIN inválido', description: 'O PIN deve ter 4 dígitos.' });
      return;
    }

    setLoading(true);

    try {
      // 1. Validar PIN do Barbeiro
      const barbersQuery = query(collection(firestore, 'barbers'), where('pin', '==', pin));
      const barberSnapshot = await getDocs(barbersQuery);

      if (barberSnapshot.empty) {
        throw new Error('PIN do barbeiro inválido ou inexistente.');
      }
      const barber = barberSnapshot.docs[0];
      const barberId = barber.id;

      const batch = writeBatch(firestore);
      const nowTimestamp = serverTimestamp();
      const userDocRef = doc(firestore, 'users', clientPhone);
      
      // Buscar dados atuais do usuário para lógica de fidelidade
      const userDocSnap = await getDoc(userDocRef);
      if (!userDocSnap.exists()) throw new Error('Usuário não encontrado.');
      const userData = userDocSnap.data();

      let newCortesAtuais = (userData.cortesAtuais || 0) + 1;
      let spinsEarned = 0;

      const userUpdates: any = {
        totalCortes: increment(1),
        updatedAt: nowTimestamp,
        lastVisit: nowTimestamp,
      };

      // Lógica de 5 cortes = 1 giro
      if (newCortesAtuais >= 5) {
        newCortesAtuais = 0;
        const newSpinRef = doc(collection(firestore, 'spins'));
        batch.set(newSpinRef, {
          userId: clientPhone,
          status: 'available',
          origin: 'fidelidade_5_cortes',
          createdAt: nowTimestamp,
          usedAt: null,
        });
        spinsEarned++;
      }
      userUpdates.cortesAtuais = newCortesAtuais;

      // Lógica de Limited Spins (Giro Extra)
      const limitedSpinsQuery = query(
        collection(firestore, "limitedSpins"),
        where('userId', '==', clientPhone),
        where('status', '==', 'active')
      );
      const limitedSpinsSnapshot = await getDocs(limitedSpinsQuery);
      
      limitedSpinsSnapshot.docs.forEach(lsDoc => {
        const lsData = lsDoc.data();
        const expiresAt = (lsData.expiresAt as Timestamp).toDate();
        if (isAfter(expiresAt, new Date())) {
          batch.update(lsDoc.ref, {
            status: 'used',
            usedAt: nowTimestamp,
            usedByBarberId: barberId,
          });
          
          const extraSpinRef = doc(collection(firestore, 'spins'));
          batch.set(extraSpinRef, {
            userId: clientPhone,
            status: 'available',
            origin: 'giro_extra_convertido',
            createdAt: nowTimestamp,
            usedAt: null,
          });
          spinsEarned++;
        }
      });

      // Lógica de Indicação (Recompensar quem indicou)
      const referralQuery = query(
        collection(firestore, "referrals"), 
        where("referredUserId", "==", clientPhone), 
        where("spinGranted", "==", false)
      );
      const referralSnapshot = await getDocs(referralQuery);
      
      if (!referralSnapshot.empty) {
        const referralDoc = referralSnapshot.docs[0];
        const referrerId = referralDoc.data().referrerUserId;

        const referralSpinRef = doc(collection(firestore, 'spins'));
        batch.set(referralSpinRef, {
          userId: referrerId,
          status: 'available',
          origin: 'indicacao',
          createdAt: nowTimestamp,
          usedAt: null,
          notes: `Indicou ${clientName} (${clientPhone})`,
        });
        
        batch.update(referralDoc.ref, { 
          spinGranted: true, 
          haircutConfirmed: true 
        });
      }

      // Registrar o corte
      const cutRef = doc(collection(firestore, "cuts"));
      batch.set(cutRef, {
        userId: clientPhone,
        barberId: barberId,
        pinUsed: pin,
        confirmed: true,
        date: nowTimestamp
      });

      batch.update(userDocRef, userUpdates);
      await batch.commit();

      setSuccessData({ cortesAtuais: newCortesAtuais, spinsEarned });
      setShowSuccess(true);
      
    } catch (error: any) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Falha na validação',
        description: error.message || 'Não foi possível confirmar o corte.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPin('');
    setShowSuccess(false);
    setSuccessData(null);
    onClose();
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-dark-gray border-gold/20 text-ice-white text-center sm:max-w-md">
          {successData && successData.spinsEarned > 0 && (
            <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={200} gravity={0.2} colors={['#D4AF37', '#FFFFFF', '#000000']} />
          )}
          <DialogHeader>
            <div className="mx-auto bg-green-500/10 p-3 rounded-full mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <DialogTitle className="font-headline text-3xl text-gold uppercase tracking-wider">Corte Confirmado!</DialogTitle>
            <DialogDescription className="text-ice-white/80 text-lg">
              Seu progresso foi atualizado com sucesso.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="bg-deep-black p-4 rounded-lg border border-gold/10">
              <p className="text-sm text-muted-foreground uppercase">Novo Progresso</p>
              <p className="text-4xl font-bold text-gold">{successData?.cortesAtuais} / 5</p>
            </div>
            {successData && successData.spinsEarned > 0 && (
              <div className="flex items-center justify-center gap-2 text-green-400 font-bold animate-bounce">
                <Sparkles className="h-5 w-5" />
                <span>VOCÊ GANHOU +{successData.spinsEarned} {successData.spinsEarned === 1 ? 'GIRO' : 'GIROS'}!</span>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleClose} className="w-full bg-gold text-deep-black font-bold h-12 text-lg">
              Fechar e Voltar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-dark-gray border-gold/20 text-ice-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl text-gold uppercase">
            <Scissors className="h-6 w-6" /> Confirmar Novo Corte
          </DialogTitle>
          <DialogDescription className="text-ice-white/70">
            Peça ao seu barbeiro para digitar o PIN de validação abaixo.
          </DialogDescription>
        </DialogHeader>
        <div className="py-8 space-y-6">
          <div className="flex flex-col items-center gap-4">
             <label className="text-sm font-medium text-muted-foreground uppercase tracking-widest">PIN do Barbeiro</label>
             <Input
                type="password"
                inputMode="numeric"
                placeholder="****"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold text-center text-3xl h-16 w-48 tracking-[0.5em] font-bold placeholder:text-muted-foreground/20"
                autoFocus
             />
          </div>
        </div>
        <DialogFooter className="sm:flex-col gap-2">
          <Button 
            onClick={handleConfirm} 
            disabled={loading || pin.length < 4}
            className="w-full bg-gold text-deep-black font-bold h-12 text-lg uppercase tracking-wider hover:bg-gold/90"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Validar e Contabilizar'}
          </Button>
          <DialogClose asChild>
             <Button variant="ghost" className="w-full text-muted-foreground hover:text-ice-white">Cancelar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


'use client';

import { useState, useEffect } from 'react';
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

  const MASTER_PIN = '2277';

  const handleConfirm = async () => {
    if (pin !== MASTER_PIN) {
      toast({ variant: 'destructive', title: 'PIN inválido', description: 'O PIN do barbeiro está incorreto.' });
      setPin('');
      return;
    }

    setLoading(true);

    try {
      const batch = writeBatch(firestore);
      const nowTimestamp = serverTimestamp();
      const userDocRef = doc(firestore, 'users', clientPhone);
      
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

      const limitedSpinsQuery = query(collection(firestore, "limitedSpins"), where('userId', '==', clientPhone), where('status', '==', 'active'));
      const lsSnapshot = await getDocs(limitedSpinsQuery);
      lsSnapshot.docs.forEach(lsDoc => {
        const expiresAt = (lsDoc.data().expiresAt as Timestamp).toDate();
        if (isAfter(expiresAt, new Date())) {
          batch.update(lsDoc.ref, { status: 'used', usedAt: nowTimestamp });
          const extraSpinRef = doc(collection(firestore, 'spins'));
          batch.set(extraSpinRef, { userId: clientPhone, status: 'available', origin: 'giro_extra_convertido', createdAt: nowTimestamp });
          spinsEarned++;
        }
      });

      const cutRef = doc(collection(firestore, "cuts"));
      batch.set(cutRef, { userId: clientPhone, barberId: 'admin_master', confirmed: true, date: nowTimestamp });

      batch.update(userDocRef, userUpdates);
      await batch.commit();

      setSuccessData({ cortesAtuais: newCortesAtuais, spinsEarned });
      setShowSuccess(true);
      toast({ title: 'Corte confirmado!', description: 'Progresso atualizado.' });

    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erro na validação', description: error.message });
      setPin('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pin.length === 4 && !loading && !showSuccess) {
      handleConfirm();
    }
  }, [pin]);

  const handleClose = () => {
    setPin('');
    setShowSuccess(false);
    onClose();
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="bg-dark-gray border-gold/20 text-center">
          {successData && successData.spinsEarned > 0 && <ReactConfetti width={width} height={height} recycle={false} numberOfPieces={200} />}
          <DialogHeader>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <DialogTitle className="text-2xl text-gold uppercase">Corte Confirmado!</DialogTitle>
          </DialogHeader>
          <div className="py-6 bg-deep-black rounded-lg border border-gold/10">
            <p className="text-sm text-muted-foreground">Progresso</p>
            <p className="text-4xl font-bold text-gold">{successData?.cortesAtuais} / 5</p>
            {successData && successData.spinsEarned > 0 && (
              <p className="mt-2 text-green-400 font-bold flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4" /> +{successData.spinsEarned} Giro(s) Ganho(s)!
              </p>
            )}
          </div>
          <Button onClick={handleClose} className="w-full bg-gold text-deep-black font-bold h-12">Fechar</Button>
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
          <DialogDescription>O barbeiro deve digitar o PIN para validar.</DialogDescription>
        </DialogHeader>
        <div className="py-8 flex flex-col items-center gap-4">
          <Input
            type="password"
            inputMode="numeric"
            placeholder="****"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
            className="bg-deep-black border-gold/30 text-center text-3xl h-16 w-48 tracking-widest font-bold"
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={loading || pin.length < 4} className="w-full bg-gold text-deep-black font-bold h-12">
            {loading ? <Loader2 className="animate-spin" /> : 'Validar Corte'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

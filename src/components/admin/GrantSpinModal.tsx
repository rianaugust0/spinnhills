
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Gift } from 'lucide-react';
import { initializeFirebase } from '@/firebase';
import { doc, runTransaction, collection, serverTimestamp, getDocs, query, where } from 'firebase/firestore';

const { firestore } = initializeFirebase();

interface GrantSpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: { id: string; name: string; girosDisponiveis: number; };
  onSpinGranted: (newSpinCount: number) => void;
}

type SpinOrigin = 'indicacao' | 'instagram_avaliacao';

export function GrantSpinModal({ isOpen, onClose, client, onSpinGranted }: GrantSpinModalProps) {
  const { toast } = useToast();
  const [origin, setOrigin] = useState<SpinOrigin | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!origin) {
      toast({ variant: 'destructive', title: 'Selecione uma origem para o giro.' });
      return;
    }
    
    const barberPin = sessionStorage.getItem('barber-pin');
    if (!barberPin) {
        toast({ variant: 'destructive', title: 'Sessão do barbeiro expirada.', description: 'Faça o login novamente.' });
        return;
    }

    setLoading(true);

    try {
        const barbersQuery = query(collection(firestore, 'barbers'), where('pin', '==', barberPin));
        const barberSnapshot = await getDocs(barbersQuery);
        if (barberSnapshot.empty) {
            throw new Error('PIN do barbeiro inválido ou inativo.');
        }
        const barberId = barberSnapshot.docs[0].id;
        const userDocRef = doc(firestore, 'users', client.id);

        const newSpinCount = await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw new Error('Cliente não encontrado.');
            }

            const newGiros = (userDoc.data().girosDisponiveis || 0) + 1;
            
            // Update user's spin count
            transaction.update(userDocRef, {
                girosDisponiveis: newGiros,
                updatedAt: serverTimestamp()
            });

            // Register the manual spin
            const spinRef = doc(collection(firestore, 'spins'));
            transaction.set(spinRef, {
                userId: client.id,
                origin: origin,
                manual: true,
                releasedBy: barberId,
                notes: notes,
                createdAt: serverTimestamp()
            });
            
            return newGiros;
        });

        toast({
            title: 'Giro liberado!',
            description: `${client.name} agora tem ${newSpinCount} giro(s) disponível(is).`
        });
        
        onSpinGranted(newSpinCount);
        handleClose();

    } catch (error: any) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erro ao liberar giro', description: error.message });
    } finally {
        setLoading(false);
    }
  };

  const handleClose = () => {
    setOrigin('');
    setNotes('');
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-dark-gray border-gold/20 text-ice-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl text-gold uppercase">
            <Gift /> Liberar Giro Manual
          </DialogTitle>
          <DialogDescription>
            Conceda um giro para <strong className='text-gold'>{client.name.split(' ')[0]}</strong> por uma ação específica.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <Select onValueChange={(value: SpinOrigin) => setOrigin(value)} value={origin}>
                <SelectTrigger className="w-full h-12 bg-deep-black border-gold/30">
                    <SelectValue placeholder="Selecione a origem do giro..." />
                </SelectTrigger>
                <SelectContent className='bg-dark-gray border-gold/20 text-ice-white'>
                    <SelectItem value="indicacao">Indicação de novo cliente</SelectItem>
                    <SelectItem value="instagram_avaliacao">Seguiu no Insta / Avaliou no Google</SelectItem>
                </SelectContent>
            </Select>
             <Textarea 
                placeholder="Observação (opcional)... Ex: Indicou o cliente João" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-deep-black border-gold/30"
            />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={loading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={loading || !origin}>
            {loading ? <Loader2 className="animate-spin" /> : 'Confirmar e Liberar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

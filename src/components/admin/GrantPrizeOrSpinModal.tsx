
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FerrisWheel } from 'lucide-react';
import { initializeFirebase } from '@/firebase';
import { doc, collection, serverTimestamp, getDocs, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { allOutcomes as prizeOptions, PrizeOption } from '@/lib/prizes';
import type { ClientData } from '@/app/admin/confirmar-corte/page';

const { firestore } = initializeFirebase();

interface GrantPrizeOrSpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientData;
  onClientUpdate: (updatedData: Partial<ClientData>) => void;
}


export function GrantPrizeOrSpinModal({ isOpen, onClose, client, onClientUpdate }: GrantPrizeOrSpinModalProps) {
  const { toast } = useToast();
  const [selectedPrizeType, setSelectedPrizeType] = useState<PrizeOption['type'] | ''>('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const barberPin = sessionStorage.getItem('barber-pin');
    if (!barberPin) {
        toast({ variant: 'destructive', title: 'Sessão do barbeiro expirada.', description: 'Faça o login novamente.' });
        return;
    }
    if (!selectedPrizeType) {
        toast({ variant: 'destructive', title: 'Selecione o resultado do giro.' });
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
        
        const prizeToGrant = prizeOptions.find(p => p.type === selectedPrizeType);
        if (!prizeToGrant) throw new Error('Prêmio selecionado inválido.');

        // Handle "try_again" case - just log it for history, no prize for user
        if (prizeToGrant.type === 'try_again') {
             addDoc(collection(firestore, 'spins'), {
                userId: client.id,
                origin: 'roleta_fisica',
                result: 'try_again',
                manual: true,
                releasedBy: barberId,
                notes: `Resultado do giro físico: ${prizeToGrant.title}`,
                createdAt: serverTimestamp()
            });
             toast({ title: 'Registro Salvo', description: 'O resultado "Tente Novamente" foi registrado no histórico do cliente.' });
        }
        // Handle "limited_spin" (Giro Extra)
        else if (prizeToGrant.type === 'giro_extra') {
             const expirationDate = new Date();
             expirationDate.setDate(expirationDate.getDate() + prizeToGrant.validityDays);
            
             addDocumentNonBlocking(collection(firestore, 'limitedSpins'), {
                userId: client.id,
                type: "extra_spin",
                status: "active",
                condition: "valid_only_with_haircut",
                createdAt: serverTimestamp(),
                expiresAt: expirationDate,
                usedAt: null,
                usedByBarberId: null,
                grantedBy: barberId,
                origin: 'roleta_fisica',
                notes,
             });
             toast({ title: 'Giro Extra Adicionado!', description: `${client.name} tem ${prizeToGrant.validityDays} dias para cortar o cabelo e ativar o giro.` });
        }
        // Handle normal prizes
        else {
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + prizeToGrant.validityDays);

            addDocumentNonBlocking(collection(firestore, 'prizes'), {
                userId: client.id,
                userName: client.name,
                userPhone: client.id, // client.id is the phone number
                type: prizeToGrant.type,
                title: prizeToGrant.title,
                description: prizeToGrant.description,
                imageUrl: prizeToGrant.imageUrl,
                status: 'active',
                validityDays: prizeToGrant.validityDays,
                createdAt: serverTimestamp(),
                expiresAt: expirationDate,
                grantedBy: barberId,
                origin: 'roleta_fisica',
                notes: notes,
            });
            toast({ title: 'Prêmio Registrado!', description: `"${prizeToGrant.title}" foi adicionado aos prêmios de ${client.name.split(' ')[0]}.` });
        }
        
        handleClose();

    } catch (error: any) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erro ao registrar', description: error.message });
    } finally {
        setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPrizeType('');
    setNotes('');
    onClose();
  }
  
  const selectedPrize = prizeOptions.find(p => p.type === selectedPrizeType);
  let validityText = '';
  if (selectedPrize && selectedPrize.type !== 'try_again') {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + selectedPrize.validityDays);
      validityText = `Válido até ${expirationDate.toLocaleDateString('pt-BR')}`;
  }


  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-dark-gray border-gold/20 text-ice-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl text-gold uppercase">
            <FerrisWheel /> Registrar Giro Físico
          </DialogTitle>
          <DialogDescription>
            Selecione o prêmio que <strong className='text-gold'>{client.name.split(' ')[0]}</strong> tirou na roleta física.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className='space-y-2'>
              <label className='text-sm font-medium text-muted-foreground'>Prêmio Sorteado</label>
              <Select onValueChange={(value: PrizeOption['type']) => setSelectedPrizeType(value)}>
                  <SelectTrigger className="w-full h-12 bg-deep-black border-gold/30">
                      <SelectValue placeholder="Selecione o prêmio da roleta..." />
                  </SelectTrigger>
                  <SelectContent className='bg-dark-gray border-gold/20 text-ice-white'>
                      {prizeOptions.map(prize => (
                          <SelectItem key={prize.type} value={prize.type}>{prize.title}</SelectItem>
                      ))}
                  </SelectContent>
              </Select>
               {validityText && <p className='text-xs text-muted-foreground text-center pt-1'>{validityText}</p>}
          </div>
            
          <div className='space-y-2'>
               <label className='text-sm font-medium text-muted-foreground'>Observações (Opcional)</label>
              <Textarea 
                  placeholder="Ex: Cliente estava muito feliz, etc." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="bg-deep-black border-gold/30"
              />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary" disabled={loading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={loading || !selectedPrizeType}>
            {loading ? <Loader2 className="animate-spin" /> : 'Confirmar Registro'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

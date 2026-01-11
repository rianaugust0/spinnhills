
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Gift } from 'lucide-react';
import { initializeFirebase } from '@/firebase';
import { doc, collection, serverTimestamp, getDocs, query, where, addDoc, updateDoc } from 'firebase/firestore';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { grantablePrizes, PrizeOption } from '@/lib/prizes';
import type { ClientData } from '@/app/admin/confirmar-corte/page';

const { firestore } = initializeFirebase();

interface GrantPrizeOrSpinModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientData;
  onClientUpdate: (updatedData: Partial<ClientData>) => void;
}

type GrantType = 'spin' | 'prize' | 'limited_spin';
type PrizeOrigin = 'roleta_fisica' | 'indicacao' | 'cortesia' | 'outro';

export function GrantPrizeOrSpinModal({ isOpen, onClose, client, onClientUpdate }: GrantPrizeOrSpinModalProps) {
  const { toast } = useToast();
  const [grantType, setGrantType] = useState<GrantType>('spin');
  const [selectedPrizeType, setSelectedPrizeType] = useState<PrizeOption['type'] | ''>('');
  const [origin, setOrigin] = useState<PrizeOrigin>('roleta_fisica');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    const barberPin = sessionStorage.getItem('barber-pin');
    if (!barberPin) {
        toast({ variant: 'destructive', title: 'Sessão do barbeiro expirada.', description: 'Faça o login novamente.' });
        return;
    }
    if (grantType === 'prize' && !selectedPrizeType) {
        toast({ variant: 'destructive', title: 'Selecione um prêmio para liberar.' });
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

        if (grantType === 'spin') {
            const newSpinCount = client.girosDisponiveis + 1;
            // Optimistic UI Update
            onClientUpdate({ girosDisponiveis: newSpinCount });
            toast({ title: 'Giro liberado!', description: `${client.name} agora tem ${newSpinCount} giro(s).` });
            
            // Non-blocking Firestore updates
            updateDoc(userDocRef, {
                girosDisponiveis: newSpinCount,
                updatedAt: serverTimestamp()
            });
            addDoc(collection(firestore, 'spins'), {
                userId: client.id,
                origin: origin,
                manual: true,
                releasedBy: barberId,
                notes,
                createdAt: serverTimestamp()
            });
        } else if (grantType === 'prize') {
            const prizeToGrant = grantablePrizes.find(p => p.type === selectedPrizeType);
            if (!prizeToGrant) throw new Error('Prêmio selecionado inválido.');

            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + prizeToGrant.validityDays);

            // Optimistic UI Update
            toast({ title: 'Prêmio liberado!', description: `"${prizeToGrant.title}" foi adicionado aos prêmios de ${client.name.split(' ')[0]}.` });
            
            // Non-blocking Firestore updates
            addDocumentNonBlocking(collection(firestore, 'prizes'), {
                userId: client.id,
                userName: client.name,
                userPhone: client.id,
                type: prizeToGrant.type,
                title: prizeToGrant.title,
                description: prizeToGrant.description,
                imageUrl: prizeToGrant.imageUrl,
                status: 'active',
                validityDays: prizeToGrant.validityDays,
                createdAt: serverTimestamp(),
                expiresAt: expirationDate,
                grantedBy: barberId,
                origin: origin,
                notes: notes,
            });
        } else if (grantType === 'limited_spin') {
             const expirationDate = new Date();
             expirationDate.setDate(expirationDate.getDate() + 10);
            
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
                origin: origin,
                notes,
             });
             toast({ title: 'Giro Limitado Adicionado!', description: `${client.name} tem 10 dias para cortar o cabelo e ganhar um giro.` });
        }
        
        handleClose();

    } catch (error: any) {
        console.error(error);
        toast({ variant: 'destructive', title: 'Erro ao liberar', description: error.message });
    } finally {
        setLoading(false);
    }
  };

  const handleClose = () => {
    setGrantType('spin');
    setSelectedPrizeType('');
    setOrigin('roleta_fisica');
    setNotes('');
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-dark-gray border-gold/20 text-ice-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl text-gold uppercase">
            <Gift /> Adicionar Benefício
          </DialogTitle>
          <DialogDescription>
            Para <strong className='text-gold'>{client.name.split(' ')[0]}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
            <RadioGroup defaultValue="spin" value={grantType} onValueChange={(value: GrantType) => setGrantType(value)}>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="spin" id="r1" />
                    <Label htmlFor="r1">Liberar 1 giro normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="prize" id="r2" />
                    <Label htmlFor="r2">Liberar prêmio direto</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="limited_spin" id="r3" />
                    <Label htmlFor="r3">Adicionar giro limitado (10 dias)</Label>
                </div>
            </RadioGroup>

            {grantType === 'prize' && (
                <div className='space-y-4 animate-fade-in-up border-t border-gold/10 pt-4'>
                    <Select onValueChange={(value: PrizeOption['type']) => setSelectedPrizeType(value)}>
                        <SelectTrigger className="w-full h-12 bg-deep-black border-gold/30">
                            <SelectValue placeholder="Selecione o prêmio..." />
                        </SelectTrigger>
                        <SelectContent className='bg-dark-gray border-gold/20 text-ice-white'>
                            {grantablePrizes.map(prize => (
                                <SelectItem key={prize.type} value={prize.type}>{prize.title}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
            
            <div className='space-y-4 border-t border-gold/10 pt-4'>
                 <Select defaultValue='roleta_fisica' onValueChange={(value: PrizeOrigin) => setOrigin(value)}>
                    <SelectTrigger className="w-full h-12 bg-deep-black border-gold/30">
                        <SelectValue placeholder="Origem..." />
                    </SelectTrigger>
                    <SelectContent className='bg-dark-gray border-gold/20 text-ice-white'>
                        <SelectItem value="roleta_fisica">Roleta Física</SelectItem>
                        <SelectItem value="indicacao">Indicação</SelectItem>
                        <SelectItem value="cortesia">Cortesia</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                </Select>
                <Textarea 
                    placeholder="Observação (opcional)... Ex: Indicou o cliente João" 
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
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : 'Confirmar Liberação'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    
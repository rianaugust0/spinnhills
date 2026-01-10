
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, User, Scissors, CheckCircle, FerrisWheel, Gift } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { initializeFirebase } from '@/firebase';
import { GrantSpinModal } from '@/components/admin/GrantSpinModal';
import {
  doc,
  getDoc,
  runTransaction,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  addDoc,
} from 'firebase/firestore';

const { firestore } = initializeFirebase();

type ClientData = {
    id: string;
    name: string;
    cortesAtuais: number;
    girosDisponiveis: number;
}

export default function ConfirmarCortePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<ClientData | null>(null);
  const [step, setStep] = useState<'findClient' | 'confirmCut' | 'success'>('findClient');
  const [isGrantSpinModalOpen, setIsGrantSpinModalOpen] = useState(false);

  const handleFindClient = async () => {
    const sanitizedPhone = phone.replace(/\D/g, '');
    if (sanitizedPhone.length < 10) {
      toast({ variant: 'destructive', title: 'Telefone inválido' });
      return;
    }
    setLoading(true);
    try {
      const userDocRef = doc(firestore, 'users', sanitizedPhone);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setClient({
            id: userDoc.id,
            name: userData.name,
            cortesAtuais: userData.cortesAtuais,
            girosDisponiveis: userData.girosDisponiveis
        });
        setStep('confirmCut');
      } else {
        toast({ variant: 'destructive', title: 'Cliente não encontrado' });
        setClient(null);
      }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erro ao buscar cliente' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCut = async () => {
     if (pin.length < 4) {
      toast({ variant: 'destructive', title: 'PIN inválido' });
      return;
    }
    if (!client) return;

    setLoading(true);

    try {
        const barbersQuery = query(collection(firestore, 'barbers'), where('pin', '==', pin));
        const barberSnapshot = await getDocs(barbersQuery);

        if (barberSnapshot.empty) {
            throw new Error('PIN do barbeiro inválido ou inativo.');
        }
        const barberId = barberSnapshot.docs[0].id;

        const userDocRef = doc(firestore, 'users', client.id);

        const { newSpins, cortesAtuais } = await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw new Error('Usuário não encontrado.');
            }

            const currentData = userDoc.data();
            let newCortesAtuais = (currentData.cortesAtuais || 0) + 1;
            let newGirosDisponiveis = currentData.girosDisponiveis || 0;
            let spinGranted = false;

            if (newCortesAtuais >= 5) {
                newCortesAtuais = 0;
                newGirosDisponiveis += 1;
                spinGranted = true;
            }

            transaction.update(userDocRef, {
                cortesAtuais: newCortesAtuais,
                totalCortes: (currentData.totalCortes || 0) + 1,
                girosDisponiveis: newGirosDisponiveis,
                updatedAt: serverTimestamp(),
            });

            // Register the cut
            const cutRef = doc(collection(firestore, "cuts"));
            transaction.set(cutRef, {
                userId: client.id,
                barberId: barberId,
                pinUsed: pin,
                confirmed: true,
                date: serverTimestamp()
            });
            
            // Register the spin if granted
            if (spinGranted) {
                const spinRef = doc(collection(firestore, "spins"));
                transaction.set(spinRef, {
                    userId: client.id,
                    origin: 'fidelidade_5_cortes',
                    manual: false,
                    releasedBy: null,
                    notes: null,
                    createdAt: serverTimestamp()
                });
            }

            return { newSpins: newGirosDisponiveis, cortesAtuais: newCortesAtuais };
        });

        setStep('success');
        setClient(prev => prev ? {...prev, cortesAtuais, girosDisponiveis: newSpins } : null);

        toast({
            title: 'Corte confirmado!',
            description: `O progresso de ${client.name.split(' ')[0]} foi atualizado.`,
        });

        if (newSpins > client.girosDisponiveis) {
             toast({
                title: 'Parabéns! 🎡',
                description: `${client.name.split(' ')[0]} ganhou +1 giro no SPIN HILLS!`,
                duration: 5000,
            });
        }


    } catch (error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Falha na confirmação',
            description: error.message || 'Não foi possível confirmar o corte.',
        });
    } finally {
        setLoading(false);
    }
  }

  const handleManualSpinGranted = (newSpinCount: number) => {
    if (client) {
      setClient({ ...client, girosDisponiveis: newSpinCount });
    }
  };
  
  if (step === 'success') {
       return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
            <div className='animate-fade-in-up'>
                <CheckCircle className="h-24 w-24 text-green-500 mx-auto animate-pulse" />
                <h1 className="font-headline text-4xl text-gold uppercase tracking-widest mt-4">Corte Confirmado!</h1>
                <p className='text-ice-white text-lg mt-2'>O progresso de {client?.name.split(' ')[0]} foi atualizado.</p>
                 <div className='mt-4 text-ice-white/80'>
                    <p>Novo Progresso: <span className='font-bold text-gold'>{client?.cortesAtuais}/5</span></p>
                    <p>Giros Disponíveis: <span className='font-bold text-gold'>{client?.girosDisponiveis}</span></p>
                 </div>
                <Button onClick={() => {
                    setStep('findClient');
                    setClient(null);
                    setPhone('');
                    setPin('');
                }} className='mt-8 w-full max-w-sm'>Confirmar Outro Corte</Button>
                 <Button variant="ghost" onClick={() => router.push('/admin')} className='mt-2 w-full max-w-sm'>Voltar para o Menu</Button>
            </div>
        </div>
      )
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      {client && <GrantSpinModal 
        isOpen={isGrantSpinModalOpen}
        onClose={() => setIsGrantSpinModalOpen(false)}
        client={client}
        onSpinGranted={handleManualSpinGranted}
      />}
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-gold" />
        </Button>
         <h1 className="font-headline text-xl text-ice-white uppercase">Ações do Cliente</h1>
         <div></div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 pb-8">
        {step === 'findClient' ? (
            <Card className="w-full max-w-sm bg-dark-gray border-gold/20 text-center animate-fade-in-up">
                <CardHeader>
                    <User className='h-12 w-12 mx-auto text-gold/50'/>
                    <CardTitle className="font-headline text-3xl text-gold uppercase">Identificar Cliente</CardTitle>
                    <CardDescription>Digite o telefone do cliente para buscar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        type="tel"
                        placeholder="Telefone do Cliente"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12"
                    />
                    <Button
                        onClick={handleFindClient}
                        disabled={loading || !phone}
                        className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
                        >
                        {loading ? <Loader2 className="animate-spin" /> : 'Buscar Cliente'}
                    </Button>
                </CardContent>
            </Card>
        ) : client && (
             <Card className="w-full max-w-sm bg-dark-gray border-gold/20 text-center animate-fade-in-up">
                <CardHeader>
                     <Scissors className='h-12 w-12 mx-auto text-gold/50'/>
                    <CardTitle className="font-headline text-3xl text-gold uppercase">Ações para <strong className='text-gold'>{client.name.split(' ')[0]}</strong></CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='p-2 bg-deep-black rounded-lg border border-gold/10'>
                            <p className='text-xs text-muted-foreground'>Progresso</p>
                            <p className='text-lg font-bold text-ice-white'>{client.cortesAtuais} / 5</p>
                        </div>
                        <div className='p-2 bg-deep-black rounded-lg border border-gold/10'>
                            <p className='text-xs text-muted-foreground'>Giros</p>
                            <p className='text-lg font-bold text-ice-white'>{client.girosDisponiveis}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2 p-4 border border-dashed border-gold/20 rounded-lg">
                        <h3 className='font-bold text-ice-white mb-2'>CONFIRMAR CORTE</h3>
                        <Input
                            type="password"
                            inputMode='numeric'
                            placeholder="Digite o PIN do barbeiro"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                            className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12 placeholder:text-muted-foreground/50"
                        />
                        <Button
                            onClick={handleConfirmCut}
                            disabled={loading || pin.length < 4}
                            className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Confirmar e Contabilizar'}
                        </Button>
                    </div>

                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsGrantSpinModalOpen(true)}
                        disabled={loading}
                        className="w-full text-gold border-gold/50 hover:bg-gold/10 hover:text-gold"
                      >
                        <Gift className="mr-2 h-4 w-4" />
                        Liberar Giro Manual
                      </Button>
                    </div>

                     <Button variant="link" onClick={() => {
                         setClient(null);
                         setPhone('');
                         setPin('');
                         setStep('findClient');
                     }} className='text-gold/80'>Buscar outro cliente</Button>
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}

    
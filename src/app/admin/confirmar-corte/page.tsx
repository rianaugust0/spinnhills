'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, User, Scissors, KeyRound, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { initializeFirebase } from '@/firebase';
import {
  doc,
  getDoc,
  runTransaction,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
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
        // 1. Validate barber PIN
        const barbersQuery = query(collection(firestore, 'barbers'), where('pin', '==', pin));
        const barberSnapshot = await getDocs(barbersQuery);

        if (barberSnapshot.empty) {
            throw new Error('PIN do barbeiro inválido ou inativo.');
        }
        const barberId = barberSnapshot.docs[0].id;

        // 2. Run transaction to update user cuts
        const userDocRef = doc(firestore, 'users', client.id);

        await runTransaction(firestore, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);
            if (!userDoc.exists()) {
                throw new Error('Usuário não encontrado.');
            }

            const currentData = userDoc.data();
            let cortesAtuais = (currentData.cortesAtuais || 0) + 1;
            let girosDisponiveis = currentData.girosDisponiveis || 0;
            let showConfetti = false;

            if (cortesAtuais >= 5) {
                cortesAtuais = 0;
                girosDisponiveis += 1;
                showConfetti = true;
            }

            transaction.update(userDocRef, {
                cortesAtuais: cortesAtuais,
                totalCortes: (currentData.totalCortes || 0) + 1,
                girosDisponiveis: girosDisponiveis,
                updatedAt: serverTimestamp(),
            });

            return { showConfetti, newSpins: girosDisponiveis };
        });

        setStep('success');
        toast({
            title: 'Corte confirmado!',
            description: `O progresso de ${client.name.split(' ')[0]} foi atualizado.`,
        });


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
  
  if (step === 'success') {
       return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
            <div className='animate-fade-in-up'>
                <CheckCircle className="h-24 w-24 text-green-500 mx-auto animate-pulse" />
                <h1 className="font-headline text-4xl text-gold uppercase tracking-widest mt-4">Corte Confirmado!</h1>
                <p className='text-ice-white text-lg mt-2'>O progresso de {client?.name.split(' ')[0]} foi atualizado.</p>
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
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-gold" />
        </Button>
         <h1 className="font-headline text-xl text-ice-white uppercase">Confirmar Corte</h1>
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
                    <CardTitle className="font-headline text-3xl text-gold uppercase">Confirmar Corte</CardTitle>
                    <CardDescription>Valide o corte para <strong className='text-gold'>{client.name}</strong>.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className='p-4 bg-deep-black rounded-lg border border-gold/10'>
                        <p className='text-muted-foreground'>Progresso Atual</p>
                        <p className='text-xl font-bold text-ice-white'>{client.cortesAtuais} / 5</p>
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="password"
                            inputMode='numeric'
                            placeholder="Seu PIN de Barbeiro"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                            className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold text-center text-2xl h-14 tracking-[1em]"
                        />
                        <Button
                            onClick={handleConfirmCut}
                            disabled={loading || pin.length < 4}
                            className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Confirmar e Contabilizar'}
                        </Button>
                         <Button variant="link" onClick={() => {
                             setClient(null);
                             setPhone('');
                             setStep('findClient');
                         }} className='text-gold/80'>Buscar outro cliente</Button>
                    </div>
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}

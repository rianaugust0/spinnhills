
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Roulette } from '@/components/spin/roulette';
import { initializeFirebase, useUser, useDoc } from '@/firebase';
import { doc, runTransaction, serverTimestamp } from 'firebase/firestore';
import { PrizeOption } from '@/lib/prizes';

// Initialize Firebase
const { firestore } = initializeFirebase();

export default function SpinPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading: isUserLoading } = useUser();
  const [clientPhone, setClientPhone] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [prizeWon, setPrizeWon] = useState<PrizeOption | null>(null);

  // Firestore document reference
  const userDocRef = useMemo(() => {
    if (!clientPhone) return null;
    return doc(firestore, 'users', clientPhone);
  }, [clientPhone]);

  const { data: clientData, isLoading: isClientLoading } = useDoc(userDocRef);

  useEffect(() => {
    const phoneFromStorage = localStorage.getItem('spin-hills-user-phone');
    if (!isUserLoading && !phoneFromStorage) {
      router.replace('/entrar');
    } else {
      setClientPhone(phoneFromStorage);
    }
  }, [isUserLoading, router]);

  const handleSpinFinish = async (prize: PrizeOption) => {
    if (!userDocRef || !clientPhone) return;

    try {
      await runTransaction(firestore, async (transaction) => {
        const userDoc = await transaction.get(userDocRef);
        if (!userDoc.exists() || userDoc.data().girosDisponiveis < 1) {
          throw new Error("Você não tem giros suficientes.");
        }

        // 1. Consume the spin
        transaction.update(userDocRef, {
          girosDisponiveis: userDoc.data().girosDisponiveis - 1,
          updatedAt: serverTimestamp(),
        });
        
        // 2. Add prize if it's not "try again"
        if (prize.nome !== 'Não foi dessa vez' && prize.validadeDias > 0) {
            const prizeDocRef = doc(collection(firestore, 'prizes'));
            const expirationDate = new Date();
            expirationDate.setDate(expirationDate.getDate() + prize.validadeDias);

            transaction.set(prizeDocRef, {
                userId: clientPhone,
                nome: prize.nome,
                tipo: prize.tipo,
                validadeDias: prize.validadeDias,
                dataGanho: serverTimestamp(),
                dataExpiracao: expirationDate,
                status: 'ativo',
            });
        }
      });
      
      setPrizeWon(prize);
      setSpinning(false);

    } catch (e: any) {
      console.error("Spin transaction failed: ", e);
      toast({
        variant: 'destructive',
        title: "Ops! Algo deu errado.",
        description: e.message || "Não foi possível completar o giro. Tente novamente.",
      });
      setSpinning(false);
    }
  };

  const isLoading = isUserLoading || isClientLoading;

  if (isLoading || !clientData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
      </div>
    );
  }

  if (clientData.girosDisponiveis === 0 && !prizeWon) {
    return(
         <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
             <Card className="bg-dark-gray border-gold/20 p-8">
                <CardTitle className='text-2xl text-gold'>Você não tem giros!</CardTitle>
                <CardDescription className='mt-2'>Complete tarefas no dashboard para ganhar mais giros.</CardDescription>
                <Button onClick={() => router.push('/dashboard')} className='mt-6 w-full'>Voltar ao Dashboard</Button>
             </Card>
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-gold" />
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 py-8 space-y-8 text-center">
        {prizeWon ? (
           <div className='animate-fade-in-up'>
              <Card className="bg-dark-gray border-gold/20 p-8 shadow-gold-glow">
                <CardHeader>
                    {prizeWon.nome !== 'Não foi dessa vez' ? (
                        <>
                            <PartyPopper className='h-16 w-16 text-gold mx-auto animate-bounce'/>
                            <CardTitle className='text-3xl text-gold mt-4'>Parabéns!</CardTitle>
                            <CardDescription className='text-xl text-ice-white mt-2'>Você ganhou</CardDescription>
                            <p className='text-4xl font-bold text-gold font-headline tracking-wider'>{prizeWon.nome}</p>
                        </>
                    ) : (
                         <>
                            <CardTitle className='text-3xl'>Quase!</CardTitle>
                            <CardDescription className='text-xl mt-2'>Não foi dessa vez, mas o próximo giro pode ser o da sorte!</CardDescription>
                        </>
                    )}
                </CardHeader>
                <CardContent>
                     <Button onClick={() => router.push('/dashboard')} className='mt-6 w-full'>Ir para meus prêmios</Button>
                </CardContent>
             </Card>
           </div>
        ) : (
          <>
            <h1 className="font-headline text-5xl text-gold uppercase tracking-wider">Gire a Roleta!</h1>
            <p className="text-muted-foreground">Você tem <span className='font-bold text-ice-white'>{clientData.girosDisponiveis}</span> giro{clientData.girosDisponiveis > 1 ? 's' : ''}. Boa sorte!</p>
            <Roulette onSpinFinish={handleSpinFinish} spinning={spinning} />
          </>
        )}
      </main>
    </div>
  );
}

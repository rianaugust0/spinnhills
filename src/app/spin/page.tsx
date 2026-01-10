
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Roulette } from '@/components/spin/roulette';
import { initializeFirebase, useDoc } from '@/firebase';
import { doc, runTransaction, serverTimestamp, collection, addDoc } from 'firebase/firestore';
import { PrizeOption } from '@/lib/prizes';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';


// Initialize Firebase
const { firestore } = initializeFirebase();

export default function SpinPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { width, height } = useWindowSize();
  const [clientPhone, setClientPhone] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [prizeWon, setPrizeWon] = useState<PrizeOption | null>(null);
  const [mustSpin, setMustSpin] = useState(false);

  // Firestore document reference
  const userDocRef = useMemo(() => {
    if (!clientPhone) return null;
    return doc(firestore, 'users', clientPhone);
  }, [clientPhone]);

  const { data: clientData, isLoading: isClientLoading } = useDoc(userDocRef);

  useEffect(() => {
    const phoneFromStorage = localStorage.getItem('spin-hills-user-phone');
    if (!phoneFromStorage) {
      router.replace('/entrar');
    } else {
      setClientPhone(phoneFromStorage);
    }
  }, [router]);

  const startSpin = () => {
    if (clientData?.girosDisponiveis > 0 && !isSpinning) {
        setIsSpinning(true);
        setMustSpin(true);
    } else {
        toast({
            variant: 'destructive',
            title: 'Sem giros disponíveis',
            description: 'Você precisa de giros para jogar. Complete tarefas para ganhar mais!'
        })
    }
  }

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
            if (prize.type !== 'try_again') {
                const prizeSubcollectionRef = collection(firestore, 'users', clientPhone, 'prizes');
                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + prize.validityDays);

                // Use addDoc within transaction context
                const newPrizeRef = doc(prizeSubcollectionRef);
                transaction.set(newPrizeRef, {
                    userId: clientPhone,
                    type: prize.type,
                    title: prize.title,
                    description: prize.description,
                    imageUrl: prize.imageUrl,
                    status: 'active',
                    validityDays: prize.validityDays,
                    createdAt: serverTimestamp(),
                    expiresAt: expirationDate,
                    usedAt: null,
                    usedByBarberId: null,
                });
            }
        });
      
      setPrizeWon(prize);
      setIsSpinning(false);
      setMustSpin(false);

    } catch (e: any) {
      console.error("Spin transaction failed: ", e);
      toast({
        variant: 'destructive',
        title: "Ops! Algo deu errado.",
        description: e.message || "Não foi possível completar o giro. Tente novamente.",
      });
      setIsSpinning(false);
      setMustSpin(false);
    }
  };

  const isLoading = isClientLoading;

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
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white overflow-hidden">
        {prizeWon && prizeWon.type !== 'try_again' && <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />}
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
                    {prizeWon.type !== 'try_again' ? (
                        <>
                            <PartyPopper className='h-16 w-16 text-gold mx-auto animate-bounce'/>
                            <CardTitle className='text-3xl text-gold mt-4'>Parabéns!</CardTitle>
                            <CardDescription className='text-xl text-ice-white mt-2'>Você ganhou</CardDescription>
                            <p className='text-4xl font-bold text-gold font-headline tracking-wider'>{prizeWon.title}</p>
                        </>
                    ) : (
                         <>
                            <CardTitle className='text-3xl'>Quase!</CardTitle>
                            <CardDescription className='text-xl mt-2'>Não foi dessa vez, mas o próximo giro pode ser o da sorte!</CardDescription>
                        </>
                    )}
                </CardHeader>
                <CardContent>
                     <Button onClick={() => router.push('/dashboard')} className='mt-6 w-full'>Voltar para o Início</Button>
                </CardContent>
             </Card>
           </div>
        ) : (
          <>
            <h1 className="font-headline text-5xl text-gold uppercase tracking-wider">Gire a Roleta!</h1>
            <p className="text-muted-foreground">Você tem <span className='font-bold text-ice-white'>{clientData.girosDisponiveis}</span> giro{clientData.girosDisponiveis > 1 ? 's' : ''}. Boa sorte!</p>
            <Roulette 
              mustSpin={mustSpin}
              onStopSpinning={() => setMustSpin(false)}
              onPrizeDefined={handleSpinFinish} 
              startSpinning={startSpin}
              isSpinning={isSpinning}
            />
          </>
        )}
      </main>
    </div>
  );
}

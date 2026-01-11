
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { initializeFirebase, useDoc } from '@/firebase';
import { doc, serverTimestamp, collection } from 'firebase/firestore';
import { PrizeOption, allOutcomes } from '@/lib/prizes';
import { useWindowSize } from 'react-use';
import dynamic from 'next/dynamic';
import { updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// Dynamically import heavy components
const Roulette = dynamic(() => import('@/components/spin/roulette').then(mod => mod.Roulette), {
  loading: () => <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] flex items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-gold" /></div>,
  ssr: false
});

const Confetti = dynamic(() => import('react-confetti'), { ssr: false });


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

  const { data: clientData, isLoading: isClientLoading, setData: setClientData } = useDoc(userDocRef);

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
        setMustSpin(true);
        setIsSpinning(true);
    } else {
        toast({
            variant: 'destructive',
            title: 'Sem giros disponíveis',
            description: 'Você precisa de giros para jogar. Complete tarefas para ganhar mais!'
        })
    }
  }

  const handleSpinFinish = (prize: PrizeOption) => {
    if (!userDocRef || !clientPhone || !clientData) return;

    // Optimistic UI update
    setClientData(prev => prev ? { ...prev, girosDisponiveis: prev.girosDisponiveis - 1 } : null);
    setPrizeWon(prize);
    setIsSpinning(false);
    setMustSpin(false);

    // Non-blocking Firestore updates
    updateDocumentNonBlocking(userDocRef, {
      girosDisponiveis: clientData.girosDisponiveis - 1,
      updatedAt: serverTimestamp(),
    });
    
    if (prize.type !== 'try_again') {
        const prizeCollectionRef = collection(firestore, 'prizes');
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + prize.validityDays);

        const newPrizeData = {
            userId: clientPhone,
            userName: clientData.name,
            userPhone: clientData.id, // Assuming phone is ID
            type: prize.type,
            title: prize.title,
            description: prize.description,
            imageUrl: prize.imageUrl,
            status: 'active',
            validityDays: prize.validityDays,
            createdAt: serverTimestamp(),
            expiresAt: expirationDate,
            origin: 'roleta_digital',
        };
        addDocumentNonBlocking(prizeCollectionRef, newPrizeData);
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

  if (clientData.girosDisponiveis <= 0 && !isSpinning && !prizeWon) {
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
            <p className="text-muted-foreground">Você tem <span className='font-bold text-ice-white'>{clientData.girosDisponiveis}</span> giro{clientData.girosDisponiveis !== 1 ? 's' : ''}. Boa sorte!</p>
            <Roulette 
              mustSpin={mustSpin}
              onStopSpinning={() => {
                 setIsSpinning(false);
              }}
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

    

'use client';

import { useEffect, useState, useMemo } from 'react';
import { Loader2, LogOut, FerrisWheel, Sparkles, Gift, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { initializeFirebase, useDoc, useCollection } from '@/firebase';
import { doc, collection, query, where, Timestamp } from 'firebase/firestore';
import { isAfter, differenceInDays } from 'date-fns';
import { UserDashboardTabs } from '@/components/dashboard/UserDashboardTabs';
import { WhatsappIcon } from '@/components/ui/WhatsappIcon';

const { firestore } = initializeFirebase();

export default function DashboardPage() {
  const router = useRouter();
  const [clientPhone, setClientPhone] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const phoneFromStorage = localStorage.getItem('spin-hills-user-phone');
    if (!phoneFromStorage) {
      router.replace('/entrar');
    } else {
      setClientPhone(phoneFromStorage);
      setInitialLoading(false);
    }
  }, [router]);

  const userDocRef = useMemo(() => {
    if (!firestore || !clientPhone) return null;
    return doc(firestore, 'users', clientPhone);
  }, [clientPhone, firestore]);

  const { data: clientData, isLoading: isClientLoading } = useDoc(userDocRef);

  const prizesQuery = useMemo(() => {
    if (!firestore || !clientPhone) return null;
    return query(
      collection(firestore, 'prizes'),
      where('userId', '==', clientPhone),
      where('status', '==', 'active')
    );
  }, [clientPhone, firestore]);
  
  const { data: activePrizesData, isLoading: isPrizesLoading } = useCollection(prizesQuery);

  const activePrizes = useMemo(() => {
    if (!activePrizesData) return [];
    const today = new Date();
    return activePrizesData.filter(prize => {
        const expiresAtDate = prize.expiresAt instanceof Timestamp ? prize.expiresAt.toDate() : prize.expiresAt;
        return isAfter(expiresAtDate, today) || differenceInDays(expiresAtDate, today) >= 0;
    }).sort((a, b) => {
        const dateA = a.expiresAt instanceof Timestamp ? a.expiresAt.toDate() : a.expiresAt;
        const dateB = b.expiresAt instanceof Timestamp ? b.expiresAt.toDate() : b.expiresAt;
        return dateA.getTime() - dateB.getTime();
    });
  }, [activePrizesData]);
  
  const limitedSpinsQuery = useMemo(() => {
      if (!firestore || !clientPhone) return null;
      return query(
          collection(firestore, 'limitedSpins'),
          where('userId', '==', clientPhone),
          where('status', '==', 'active')
      );
  }, [clientPhone, firestore]);

  const { data: limitedSpinsData, isLoading: isLimitedSpinsLoading } = useCollection(limitedSpinsQuery);
  
  const activeLimitedSpin = useMemo(() => {
      if (!limitedSpinsData || limitedSpinsData.length === 0) return null;
      const today = new Date();
      const activeSpin = limitedSpinsData.find(spin => {
        const expiresAtDate = spin.expiresAt instanceof Timestamp ? spin.expiresAt.toDate() : new Date(spin.expiresAt);
        return isAfter(expiresAtDate, today) || differenceInDays(expiresAtDate, today) >= 0;
      });
      return activeSpin || null;
  }, [limitedSpinsData]);


  const handleLogout = () => {
    localStorage.removeItem('spin-hills-user-phone');
    router.push('/');
  };

  const isLoading = initialLoading || isClientLoading || isPrizesLoading || isLimitedSpinsLoading;

  if (isLoading || !clientData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
      </div>
    );
  }

  const progressPercentage = (clientData.cortesAtuais / 5) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      <header className="p-4 flex justify-between items-center border-b border-gold/20">
        <div>
          <h1 className="font-headline text-xl text-ice-white uppercase">Fala, {clientData.name?.split(' ')[0]} 👋</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sair">
          <LogOut className="h-5 w-5 text-gold/80 hover:text-gold" />
        </Button>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-6 md:space-y-8 animate-fade-in-up">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <Card className="bg-dark-gray border-gold/20 text-center shadow-lg shadow-gold-glow">
            <CardHeader>
                <CardTitle className="font-headline text-4xl text-gold uppercase tracking-wider flex items-center justify-center gap-3">
                <FerrisWheel className="h-10 w-10 animate-spin [animation-duration:10s]" />
                Spin Hills
                </CardTitle>
                <CardDescription>
                Giros disponíveis:
                <span className="text-5xl font-bold text-ice-white block mt-2">{clientData.girosDisponiveis}</span>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {clientData.girosDisponiveis > 0 ? (
                <Button onClick={() => router.push('/spin')} className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Girar agora!
                </Button>
                ) : (
                <Button disabled className="w-full bg-muted text-muted-foreground h-12 text-base">
                    Complete ações para liberar giros
                </Button>
                )}
            </CardContent>
            </Card>

            <Card className="bg-dark-gray border-gold/20">
                <CardHeader className="pb-4">
                    <CardTitle className="text-ice-white text-lg">✂️ Progresso para o próximo giro</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={progressPercentage} className="bg-deep-black h-3 [&>div]:bg-gold" />
                    <p className="text-center text-muted-foreground text-sm mt-3">
                    <span className="font-bold text-gold">{clientData.cortesAtuais} / 5</span> cortes confirmados
                    </p>
                    <p className="text-center text-xs text-muted-foreground/50 mt-2">Complete 5 cortes e ganhe 1 giro.</p>
                </CardContent>
            </Card>
        </div>


        <Card className="bg-dark-gray border-gold/20">
          <CardHeader className="text-center">
            <CardTitle className="text-ice-white text-lg flex items-center justify-center gap-2">
                <WhatsappIcon className='h-6 w-6' />
                Entre no Grupo Oficial
            </CardTitle>
            <CardDescription className='text-sm text-muted-foreground mt-1'>Fique por dentro de avisos, novidades, prêmios e benefícios exclusivos.</CardDescription>
          </CardHeader>
          <CardContent>
            <a 
                href="https://chat.whatsapp.com/GReZCTJDQbx1KxM9YrZji3" 
                target="_blank" 
                rel="noopener noreferrer"
                className='w-full'
            >
                <Button className="w-full bg-whatsapp text-white font-bold uppercase tracking-wider hover:bg-whatsapp/90 h-12 text-base">
                    <WhatsappIcon className='h-5 w-5 mr-2' />
                    Entrar no Grupo
                </Button>
            </a>
          </CardContent>
        </Card>

        <UserDashboardTabs 
            activePrizes={activePrizes}
            activeLimitedSpin={activeLimitedSpin}
        />
      </main>
    </div>
  );
}

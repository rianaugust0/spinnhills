
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Loader2, LogOut, Gift, FerrisWheel, Sparkles, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { initializeFirebase, useUser, useDoc, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';

// Initialize Firebase
const { firestore } = initializeFirebase();

interface Prize {
  id: string;
  nome: string;
  dataExpiracao: any;
  status: 'ativo' | 'utilizado' | 'expirado';
}

// Helper to calculate remaining days
const calculateRemainingDays = (expiryDate: any) => {
    if (!expiryDate || !expiryDate.toDate) return 0;
    const now = new Date();
    const expiry = expiryDate.toDate();
    const diffTime = expiry.getTime() - now.getTime();
    if (diffTime <= 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};


export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const [clientPhone, setClientPhone] = useState<string | null>(null);

  // Firestore document reference
  const userDocRef = useMemo(() => {
    if (!clientPhone) return null;
    // Assuming phone number is the document ID
    return doc(firestore, 'users', clientPhone);
  }, [clientPhone]);

  const { data: clientData, isLoading: isClientLoading } = useDoc(userDocRef);

  // Firestore collection reference for prizes
  const prizesQuery = useMemo(() => {
    if (!clientPhone) return null;
    return query(
      collection(firestore, 'prizes'),
      where('userId', '==', clientPhone),
      where('status', '==', 'ativo')
    );
  }, [clientPhone]);

  const { data: activePrizes, isLoading: isPrizesLoading } = useCollection(prizesQuery);

  useEffect(() => {
    const phoneFromStorage = localStorage.getItem('spin-hills-user-phone');
    if (!isUserLoading && !phoneFromStorage) {
      router.replace('/entrar');
    } else {
      setClientPhone(phoneFromStorage);
    }
  }, [isUserLoading, router]);

  const handleLogout = () => {
    localStorage.removeItem('spin-hills-user-phone');
    localStorage.removeItem('spin-hills-user-name');
    router.push('/');
  };

  const isLoading = isUserLoading || isClientLoading || isPrizesLoading;

  if (isLoading || !clientData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
      </div>
    );
  }

  const progressPercentage = (clientData.cortesAtuais / 5) * 100;
  const hasSpins = clientData.girosDisponiveis > 0;

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

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8 animate-fade-in-up">
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
            {hasSpins ? (
                 <Button onClick={() => router.push('/spin')} className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base">
                    <Sparkles className="mr-2"/>
                    Girar agora!
                 </Button>
            ) : (
                <Button disabled className="w-full bg-muted text-muted-foreground">
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

        <div>
          <h2 className="font-headline text-2xl text-ice-white uppercase mb-4">Seus Prêmios</h2>
          {activePrizes && activePrizes.length > 0 ? (
            <div className='grid gap-4'>
            {(activePrizes as Prize[]).map((prize) => {
              const remainingDays = calculateRemainingDays(prize.dataExpiracao);
              return (
                <Card key={prize.id} className="bg-dark-gray border-gold/30">
                  <CardHeader>
                    <CardTitle className='flex items-center gap-3 text-gold'>
                        <Gift/>
                        {prize.nome}
                    </CardTitle>
                     <CardDescription>
                        {remainingDays > 0 
                        ? `⏳ Válido por mais ${remainingDays} dia${remainingDays > 1 ? 's' : ''}`
                        : 'Prêmio expirado'}
                    </CardDescription>
                  </CardHeader>
                   <CardContent>
                        <Button 
                          onClick={() => router.push(`/resgatar-premio?id=${prize.id}`)}
                          className='w-full'
                          variant='outline'
                        >
                          <Ticket className='mr-2'/>
                          Usar Prêmio
                        </Button>
                  </CardContent>
                </Card>
              );
            })}
            </div>
          ) : (
             <Card className="bg-dark-gray border-dashed border-gold/30 text-center p-8">
              <CardTitle className="text-muted-foreground font-normal">Você ainda não possui prêmios ativos.</CardTitle>
              <CardDescription className="mt-2 text-sm">Gire a roleta para ganhar!</CardDescription>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

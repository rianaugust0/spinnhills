
'use client';

import { useEffect, useState, useMemo } from 'react';
import { Loader2, LogOut, Gift, FerrisWheel, Sparkles, Calendar, Badge, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { initializeFirebase, useDoc, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { differenceInDays } from 'date-fns';

const { firestore } = initializeFirebase();

const PrizeCard = ({ prize }: { prize: any }) => {
  const router = useRouter();
  const validityLeft = differenceInDays(prize.expiresAt.toDate(), new Date());

  const handleRedeemClick = () => {
    router.push(`/resgatar-premio?userId=${prize.userId}&prizeId=${prize.id}`);
  };

  return (
    <Card className="bg-dark-gray border-gold/20 overflow-hidden">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-3">
             <div className="bg-gold/10 p-2 rounded-md">
                <Ticket className="h-6 w-6 text-gold" />
             </div>
             <CardTitle className="text-ice-white text-lg font-bold">{prize.title}</CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-2">{prize.description}</CardDescription>
        </div>
        <div className="mt-4">
            {validityLeft > 0 ? (
                 <div className='flex justify-between items-center'>
                    <Badge variant="outline" className='border-green-500/50 text-green-400'>
                        <Calendar className="h-3 w-3 mr-1.5" />
                        Válido por mais {validityLeft} dia{validityLeft > 1 ? 's' : ''}
                    </Badge>
                    <Button size="sm" onClick={handleRedeemClick}>Resgatar</Button>
                 </div>
            ) : (
                 <Badge variant="destructive">Expirado</Badge>
            )}
        </div>
      </CardContent>
    </Card>
  );
};


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
    if (!clientPhone) return null;
    return doc(firestore, 'users', clientPhone);
  }, [clientPhone]);

  const { data: clientData, isLoading: isClientLoading } = useDoc(userDocRef);

  const prizesQuery = useMemo(() => {
    if (!clientPhone) return null;
    return query(
      collection(firestore, 'users', clientPhone, 'prizes'),
      where('status', '==', 'active')
    );
  }, [clientPhone]);
  
  const { data: activePrizes, isLoading: isPrizesLoading } = useCollection(prizesQuery);

  const handleLogout = () => {
    localStorage.removeItem('spin-hills-user-phone');
    router.push('/');
  };

  const isLoading = initialLoading || isClientLoading || isPrizesLoading;

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
            {clientData.girosDisponiveis > 0 ? (
              <Button onClick={() => router.push('/spin')} className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base">
                <Sparkles className="mr-2 h-5 w-5" />
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
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePrizes.map((prize) => (
                    <PrizeCard key={prize.id} prize={prize} />
                ))}
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

    
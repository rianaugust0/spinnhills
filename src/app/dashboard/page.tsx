
'use client';

import { useEffect, useState, useMemo } from 'react';
import { LogOut, Handshake, Users, Info, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { initializeFirebase, useDoc, useCollection } from '@/firebase';
import { doc, collection, query, where, Timestamp } from 'firebase/firestore';
import { isAfter, differenceInDays } from 'date-fns';
import { UserDashboardTabs } from '@/components/dashboard/UserDashboardTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ShareReferralModal } from '@/components/dashboard/ShareReferralModal';


const { firestore } = initializeFirebase();

const DashboardSkeleton = () => (
    <div className="flex-1 container mx-auto px-4 py-8 space-y-6 md:space-y-8 animate-pulse">
        <Card className="bg-dark-gray/50 border-gold/10">
            <CardHeader className="pb-4">
                <Skeleton className="h-6 w-4/5" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-4 w-1/2 mx-auto mt-3" />
            </CardContent>
        </Card>

        <Card className="bg-dark-gray/50 border-gold/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className='text-gold'/> Como Ganhar Mais Giros?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-deep-black border border-gold/10">
                    <Handshake className="h-8 w-8 text-gold/80 mt-1"/>
                    <div>
                        <h3 className="font-bold text-ice-white text-lg">Indique um Amigo e Ganhe</h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-3">Seu amigo faz o primeiro corte e você ganha 1 giro na hora!</p>
                        <Skeleton className="h-10 w-40" />
                    </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-deep-black border border-gold/10">
                    <Users className="h-8 w-8 text-gold/80 mt-1"/>
                    <div>
                        <h3 className="font-bold text-ice-white text-lg">Divulgue e Avalie</h3>
                        <p className="text-sm text-muted-foreground">Siga nosso Instagram e faça uma avaliação 5 estrelas no Google. Mostre para o barbeiro e ganhe 1 giro. (Válido apenas 1 vez)</p>
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Tabs Skeleton */}
        <div className="w-full">
            <div className="flex h-12 items-center justify-center rounded-md bg-muted p-1">
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-1/3" />
                <Skeleton className="h-10 w-1/3" />
            </div>
            <div className="mt-6">
                <Card className="bg-dark-gray/50 border-dashed border-gold/10 text-center p-8">
                    <Skeleton className="h-10 w-10 mx-auto mb-4 rounded-full"/>
                    <Skeleton className="h-5 w-3/4 mx-auto"/>
                    <Skeleton className="h-4 w-1/2 mx-auto mt-2"/>
                </Card>
            </div>
        </div>
    </div>
);


export default function DashboardPage() {
  const router = useRouter();
  const [clientPhone, setClientPhone] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  useEffect(() => {
    // This now safely runs only on the client
    const phoneFromStorage = localStorage.getItem('spin-hills-user-phone');
    if (!phoneFromStorage) {
      router.replace('/entrar');
    } else {
      setClientPhone(phoneFromStorage);
      setIsClient(true);
    }
  }, [router]);

  const userDocRef = useMemo(() => {
    if (!firestore || !clientPhone) return null;
    return doc(firestore, 'users', clientPhone);
  }, [clientPhone]);

  const { data: clientData, isLoading: isClientLoading } = useDoc(userDocRef);

  const prizesQuery = useMemo(() => {
    if (!firestore || !clientPhone) return null;
    return query(
      collection(firestore, 'prizes'),
      where('userId', '==', clientPhone),
      where('status', '==', 'active')
    );
  }, [clientPhone]);
  
  const { data: activePrizesData, isLoading: isPrizesLoading } = useCollection(prizesQuery);

  const activePrizes = useMemo(() => {
    if (!activePrizesData) return [];
    if (!isClient) return []; // Don't process on server
    const today = new Date();
    return activePrizesData.filter(prize => {
        const expiresAtDate = prize.expiresAt instanceof Timestamp ? prize.expiresAt.toDate() : prize.expiresAt;
        return isAfter(expiresAtDate, today) || differenceInDays(expiresAtDate, today) >= 0;
    }).sort((a, b) => {
        const dateA = a.expiresAt instanceof Timestamp ? a.expiresAt.toDate() : a.expiresAt;
        const dateB = b.expiresAt instanceof Timestamp ? b.expiresAt.toDate() : b.expiresAt;
        return dateA.getTime() - dateB.getTime();
    });
  }, [activePrizesData, isClient]);
  
  const limitedSpinsQuery = useMemo(() => {
      if (!firestore || !clientPhone) return null;
      return query(
          collection(firestore, 'limitedSpins'),
          where('userId', '==', clientPhone),
          where('status', '==', 'active')
      );
  }, [clientPhone]);

  const { data: limitedSpinsData, isLoading: isLimitedSpinsLoading } = useCollection(limitedSpinsQuery);
  
  const activeLimitedSpin = useMemo(() => {
      if (!limitedSpinsData || limitedSpinsData.length === 0 || !isClient) return null;
      const today = new Date();
      const activeSpin = limitedSpinsData.find(spin => {
        const expiresAtDate = spin.expiresAt instanceof Timestamp ? spin.expiresAt.toDate() : new Date(spin.expiresAt);
        return isAfter(expiresAtDate, today) || differenceInDays(expiresAtDate, today) >= 0;
      });
      return activeSpin || null;
  }, [limitedSpinsData, isClient]);


  const handleLogout = () => {
    localStorage.removeItem('spin-hills-user-phone');
    router.push('/');
  };

  const isLoading = isClientLoading || isPrizesLoading || isLimitedSpinsLoading || !isClient;

  if (!isClient) {
    return (
        <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
            <header className="p-4 flex justify-between items-center border-b border-gold/20">
                <Skeleton className='h-7 w-48'/>
                <Skeleton className='h-10 w-10'/>
            </header>
            <DashboardSkeleton />
        </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      <ShareReferralModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          referralCode={clientData?.referralCode || ''}
        />
      <header className="p-4 flex justify-between items-center border-b border-gold/20">
        <div>
          {isLoading || !clientData ? (
             <Skeleton className='h-7 w-48'/>
          ) : (
             <h1 className="font-headline text-xl text-ice-white uppercase">Fala, {clientData.name?.split(' ')[0]} 👋</h1>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sair">
          <LogOut className="h-5 w-5 text-gold/80 hover:text-gold" />
        </Button>
      </header>

      {isLoading ? <DashboardSkeleton /> : (
        <main className="flex-1 container mx-auto px-4 py-8 space-y-6 md:space-y-8 animate-fade-in-up">
          
            <Card className="bg-dark-gray border-gold/20">
                <CardHeader className="pb-4">
                    <CardTitle className="text-ice-white text-lg">✂️ Progresso para o próximo giro de fidelidade</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={((clientData?.cortesAtuais ?? 0) / 5) * 100} className="bg-deep-black h-3 [&>div]:bg-gold" />
                    <p className="text-center text-muted-foreground text-sm mt-3">
                    <span className="font-bold text-gold">{clientData?.cortesAtuais ?? 0} / 5</span> cortes confirmados
                    </p>
                    <p className="text-center text-xs text-muted-foreground/50 mt-2">Complete 5 cortes e ganhe 1 giro de fidelidade.</p>
                </CardContent>
            </Card>

            <Card className="bg-dark-gray border-gold/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Info className='text-gold'/> Como Ganhar Mais Giros?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-deep-black border border-gold/10">
                    <Handshake className="h-8 w-8 text-gold/80 mt-1"/>
                    <div>
                      <h3 className="font-bold text-ice-white text-lg">Indique um Amigo e Ganhe</h3>
                      <p className="text-sm text-muted-foreground mt-1 mb-3">Seu amigo faz o primeiro corte e você ganha 1 giro na hora!</p>
                       <Button onClick={() => setIsShareModalOpen(true)} className="bg-gold text-deep-black hover:bg-gold/90" disabled={!clientData?.referralCode}>
                        <Share2 className="mr-2 h-4 w-4" />
                        Indicar um amigo
                      </Button>
                    </div>
                  </div>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-deep-black border border-gold/10">
                  <Users className="h-8 w-8 text-gold/80 mt-1"/>
                  <div>
                    <h3 className="font-bold text-ice-white text-lg">Divulgue e Avalie</h3>
                    <p className="text-sm text-muted-foreground">Siga nosso Instagram e faça uma avaliação 5 estrelas no Google. Mostre para o barbeiro e ganhe 1 giro. (Válido apenas 1 vez)</p>
                  </div>
                </div>
              </CardContent>
            </Card>


            <UserDashboardTabs 
                activePrizes={activePrizes}
                activeLimitedSpin={activeLimitedSpin}
            />
        </main>
      )}
    </div>
  );
}


'use client';

import { useEffect, useState, useMemo } from 'react';
import { LogOut, Handshake, Users, Info, Share2, Instagram, Star, Award, FerrisWheel, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';
import { initializeFirebase, useDoc, useCollection } from '@/firebase';
import { doc, collection, query, where, Timestamp, getDocs, getDoc, orderBy, limit, updateDoc, serverTimestamp } from 'firebase/firestore';
import { isAfter, differenceInDays } from 'date-fns';
import { UserDashboardTabs } from '@/components/dashboard/UserDashboardTabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ShareReferralModal } from '@/components/dashboard/ShareReferralModal';
import { useToast } from '@/hooks/use-toast';


const { firestore } = initializeFirebase();

const DashboardSkeleton = () => (
    <div className="flex-1 container mx-auto px-4 py-8 space-y-6 md:space-y-8 animate-pulse">
        
        <Card className="bg-dark-gray/50 border-gold/10">
            <CardHeader className="pb-4">
                <Skeleton className="h-8 w-3/5" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-4/5 mt-2" />
            </CardContent>
        </Card>

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
  const { toast } = useToast();
  const [clientPhone, setClientPhone] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  const [isUsingSpin, setIsUsingSpin] = useState(false);
  
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

  useEffect(() => {
    if (!clientPhone || !clientData) return; // Wait for clientData

    const fetchReferrerInfo = async () => {
        // Find if this user was referred by someone
        const referralsQuery = query(collection(firestore, 'referrals'), where('referredUserId', '==', clientPhone));
        const referralsSnapshot = await getDocs(referralsQuery);
        if (!referralsSnapshot.empty) {
            const referralDoc = referralsSnapshot.docs[0];
            const referrerId = referralDoc.data().referrerUserId;

            // Now find the name of the person who referred them
            if (referrerId) {
                const referrerUserDoc = await getDoc(doc(firestore, 'users', referrerId));
                if (referrerUserDoc.exists()) {
                    setReferrerName(referrerUserDoc.data().name);
                }
            }
        }
    };
    fetchReferrerInfo();
  }, [clientPhone, clientData]); // Rerun when clientData is available


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
  
  const availableSpinsQuery = useMemo(() => {
    if (!firestore || !clientPhone) return null;
    return query(
        collection(firestore, 'spins'),
        where('userId', '==', clientPhone),
        where('status', '==', 'available')
    );
  }, [clientPhone]);

  const { data: availableSpinsData, isLoading: isSpinsLoading } = useCollection(availableSpinsQuery);
  
  const availableSpins = useMemo(() => {
    if (!availableSpinsData) return [];
    // Sort client-side
    return availableSpinsData.sort((a, b) => (a.createdAt as Timestamp).toMillis() - (b.createdAt as Timestamp).toMillis());
  }, [availableSpinsData]);

  const availableSpinsCount = availableSpins?.length ?? 0;

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


  const handleUseSpin = async () => {
    if (!availableSpins || availableSpins.length === 0) {
      toast({ variant: 'destructive', title: 'Você não tem giros disponíveis.' });
      return;
    }
    setIsUsingSpin(true);

    const spinToUse = availableSpins[0]; // Oldest available spin
    const spinDocRef = doc(firestore, 'spins', spinToUse.id);

    try {
      await updateDoc(spinDocRef, {
        status: 'used_pending_confirm',
        usedAt: serverTimestamp()
      });
      toast({
        title: 'Giro utilizado!',
        description: 'Aguardando confirmação do barbeiro para registrar seu prêmio.'
      });
    } catch (error: any) {
      console.error("Error using spin: ", error);
      toast({
        variant: 'destructive',
        title: 'Erro ao usar o giro',
        description: error.message || 'Tente novamente mais tarde.'
      });
    } finally {
      setIsUsingSpin(false);
    }
  };


  const handleLogout = () => {
    localStorage.removeItem('spin-hills-user-phone');
    router.push('/');
  };

  const isLoading = isClientLoading || isPrizesLoading || isSpinsLoading || isLimitedSpinsLoading || !isClient;

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
            
             {referrerName && (
                <Card className="bg-green-900/40 border-green-500/50">
                    <CardContent className="p-4 flex items-center gap-4">
                        <Award className="h-8 w-8 text-green-300" />
                        <div>
                            <p className="font-bold text-green-200">Você foi indicado por {referrerName.split(' ')[0]}!</p>
                            <p className="text-sm text-green-300/80">Faça seu primeiro corte para que ele(a) ganhe a recompensa.</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {(availableSpinsCount > 0) && (
              <Card className="bg-dark-gray border-gold/20 text-center shadow-lg shadow-gold/5 animate-fade-in-up">
                <CardHeader>
                  <FerrisWheel className="h-12 w-12 mx-auto text-gold animate-pulse" />
                  <CardTitle className="text-2xl text-gold font-headline tracking-wider">Giros Disponíveis na Roleta</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-ice-white">{availableSpinsCount}</p>
                  <p className="text-lg text-muted-foreground mt-1">
                    Você tem {availableSpinsCount > 1 ? 'giros' : 'giro'} para usar!
                  </p>
                  <p className="text-sm text-muted-foreground/70 mt-2">
                    Vá até a barbearia para usar seus giros na nossa roleta de prêmios.
                  </p>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className='mt-4' size='lg' disabled={isUsingSpin}>
                           {isUsingSpin ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FerrisWheel className='mr-2 h-4 w-4'/>}
                           Usar 1 Giro Agora
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-dark-gray border-gold/20 text-ice-white">
                        <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl text-gold font-headline">⚠️ Atenção antes de usar o Giro</AlertDialogTitle>
                        <AlertDialogDescription className="text-base text-ice-white/80">
                            Você está prestes a usar 1 giro na roleta física. O giro será debitado do seu perfil imediatamente.
                            <br/><br/>
                            O prêmio que você ganhar será registrado pelo barbeiro.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="secondary" className="text-base">Cancelar</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button onClick={handleUseSpin} className="bg-gold text-deep-black text-base">Confirmar e Girar</Button>
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                </CardContent>
              </Card>
            )}

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
                       <Button onClick={() => setIsShareModalOpen(true)} className="bg-gold text-deep-black hover:bg-gold/90">
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
                     <div className="flex flex-col sm:flex-row gap-2 mt-3">
                        <Button asChild variant="outline" className="text-ice-white border-purple-500/50 hover:bg-purple-500/10 hover:text-ice-white">
                           <a href="https://www.instagram.com/hillscut?igsh=MXJoZDAzb2dpdWt2MA==" target="_blank" rel="noopener noreferrer">
                                <Instagram className="mr-2 h-4 w-4" /> Seguir no Instagram
                           </a>
                        </Button>
                         <Button asChild variant="outline" className="text-ice-white border-blue-500/50 hover:bg-blue-500/10 hover:text-ice-white">
                           <a href="https://g.page/r/CSwWRcEEtr-UEBM/review" target="_blank" rel="noopener noreferrer">
                                <Star className="mr-2 h-4 w-4" /> Avaliar no Google
                           </a>
                        </Button>
                     </div>
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

    

    
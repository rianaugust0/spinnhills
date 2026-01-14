
'use client';

import { useEffect, useState, useMemo } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, Timestamp, updateDoc, doc, serverTimestamp, where } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrizesList } from '@/components/admin/PrizesList';
import { isAfter, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const { firestore } = initializeFirebase();

const DashboardSkeleton = () => (
    <div className='animate-pulse'>
        <div className="flex items-center justify-center rounded-md bg-muted p-1 h-12 w-full mb-6">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-1/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-dark-gray/50 border-gold/10">
                    <CardHeader className="p-4">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-1/3 mt-1" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-1" />
                    </CardContent>
                     <div className="p-4 pt-0">
                        <Skeleton className="h-11 w-full" />
                    </div>
                </Card>
            ))}
        </div>
    </div>
);


export default function AdminDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [allPrizes, setAllPrizes] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  const fetchPrizes = async () => {
    // No setLoading(true) here to avoid flicker on tab change
    try {
      const prizesQuery = query(collection(firestore, 'prizes'));
      const prizesSnapshot = await getDocs(prizesQuery);

      const prizes = prizesSnapshot.docs.map((doc) => {
          const prizeData = doc.data();
          return {
              id: doc.id,
              ...prizeData,
              expiresAt: (prizeData.expiresAt as Timestamp).toDate(),
              createdAt: (prizeData.createdAt as Timestamp).toDate(),
              contactedAt: prizeData.contactedAt ? (prizeData.contactedAt as Timestamp).toDate() : null,
              redeemedAt: prizeData.redeemedAt ? (prizeData.redeemedAt as Timestamp).toDate() : null,
          }
      });
      
      prizes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setAllPrizes(prizes);
      
    } catch (error) {
      console.error("Failed to fetch prizes:", error);
      toast({ variant: 'destructive', title: 'Erro ao buscar prêmios' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchPrizes();
    }
  }, [isClient]);

  const handleUpdateStatus = async (prizeId: string, status: 'in_contact' | 'redeemed') => {
      const prizeRef = doc(firestore, 'prizes', prizeId);
      const updates: any = { status };
      let successMessage = '';

      if (status === 'in_contact') {
          updates.contactedAt = serverTimestamp();
          successMessage = 'Status atualizado para "Em Contato".';
      } else if (status === 'redeemed') {
          updates.redeemedAt = serverTimestamp();
          successMessage = 'Prêmio marcado como "Resgatado".';
      }

      try {
          await updateDoc(prizeRef, updates);
          toast({ title: 'Sucesso!', description: successMessage });
          // Refresh the list
          await fetchPrizes();
      } catch (error) {
          console.error("Failed to update prize status:", error);
          toast({ variant: 'destructive', title: 'Erro ao atualizar status do prêmio' });
      }
  };


  const { activePrizes, inContactPrizes, redeemedPrizes, expiredPrizes } = useMemo(() => {
    const today = startOfDay(new Date());
    const lists = {
        activePrizes: [] as any[],
        inContactPrizes: [] as any[],
        redeemedPrizes: [] as any[],
        expiredPrizes: [] as any[],
    };

    allPrizes.forEach(prize => {
      const isExpired = !isAfter(prize.expiresAt, today) && prize.status !== 'redeemed';
      
      if (isExpired && prize.status !== 'expired') {
          // Update status in Firestore if it's not already 'expired' or 'redeemed'
          updateDoc(doc(firestore, 'prizes', prize.id), { status: 'expired' });
          lists.expiredPrizes.push({ ...prize, status: 'expired' });
      } else {
        switch (prize.status) {
            case 'active':
                lists.activePrizes.push(prize);
                break;
            case 'in_contact':
                lists.inContactPrizes.push(prize);
                break;
            case 'redeemed':
                lists.redeemedPrizes.push(prize);
                break;
            case 'expired':
                lists.expiredPrizes.push(prize);
                break;
            default:
                break;
        }
      }
    });

    return lists;
  }, [allPrizes]);
  
  const tabs = [
    { value: "active", label: "Ativos", data: activePrizes, emptyMessage: "Nenhum prêmio ativo no momento." },
    { value: "in_contact", label: "Em Contato", data: inContactPrizes, emptyMessage: "Nenhum prêmio em contato." },
    { value: "redeemed", label: "Resgatados", data: redeemedPrizes, emptyMessage: "Nenhum prêmio foi resgatado ainda." },
    { value: "expired", label: "Expirados", data: expiredPrizes, emptyMessage: "Nenhum prêmio expirado." },
  ];

  if (!isClient) {
    return (
      <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
        <header className="p-4 flex justify-between items-center border-b border-gold/20 sticky top-0 bg-deep-black/80 backdrop-blur-sm z-10">
          <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} aria-label="Voltar">
            <ArrowLeft className="h-5 w-5 text-gold" />
          </Button>
          <h1 className="font-headline text-xl text-ice-white uppercase">Painel de Prêmios</h1>
          <div></div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-8">
          <DashboardSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      <header className="p-4 flex justify-between items-center border-b border-gold/20 sticky top-0 bg-deep-black/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-gold" />
        </Button>
        <h1 className="font-headline text-xl text-ice-white uppercase">Painel de Prêmios</h1>
        <Button variant="ghost" size="icon" onClick={fetchPrizes} aria-label="Atualizar">
          <Loader2 className={loading ? 'animate-spin' : ''} />
        </Button>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        
        {loading ? <DashboardSkeleton /> : (
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
                {tabs.map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="flex-wrap">
                    {tab.label} ({tab.data.length})
                  </TabsTrigger>
                ))}
              </TabsList>
              {tabs.map(tab => (
                 <TabsContent key={tab.value} value={tab.value} className="mt-6">
                    <PrizesList 
                        prizes={tab.data} 
                        status={tab.value as any}
                        emptyMessage={tab.emptyMessage}
                        onUpdateStatus={handleUpdateStatus}
                    />
                 </TabsContent>
              ))}
            </Tabs>
        )}
      </main>
    </div>
  );
}

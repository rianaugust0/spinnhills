
'use client';

import { useEffect, useState, useMemo } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Loader2, ArrowLeft, BotMessageSquare, AlertTriangle, CalendarCheck, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PrizesList } from '@/components/admin/PrizesList';
import { isSameDay, isWithinInterval, addDays, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const { firestore } = initializeFirebase();

interface PrizeSummary {
  expiringToday: number;
  expiringIn3Days: number;
  totalActive: number;
}

const DashboardSkeleton = () => (
    <div className='animate-pulse'>
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="bg-dark-gray/50 border-gold/10">
                <CardHeader className="p-4 pb-2">
                    <Skeleton className="h-10 w-1/4 mx-auto" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                </CardContent>
            </Card>
             <Card className="bg-dark-gray/50 border-gold/10">
                <CardHeader className="p-4 pb-2">
                    <Skeleton className="h-10 w-1/4 mx-auto" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                </CardContent>
            </Card>
             <Card className="bg-dark-gray/50 border-gold/10">
                <CardHeader className="p-4 pb-2">
                    <Skeleton className="h-10 w-1/4 mx-auto" />
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                </CardContent>
            </Card>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-dark-gray/50 border-gold/10">
                    <CardHeader className="p-4">
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-1/3 mt-1" />
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <Skeleton className="h-5 w-3/4" />
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
  const [loading, setLoading] = useState(true);
  const [allPrizes, setAllPrizes] = useState<any[]>([]);
  const [summary, setSummary] = useState<PrizeSummary>({
    expiringToday: 0,
    expiringIn3Days: 0,
    totalActive: 0,
  });

  useEffect(() => {
    const fetchActivePrizes = async () => {
      // No setLoading(true) here, skeleton handles initial state
      try {
        const today = startOfDay(new Date());
        
        const prizesQuery = query(
          collection(firestore, 'prizes'),
          where('status', '==', 'active')
        );
        const prizesSnapshot = await getDocs(prizesQuery);

        let prizes = prizesSnapshot.docs.map((doc) => {
            const prizeData = doc.data();
            const expiresAtDate = (prizeData.expiresAt as Timestamp).toDate();
            return {
                id: doc.id,
                ...prizeData,
                expiresAt: expiresAtDate,
            }
        }).filter(p => p.expiresAt >= today); // Filter out already expired prizes
        
        // Sort all prizes by expiration date
        prizes.sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime());

        // Calculate summary
        const expiringToday = prizes.filter(p => isSameDay(p.expiresAt, today)).length;
        const expiringIn3Days = prizes.filter(p => 
            !isSameDay(p.expiresAt, today) && 
            isWithinInterval(p.expiresAt, { start: addDays(today, 1), end: addDays(today, 3) })
        ).length;

        setSummary({
            expiringToday,
            expiringIn3Days,
            totalActive: prizes.length
        });
        setAllPrizes(prizes);
        
      } catch (error) {
        console.error("Failed to fetch active prizes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePrizes();
  }, []);

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
        
        {loading ? <DashboardSkeleton /> : (
            <>
                {/* Summary Cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in-up">
                    <Card className="bg-red-900/40 border-red-500/50 text-center">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-4xl font-bold text-red-300">{summary.expiringToday}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm font-medium text-red-300/80">Vencem Hoje</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-yellow-900/40 border-yellow-500/50 text-center">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-4xl font-bold text-yellow-300">{summary.expiringIn3Days}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm font-medium text-yellow-300/80">Vencem em até 3 dias</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-dark-gray border-gold/20 text-center">
                        <CardHeader className="p-4 pb-2">
                            <CardTitle className="text-4xl font-bold text-ice-white">{summary.totalActive}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                            <p className="text-sm font-medium text-muted-foreground">Total de Prêmios Ativos</p>
                        </CardContent>
                    </Card>
                </section>

                <PrizesList prizes={allPrizes} />
            </>
        )}
      </main>
    </div>
  );
}

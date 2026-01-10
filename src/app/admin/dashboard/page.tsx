'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { Loader2, ArrowLeft, BotMessageSquare } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserWithPrizes } from '@/lib/types';
import { PrizesList } from '@/components/admin/PrizesList';

const { firestore } = initializeFirebase();

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [usersWithPrizes, setUsersWithPrizes] = useState<any[]>([]);

  useEffect(() => {
    const fetchActivePrizes = async () => {
      setLoading(true);
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        let allPrizes: any[] = [];

        for (const userDoc of usersSnapshot.docs) {
          const userId = userDoc.id;
          const userData = userDoc.data();
          const prizesQuery = query(
            collection(firestore, 'users', userId, 'prizes'),
            where('status', '==', 'active')
          );
          const prizesSnapshot = await getDocs(prizesQuery);

          if (!prizesSnapshot.empty) {
            const prizes = prizesSnapshot.docs.map((prizeDoc) => {
                 const prizeData = prizeDoc.data();
                 return {
                     id: prizeDoc.id,
                     ...prizeData,
                     // Ensure expiresAt is a Date object for sorting
                     expiresAt: (prizeData.expiresAt as Timestamp).toDate(),
                     userName: userData.name,
                     userPhone: userData.phone
                 }
            });
            allPrizes.push(...prizes);
          }
        }
        
        // Sort all prizes by expiration date
        allPrizes.sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime());

        setUsersWithPrizes(allPrizes);
        
      } catch (error) {
        console.error("Failed to fetch active prizes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePrizes();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
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
        <Button variant="outline" size="sm" disabled>
            <BotMessageSquare className='mr-2'/>
            Disparos em Breve
        </Button>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <PrizesList prizes={usersWithPrizes} />
      </main>
    </div>
  );
}

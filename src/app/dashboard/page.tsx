
'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Loader2, LogOut, Award, Scissors, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ClientData = {
  name: string;
  phone: string;
  points: number;
  cuts: number;
  createdAt: any;
  lastCutAt: any;
};

type RewardData = {
  id: string;
  title: string;
  pointsRequired: number;
  active: boolean;
};

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }

    if (user && firestore) {
      const clientDocRef = doc(firestore, 'clients', user.uid);
      const rewardsCollectionRef = collection(firestore, 'rewards');
      
      const unsubscribeClient = onSnapshot(clientDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setClientData(docSnap.data() as ClientData);
        } else {
          console.log("Cliente não encontrado.");
        }
        setLoading(false);
      });

      const q = query(rewardsCollectionRef, where("active", "==", true));
      const unsubscribeRewards = onSnapshot(q, (querySnapshot) => {
        const rewardsData: RewardData[] = [];
        querySnapshot.forEach((doc) => {
          rewardsData.push({ id: doc.id, ...doc.data() } as RewardData);
        });
        setRewards(rewardsData.sort((a, b) => a.pointsRequired - b.pointsRequired));
      });

      return () => {
        unsubscribeClient();
        unsubscribeRewards();
      };
    }
  }, [user, isUserLoading, firestore, router]);


  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };
  
  if (loading || !clientData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
      </div>
    );
  }

  const nextReward = rewards.find(r => r.pointsRequired > clientData.points);
  const pointsToNextReward = nextReward ? nextReward.pointsRequired - clientData.points : 0;
  const progressPercentage = nextReward ? (clientData.points / nextReward.pointsRequired) * 100 : 100;

  return (
    <div className="flex flex-col min-h-screen bg-deep-black">
      <header className="p-4 flex justify-between items-center border-b border-gold/20">
        <div>
           <h1 className="font-headline text-2xl text-gold uppercase">Club Hills Basic</h1>
           <p className="text-sm text-muted-foreground">Olá, {clientData.name} 👋</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5 text-gold/80 hover:text-gold" />
        </Button>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card className="bg-dark-gray border-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pontos Atuais</CardTitle>
              <Star className="h-5 w-5 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-ice-white">{clientData.points}</div>
            </CardContent>
          </Card>
          <Card className="bg-dark-gray border-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Cortes</CardTitle>
              <Scissors className="h-5 w-5 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-ice-white">{clientData.cuts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card className="bg-dark-gray border-gold/20">
            <CardHeader>
              <CardTitle className="text-ice-white">Seu Progresso</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="bg-deep-black [&>div]:bg-gold" />
              {nextReward && (
                 <p className="text-center text-muted-foreground mt-4">
                  Faltam <span className="font-bold text-gold">{pointsToNextReward}</span> pontos para resgatar <span className="font-bold text-ice-white">{nextReward.title}</span>!
                </p>
              )}
               {!nextReward && rewards.length > 0 &&(
                 <p className="text-center text-muted-foreground mt-4">
                  Você já pode resgatar todas as recompensas disponíveis!
                </p>
              )}
            </CardContent>
          </Card>

        {/* Rewards */}
        <div>
          <h2 className="font-headline text-3xl text-ice-white uppercase mb-4">Recompensas</h2>
          <div className="space-y-4">
            {rewards.map((reward) => {
              const canRedeem = clientData.points >= reward.pointsRequired;
              return (
                <Card key={reward.id} className={`bg-dark-gray border-gold/20 flex items-center justify-between p-4 ${!canRedeem ? 'opacity-50' : ''}`}>
                  <div>
                    <p className="font-bold text-ice-white">{reward.title}</p>
                    <p className="text-sm text-gold">{reward.pointsRequired} Pontos</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-gold/50 text-gold hover:bg-gold hover:text-deep-black" 
                    disabled={!canRedeem}
                  >
                    {canRedeem ? 'Resgatar' : 'Insuficiente'}
                  </Button>
              </Card>
              );
            })}
             {rewards.length === 0 && (
                <p className="text-muted-foreground text-center">Nenhuma recompensa disponível no momento.</p>
             )}
          </div>
        </div>
      </main>
    </div>
  );
}


'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Loader2, LogOut, Award, Scissors, Star, Lock } from 'lucide-react';
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

// Mock data as requested for UX purposes
const mockRewards = [
  { id: '1', title: '10% OFF no Corte', pointsRequired: 20 },
  { id: '2', title: 'Corte Grátis', pointsRequired: 50 },
  { id: '3', title: 'Pomada Modeladora', pointsRequired: 70 },
];

const nextRewardExample = {
  title: 'Corte Grátis',
  pointsRequired: 50,
};


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
      return; 
    }

    if (user && firestore) {
      const clientDocRef = doc(firestore, 'clients', user.uid);
      
      const unsubscribeClient = onSnapshot(clientDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setClientData(docSnap.data() as ClientData);
        } else {
          console.log("Cliente não encontrado no Firestore.");
        }
        setLoading(false); 
      }, (error) => {
        console.error("Erro ao buscar dados do cliente:", error);
        setLoading(false); 
      });

      return () => {
        unsubscribeClient();
      };
    } else if (!isUserLoading) {
        setLoading(false);
    }
  }, [user, isUserLoading, firestore, router]);


  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };
  
  if (isUserLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
      </div>
    );
  }
  
  if (!clientData) {
     return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black text-center p-4">
        <h1 className="text-2xl text-gold mb-4">Bem-vindo(a) ao Club Hills!</h1>
        <p className="text-muted-foreground mb-8">Seus dados estão sendo preparados. Em breve você verá seus pontos aqui.</p>
        <Button onClick={handleLogout}>Sair</Button>
      </div>
    );
  }

  const currentPoints = clientData.points || 0;
  const progressPercentage = (currentPoints / nextRewardExample.pointsRequired) * 100;
  const pointsToNextReward = Math.max(0, nextRewardExample.pointsRequired - currentPoints);

  return (
    <div className="flex flex-col min-h-screen bg-deep-black">
      <header className="p-4 flex justify-between items-start border-b border-gold/20">
        <div>
           <h1 className="font-headline text-2xl text-gold uppercase">Club Hills Basic</h1>
           <p className="text-sm text-muted-foreground mt-1">👋 Bem-vindo ao Club Hills</p>
           <p className="text-sm text-muted-foreground">Cada corte te aproxima de recompensas exclusivas.</p>
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
              <div className="text-4xl font-bold text-ice-white">{currentPoints}</div>
              <p className="text-xs text-muted-foreground mt-1">Pontos acumulados no clube. Use seus pontos para trocar por recompensas.</p>
            </CardContent>
          </Card>
          <Card className="bg-dark-gray border-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Cortes</CardTitle>
              <Scissors className="h-5 w-5 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-ice-white">{clientData.cuts}</div>
              <p className="text-xs text-muted-foreground mt-1">Cada corte gera pontos no Club Hills.</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <Card className="bg-dark-gray border-gold/20">
            <CardHeader>
              <CardTitle className="text-ice-white">🎯 Próxima recompensa: {nextRewardExample.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="bg-deep-black [&>div]:bg-gold" />
               <p className="text-center text-muted-foreground mt-4">
                <span className="font-bold text-gold">{currentPoints} / {nextRewardExample.pointsRequired}</span> pontos acumulados
              </p>
            </CardContent>
          </Card>

        {/* Rewards */}
        <div>
          <h2 className="font-headline text-3xl text-ice-white uppercase mb-4">Recompensas</h2>
          <div className="space-y-4">
            {mockRewards.map((reward) => {
              const pointsNeeded = Math.max(0, reward.pointsRequired - currentPoints);
              const canRedeem = currentPoints >= reward.pointsRequired;

              if (canRedeem) {
                return (
                  <Card key={reward.id} className="bg-dark-gray border-gold/20 flex items-center justify-between p-4">
                    <div>
                      <p className="font-bold text-ice-white">{reward.title}</p>
                      <p className="text-sm text-gold">{reward.pointsRequired} Pontos</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="border-gold/50 text-gold hover:bg-gold hover:text-deep-black" 
                    >
                      Resgatar
                    </Button>
                </Card>
                )
              }

              return (
                <Card key={reward.id} className="bg-dark-gray border-gold/20 flex items-center justify-between p-4 opacity-60">
                  <div className="flex items-center gap-4">
                    <Lock className="h-5 w-5 text-gold" />
                    <div>
                      <p className="font-bold text-ice-white">{reward.title}</p>
                      <p className="text-sm text-muted-foreground">Faltam {pointsNeeded} pontos para desbloquear</p>
                    </div>
                  </div>
              </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}


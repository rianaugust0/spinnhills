
'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
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
  const { user } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.push('/');
    }

    if (user && firestore) {
      const clientDocRef = doc(firestore, 'clients', user.uid);
      
      const unsubscribe = onSnapshot(clientDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setClientData(docSnap.data() as ClientData);
        } else {
          // TODO: Create client document if it doesn't exist
          console.log("Cliente não encontrado, precisa criar o perfil.");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, firestore, router]);


  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/');
    }
  };
  
  if (loading || !clientData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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
           <p className="text-sm text-muted-foreground">Olá, {clientData.name}!</p>
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
              <Progress value={progressPercentage} className="bg-deep-black" />
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
            {/* Placeholder for rewards list */}
             <Card className="bg-dark-gray border-gold/20 flex items-center justify-between p-4">
                <div>
                  <p className="font-bold text-ice-white">Corte Grátis</p>
                  <p className="text-sm text-gold">100 Pontos</p>
                </div>
                <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold hover:text-deep-black" disabled>Resgatar</Button>
            </Card>
             <Card className="bg-dark-gray border-gold/20 flex items-center justify-between p-4 opacity-50">
                <div>
                  <p className="font-bold text-ice-white">Produto da Barbearia</p>
                  <p className="text-sm text-gold">150 Pontos</p>
                </div>
                <Button variant="outline" className="border-gold/50 text-gold hover:bg-gold hover:text-deep-black" disabled>Pontos insuficientes</Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

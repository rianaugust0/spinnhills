
'use client';

import { useEffect, useState } from 'react';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

// Mock data for demonstration - will be replaced with Firestore data
const mockClientData = {
  name: "Cliente",
  points: 0,
  cuts: 0,
  progressCuts: 0,
};

export default function DashboardPage() {
  const router = useRouter();
  const [clientData, setClientData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const userPhone = localStorage.getItem('hills-user-phone');
    if (!userPhone) {
      router.replace('/entrar');
    } else {
      // Here you would fetch data from Firestore using the user's phone
      // For now, we'll use mock data
      setClientData(mockClientData);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
      localStorage.removeItem('hills-user-phone');
      router.push('/');
  }

  if (loading || !clientData) {
     return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
      </div>
    );
  }

  const progressPercentage = (clientData.progressCuts / 5) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      <header className="p-4 flex justify-between items-start border-b border-gold/20">
        <div>
           <h1 className="font-headline text-2xl text-gold uppercase">Club Hills Basic</h1>
           <p className="text-sm text-muted-foreground mt-1">👋 Bem-vindo ao Club Hills, {clientData.name}!</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5 text-gold/80 hover:text-gold" />
        </Button>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-dark-gray border-gold/20 text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pontos Atuais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-ice-white">{clientData.points}</div>
            </CardContent>
          </Card>
          <Card className="bg-dark-gray border-gold/20 text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Cortes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-ice-white">{clientData.cuts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress to next spin */}
        <Card className="bg-dark-gray border-gold/20">
            <CardHeader>
              <CardTitle className="text-ice-white">🎯 Progresso para o próximo giro</CardTitle>
              <CardDescription>Complete 5 cortes para ganhar 1 giro na roleta Spin Hills!</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progressPercentage} className="bg-deep-black [&>div]:bg-gold" />
               <p className="text-center text-muted-foreground mt-4">
                <span className="font-bold text-gold">{clientData.progressCuts} / 5</span> cortes confirmados
              </p>
            </CardContent>
          </Card>

        {/* Active Prizes */}
        <div>
          <h2 className="font-headline text-3xl text-ice-white uppercase mb-4">Minhas Recompensas</h2>
          <Card className="bg-dark-gray border-dashed border-gold/30 text-center p-8">
              <CardTitle className="text-muted-foreground">Nenhuma recompensa disponível no momento.</CardTitle>
              <CardDescription className="mt-2">Continue cortando para desbloquear prêmios!</CardDescription>
          </Card>
        </div>
      </main>
    </div>
  );
}

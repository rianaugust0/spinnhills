
'use client';

import { useEffect, useState } from 'react';
import { Loader2, LogOut, Gift, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

// Mock data for demonstration - will be replaced with Firestore data
const mockClientData = {
  name: "Cliente",
  girosDisponiveis: 0,
  cortesAtuais: 0,
};

export default function DashboardPage() {
  const router = useRouter();
  const [clientData, setClientData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userPhone = localStorage.getItem('spin-hills-user-phone');
    const userName = localStorage.getItem('spin-hills-user-name') || 'Cliente';
    if (!userPhone) {
      router.replace('/entrar');
    } else {
      // Here you would fetch data from Firestore using the user's phone
      setClientData({ ...mockClientData, name: userName });
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
      localStorage.removeItem('spin-hills-user-phone');
      localStorage.removeItem('spin-hills-user-name');
      router.push('/');
  }

  if (loading || !clientData) {
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
           <h1 className="font-headline text-xl text-ice-white uppercase">Fala, {clientData.name.split(' ')[0]} 👋</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Sair">
          <LogOut className="h-5 w-5 text-gold/80 hover:text-gold" />
        </Button>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8 animate-fade-in-up">
        {/* Spin Hills Card */}
        <Card className="bg-dark-gray border-gold/20 text-center shadow-lg shadow-gold/5">
          <CardHeader>
            <CardTitle className="font-headline text-4xl text-gold uppercase tracking-wider">
              Spin Hills
            </CardTitle>
            <CardDescription>Giros disponíveis: 
                <span className="text-5xl font-bold text-ice-white block mt-2">{clientData.girosDisponiveis}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Button disabled className="w-full bg-muted text-muted-foreground">
                Complete ações para liberar giros
             </Button>
          </CardContent>
        </Card>

        {/* Progress to next spin */}
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

        {/* Active Prizes */}
        <div>
          <h2 className="font-headline text-2xl text-ice-white uppercase mb-4">Seus Prêmios</h2>
          <Card className="bg-dark-gray border-dashed border-gold/30 text-center p-8">
              <CardTitle className="text-muted-foreground font-normal">Você ainda não possui prêmios ativos.</CardTitle>
              <CardDescription className="mt-2 text-sm">Gire a roleta para ganhar!</CardDescription>
          </Card>
        </div>
      </main>
    </div>
  );
}

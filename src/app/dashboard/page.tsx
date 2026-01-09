'use client';

import { useState } from 'react';
import { Loader2, LogOut, Star, Scissors, RotateCw, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

// Mock data for demonstration
const clientData = {
  name: "João",
  points: 30,
  cuts: 8,
  spins: 1,
  progressCuts: 3,
};

const activePrizes = [
  { id: '1', name: 'Corte Grátis', type: 'Corte', expires: 5 },
  { id: '2', name: 'Hidratação', type: 'Serviço', expires: 12 },
];

export default function DashboardPage() {
  const router = useRouter();

  if (!clientData) {
     return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
      </div>
    );
  }

  const handleLogout = () => {
      // In a real app, this would clear the session/local storage
      router.push('/');
  }

  const progressPercentage = (clientData.progressCuts / 5) * 100;

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      <header className="p-4 flex justify-between items-start border-b border-gold/20">
        <div>
           <h1 className="font-headline text-2xl text-gold uppercase">Club Hills Basic</h1>
           <p className="text-sm text-muted-foreground mt-1">👋 Bem-vindo ao Club Hills, {clientData.name}!</p>
           <p className="text-sm text-muted-foreground">Cada corte te aproxima de recompensas exclusivas.</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout}>
          <LogOut className="h-5 w-5 text-gold/80 hover:text-gold" />
        </Button>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card className="bg-dark-gray border-gold/20 text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pontos</CardTitle>
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
          <Card className="bg-dark-gray border-gold/20 text-center col-span-2 sm:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Giros Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-ice-white">{clientData.spins}</div>
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

        {/* Spin Hills Roleta */}
        <Card className="bg-dark-gray border-gold/20 text-center">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-gold uppercase">SPIN HILLS</CardTitle>
              <CardDescription>Você tem <span className="font-bold text-gold">{clientData.spins}</span> giro(s) disponível(is). Gire e ganhe!</CardDescription>
            </CardHeader>
            <CardContent>
                <Button size="lg" className="bg-gold text-deep-black hover:bg-gold/90 w-full font-bold text-lg" disabled={clientData.spins === 0}>
                    <RotateCw className="mr-2"/> Girar a Roleta
                </Button>
                 <p className="text-xs text-muted-foreground mt-4">Ganhe mais giros indicando amigos ou avaliando a barbearia!</p>
            </CardContent>
        </Card>

        {/* Active Prizes */}
        <div>
          <h2 className="font-headline text-3xl text-ice-white uppercase mb-4">Meus Prêmios Ativos</h2>
          <div className="space-y-4">
            {activePrizes.length > 0 ? (
                activePrizes.map((prize) => (
                  <Card key={prize.id} className="bg-zinc-800 border-gold/20 flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <Gift className="h-6 w-6 text-gold" />
                        <div>
                          <p className="font-bold text-ice-white">{prize.name}</p>
                          <p className="text-sm text-muted-foreground">Válido para o próximo atendimento</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="font-semibold text-gold">Expira em {prize.expires} dias</p>
                        <p className="text-xs text-muted-foreground">Apresente no caixa</p>
                    </div>
                  </Card>
                ))
            ) : (
                 <Card className="bg-dark-gray border-dashed border-gold/30 text-center p-8">
                    <CardTitle className="text-muted-foreground">Nenhum prêmio ativo</CardTitle>
                    <CardDescription className="mt-2">Gire a roleta para ganhar prêmios!</CardDescription>
                </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

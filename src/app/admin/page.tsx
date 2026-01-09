'use client';

import { useState } from 'react';
import { Loader2, Search, User, Scissors, Award, Gift, RotateCw, MessageSquare, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data - will be replaced with Firestore data
const mockClient = {
  id: 'mock-id-123',
  name: 'João da Silva',
  phone: '11987654321',
  points: 30,
  cuts: 3,
  progressCuts: 3,
  spins: 0,
};

// Mock data - will be replaced with Firestore data
const mockPrizes = [
    { id: 'p1', clientName: 'João da Silva', phone: '11987654321', prize: 'Corte Grátis', expires: 5, status: 'Ativo' },
    { id: 'p2', clientName: 'Maria Oliveira', phone: '21912345678', prize: 'Hidratação', expires: 12, status: 'Ativo' },
];

export default function AdminPage() {
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [foundClient, setFoundClient] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      if (searchPhone === '11987654321') {
        setFoundClient(mockClient);
      } else {
        setFoundClient(null);
        toast({
          variant: 'destructive',
          title: 'Cliente não encontrado',
        });
      }
      setIsSearching(false);
    }, 1000);
  };

  const handleActionWithPin = (action: string) => {
    if (pin !== '1234') { // Mock PIN
        toast({ variant: 'destructive', title: 'PIN inválido!' });
        return;
    }
    
    setLoading(true);
    // Simulate action
    setTimeout(() => {
        toast({ title: 'Sucesso!', description: `Ação "${action}" confirmada para ${foundClient.name}.` });
        setLoading(false);
        setIsPinModalOpen(false);
        setPin('');

        // Here you would update the database, e.g., reset progress, add a spin, etc.
        if (action === 'Confirmar Corte') {
            const newCuts = foundClient.progressCuts + 1;
            if (newCuts >= 5) {
                 setFoundClient({ ...foundClient, cuts: foundClient.cuts + 1, progressCuts: 0, spins: foundClient.spins + 1 });
                 toast({ title: '🎉 Giro Liberado!', description: `${foundClient.name} completou 5 cortes e ganhou 1 giro.` })
            } else {
                 setFoundClient({ ...foundClient, cuts: foundClient.cuts + 1, progressCuts: newCuts });
            }
        }
         if (action === 'Liberar Giro (Indicação)') {
            setFoundClient({ ...foundClient, spins: foundClient.spins + 1 });
        }


    }, 1500);
  };


  return (
    <div className="flex flex-col min-h-screen bg-deep-black p-4 text-ice-white">
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl text-gold uppercase">Painel HillsCut</h1>
        <p className="text-muted-foreground">Gerenciamento do Club Hills & Spin Hills</p>
      </header>

      {/* Search Section */}
      <Card className="bg-dark-gray border-gold/20 mb-8">
        <CardHeader>
          <CardTitle>Buscar Cliente</CardTitle>
          <CardDescription>Busque pelo número de telefone para gerenciar.</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            type="tel"
            placeholder="Telefone do cliente"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="bg-zinc-800 border-gold/30"
          />
          <Button onClick={handleSearch} disabled={isSearching} className="bg-gold text-deep-black hover:bg-gold/90">
            {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
          </Button>
        </CardContent>
      </Card>
      
      {/* Client Management Section */}
      {foundClient && (
        <Card className="bg-dark-gray border-gold/20 animate-fade-in-up">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><User /> {foundClient.name}</CardTitle>
                <p className="text-muted-foreground">{foundClient.phone}</p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center mb-4">
                <div>
                    <p className="text-sm text-muted-foreground">Cortes (Progresso)</p>
                    <p className="text-3xl font-bold text-gold">{foundClient.progressCuts} / 5</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Giros Disponíveis</p>
                    <p className="text-3xl font-bold text-gold">{foundClient.spins}</p>
                </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2">
                <Dialog open={isPinModalOpen} onOpenChange={setIsPinModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full bg-gold text-deep-black hover:bg-gold/90"><Scissors className="mr-2"/> Confirmar Corte</Button>
                    </DialogTrigger>
                     <DialogContent className="bg-dark-gray text-ice-white border-gold/20">
                        <DialogHeader>
                          <DialogTitle>Confirmação do Barbeiro</DialogTitle>
                          <DialogDescription>Digite seu PIN para confirmar o corte para {foundClient.name}.</DialogDescription>
                        </DialogHeader>
                        <Input 
                            type="password"
                            maxLength={4}
                            placeholder="PIN de 4 dígitos"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="bg-zinc-800 border-gold/30 text-center text-2xl tracking-[0.5em] h-14"
                        />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsPinModalOpen(false)}>Cancelar</Button>
                            <Button onClick={() => handleActionWithPin('Confirmar Corte')} disabled={loading} className="bg-gold text-deep-black hover:bg-gold/90">
                                {loading ? <Loader2 className="animate-spin"/> : "Confirmar"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="w-full border-gold/50 text-gold hover:bg-gold hover:text-deep-black"><Gift className="mr-2"/> Liberar Giro</Button>
                    </DialogTrigger>
                    {/* A more complex dialog would go here to choose the reason for the spin */}
                    <DialogContent className="bg-dark-gray text-ice-white border-gold/20">
                        <DialogHeader>
                            <DialogTitle>Liberar Giro Manual</DialogTitle>
                            <DialogDescription>Selecione o motivo e confirme com seu PIN.</DialogDescription>
                        </DialogHeader>
                         <div className="grid gap-2 my-4">
                            <Button variant="secondary" onClick={() => handleActionWithPin('Liberar Giro (Indicação)')}>Indicação de Amigo</Button>
                            <Button variant="secondary" onClick={() => handleActionWithPin('Liberar Giro (Mídia Social)')}>Avaliação / Seguiu</Button>
                         </div>
                         <Input 
                            type="password"
                            maxLength={4}
                            placeholder="Seu PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="bg-zinc-800 border-gold/30 text-center text-lg h-12"
                        />
                        <DialogFooter>
                            <Button variant="outline">Fechar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardFooter>
        </Card>
      )}

      {/* Active Prizes Section */}
      <div className="mt-8">
        <h2 className="font-headline text-3xl text-ice-white uppercase mb-4">Prêmios Ativos</h2>
        <div className="space-y-4">
            {mockPrizes.map((prize) => (
                <Card key={prize.id} className="bg-dark-gray border-gold/20 flex justify-between items-center p-4">
                    <div>
                        <p className="font-bold text-ice-white">{prize.clientName}</p>
                        <p className="text-sm text-muted-foreground">{prize.prize}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-gold">Expira em {prize.expires} dias</p>
                        <Button size="sm" variant="ghost" className="text-gold/80 hover:text-gold p-0 h-auto">Resgatar com PIN</Button>
                    </div>
                </Card>
            ))}
        </div>
      </div>
    </div>
  );
}

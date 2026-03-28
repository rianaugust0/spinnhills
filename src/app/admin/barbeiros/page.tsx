
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, UserPlus, Trash2, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const { firestore } = initializeFirebase();

interface Barber {
    id: string;
    name: string;
    pin: string;
}

export default function ManageBarbersPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  
  const [newName, setNewName] = useState('');
  const [newPin, setNewPin] = useState('');

  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const barbersQuery = query(collection(firestore, 'barbers'), orderBy('name', 'asc'));
      const snapshot = await getDocs(barbersQuery);
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barber));
      setBarbers(list);
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erro ao carregar barbeiros' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  const handleAddBarber = async () => {
    if (!newName || newPin.length !== 4) {
      toast({ variant: 'destructive', title: 'Dados inválidos', description: 'Preencha o nome e um PIN de 4 dígitos.' });
      return;
    }
    
    setAdding(true);
    try {
      await addDoc(collection(firestore, 'barbers'), {
        name: newName,
        pin: newPin,
      });
      toast({ title: 'Barbeiro adicionado!', description: `Agora o PIN ${newPin} está ativo.` });
      setNewName('');
      setNewPin('');
      fetchBarbers();
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erro ao adicionar barbeiro' });
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteBarber = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja remover o barbeiro ${name}?`)) return;
    
    try {
      await deleteDoc(doc(firestore, 'barbers', id));
      toast({ title: 'Barbeiro removido' });
      fetchBarbers();
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erro ao remover barbeiro' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      <header className="p-4 flex justify-between items-center border-b border-gold/20 sticky top-0 bg-deep-black/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-gold" />
        </Button>
        <h1 className="font-headline text-xl text-ice-white uppercase flex items-center gap-2">
            <ShieldCheck className="text-gold" /> Gerenciar Barbeiros
        </h1>
        <div></div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        <Card className="bg-dark-gray border-gold/20">
            <CardHeader>
                <CardTitle className="text-gold flex items-center gap-2">
                    <UserPlus className="h-5 w-5" /> Novo Barbeiro
                </CardTitle>
                <CardDescription>Cadastre um novo barbeiro e seu PIN de acesso (ex: 2277).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs uppercase text-muted-foreground">Nome do Barbeiro</label>
                        <Input 
                            placeholder="Ex: João Silva" 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="bg-deep-black border-gold/30"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase text-muted-foreground">PIN (4 dígitos)</label>
                        <Input 
                            type="password"
                            inputMode="numeric"
                            maxLength={4}
                            placeholder="Ex: 2277" 
                            value={newPin}
                            onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                            className="bg-deep-black border-gold/30 text-center tracking-widest font-bold"
                        />
                    </div>
                </div>
                <Button 
                    onClick={handleAddBarber} 
                    disabled={adding} 
                    className="w-full bg-gold text-deep-black font-bold uppercase"
                >
                    {adding ? <Loader2 className="animate-spin" /> : 'Adicionar Barbeiro'}
                </Button>
            </CardContent>
        </Card>

        <Card className="bg-dark-gray border-gold/20">
            <CardHeader>
                <CardTitle>Barbeiros Cadastrados</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold" /></div>
                ) : barbers.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gold/20 hover:bg-transparent">
                                <TableHead>Nome</TableHead>
                                <TableHead>PIN</TableHead>
                                <TableHead className="text-right">Ação</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {barbers.map(barber => (
                                <TableRow key={barber.id} className="border-gold/10 hover:bg-gold/5">
                                    <TableCell className="font-medium">{barber.name}</TableCell>
                                    <TableCell className="font-mono">****</TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                            onClick={() => handleDeleteBarber(barber.id, barber.name)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center p-8 text-muted-foreground italic">Nenhum barbeiro cadastrado.</div>
                )}
            </CardContent>
        </Card>
      </main>
    </div>
  );
}

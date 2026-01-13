
'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, where, Timestamp, writeBatch, doc } from 'firebase/firestore';
import { Loader2, ArrowLeft, CheckCircle, User, Clock, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { GrantPrizeOrSpinModal } from '@/components/admin/GrantPrizeOrSpinModal';
import type { ClientData } from '../confirmar-corte/page';

const { firestore } = initializeFirebase();

interface PendingSpin {
  id: string;
  userId: string;
  usedAt: Timestamp;
  userName?: string;
}

const SkeletonLoader = () => (
    <div className='animate-pulse'>
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className='hover:bg-transparent'>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Usado em</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(3)].map((_, i) => (
                        <TableRow key={i} className='border-dark-gray'>
                            <TableCell><div className='h-5 w-32 bg-muted rounded'></div></TableCell>
                            <TableCell><div className='h-5 w-24 bg-muted rounded'></div></TableCell>
                            <TableCell className="text-right"><div className='h-9 w-32 bg-muted rounded ml-auto'></div></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
);


export default function ConfirmSpinsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pendingSpins, setPendingSpins] = useState<PendingSpin[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  const fetchPendingSpins = async () => {
      try {
        const spinsQuery = query(
            collection(firestore, 'spins'), 
            where('status', '==', 'used_pending_confirm')
            );
        const spinsSnapshot = await getDocs(spinsQuery);

        const spinsList: PendingSpin[] = spinsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as PendingSpin));
        
        // Fetch user names for each spin
        const spinsWithUserData = await Promise.all(spinsList.map(async (spin) => {
            // Because userId is the phone number, which is the document ID for users
            const userDocRef = doc(firestore, 'users', spin.userId);
            const userDoc = await getDoc(userDocRef);
            const userName = userDoc.exists() ? userDoc.data().name : 'Cliente não encontrado';
            return { ...spin, userName };
        }));

        // Sort by date client-side since Firestore requires an index
        spinsWithUserData.sort((a,b) => b.usedAt.toMillis() - a.usedAt.toMillis());

        setPendingSpins(spinsWithUserData);
      } catch (error) {
        console.error("Failed to fetch pending spins:", error);
        toast({ variant: 'destructive', title: 'Erro ao buscar giros', description: 'Não foi possível carregar os giros pendentes.'})
      } finally {
        setLoading(false);
      }
    };
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      fetchPendingSpins();
    }
  }, [isClient]);

  const handleOpenModal = async (clientPhone: string, clientName: string) => {
      const userDocRef = doc(firestore, 'users', clientPhone);
      const userDocSnapshot = await getDoc(userDocRef);
      
      if(!userDocSnapshot.exists()){
          toast({variant: 'destructive', title: 'Cliente não encontrado'});
          return;
      }
      const userData = userDocSnapshot.data();
      setSelectedClient({
        id: clientPhone,
        name: clientName,
        cortesAtuais: userData.cortesAtuais,
        totalCortes: userData.totalCortes,
      });
      setIsModalOpen(true);
  };
  
  const handleModalClose = () => {
      setIsModalOpen(false);
      setSelectedClient(null);
      // Refresh list after modal closes
      setLoading(true);
      fetchPendingSpins();
  }


  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      {selectedClient && (
        <GrantPrizeOrSpinModal 
            isOpen={isModalOpen}
            onClose={handleModalClose}
            client={selectedClient}
        />
      )}
      <header className="p-4 flex justify-between items-center border-b border-gold/20 sticky top-0 bg-deep-black/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-gold" />
        </Button>
        <h1 className="font-headline text-xl text-ice-white uppercase flex items-center gap-2"><CheckCircle/> Confirmar Giros Usados</h1>
        <div></div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {loading ? <SkeletonLoader /> : (
            <Card className="bg-dark-gray border-gold/20">
                <CardHeader>
                    <CardTitle>Giros Pendentes de Confirmação</CardTitle>
                    <CardDescription>Confirme o prêmio que o cliente tirou na roleta para registrar no histórico dele.</CardDescription>
                </CardHeader>
                <CardContent>
                   {pendingSpins.length > 0 ? (
                     <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className='hover:bg-transparent border-gold/10'>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Usado em</TableHead>
                                    <TableHead className="text-right">Ação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pendingSpins.map(spin => (
                                    <TableRow key={spin.id} className='border-gold/5'>
                                        <TableCell className='font-medium'>{spin.userName}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {format(spin.usedAt.toDate(), 'dd/MM/yyyy HH:mm')}
                                                </span>
                                            </div>
                                            <span className='text-xs text-muted-foreground ml-6'>
                                                ({formatDistanceToNow(spin.usedAt.toDate(), { addSuffix: true, locale: ptBR })})
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button 
                                                size="sm" 
                                                className='bg-gold hover:bg-gold/90 text-deep-black font-bold h-9'
                                                onClick={() => handleOpenModal(spin.userId, spin.userName || 'Cliente')}
                                            >
                                                Confirmar Prêmio
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                   ) : (
                    <div className='text-center p-8 border border-dashed border-gold/10 rounded-lg'>
                        <Info className='h-12 w-12 mx-auto text-muted-foreground'/>
                        <p className='mt-4 text-muted-foreground'>Nenhum giro pendente.</p>
                        <p className='text-sm text-muted-foreground/70'>Quando um cliente usar um giro no app, ele aparecerá aqui para confirmação.</p>
                    </div>
                   )}
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}

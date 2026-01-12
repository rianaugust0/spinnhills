
'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Loader2, ArrowLeft, Users, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WhatsappIcon } from '@/components/ui/WhatsappIcon';

const { firestore } = initializeFirebase();

interface Client {
  id: string;
  name: string;
  phone: string;
  lastVisit?: Timestamp;
  totalCortes: number;
}

const ClientListSkeleton = () => (
    <div className='animate-pulse'>
         <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className='hover:bg-transparent'>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Última Visita</TableHead>
                        <TableHead>Dias sem Vir</TableHead>
                        <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {[...Array(5)].map((_, i) => (
                        <TableRow key={i} className='border-dark-gray'>
                            <TableCell><div className='h-5 w-32 bg-muted rounded'></div></TableCell>
                            <TableCell><div className='h-5 w-24 bg-muted rounded'></div></TableCell>
                            <TableCell><div className='h-5 w-20 bg-muted rounded'></div></TableCell>
                            <TableCell className="text-right"><div className='h-9 w-32 bg-muted rounded ml-auto'></div></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    </div>
);


export default function ClientReturnPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchClients = async () => {
      try {
        const clientsQuery = query(collection(firestore, 'users'), orderBy('lastVisit', 'asc'));
        const clientsSnapshot = await getDocs(clientsQuery);

        const clientsList = clientsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Client));
        
        setClients(clientsList);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [isClient]);

  const getDaysSinceLastVisit = (lastVisit?: Timestamp): number | null => {
    if (!lastVisit) return null;
    return differenceInDays(new Date(), lastVisit.toDate());
  };

  const getBadgeVariant = (days: number | null): 'destructive' | 'secondary' | 'default' => {
    if (days === null) return 'secondary';
    if (days >= 15) return 'destructive';
    if (days >= 8) return 'secondary';
    return 'default';
  };
  
  const getBadgeClass = (days: number | null) => {
    if (days === null) return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    if (days >= 15) return 'bg-red-900/40 text-red-300 border-red-500/50';
    if (days >= 8) return 'bg-yellow-900/40 text-yellow-300 border-yellow-500/50';
    return 'bg-green-900/40 text-green-300 border-green-500/50';
  }

  const openWhatsApp = (phone: string, name: string, days: number | null) => {
    const userFirstName = name.split(' ')[0];
    const daysText = days ? `Faz ${days} dias que você não vem cortar o cabelo 💈` : "Notamos sua ausência e queremos você de volta! 💈";
    const message = `Olá ${userFirstName} 👋\n${daysText}\n\nTemos um prêmio especial te esperando 🎁\n\nTe esperamos!`;
    const whatsappUrl = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      <header className="p-4 flex justify-between items-center border-b border-gold/20 sticky top-0 bg-deep-black/80 backdrop-blur-sm z-10">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin')} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-gold" />
        </Button>
        <h1 className="font-headline text-xl text-ice-white uppercase flex items-center gap-2"><Users/> Retorno de Clientes</h1>
        <div></div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {loading ? <ClientListSkeleton /> : (
            <Card className="bg-dark-gray border-gold/20">
                <CardHeader>
                    <CardTitle>Lista de Clientes</CardTitle>
                    <CardDescription>Acompanhe a frequência dos seus clientes e incentive o retorno.</CardDescription>
                </CardHeader>
                <CardContent>
                   {clients.length > 0 ? (
                     <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className='hover:bg-transparent border-gold/10'>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Última Visita</TableHead>
                                    <TableHead>Dias sem Vir</TableHead>
                                    <TableHead className="text-right">Ação</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.map(client => {
                                    const days = getDaysSinceLastVisit(client.lastVisit);
                                    return (
                                        <TableRow key={client.id} className='border-gold/5'>
                                            <TableCell className='font-medium'>{client.name}</TableCell>
                                            <TableCell>
                                                {client.lastVisit ? format(client.lastVisit.toDate(), 'dd/MM/yyyy') : 'N/A'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={getBadgeClass(days)}>
                                                    {days !== null ? `${days} dias` : 'N/A'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button 
                                                    size="sm" 
                                                    className='bg-whatsapp hover:bg-whatsapp/90 text-white h-9'
                                                    onClick={() => openWhatsApp(client.phone, client.name, days)}
                                                >
                                                    <WhatsappIcon className='h-4 w-4 mr-2'/>
                                                    Chamar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                   ) : (
                    <div className='text-center p-8 border border-dashed border-gold/10 rounded-lg'>
                        <Users className='h-12 w-12 mx-auto text-muted-foreground'/>
                        <p className='mt-4 text-muted-foreground'>Nenhum cliente encontrado.</p>
                        <p className='text-sm text-muted-foreground/70'>Quando os clientes se cadastrarem, eles aparecerão aqui.</p>
                    </div>
                   )}
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}

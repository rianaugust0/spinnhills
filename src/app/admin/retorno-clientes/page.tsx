
'use client';

import { useEffect, useState } from 'react';
import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, orderBy, Timestamp } from 'firebase/firestore';
import { Loader2, ArrowLeft, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format, differenceInDays } from 'date-fns';
import { WhatsappIcon } from '@/components/ui/WhatsappIcon';

const { firestore } = initializeFirebase();

interface Client {
  id: string;
  name: string;
  phone: string;
  lastVisit?: Timestamp;
  totalCortes: number;
}

export default function ClientReturnPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsQuery = query(collection(firestore, 'users'));
        const snapshot = await getDocs(clientsQuery);
        let list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
        
        list.sort((a, b) => {
          const dateA = a.lastVisit ? a.lastVisit.toDate().getTime() : 0;
          const dateB = b.lastVisit ? b.lastVisit.toDate().getTime() : 0;
          return dateA - dateB;
        });
        
        setClients(list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const openWhatsApp = (phone: string, name: string) => {
    const firstName = name.split(' ')[0];
    const emojiCool = String.fromCodePoint(0x1F60E);
    const emojiScissors = String.fromCodePoint(0x2702, 0xFE0F);

    const message = `E aí, ${firstName}! Tudo certo? \nFaz um tempo que você não aparece por aqui, bora marcar aquele corte e voltar pro estilo? ${emojiCool}${emojiScissors}`;
    const url = `https://api.whatsapp.com/send?phone=55${phone.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      <header className="p-4 flex justify-between items-center border-b border-gold/20">
        <Button variant="ghost" size="icon" onClick={() => router.push('/admin')}>
          <ArrowLeft className="h-5 w-5 text-gold" />
        </Button>
        <h1 className="font-headline text-xl uppercase flex items-center gap-2"><Users/> Retorno de Clientes</h1>
        <div className="w-10"></div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {loading ? <div className="flex justify-center p-8"><Loader2 className="animate-spin text-gold" /></div> : (
          <Card className="bg-dark-gray border-gold/20">
            <CardHeader>
              <CardTitle>Clientes por Última Visita</CardTitle>
              <CardDescription>Acompanhe a frequência e incentive o retorno.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gold/10 hover:bg-transparent">
                    <TableHead>Cliente</TableHead>
                    <TableHead>Última Visita</TableHead>
                    <TableHead className="text-right">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map(client => {
                    const days = client.lastVisit ? differenceInDays(new Date(), client.lastVisit.toDate()) : null;
                    return (
                      <TableRow key={client.id} className="border-gold/5">
                        <TableCell className="font-medium">{client.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={days && days >= 15 ? 'text-red-400 border-red-400/30' : 'text-green-400 border-green-400/30'}>
                            {days !== null ? `${days} dias` : 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" className="bg-whatsapp hover:bg-whatsapp/90 text-white" onClick={() => openWhatsApp(client.phone, client.name)}>
                            <WhatsappIcon className="h-4 w-4 mr-2"/> Chamar
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

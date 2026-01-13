
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, User, FerrisWheel, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, serverTimestamp, writeBatch, query, where, getDocs, addDoc } from 'firebase/firestore';

const { firestore } = initializeFirebase();

type ClientInfo = {
    id: string;
    name: string;
}

export default function GiroManualPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<ClientInfo | null>(null);
  const [step, setStep] = useState<'findClient' | 'confirmAction'>('findClient');

  const handleFindClient = async () => {
    const sanitizedPhone = phone.replace(/\D/g, '');
    if (sanitizedPhone.length < 10) {
      toast({ variant: 'destructive', title: 'Telefone inválido' });
      return;
    }
    setLoading(true);
    try {
      const userDocRef = doc(firestore, 'users', sanitizedPhone);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setClient({
            id: userDoc.id,
            name: userData.name,
        });
        setStep('confirmAction');
      } else {
        toast({ variant: 'destructive', title: 'Cliente não encontrado' });
        setClient(null);
      }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erro ao buscar cliente' });
    } finally {
      setLoading(false);
    }
  };

  const handleGrantManualSpin = async () => {
    if (!client) return;

    setLoading(true);
    const barberPin = sessionStorage.getItem('barber-pin');
    if (!barberPin) {
        toast({ variant: 'destructive', title: 'Sessão do barbeiro expirada.', description: 'Faça o login novamente.' });
        setLoading(false);
        return;
    }

    try {
        const barbersQuery = query(collection(firestore, 'barbers'), where('pin', '==', barberPin));
        const barberSnapshot = await getDocs(barbersQuery);
        if (barberSnapshot.empty) {
            throw new Error('PIN do barbeiro inválido ou inativo.');
        }
        const barberId = barberSnapshot.docs[0].id;
        
        await addDoc(collection(firestore, 'spins'), {
            userId: client.id,
            origin: 'manual',
            status: 'available',
            createdAt: serverTimestamp(),
            usedAt: null,
            notes: `Giro concedido manualmente pelo barbeiro ${barberId}.`
        });

        toast({
            title: 'Giro Concedido!',
            description: `${client.name.split(' ')[0]} ganhou +1 giro.`,
        });
        
        // Go back to find client screen
        setClient(null);
        setPhone('');
        setStep('findClient');

    } catch (error: any) {
        console.error(error);
        toast({
            variant: 'destructive',
            title: 'Falha ao conceder o giro',
            description: error.message || 'Não foi possível completar a operação.',
        });
    } finally {
        setLoading(false);
    }
  };

  const resetState = () => {
      setClient(null);
      setPhone('');
      setStep('findClient');
  };


  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => step === 'confirmAction' ? resetState() : router.back()} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-gold" />
        </Button>
         <h1 className="font-headline text-xl text-ice-white uppercase">Conceder Giro Manual</h1>
         <div></div>
      </header>
      <main className="flex-1 flex flex-col items-center container mx-auto px-4 py-8">
        {step === 'findClient' ? (
            <Card className="w-full max-w-sm bg-dark-gray border-gold/20 text-center animate-fade-in-up">
                <CardHeader>
                    <User className='h-12 w-12 mx-auto text-gold/50'/>
                    <CardTitle className="font-headline text-3xl text-gold uppercase">Identificar Cliente</CardTitle>
                    <CardDescription>Digite o telefone do cliente para liberar um giro.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        type="tel"
                        placeholder="Telefone do Cliente"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12"
                    />
                    <Button
                        onClick={handleFindClient}
                        disabled={loading || !phone}
                        className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
                        >
                        {loading ? <Loader2 className="animate-spin" /> : 'Buscar Cliente'}
                    </Button>
                </CardContent>
            </Card>
        ) : client && (
             <Card className="w-full max-w-sm bg-dark-gray border-gold/20 animate-fade-in-up">
                <CardHeader className='text-center'>
                     <FerrisWheel className='h-12 w-12 mx-auto text-gold/50'/>
                    <CardTitle className="font-headline text-3xl text-gold uppercase">Conceder para <strong className='text-gold'>{client.name.split(' ')[0]}</strong></CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Card className="bg-deep-black border-gold/10">
                        <CardHeader className='pb-4'>
                            <CardTitle className="text-lg">Conceder +1 Giro Manualmente</CardTitle>
                            <CardDescription className='text-xs'>Esta ação adicionará um giro disponível na conta do cliente. Use para promoções, sorteios ou outras necessidades.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button 
                                className='w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base' 
                                onClick={handleGrantManualSpin}
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin" /> : 'Confirmar e Conceder +1 Giro'}
                            </Button>
                        </CardContent>
                    </Card>
                    
                     <Button variant="link" onClick={resetState} className='text-gold/80 w-full'>Buscar outro cliente</Button>
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}

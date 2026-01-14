
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, User, Gift, Check, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, serverTimestamp, writeBatch } from 'firebase/firestore';

const { firestore } = initializeFirebase();

type ClientInfo = {
    id: string;
    name: string;
    instagramReviewRewardUsed: boolean;
}

export default function LiberarGiroPage() {
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
            instagramReviewRewardUsed: userData.instagramReviewRewardUsed || false,
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

  const handleGrantInstagramReviewSpin = async () => {
    if (!client) return;
    if (client.instagramReviewRewardUsed) {
        toast({ variant: 'destructive', title: 'Benefício já utilizado', description: 'Este cliente já resgatou o giro por avaliação.' });
        return;
    }
    setLoading(true);

    try {
        const batch = writeBatch(firestore);
        const userDocRef = doc(firestore, 'users', client.id);

        batch.update(userDocRef, { 
            instagramReviewRewardUsed: true 
        });

        const spinDocRef = doc(collection(firestore, 'spins'));
        batch.set(spinDocRef, {
            userId: client.id,
            origin: 'instagram_avaliacao',
            status: 'available',
            createdAt: serverTimestamp(),
            usedAt: null,
            notes: 'Giro concedido por seguir o Instagram e avaliar no Google.'
        });

        await batch.commit();

        toast({
            title: 'Giro Concedido!',
            description: `${client.name.split(' ')[0]} ganhou +1 giro.`,
        });
        
        setClient(prev => prev ? ({ ...prev, instagramReviewRewardUsed: true }) : null);

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
         <h1 className="font-headline text-xl text-ice-white uppercase">Liberar Giro por Ação</h1>
         <div></div>
      </header>
      <main className="flex-1 flex flex-col items-center container mx-auto px-4 py-8">
        {step === 'findClient' ? (
            <Card className="w-full max-w-sm bg-dark-gray border-gold/20 text-center animate-fade-in-up">
                <CardHeader>
                    <User className='h-12 w-12 mx-auto text-gold/50'/>
                    <CardTitle className="font-headline text-3xl text-gold uppercase">Identificar Cliente</CardTitle>
                    <CardDescription>Digite o telefone do cliente para verificar os benefícios.</CardDescription>
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
                     <Gift className='h-12 w-12 mx-auto text-gold/50'/>
                    <CardTitle className="font-headline text-3xl text-gold uppercase">Ações para <strong className='text-gold'>{client.name.split(' ')[0]}</strong></CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Card className="bg-deep-black border-gold/10">
                        <CardHeader className='pb-4'>
                            <CardTitle className="text-lg">Instagram + Avaliação Google</CardTitle>
                            <CardDescription className='text-xs'>Conceder +1 giro por seguir no Instagram e fazer uma avaliação 5 estrelas no Google.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {client.instagramReviewRewardUsed ? (
                                <div className="flex items-center gap-2 text-green-400 p-2 bg-green-900/20 rounded-md">
                                    <Check className="h-5 w-5" />
                                    <p className="text-sm font-medium">Benefício já utilizado por este cliente.</p>
                                </div>
                            ) : (
                                <Button 
                                    className='w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base' 
                                    onClick={handleGrantInstagramReviewSpin}
                                    disabled={loading}
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : 'Confirmar e Conceder +1 Giro'}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                    
                    <Card className="bg-deep-black border-gold/10 opacity-50 cursor-not-allowed">
                        <CardHeader className='pb-4'>
                             <CardTitle className="text-lg flex items-center gap-2">Indicação de Amigo <span className='text-xs'>(Automático)</span></CardTitle>
                             <CardDescription className='text-xs'>O giro por indicação é concedido automaticamente quando o amigo indicado faz o primeiro corte.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className='w-full' disabled>
                                <Info className='mr-2 h-4 w-4' />
                                Ação automática
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

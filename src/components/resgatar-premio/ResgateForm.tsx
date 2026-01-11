
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { initializeFirebase, useDoc } from '@/firebase';
import { doc, runTransaction, serverTimestamp, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

const { firestore } = initializeFirebase();

export function ResgateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prizeId = searchParams.get('prizeId');
  const { toast } = useToast();

  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const prizeDocRef = useMemo(() => {
    if (!prizeId) return null;
    return doc(firestore, 'prizes', prizeId);
  }, [prizeId]);

  const { data: prizeData, isLoading: isPrizeLoading } = useDoc(prizeDocRef);

  useEffect(() => {
    if (!prizeId) {
      toast({ variant: 'destructive', title: 'URL inválida', description: "O prêmio não foi especificado." });
      router.push('/dashboard');
    }
  }, [prizeId, router, toast]);

  const handleRedeem = async () => {
    if (pin.length < 4) {
      toast({ variant: 'destructive', title: 'PIN inválido', description: 'O PIN do barbeiro deve ter 4 dígitos.' });
      return;
    }
    if (!prizeDocRef || !prizeData) return;

    setLoading(true);

    try {
      const barbersQuery = query(collection(firestore, 'barbers'), where('pin', '==', pin));
      const barberSnapshot = await getDocs(barbersQuery);

      if (barberSnapshot.empty) {
        throw new Error('PIN do barbeiro inválido.');
      }
      const barber = barberSnapshot.docs[0];

      setSuccess(true);
      toast({ title: 'Prêmio resgatado com sucesso!', description: `${prizeData?.title} foi validado.` });
      
      updateDocumentNonBlocking(prizeDocRef, {
        status: 'used',
        usedAt: serverTimestamp(),
        usedByBarberId: barber.id,
      });

    } catch (error: any) {
      console.error("Redemption failed:", error);
      setSuccess(false);
      toast({
        variant: 'destructive',
        title: 'Ops! Algo deu errado.',
        description: error.message || 'Não foi possível resgatar o prêmio.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPrizeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
      </div>
    );
  }

  if (success) {
      return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
            <div className='animate-fade-in-up'>
                <CheckCircle className="h-24 w-24 text-green-500 mx-auto animate-pulse" />
                <h1 className="font-headline text-4xl text-gold uppercase tracking-widest mt-4">Prêmio Resgatado!</h1>
                <p className='text-ice-white text-lg mt-2'>"{prizeData?.title}" foi aplicado com sucesso.</p>
                <Button onClick={() => router.push('/dashboard')} className='mt-8 w-full max-w-sm'>Voltar ao Início</Button>
            </div>
        </div>
      )
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
        <header className="p-4 flex justify-between items-center">
            <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Voltar">
            <ArrowLeft className="h-5 w-5 text-gold" />
            </Button>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 pb-8">
            <Card className="w-full max-w-sm bg-dark-gray border-gold/20 text-center animate-fade-in-up">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl text-gold uppercase">Resgatar Prêmio</CardTitle>
                    <CardDescription>Peça para um barbeiro digitar o PIN para confirmar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className='p-4 bg-deep-black rounded-lg border border-gold/10'>
                        <p className='text-muted-foreground'>Prêmio:</p>
                        <p className='text-xl font-bold text-ice-white'>{prizeData?.title}</p>
                    </div>
                    <div className="space-y-2">
                        <Input
                            type="password"
                            inputMode='numeric'
                            placeholder="Digite o PIN do barbeiro"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                            className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12 placeholder:text-muted-foreground/50"
                        />
                        <Button
                            onClick={handleRedeem}
                            disabled={loading || !pin}
                            className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Confirmar Resgate'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}

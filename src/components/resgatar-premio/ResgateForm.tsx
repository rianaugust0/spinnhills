
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { initializeFirebase, useDoc } from '@/firebase';
import { doc, serverTimestamp, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const { firestore } = initializeFirebase();

export function ResgateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prizeId = searchParams.get('prizeId');
  const { toast } = useToast();

  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const MASTER_PIN = '2277';

  const prizeDocRef = useMemo(() => {
    if (!prizeId) return null;
    return doc(firestore, 'prizes', prizeId);
  }, [prizeId]);

  const { data: prizeData, isLoading: isPrizeLoading } = useDoc(prizeDocRef);

  const handleRedeem = async () => {
    if (pin !== MASTER_PIN) {
      toast({ variant: 'destructive', title: 'PIN inválido' });
      setPin('');
      return;
    }
    setLoading(true);
    try {
      await updateDoc(prizeDocRef!, {
        status: 'redeemed',
        redeemedAt: serverTimestamp(),
        usedByBarberId: 'admin_master',
      });
      setSuccess(true);
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Erro ao resgatar', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  if (isPrizeLoading) return <div className="flex min-h-screen items-center justify-center bg-deep-black"><Loader2 className="animate-spin text-gold" /></div>;

  if (success) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black text-center p-4">
        <CheckCircle className="h-24 w-24 text-green-500 animate-pulse" />
        <h1 className="font-headline text-4xl text-gold mt-4 uppercase">Resgatado!</h1>
        <Button onClick={() => router.push('/dashboard')} className="mt-8 h-12 w-full max-w-sm">Voltar</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black">
      <header className="p-4"><Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="h-5 w-5 text-gold" /></Button></header>
      <main className="container mx-auto px-4 flex justify-center py-8">
        <Card className="w-full max-w-sm bg-dark-gray border-gold/20 text-center">
          <CardHeader>
            <CardTitle className="text-gold uppercase">Resgatar Prêmio</CardTitle>
            <CardDescription>{prizeData?.title}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="password" inputMode="numeric" placeholder="PIN do Barbeiro" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} maxLength={4} className="bg-deep-black h-12 text-center" autoFocus />
            <Button onClick={handleRedeem} disabled={loading || pin.length < 4} className="w-full bg-gold text-deep-black font-bold h-12 uppercase">
              {loading ? <Loader2 className="animate-spin" /> : 'Confirmar Resgate'}
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

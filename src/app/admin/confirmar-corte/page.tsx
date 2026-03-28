
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, User, Scissors, CheckCircle, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { initializeFirebase } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs, serverTimestamp, Timestamp, writeBatch, increment } from 'firebase/firestore';
import { isAfter } from 'date-fns';

const { firestore } = initializeFirebase();

export default function ConfirmarCortePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<any>(null);
  const [step, setStep] = useState<'findClient' | 'confirmCut' | 'success'>('findClient');

  const MASTER_PIN = '2277';

  const handleFindClient = async () => {
    const sanitized = phone.replace(/\D/g, '');
    if (sanitized.length < 10) {
      toast({ variant: 'destructive', title: 'Telefone inválido' });
      return;
    }
    setLoading(true);
    try {
      const snap = await getDoc(doc(firestore, 'users', sanitized));
      if (snap.exists()) {
        setClient({ id: snap.id, ...snap.data() });
        setStep('confirmCut');
      } else {
        toast({ variant: 'destructive', title: 'Cliente não encontrado' });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCut = async () => {
    if (pin !== MASTER_PIN) {
      toast({ variant: 'destructive', title: 'PIN inválido' });
      setPin('');
      return;
    }
    setLoading(true);
    try {
      const batch = writeBatch(firestore);
      const now = serverTimestamp();
      const userRef = doc(firestore, 'users', client.id);

      let newCortes = (client.cortesAtuais || 0) + 1;
      if (newCortes >= 5) {
        newCortes = 0;
        const spinRef = doc(collection(firestore, 'spins'));
        batch.set(spinRef, { userId: client.id, status: 'available', origin: 'fidelidade_5_cortes', createdAt: now });
      }

      batch.update(userRef, { cortesAtuais: newCortes, totalCortes: increment(1), lastVisit: now, updatedAt: now });
      batch.set(doc(collection(firestore, 'cuts')), { userId: client.id, barberId: 'admin_master', date: now });

      await batch.commit();
      setStep('success');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
        <CheckCircle className="h-24 w-24 text-green-500 animate-pulse" />
        <h1 className="font-headline text-4xl text-gold mt-4">CORTE CONFIRMADO!</h1>
        <Button onClick={() => {setStep('findClient'); setPhone(''); setPin('');}} className="mt-8 h-12 w-full max-w-sm">Próximo</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black">
      <header className="p-4 flex items-center border-b border-gold/20">
        <Button variant="ghost" size="icon" onClick={() => step === 'confirmCut' ? setStep('findClient') : router.back()}>
          <ArrowLeft className="h-5 w-5 text-gold" />
        </Button>
        <h1 className="font-headline text-xl text-ice-white ml-2">CONFIRMAR CORTE</h1>
      </header>
      <main className="container mx-auto py-8 px-4 flex justify-center">
        {step === 'findClient' ? (
          <Card className="w-full max-w-sm bg-dark-gray border-gold/20">
            <CardHeader className="text-center">
              <User className="h-12 w-12 mx-auto text-gold/50" />
              <CardTitle className="text-gold uppercase">Identificar Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="tel" placeholder="Telefone do Cliente" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-deep-black h-12 text-center" />
              <Button onClick={handleFindClient} disabled={loading} className="w-full bg-gold text-deep-black font-bold h-12">
                {loading ? <Loader2 className="animate-spin" /> : 'BUSCAR'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-sm bg-dark-gray border-gold/20">
            <CardHeader className="text-center">
              <Scissors className="h-12 w-12 mx-auto text-gold/50" />
              <CardTitle className="text-gold uppercase">{client.name.split(' ')[0]}</CardTitle>
              <CardDescription>Progresso: {client.cortesAtuais}/5</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input type="password" placeholder="PIN do Barbeiro" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} maxLength={4} className="bg-deep-black h-12 text-center" autoFocus />
              <Button onClick={handleConfirmCut} disabled={loading || pin.length < 4} className="w-full bg-gold text-deep-black font-bold h-12">
                {loading ? <Loader2 className="animate-spin" /> : 'CONFIRMAR'}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

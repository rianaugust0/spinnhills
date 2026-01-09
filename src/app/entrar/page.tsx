
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FerrisWheel } from 'lucide-react';
import { initializeFirebase } from '@/firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const { firestore } = initializeFirebase();

export default function EntrarPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleRegistration = async () => {
    if (name.length < 3) {
      toast({ variant: 'destructive', title: 'Nome inválido', description: 'Por favor, insira seu nome completo.' });
      return;
    }
    // Basic phone validation (e.g., at least 10 digits)
    const sanitizedPhone = phone.replace(/\D/g, '');
    if (sanitizedPhone.length < 10) {
      toast({ variant: 'destructive', title: 'Telefone inválido', description: 'Por favor, insira um telefone com DDD.' });
      return;
    }
    
    setLoading(true);

    try {
      const userDocRef = doc(firestore, 'users', sanitizedPhone);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // User does not exist, create a new document
        await setDoc(userDocRef, {
          name: name,
          phone: sanitizedPhone,
          totalCortes: 0,
          cortesAtuais: 0,
          girosDisponiveis: 0,
          premiosAtivos: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        toast({ title: `Bem-vindo, ${name.split(' ')[0]}!`, description: 'Sua jornada no Spin Hills começou.' });
      } else {
        // User already exists, just log them in
        toast({ title: `Bem-vindo de volta, ${userDoc.data().name.split(' ')[0]}!` });
      }
      
      // Create session in browser
      localStorage.setItem('spin-hills-user-phone', sanitizedPhone);
      
      router.push('/dashboard');

    } catch (error) {
       console.error("Registration failed:", error);
       toast({
          variant: 'destructive',
          title: 'Ops! Algo deu errado.',
          description: 'Não foi possível completar seu cadastro. Tente novamente.',
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
      <div className="w-full max-w-sm animate-fade-in-up">
        <FerrisWheel className="h-16 w-16 text-gold mx-auto mb-4" />
         <h1 className="font-headline text-5xl text-gold uppercase tracking-widest mb-2">
            SPIN HILLS
        </h1>
        <h2 className="font-body text-xl font-bold text-ice-white">Antes de começar...</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Só precisamos te identificar para registrar seus giros e prêmios. 😉
        </p>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Seu Nome Completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-dark-gray border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12"
          />
          <Input
            type="tel"
            placeholder="Seu Telefone (XX) XXXXX-XXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="bg-dark-gray border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12"
          />
          <Button
            onClick={handleRegistration}
            disabled={loading}
            className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar no Clube'}
          </Button>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// This is a simplified login/registration flow without actual Firebase Auth
// It simulates finding or creating a user and then navigating to the dashboard

export default function WelcomePage() {
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
    if (phone.length < 10) {
      toast({ variant: 'destructive', title: 'Telefone inválido', description: 'Por favor, insira um telefone com DDD.' });
      return;
    }
    
    setLoading(true);

    // In a real application, you would:
    // 1. Call a serverless function or use client-side SDK to find or create a user.
    // 2. For this simplified approach, we use localStorage as a session manager.
    
    try {
      // Here you would interact with Firestore
      // For now, we simulate success and save to localStorage
      console.log(`Finding or creating user with phone: ${phone}`);
      
      // We'll use the phone number as the "session token" for simplicity
      localStorage.setItem('hills-user-phone', phone);
      
      toast({ title: 'Bem-vindo ao Club Hills!', description: 'Seu acesso foi liberado.' });
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
        <h1 className="font-headline text-5xl text-gold uppercase tracking-widest mb-2">
          HillsCut
        </h1>
        <h2 className="font-body text-xl font-bold text-ice-white">Entre em menos de 10 segundos</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Só precisamos do básico pra registrar seus pontos.
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
            {loading ? <Loader2 className="animate-spin" /> : 'Começar a Pontuar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

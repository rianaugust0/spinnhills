
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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
    if (phone.length < 10) {
      toast({ variant: 'destructive', title: 'Telefone inválido', description: 'Por favor, insira um telefone com DDD.' });
      return;
    }
    
    setLoading(true);

    // In a real application, you would use Firestore here.
    // For now, we simulate success and save to localStorage to create the session.
    try {
      console.log(`Creating user with phone: ${phone} and name: ${name}`);
      // TODO: Add Firestore logic to find or create user.
      
      localStorage.setItem('spin-hills-user-phone', phone);
      localStorage.setItem('spin-hills-user-name', name);
      
      toast({ title: `Bem-vindo, ${name.split(' ')[0]}!`, description: 'Sua jornada no Spin Hills começou.' });
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
          HILLSCUT
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
            {loading ? <Loader2 className="animate-spin" /> : 'Começar a Girar'}
          </Button>
        </div>
      </div>
    </div>
  );
}

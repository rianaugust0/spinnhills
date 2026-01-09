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
  const [step, setStep] = useState<'welcome' | 'register'>('welcome');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleRegistration = () => {
    if (name.length < 3) {
      toast({ variant: 'destructive', title: 'Nome inválido', description: 'Por favor, insira seu nome.' });
      return;
    }
    if (phone.length < 10) {
      toast({ variant: 'destructive', title: 'Telefone inválido', description: 'Por favor, insira um telefone com DDD.' });
      return;
    }
    
    setLoading(true);

    // In a real application, you would:
    // 1. Call a serverless function to find or create a user in Firestore.
    // 2. The function would return a custom token.
    // 3. You would use signInWithCustomToken() on the client.
    // 4. For this demo, we'll just simulate success and redirect.

    setTimeout(() => {
      console.log(`Registering or logging in user: ${name} with phone: ${phone}`);
      toast({ title: 'Bem-vindo ao Club Hills!', description: 'Seu acesso foi liberado.' });
      
      // We simulate creating a "session" by just redirecting.
      // A real app would use auth state.
      router.push('/dashboard');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
      <div className="w-full max-w-sm">
        <h1 className="font-headline text-5xl text-gold uppercase tracking-widest mb-2">
          HillsCut
        </h1>
        
        {step === 'welcome' && (
          <div className="space-y-6 animate-fade-in-up">
             <h2 className="font-body text-xl text-ice-white mt-2 mb-8">
              Seu corte agora vale prêmios
            </h2>
            <p className="text-muted-foreground">
              Junte-se ao Club Hills, complete desafios e gire a roleta para ganhar benefícios exclusivos.
            </p>
            <Button
              onClick={() => setStep('register')}
              className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
            >
              Entrar no Club Hills
            </Button>
          </div>
        )}

        {step === 'register' && (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="font-body text-xl font-bold text-ice-white">Acesse sua conta</h2>
            <p className="text-muted-foreground">
              Usamos seu telefone para identificar seu progresso e seus prêmios. Sem senhas, sem complicação.
            </p>
            <Input
              type="text"
              placeholder="Seu Nome"
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
              {loading ? <Loader2 className="animate-spin" /> : 'Acessar Meus Prêmios'}
            </Button>
             <Button
              variant="link"
              onClick={() => setStep('welcome')}
              className="text-gold/80 hover:text-gold"
            >
              Voltar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

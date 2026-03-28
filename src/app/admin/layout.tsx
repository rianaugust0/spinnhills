
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const MASTER_PIN = '2277';

  useEffect(() => {
    const sessionPin = sessionStorage.getItem('barber-pin');
    if (sessionPin === MASTER_PIN) {
      setIsAuthenticated(true);
    }
    setIsCheckingSession(false);
  }, []);

  const handleLogin = async () => {
    if (pin === MASTER_PIN) {
      sessionStorage.setItem('barber-pin', pin);
      setIsAuthenticated(true);
      toast({ title: 'Acesso liberado!', description: 'Bem-vindo ao painel.' });
    } else {
      toast({ variant: 'destructive', title: 'PIN inválido' });
      setPin('');
    }
  };

  useEffect(() => {
    if (pin.length === 4 && !isAuthenticated) {
      handleLogin();
    }
  }, [pin]);

  if (isCheckingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black p-4">
        <Card className="w-full max-w-sm bg-dark-gray border-gold/20 text-center animate-fade-in-up">
          <CardHeader>
            <Shield className="h-12 w-12 mx-auto text-gold/50" />
            <CardTitle className="font-headline text-3xl text-gold uppercase">Área Restrita</CardTitle>
            <CardDescription>Insira o PIN 2277 para continuar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              inputMode="numeric"
              placeholder="Digite o PIN"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12"
              autoFocus
            />
            <Button
              onClick={handleLogin}
              disabled={loading || pin.length < 4}
              className="w-full bg-gold text-deep-black font-bold h-12 text-base"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

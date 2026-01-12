
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initializeFirebase } from '@/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const { firestore } = initializeFirebase();

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

  useEffect(() => {
    // This code now runs only on the client
    const checkSession = async () => {
        try {
            const sessionPin = sessionStorage.getItem('barber-pin');
            if (sessionPin) {
                const isValid = await validatePin(sessionPin, false);
                if (isValid) {
                    setIsAuthenticated(true);
                } else {
                    sessionStorage.removeItem('barber-pin');
                }
            }
        } catch (error) {
            console.error("Failed to check session", error);
        } finally {
            setIsCheckingSession(false);
        }
    };
    checkSession();
  }, []);

  const validatePin = async (pinToValidate: string, showToast: boolean = true) => {
    setLoading(true);
    try {
      const barbersQuery = query(collection(firestore, 'barbers'), where('pin', '==', pinToValidate));
      const barberSnapshot = await getDocs(barbersQuery);
      if (!barberSnapshot.empty) {
        if (showToast) {
            toast({ title: 'Acesso liberado!', description: 'Bem-vindo ao painel.' });
        }
        return true;
      } else {
        if (showToast) {
            toast({ variant: 'destructive', title: 'PIN inválido' });
        }
        return false;
      }
    } catch (error) {
      console.error(error);
      if(showToast) {
        toast({ variant: 'destructive', title: 'Erro ao validar acesso' });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    if (pin.length < 4) return;
    const isValid = await validatePin(pin);
    if (isValid) {
      sessionStorage.setItem('barber-pin', pin);
      setIsAuthenticated(true);
    }
  };

  if (isCheckingSession) {
      return (
         <div className="flex min-h-screen items-center justify-center bg-deep-black">
            <Loader2 className="h-16 w-16 animate-spin text-gold" />
         </div>
      )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deep-black p-4">
        <Card className="w-full max-w-sm bg-dark-gray border-gold/20 text-center animate-fade-in-up">
          <CardHeader>
            <Shield className="h-12 w-12 mx-auto text-gold/50" />
            <CardTitle className="font-headline text-3xl text-gold uppercase">Área Restrita</CardTitle>
            <CardDescription>Insira seu PIN de barbeiro para continuar.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              inputMode="numeric"
              placeholder="Digite o PIN do barbeiro"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12 placeholder:text-muted-foreground/50"
            />
            <Button
              onClick={handleLogin}
              disabled={loading || pin.length < 4}
              className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
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

    
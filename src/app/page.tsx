
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: any;
  }
}

export default function LoginPage() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'welcome' | 'register' | 'otp'>('welcome');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();
  
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const setupRecaptcha = () => {
    if (!auth) return;
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
      });
    }
  };

  const handleSendOtp = async () => {
    if (!auth || !firestore) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao inicializar. Tente recarregar a página." });
      return;
    }
    if (name.length < 3) {
      toast({ variant: "destructive", title: "Erro", description: "Por favor, insira um nome válido." });
      return;
    }
    if (phoneNumber.length < 10) {
      toast({ variant: "destructive", title: "Erro", description: "Por favor, insira um número de telefone válido com DDD." });
      return;
    }
    
    setLoading(true);
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier!;
    const formattedPhoneNumber = `+55${phoneNumber.replace(/\D/g, '')}`;

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      
      // We will create the user document after OTP verification
      setStep('otp');
      toast({ title: "Código enviado!", description: "Enviamos um código de verificação para o seu celular." });
    } catch (error: any) {
      console.error("Erro ao enviar OTP:", error);
      toast({ variant: "destructive", title: "Erro ao enviar código", description: "Não foi possível enviar o código. Verifique o número e tente novamente." });
       if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then((widgetId) => {
          if ((window as any).grecaptcha) {
            (window as any).grecaptcha.reset(widgetId);
          }
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast({ variant: "destructive", title: "Erro", description: "O código deve ter 6 dígitos." });
      return;
    }

    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      if (user && firestore) {
        const clientDocRef = doc(firestore, 'clients', user.uid);
        await setDoc(clientDocRef, {
          name: name,
          phone: user.phoneNumber,
          points: 0,
          cuts: 0,
          createdAt: new Date(),
          lastCutAt: null,
        }, { merge: true });
      }

      toast({ title: "Login realizado com sucesso!" });
      router.push('/dashboard');
    } catch (error) {
      console.error("Erro ao verificar OTP:", error);
      toast({ variant: "destructive", title: "Código inválido", description: "O código inserido está incorreto. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };
  
  if (isUserLoading || user) {
    return (
       <div className="flex min-h-screen items-center justify-center bg-deep-black">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
       <div id="recaptcha-container"></div>
      <div className="w-full max-w-sm">
        <h1 className="font-headline text-5xl text-gold uppercase tracking-widest mb-2">
          HillsCut
        </h1>
        
        {step === 'welcome' && (
          <div className="space-y-6 animate-fade-in-up">
             <p className="font-body text-xl text-ice-white mt-2 mb-8">
              Seu corte agora vale pontos
            </p>
            <p className="text-muted-foreground">
              Corte, acumule pontos e ganhe benefícios no Club Hills.
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
            <h2 className="font-body text-xl font-bold text-ice-white">Entre em menos de 10 segundos</h2>
            <p className="text-muted-foreground">
              Só precisamos do básico pra registrar seus pontos.
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
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-dark-gray border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12"
            />
            <Button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Começar a pontuar'}
            </Button>
          </div>
        )}

        {step === 'otp' && (
          <div className="space-y-6 animate-fade-in-up">
            <p className="text-muted-foreground">
              Digite o código de 6 dígitos que enviamos para você.
            </p>
            <Input
              type="text"
              maxLength={6}
              placeholder="_ _ _ _ _ _"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-dark-gray border-gold/30 focus:ring-gold focus:border-gold text-center text-2xl tracking-[0.5em] h-14"
            />
            <Button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Verificar Código'}
            </Button>
             <Button
              variant="link"
              onClick={() => {
                setStep('register');
                setOtp('');
              }}
              className="text-gold/80 hover:text-gold"
            >
              Usar outro número
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

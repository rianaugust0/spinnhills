
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { useAuth, useUser } from '@/firebase';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

// Keep RecaptchaVerifier on the window object to avoid re-creating it on every render
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
  }
}

export default function LoginPage() {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'welcome' | 'register' | 'otp'>('welcome');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

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
    
    // Prevent multiple instances
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
    }
    
    const recaptchaContainer = document.getElementById('recaptcha-container');
    if (!recaptchaContainer) return;


    const verifier = new RecaptchaVerifier(auth, recaptchaContainer, {
        size: 'invisible',
        callback: (response: any) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
        },
        'expired-callback': () => {
           toast({
             variant: "destructive",
             title: "reCAPTCHA expirou",
             description: "Por favor, tente novamente.",
           });
        }
    });
    window.recaptchaVerifier = verifier;
    return verifier;
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
    
    const appVerifier = setupRecaptcha();
    if (!appVerifier) {
        toast({ variant: "destructive", title: "Erro", description: "Falha ao inicializar o reCAPTCHA. Recarregue a página."});
        setLoading(false);
        return;
    }

    const formattedPhoneNumber = `+55${phoneNumber.replace(/\D/g, '')}`;

    try {
      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      setConfirmationResult(result);
      
      setStep('otp');
      toast({ title: "Código enviado!", description: "Enviamos um código de verificação para o seu celular. (Use 123456 para testar)" });
    } catch (error: any) {
      console.error("Erro ao enviar OTP:", error);
      toast({ variant: "destructive", title: "Não foi possível enviar o código", description: "Verifique o número e tente novamente." });
       if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
       toast({ variant: "destructive", title: "Erro", description: "Sessão de verificação expirada. Por favor, tente novamente." });
       setStep('register');
       setLoading(false);
       return;
    }
    if (otp.length !== 6) {
      toast({ variant: "destructive", title: "Erro", description: "O código deve ter 6 dígitos." });
      return;
    }

    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      if (user && firestore) {
        const clientDocRef = doc(firestore, 'clients', user.uid);
        // Check if user document already exists
        const docSnap = await getDoc(clientDocRef);
        if (!docSnap.exists()) {
             await setDoc(clientDocRef, {
                name: name,
                phone: user.phoneNumber,
                points: 0,
                cuts: 0,
                createdAt: serverTimestamp(),
                lastCutAt: null,
            });
        }
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
  
  if (isUserLoading) {
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

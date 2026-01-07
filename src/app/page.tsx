
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { useAuth } from '@/firebase';

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
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();

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
    if (!auth) {
      toast({ variant: "destructive", title: "Erro", description: "Falha ao inicializar a autenticação." });
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
      setStep('otp');
      toast({ title: "Código enviado!", description: "Enviamos um código de verificação para o seu celular." });
    } catch (error: any) {
      console.error("Erro ao enviar OTP:", error);
      toast({ variant: "destructive", title: "Erro ao enviar código", description: "Não foi possível enviar o código. Verifique o número e tente novamente." });
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
      await window.confirmationResult.confirm(otp);
      toast({ title: "Login realizado com sucesso!" });
      router.push('/dashboard');
    } catch (error) {
      console.error("Erro ao verificar OTP:", error);
      toast({ variant: "destructive", title: "Código inválido", description: "O código inserido está incorreto. Tente novamente." });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
       <div id="recaptcha-container"></div>
      <div className="w-full max-w-sm">
        <h1 className="font-headline text-5xl text-gold uppercase tracking-widest">
          HillsCut
        </h1>
        <p className="font-body text-xl text-ice-white mt-2 mb-8">
          CLUB HILLS BASIC
        </p>

        {step === 'phone' && (
          <div className="space-y-6 animate-fade-in-up">
             <p className="text-muted-foreground">
              Acesse seu clube de fidelidade usando seu telefone.
            </p>
            <Input
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-dark-gray border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12"
            />
            <Button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Entrar'}
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
              onClick={() => setStep('phone')}
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

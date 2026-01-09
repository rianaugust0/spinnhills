
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check for session on load
    const userPhone = localStorage.getItem('hills-user-phone');
    if (userPhone) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
      <div className="w-full max-w-sm animate-fade-in-up">
        <h1 className="font-headline text-5xl text-gold uppercase tracking-widest mb-2">
          HillsCut
        </h1>
        <h2 className="font-body text-xl text-ice-white mt-2 mb-8">
          Seu corte agora vale prêmios
        </h2>
        <p className="text-muted-foreground">
          Junte-se ao Club Hills, complete desafios e gire a roleta para ganhar benefícios exclusivos.
        </p>
        <Button
          onClick={() => router.push('/entrar')}
          className="mt-8 w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
        >
          Entrar no Club Hills
        </Button>
      </div>
    </div>
  );
}

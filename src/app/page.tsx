
'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Sparkles, FerrisWheel, Loader2 } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This now safely runs only on the client
    const userPhone = localStorage.getItem('spin-hills-user-phone');
    if (userPhone) {
      router.replace('/dashboard');
    } else {
      setIsClient(true);
    }
  }, [router]);

  // Render a loading state or nothing on the server and during the initial client render
  if (!isClient) {
    return (
       <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
          <Loader2 className="h-16 w-16 animate-spin text-gold" />
       </div>
    );
  }

  // Render the full page only on the client after checking localStorage
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
      <div className="w-full max-w-md animate-fade-in-up space-y-4">
        <h2 className="font-headline text-2xl text-ice-white/70 uppercase tracking-widest">
            HILLSCUT
        </h2>
        <h1 className="font-headline text-6xl text-gold uppercase tracking-widest flex items-center justify-center gap-4">
          <FerrisWheel className="h-12 w-12 hidden sm:block" />
          SPIN HILLS
        </h1>
        <h2 className="font-body text-lg text-ice-white/90">
          Corte, gire e ganhe vantagens exclusivas.
        </h2>
        <Button
          onClick={() => router.push('/entrar')}
          className="mt-8 w-full max-w-xs bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-14 text-lg"
          size="lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Entrar
        </Button>
      </div>
    </div>
  );
}

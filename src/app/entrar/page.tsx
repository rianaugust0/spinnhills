
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FerrisWheel } from 'lucide-react';
import { initializeFirebase } from '@/firebase';
import { collection, doc, getDoc, setDoc, serverTimestamp, writeBatch, query, where, getDocs } from 'firebase/firestore';

const { firestore } = initializeFirebase();

function generateReferralCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNPQRSTUVWXYZ123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function EntrarForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const refCodeFromUrl = searchParams.get('ref');

  // Effect to store referral code from URL into localStorage
  useEffect(() => {
    if (refCodeFromUrl) {
      localStorage.setItem('referralCode', refCodeFromUrl);
      // Optionally, remove it from URL to keep it clean
      // window.history.replaceState({}, document.title, "/entrar");
    }
  }, [refCodeFromUrl]);
  

  const handleRegistration = async () => {
    if (name.length < 3) {
      toast({ variant: 'destructive', title: 'Nome inválido', description: 'Por favor, insira seu nome completo.' });
      return;
    }
    const sanitizedPhone = phone.replace(/\D/g, '');
    if (sanitizedPhone.length < 10) {
      toast({ variant: 'destructive', title: 'Telefone inválido', description: 'Por favor, insira um telefone com DDD.' });
      return;
    }
    
    setLoading(true);

    try {
      const userDocRef = doc(firestore, 'users', sanitizedPhone);
      const userDoc = await getDoc(userDocRef);

      const batch = writeBatch(firestore);
      const refCodeFromStorage = localStorage.getItem('referralCode');

      if (!userDoc.exists()) {
        const referralCode = generateReferralCode();
        const newUser = {
          name: name,
          phone: sanitizedPhone,
          totalCortes: 0,
          cortesAtuais: 0,
          instagramReviewRewardUsed: false,
          referralCode: referralCode,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        batch.set(userDocRef, newUser);
        toast({ title: `Bem-vindo, ${name.split(' ')[0]}!`, description: 'Sua jornada no SPIN HILLS começou.' });

        // Create referral document if referred by a code from storage
        if (refCodeFromStorage) {
            const q = query(collection(firestore, "users"), where("referralCode", "==", refCodeFromStorage));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                 console.warn(`Referral code ${refCodeFromStorage} not found.`);
            } else {
                const referrerDoc = querySnapshot.docs[0];
                const referrerId = referrerDoc.id;

                // Prevent self-referral
                if (referrerId === sanitizedPhone) {
                    console.warn("Self-referral attempt blocked.");
                } else {
                    const referralDocRef = doc(collection(firestore, 'referrals'));
                    batch.set(referralDocRef, {
                        referrerUserId: referrerId,
                        referredUserId: sanitizedPhone,
                        referredByCode: refCodeFromStorage,
                        haircutConfirmed: false,
                        spinGranted: false,
                        createdAt: serverTimestamp(),
                    });
                    toast({ title: 'Indicação registrada!', description: 'Seu amigo será recompensado após seu primeiro corte.' });
                }
            }
        }

      } else {
        toast({ title: `Bem-vindo de volta, ${userDoc.data().name.split(' ')[0]}!` });
      }
      
      await batch.commit();
      localStorage.setItem('spin-hills-user-phone', sanitizedPhone);
      localStorage.removeItem('referralCode'); // Clean up referral code after use
      router.push('/dashboard');

    } catch (error: any) {
       console.error("Registration failed:", error);
       toast({
          variant: 'destructive',
          title: 'Ops! Algo deu errado.',
          description: error.message || 'Não foi possível completar seu cadastro. Tente novamente.',
        });
    } finally {
        setLoading(false);
    }
  };
  
    return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
      <div className="w-full max-w-sm animate-fade-in-up">
        <FerrisWheel className="h-16 w-16 text-gold mx-auto mb-4" />
         <h1 className="font-headline text-5xl text-gold uppercase tracking-widest mb-2">
            SPIN HILLS
        </h1>
        <h2 className="font-body text-xl font-bold text-ice-white">Seja bem-vindo!</h2>
        <p className="text-muted-foreground mt-2 mb-6">
          Use seu nome e telefone para acessar seu painel de prêmios.
        </p>
         {refCodeFromUrl && (
            <div className="bg-green-900/40 text-green-300 p-3 rounded-md mb-4 border border-green-500/50">
                <p className="text-sm font-bold">Você foi indicado! Continue o cadastro para garantir os benefícios.</p>
            </div>
        )}
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
            {loading ? <Loader2 className="animate-spin" /> : 'Acessar meu painel'}
          </Button>
        </div>
      </div>
    </div>
    );
}


export default function EntrarPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-deep-black"><Loader2 className="h-16 w-16 animate-spin text-gold" /></div>}>
            <EntrarForm />
        </Suspense>
    )
}

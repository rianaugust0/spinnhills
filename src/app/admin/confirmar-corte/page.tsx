
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowLeft, User, Scissors, CheckCircle, Gift, Sparkles, FerrisWheel, Handshake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { initializeFirebase } from '@/firebase';
import { GrantPrizeOrSpinModal } from '@/components/admin/GrantPrizeOrSpinModal';
import { doc, getDoc, collection, query, where, getDocs, serverTimestamp, Timestamp, writeBatch, increment } from 'firebase/firestore';
import { isAfter } from 'date-fns';

const { firestore } = initializeFirebase();

export type ClientData = {
    id: string;
    name: string;
    cortesAtuais: number;
    girosDisponiveis: number;
    totalCortes: number;
}

type ReferralInfo = {
    referrerName: string;
    status: 'Pendente' | 'Concluída';
}

export default function ConfirmarCortePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [client, setClient] = useState<ClientData | null>(null);
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [step, setStep] = useState<'findClient' | 'confirmCut' | 'success'>('findClient');
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [extraSpinConverted, setExtraSpinConverted] = useState(false);
  const [finalGiros, setFinalGiros] = useState(0);

  const handleFindClient = async () => {
    const sanitizedPhone = phone.replace(/\D/g, '');
    if (sanitizedPhone.length < 10) {
      toast({ variant: 'destructive', title: 'Telefone inválido' });
      return;
    }
    setLoading(true);
    setReferralInfo(null);
    try {
      const userDocRef = doc(firestore, 'users', sanitizedPhone);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setClient({
            id: userDoc.id,
            name: userData.name,
            cortesAtuais: userData.cortesAtuais,
            girosDisponiveis: userData.girosDisponiveis,
            totalCortes: userData.totalCortes || 0,
        });

        // Check for referral info
        const referralQuery = query(collection(firestore, "referrals"), where("referredUserId", "==", sanitizedPhone));
        const referralSnapshot = await getDocs(referralQuery);
        if (!referralSnapshot.empty) {
            const referralDoc = referralSnapshot.docs[0].data();
            const referrerDoc = await getDoc(doc(firestore, "users", referralDoc.referrerUserId));
            if(referrerDoc.exists()){
                setReferralInfo({
                    referrerName: referrerDoc.data().name,
                    status: referralDoc.spinGranted ? 'Concluída' : 'Pendente',
                });
            }
        }
        setStep('confirmCut');
      } else {
        toast({ variant: 'destructive', title: 'Cliente não encontrado' });
        setClient(null);
      }
    } catch (error) {
      console.error(error);
      toast({ variant: 'destructive', title: 'Erro ao buscar cliente' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCut = async () => {
     if (pin.length < 4) {
      toast({ variant: 'destructive', title: 'PIN inválido' });
      return;
    }
    if (!client) return;

    setLoading(true);
    setExtraSpinConverted(false); // Reset on new confirmation

    try {
        const barbersQuery = query(collection(firestore, 'barbers'), where('pin', '==', pin));
        const barberSnapshot = await getDocs(barbersQuery);

        if (barberSnapshot.empty) {
            throw new Error('PIN do barbeiro inválido ou inativo.');
        }
        const barberId = barberSnapshot.docs[0].id;
        
        const batch = writeBatch(firestore);
        const nowTimestamp = serverTimestamp();

        const userDocRef = doc(firestore, 'users', client.id);
        const userDocSnap = await getDoc(userDocRef);
        const currentClientData = userDocSnap.data() as any;


        let newCortesAtuais = (currentClientData.cortesAtuais || 0) + 1;
        let spinGrantedFromFidelity = false;

        const updates: any = {
            totalCortes: increment(1),
            updatedAt: nowTimestamp,
            lastVisit: nowTimestamp,
        };

        if (newCortesAtuais >= 5) {
            newCortesAtuais = 0; // Reset counter
            updates.girosDisponiveis = increment(1); // Safely increment spins
            spinGrantedFromFidelity = true;
        }
        
        updates.cortesAtuais = newCortesAtuais;


        // --- Limited Spin Logic ---
        const limitedSpinsQuery = query(
          collection(firestore, "limitedSpins"),
          where('userId', '==', client.id),
          where('status', '==', 'active')
        );
        const limitedSpinsSnapshot = await getDocs(limitedSpinsQuery);
        let convertedLimitedSpin = false;
        
        const activeLimitedSpins = limitedSpinsSnapshot.docs.filter(doc => {
            const data = doc.data();
            const now = new Date();
            const expiresAt = (data.expiresAt as Timestamp).toDate();
            return data.status === 'active' && isAfter(expiresAt, now);
        });

        if (activeLimitedSpins.length > 0) {
            const limitedSpinDoc = activeLimitedSpins[0];
            batch.update(limitedSpinDoc.ref, {
                status: 'used',
                usedAt: nowTimestamp,
                usedByBarberId: barberId,
            });
             updates.girosDisponiveis = increment((updates.girosDisponiveis ? 0 : 0) + 1);
            convertedLimitedSpin = true;
            setExtraSpinConverted(true);
        }
        
        // --- Referral Logic ---
        const referralQuery = query(collection(firestore, "referrals"), where("referredUserId", "==", client.id), where("spinGranted", "==", false));
        const referralSnapshot = await getDocs(referralQuery);
        if (!referralSnapshot.empty) {
            const referralDoc = referralSnapshot.docs[0];
            const referrerId = referralDoc.data().referrerUserId;

            const referrerUserRef = doc(firestore, "users", referrerId);
            batch.update(referrerUserRef, { girosDisponiveis: increment(1) });
            batch.update(referralDoc.ref, { spinGranted: true, haircutConfirmed: true });
            
            const spinDocRef = doc(collection(firestore, "spins"));
            batch.set(spinDocRef, {
                userId: referrerId,
                origin: 'indicacao',
                createdAt: nowTimestamp,
                notes: `Indicou ${client.name} (${client.id})`
            });

            const referrerDoc = await getDoc(referrerUserRef);
            if(referrerDoc.exists()) {
                toast({
                    title: 'Indicação Recompensada! 🎉',
                    description: `${referrerDoc.data().name} ganhou +1 giro por indicar ${client.name.split(' ')[0]}!`,
                    duration: 7000,
                });
            }
        }


        batch.update(userDocRef, updates);

        const cutsCollectionRef = collection(firestore, "cuts");
        batch.set(doc(cutsCollectionRef), {
            userId: client.id,
            barberId: barberId,
            pinUsed: pin,
            confirmed: true,
            date: nowTimestamp
        });
        
        if (spinGrantedFromFidelity) {
            const spinsCollectionRef = collection(firestore, "spins");
            batch.set(doc(spinsCollectionRef), {
                userId: client.id,
                origin: 'fidelidade_5_cortes',
                createdAt: nowTimestamp
            });
        }
        
        await batch.commit();

        const updatedUserDoc = await getDoc(userDocRef);
        const finalUserData = updatedUserDoc.data() as ClientData;

        setFinalGiros(finalUserData.girosDisponiveis);

        setClient(prev => prev ? ({
          ...prev,
          cortesAtuais: newCortesAtuais,
          girosDisponiveis: finalUserData.girosDisponiveis,
          totalCortes: prev.totalCortes + 1,
        }) : null);
        setStep('success');
        
        toast({
            title: 'Corte confirmado!',
            description: `O progresso de ${client.name.split(' ')[0]} foi atualizado.`,
        });

        if (spinGrantedFromFidelity) {
             toast({
                title: 'Parabéns! 🎡',
                description: `${client.name.split(' ')[0]} ganhou +1 giro por fidelidade!`,
                duration: 5000,
            });
        }
        if (convertedLimitedSpin) {
            toast({
                title: 'Giro Extra Ativado! 🎯',
                description: `${client.name.split(' ')[0]} usou o giro extra e ganhou +1 giro!`,
                duration: 5000,
            });
        }

    } catch (error: any) {
        console.error(error);
        setStep('confirmCut'); 
        toast({
            variant: 'destructive',
            title: 'Falha na confirmação',
            description: error.message || 'Não foi possível confirmar o corte.',
        });
    } finally {
        setLoading(false);
    }
  }

  const handleClientUpdate = (updatedData: Partial<ClientData>) => {
    if (client) {
      setClient({ ...client, ...updatedData });
    }
  };

  const resetState = () => {
    setStep('findClient');
    setClient(null);
    setPhone('');
    setPin('');
    setReferralInfo(null);
  };
  
  if (step === 'success') {
       return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-deep-black p-4 text-center">
            <div className='animate-fade-in-up w-full max-w-sm'>
                <CheckCircle className="h-24 w-24 text-green-500 mx-auto animate-pulse" />
                <h1 className="font-headline text-4xl text-gold uppercase tracking-widest mt-4">Corte Confirmado!</h1>
                <p className='text-ice-white text-lg mt-2'>O progresso de {client?.name.split(' ')[0]} foi atualizado.</p>
                 <div className='mt-4 text-ice-white/80 space-y-1'>
                    {extraSpinConverted && (
                        <div className="flex items-center justify-center gap-2 text-green-400">
                           <Sparkles className="h-5 w-5" />
                           <span>Giro Extra convertido em +1 giro!</span>
                        </div>
                    )}
                    <p>Novo Progresso: <span className='font-bold text-gold'>{client?.cortesAtuais}/5</span></p>
                    <p>Giros Disponíveis: <span className='font-bold text-gold'>{finalGiros}</span></p>
                 </div>
                <Button onClick={resetState} className='mt-8 w-full h-12 text-base'>Confirmar Outro Corte</Button>
                 <Button variant="ghost" onClick={() => router.push('/admin')} className='mt-2 w-full max-w-sm'>Voltar para o Menu</Button>
            </div>
        </div>
      )
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black text-ice-white">
      {client && <GrantPrizeOrSpinModal 
        isOpen={isGrantModalOpen}
        onClose={() => setIsGrantModalOpen(false)}
        client={client}
        onClientUpdate={handleClientUpdate}
      />}
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => step === 'confirmCut' ? resetState() : router.back()} aria-label="Voltar">
          <ArrowLeft className="h-5 w-5 text-gold" />
        </Button>
         <h1 className="font-headline text-xl text-ice-white uppercase">Ações do Cliente</h1>
         <div></div>
      </header>
      <main className="flex-1 flex flex-col items-center container mx-auto py-8">
        {step === 'findClient' ? (
            <Card className="w-full max-w-sm bg-dark-gray border-gold/20 text-center animate-fade-in-up">
                <CardHeader>
                    <User className='h-12 w-12 mx-auto text-gold/50'/>
                    <CardTitle className="font-headline text-3xl text-gold uppercase">Identificar Cliente</CardTitle>
                    <CardDescription>Digite o telefone do cliente para buscar.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Input
                        type="tel"
                        placeholder="Telefone do Cliente"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12"
                    />
                    <Button
                        onClick={handleFindClient}
                        disabled={loading || !phone}
                        className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
                        >
                        {loading ? <Loader2 className="animate-spin" /> : 'Buscar Cliente'}
                    </Button>
                </CardContent>
            </Card>
        ) : client && (
             <Card className="w-full max-w-sm bg-dark-gray border-gold/20 text-center animate-fade-in-up">
                <CardHeader>
                     <Scissors className='h-12 w-12 mx-auto text-gold/50'/>
                    <CardTitle className="font-headline text-3xl text-gold uppercase">Ações para <strong className='text-gold'>{client.name.split(' ')[0]}</strong></CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {referralInfo && (
                        <div className={`p-3 rounded-lg border text-sm ${referralInfo.status === 'Pendente' ? 'bg-yellow-900/40 border-yellow-500/50' : 'bg-green-900/40 border-green-500/50'}`}>
                            <p className='flex items-center justify-center gap-2'><Handshake className='h-4 w-4'/> Indicado por: <strong className='text-ice-white'>{referralInfo.referrerName.split(' ')[0]}</strong></p>
                            <p className='text-xs mt-1'>Status: {referralInfo.status}</p>
                        </div>
                    )}
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='p-2 bg-deep-black rounded-lg border border-gold/10'>
                            <p className='text-xs text-muted-foreground'>Progresso</p>
                            <p className='text-lg font-bold text-ice-white'>{client.cortesAtuais} / 5</p>
                        </div>
                        <div className='p-2 bg-deep-black rounded-lg border border-gold/10'>
                            <p className='text-xs text-muted-foreground'>Giros Normais</p>
                            <p className='text-lg font-bold text-ice-white'>{client.girosDisponiveis}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2 p-4 border border-dashed border-gold/20 rounded-lg">
                        <h3 className='font-bold text-ice-white mb-2'>CONFIRMAR CORTE</h3>
                        <Input
                            type="password"
                            inputMode='numeric'
                            placeholder="PIN do barbeiro"
                            maxLength={4}
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                            className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold text-center text-lg h-12 placeholder:text-muted-foreground/50"
                        />
                        <Button
                            onClick={handleConfirmCut}
                            disabled={loading || pin.length < 4}
                            className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : 'Confirmar e Contabilizar'}
                        </Button>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-gold/10">
                      <Button
                        variant="outline"
                        onClick={() => setIsGrantModalOpen(true)}
                        disabled={loading}
                        className="w-full h-12 text-base text-gold border-gold/50 hover:bg-gold/10 hover:text-gold"
                      >
                        <FerrisWheel className="mr-2 h-4 w-4" />
                        Registrar Giro Físico
                      </Button>
                    </div>

                     <Button variant="link" onClick={resetState} className='text-gold/80'>Buscar outro cliente</Button>
                </CardContent>
            </Card>
        )}
      </main>
    </div>
  );
}

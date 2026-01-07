
'use client';

import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Loader2, Search, Scissors, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type ClientData = {
  id: string;
  name: string;
  phone: string;
  points: number;
  cuts: number;
};

// Mock admin check. In a real app, this should be based on custom claims.
const ADMIN_UID = "REPLACE_WITH_ACTUAL_ADMIN_UID"; // IMPORTANT

export default function AdminPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchPhone, setSearchPhone] = useState('');
  const [foundClient, setFoundClient] = useState<ClientData | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (isUserLoading) return;
    if (!user) {
      router.push('/');
      return;
    }
    // This is a basic security check. A real app should use custom claims.
    if (user.uid === ADMIN_UID) {
      setIsAdmin(true);
    } else {
      toast({ variant: "destructive", title: "Acesso Negado" });
      router.push('/dashboard');
    }
    setLoading(false);
  }, [user, isUserLoading, router, toast]);

  const handleSearch = async () => {
    if (!firestore || searchPhone.length < 10) {
      toast({ variant: "destructive", title: "Erro", description: "Digite um telefone válido." });
      return;
    }
    setIsSearching(true);
    setFoundClient(null);
    
    // This query is inefficient and not secure for production.
    // A better approach would be to have a dedicated function or a more structured phone number.
    const clientsRef = collection(firestore, "clients");
    const q = query(clientsRef, where("phone", "==", `+55${searchPhone.replace(/\D/g, '')}`));

    try {
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        toast({ title: "Cliente não encontrado" });
      } else {
        const clientDoc = querySnapshot.docs[0];
        setFoundClient({ id: clientDoc.id, ...clientDoc.data() } as ClientData);
      }
    } catch (error) {
      console.error("Erro ao buscar cliente:", error);
      toast({ variant: "destructive", title: "Erro na busca" });
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleRegisterCut = async () => {
    if (!firestore || !foundClient) return;

    const clientDocRef = doc(firestore, 'clients', foundClient.id);
    const cutsCollectionRef = collection(firestore, 'cuts');

    try {
        await updateDoc(clientDocRef, {
            points: foundClient.points + 10,
            cuts: foundClient.cuts + 1,
            lastCutAt: serverTimestamp()
        });

        await addDoc(cutsCollectionRef, {
            clientId: foundClient.id,
            date: serverTimestamp(),
            pointsGenerated: 10
        });

        // Refresh client data
        const updatedDoc = await getDoc(clientDocRef);
        if (updatedDoc.exists()) {
            setFoundClient({ id: updatedDoc.id, ...updatedDoc.data() } as ClientData);
        }

        toast({ title: "Corte registrado!", description: `${foundClient.name} ganhou 10 pontos.` });
    } catch (error) {
        console.error("Erro ao registrar corte: ", error);
        toast({ variant: "destructive", title: "Erro", description: "Não foi possível registrar o corte." });
    }
  };

  if (loading || isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-gold" />
      </div>
    );
  }
  
  if (!isAdmin) {
      return null; // Or a specific "Access Denied" component
  }

  return (
    <div className="flex flex-col min-h-screen bg-deep-black p-4">
      <h1 className="font-headline text-3xl text-gold uppercase text-center mb-8">Painel Administrativo</h1>
      
      <Card className="bg-dark-gray border-gold/20 mb-8">
        <CardHeader>
          <CardTitle className="text-ice-white">Buscar Cliente</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input 
            type="tel"
            placeholder="Telefone do cliente com DDD"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
          />
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
          </Button>
        </CardContent>
      </Card>
      
      {foundClient && (
        <Card className="bg-dark-gray border-gold/20 animate-fade-in-up">
            <CardHeader>
                <CardTitle className="text-ice-white">{foundClient.name}</CardTitle>
                <p className="text-muted-foreground">{foundClient.phone}</p>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
                <div>
                    <p className="text-sm text-muted-foreground">Pontos</p>
                    <p className="text-3xl font-bold text-gold">{foundClient.points}</p>
                </div>
                 <div>
                    <p className="text-sm text-muted-foreground">Cortes</p>
                    <p className="text-3xl font-bold text-gold">{foundClient.cuts}</p>
                </div>
            </CardContent>
            <CardFooter>
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="w-full bg-gold text-deep-black hover:bg-gold/90">
                            <Scissors className="mr-2 h-4 w-4" /> Registrar Corte
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar corte?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Isso irá adicionar 10 pontos e 1 corte para {foundClient.name}. Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRegisterCut}>Confirmar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
      )}

      {/* TODO: Rewards Management */}

    </div>
  );
}

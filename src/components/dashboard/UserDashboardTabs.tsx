
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Ticket, Calendar, Gift, Target, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { differenceInDays, format, isValid } from "date-fns";
import { Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";

const PrizeCard = ({ prize }: { prize: any }) => {
  const router = useRouter();
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Safely convert expiresAt to a Date object
  const expiresAtDate = prize.expiresAt instanceof Timestamp 
    ? prize.expiresAt.toDate() 
    : new Date(prize.expiresAt);

  useEffect(() => {
    if (isClient && isValid(expiresAtDate)) {
      // Calculate difference from the start of today to the end of the expiration day
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const expirationDay = new Date(expiresAtDate);
      expirationDay.setHours(23, 59, 59, 999);
      setDaysLeft(differenceInDays(expirationDay, today));
    }
  }, [expiresAtDate, isClient]);


  if (!isClient) {
    return null; // or a loading skeleton
  }

  if (!isValid(expiresAtDate)) {
      return (
        <Card className="bg-dark-gray border-dashed border-muted-foreground/30 text-center p-8 opacity-60">
            <CardTitle className="text-muted-foreground font-normal">{prize.title}</CardTitle>
            <CardDescription className="mt-2 text-sm text-red-500">Data de validade inválida.</CardDescription>
        </Card>
      );
  }

  const handleProceedToRedeem = () => {
    router.push(`/resgatar-premio?prizeId=${prize.id}`);
  };

  if (daysLeft === null) {
    return null; // or a loading skeleton for the card
  }
  
  const requiresHaircut = prize.type !== 'desconto_10';

  return (
    <Card className="bg-dark-gray border-gold/20 overflow-hidden">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-gold/10 p-2 rounded-md">
                    <Ticket className="h-6 w-6 text-gold" />
                </div>
                <CardTitle className="text-ice-white text-lg font-bold">{prize.title}</CardTitle>
            </div>
            {daysLeft >= 0 ? (
                <Badge variant="outline" className='border-green-500/50 text-green-400'>
                    <Calendar className="h-3 w-3 mr-1.5" />
                     {daysLeft} dia{daysLeft !== 1 ? 's' : ''}
                </Badge>
            ) : (
                 <Badge variant="destructive">Expirado</Badge>
            )}
          </div>
           {requiresHaircut && <CardDescription className="text-xs text-muted-foreground mt-2 ml-1">Obrigatório realizar um corte para usar.</CardDescription>}
        </div>
        <div className="mt-4">
            {daysLeft >= 0 && (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" className="h-9 w-full">Resgatar</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-dark-gray border-gold/20 text-ice-white">
                        <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl text-gold font-headline">⚠️ Atenção antes de resgatar</AlertDialogTitle>
                        <AlertDialogDescription className="text-base text-ice-white/80">
                            Este prêmio deve ser resgatado somente no momento do seu atendimento, dentro da barbearia.
                            <br/><br/>
                            Ao confirmar, você declara que está realizando seu corte agora. Prêmios resgatados fora da barbearia não poderão ser reutilizados.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="secondary" className="text-base">Cancelar</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button onClick={handleProceedToRedeem} className="bg-gold text-deep-black text-base">Confirmar resgate</Button>
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
      </CardContent>
    </Card>
  );
};


const LimitedSpinCard = ({ limitedSpin }: { limitedSpin: any }) => {
    const [daysLeft, setDaysLeft] = useState<number | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const expiresAtDate = limitedSpin.expiresAt instanceof Timestamp 
        ? limitedSpin.expiresAt.toDate() 
        : new Date(limitedSpin.expiresAt);
    
    useEffect(() => {
        if(isClient && isValid(expiresAtDate)) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const expirationDay = new Date(expiresAtDate);
            expirationDay.setHours(23, 59, 59, 999);
            setDaysLeft(differenceInDays(expirationDay, today));
        }
    }, [expiresAtDate, isClient]);

    if (!isClient) {
        return null;
    }

    if (!isValid(expiresAtDate)) {
        return (
             <Card className="bg-dark-gray border-dashed border-muted-foreground/30 text-center p-8 opacity-60">
                <CardTitle className="text-muted-foreground font-normal">Giro Extra com data inválida</CardTitle>
            </Card>
        )
    }

    if (daysLeft === null) {
      return null; // Or a loading skeleton
    }

    if (daysLeft < 0) {
        return (
             <Card className="bg-dark-gray border-dashed border-muted-foreground/30 text-center p-8 opacity-60">
                <CardTitle className="text-muted-foreground font-normal">Giro Extra Expirado</CardTitle>
                <CardDescription className="mt-2 text-sm">Este giro extra não foi utilizado a tempo.</CardDescription>
            </Card>
        )
    }

    return (
        <Card className="bg-blue-900/20 border-blue-500/50 text-center p-8">
            <Target className="h-12 w-12 text-blue-400 mx-auto animate-pulse" />
            <CardTitle className="text-2xl text-ice-white mt-4">Você tem 1 Giro Extra</CardTitle>
            <CardDescription className="mt-2 text-blue-300/80">
                Corte seu cabelo em até <span className="font-bold">{daysLeft} dia{daysLeft !== 1 ? 's' : ''}</span> para poder girar novamente.
            </CardDescription>
             <CardDescription className="mt-1 text-xs text-muted-foreground">
                (Expira em {format(expiresAtDate, "dd/MM/yyyy")})
            </CardDescription>
        </Card>
    );
};


const RulesTab = () => (
    <Card className="bg-dark-gray border-gold/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><BookOpen/> Regras e Validade dos Prêmios</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
           <div className="space-y-2">
                <p>✂️ <strong className="text-ice-white">Corte grátis:</strong> válido por 10 dias</p>
                <p>🧴 <strong className="text-ice-white">Esfoliação:</strong> válido por 15 dias</p>
                <p>✨ <strong className="text-ice-white">Sobrancelha:</strong> válido por 15 dias</p>
                <p>💧 <strong className="text-ice-white">Hidratação:</strong> válido por 15 dias</p>
                <p>🎁 <strong className="text-ice-white">Brinde Especial:</strong> válido por 7 dias</p>
                <p>💸 <strong className="text-ice-white">10% OFF:</strong> válido por 30 dias</p>
                <p>🎯 <strong className="text-ice-white">1 giro extra:</strong> deve ser ativado em até 10 dias (requer um corte)</p>
           </div>
           <div className="border-t border-gold/20 my-4 pt-4">
                <p className="font-bold text-amber-500 text-lg">⚠️ Regra de Ouro:</p>
                <p className='text-base'>Para utilizar <strong className="text-ice-white">qualquer prêmio</strong> (exceto o desconto de 10%), é <strong className="text-ice-white">obrigatório realizar um corte de cabelo pagante</strong> no mesmo dia do resgate.</p>
           </div>
            <div className="border-t border-gold/20 my-4 pt-4">
                <p className="font-bold text-red-500">Atenção:</p>
                <p>Prêmios não utilizados dentro do prazo perdem a validade e não podem ser recuperados.</p>
           </div>
        </CardContent>
    </Card>
);

interface UserDashboardTabsProps {
    activePrizes: any[];
    activeLimitedSpin: any | null;
}

export function UserDashboardTabs({ activePrizes, activeLimitedSpin }: UserDashboardTabsProps) {

  return (
    <Tabs defaultValue="prizes" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="prizes" className="flex flex-wrap items-center justify-center gap-x-1">
          <span>Seus Prêmios</span>
          <span>({activePrizes.length})</span>
        </TabsTrigger>
        <TabsTrigger value="extra_spin" disabled={!activeLimitedSpin}>
            Giro Extra {activeLimitedSpin ? <Target className="h-4 w-4 ml-2 text-blue-400"/> : ''}
        </TabsTrigger>
        <TabsTrigger value="rules">Regras</TabsTrigger>
      </TabsList>

      <TabsContent value="prizes" className="mt-6">
        {activePrizes && activePrizes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activePrizes.map((prize) => (
                    <PrizeCard key={prize.id} prize={prize} />
                ))}
            </div>
        ) : (
            <Card className="bg-dark-gray border-dashed border-gold/30 text-center p-8">
                <Gift className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-muted-foreground font-normal">Você ainda não possui prêmios ativos.</CardTitle>
                <CardDescription className="mt-2 text-sm">Quando um prêmio for registrado para você, ele aparecerá aqui.</CardDescription>
            </Card>
        )}
      </TabsContent>

      <TabsContent value="extra_spin" className="mt-6">
        {activeLimitedSpin ? (
            <LimitedSpinCard limitedSpin={activeLimitedSpin} />
        ) : (
             <Card className="bg-dark-gray border-dashed border-gold/30 text-center p-8">
                <Gift className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-muted-foreground font-normal">Nenhum giro extra ativo.</CardTitle>
                <CardDescription className="mt-2 text-sm">O giro extra é um prêmio que pode ser ganho na roleta.</CardDescription>
            </Card>
        )}
      </TabsContent>

      <TabsContent value="rules" className="mt-6">
        <RulesTab />
      </TabsContent>
    </Tabs>
  )
}

    
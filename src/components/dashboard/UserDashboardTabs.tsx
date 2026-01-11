
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Ticket, Calendar, Gift, Target, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { differenceInDays, format } from "date-fns";
import type { Timestamp } from "firebase/firestore";

const PrizeCard = ({ prize }: { prize: any }) => {
  const router = useRouter();
  // Ensure expiresAt is a Date object
  const expiresAtDate = prize.expiresAt instanceof (global.Timestamp || Date) ? prize.expiresAt.toDate() : prize.expiresAt;

  const validityLeft = differenceInDays(expiresAtDate, new Date());

  const handleRedeemClick = () => {
    router.push(`/resgatar-premio?prizeId=${prize.id}`);
  };

  return (
    <Card className="bg-dark-gray border-gold/20 overflow-hidden">
      <CardContent className="p-4 flex flex-col justify-between h-full">
        <div>
          <div className="flex items-center gap-3">
             <div className="bg-gold/10 p-2 rounded-md">
                <Ticket className="h-6 w-6 text-gold" />
             </div>
             <CardTitle className="text-ice-white text-lg font-bold">{prize.title}</CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground mt-2">{prize.description}</CardDescription>
        </div>
        <div className="mt-4">
            {validityLeft >= 0 ? (
                 <div className='flex justify-between items-center'>
                    <Badge variant="outline" className='border-green-500/50 text-green-400'>
                        <Calendar className="h-3 w-3 mr-1.5" />
                         Válido por mais {validityLeft} dia{validityLeft !== 1 ? 's' : ''}
                    </Badge>
                    <Button size="sm" onClick={handleRedeemClick}>Resgatar</Button>
                 </div>
            ) : (
                 <Badge variant="destructive">Expirado</Badge>
            )}
        </div>
      </CardContent>
    </Card>
  );
};


const LimitedSpinCard = ({ limitedSpin }: { limitedSpin: any }) => {
    const expiresAtDate = limitedSpin.expiresAt instanceof (global.Timestamp || Date) ? limitedSpin.expiresAt.toDate() : limitedSpin.expiresAt;
    const daysLeft = differenceInDays(expiresAtDate, new Date());

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
        <CardContent className="space-y-3 text-muted-foreground">
           <p>✂️ <strong className="text-ice-white">Corte grátis:</strong> válido por 10 dias</p>
           <p>🧴 <strong className="text-ice-white">Esfoliação:</strong> válido por 15 dias</p>
           <p>✨ <strong className="text-ice-white">Sobrancelha:</strong> válido por 15 dias</p>
           <p>💧 <strong className="text-ice-white">Hidratação:</strong> válido por 15 dias</p>
           <p>🎯 <strong className="text-ice-white">1 giro extra:</strong> deve ser utilizado em até 10 dias (requer um corte)</p>
           <div className="border-t border-gold/20 my-4 pt-4">
                <p className="font-bold text-amber-500">⚠️ Atenção:</p>
                <p>Para utilizar qualquer prêmio, é obrigatório realizar um corte de cabelo no mesmo dia.</p>
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
        <TabsTrigger value="prizes">Seus Prêmios ({activePrizes.length})</TabsTrigger>
        <TabsTrigger value="extra_spin" disabled={!activeLimitedSpin}>
            Giro Extra {activeLimitedSpin ? <Target className="h-4 w-4 ml-2 text-blue-400"/> : ''}
        </TabsTrigger>
        <TabsTrigger value="rules">Regras</TabsTrigger>
      </TabsList>

      <TabsContent value="prizes" className="mt-6">
        {activePrizes && activePrizes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activePrizes.map((prize) => (
                    <PrizeCard key={prize.id} prize={prize} />
                ))}
            </div>
        ) : (
            <Card className="bg-dark-gray border-dashed border-gold/30 text-center p-8">
                <Gift className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <CardTitle className="text-muted-foreground font-normal">Você ainda não possui prêmios ativos.</CardTitle>
                <CardDescription className="mt-2 text-sm">Gire a roleta para ganhar!</CardDescription>
            </Card>
        )}
      </TabsContent>

      <TabsContent value="extra_spin" className="mt-6">
        {activeLimitedSpin ? (
            <LimitedSpinCard limitedSpin={activeLimitedSpin} />
        ) : (
             <Card className="bg-dark-gray border-dashed border-gold/30 text-center p-8">
                <CardTitle className="text-muted-foreground font-normal">Nenhum giro extra ativo.</CardTitle>
            </Card>
        )}
      </TabsContent>

      <TabsContent value="rules" className="mt-6">
        <RulesTab />
      </TabsContent>
    </Tabs>
  )
}

    
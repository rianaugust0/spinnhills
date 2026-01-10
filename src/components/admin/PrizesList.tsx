
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, Clock, Gift, User, Phone, BotMessageSquare } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getUrgencyStyles = (daysLeft: number) => {
  if (daysLeft < 0) {
    // Already expired, but shouldn't be in the list. Still handle it.
    return 'border-muted-foreground/30 bg-muted/10 opacity-70';
  }
  if (daysLeft <= 0) {
    // Red for today
    return 'border-red-500/60 bg-red-900/30 text-red-300 shadow-lg shadow-red-900/20';
  }
  if (daysLeft <= 3) {
    // Yellow for up to 3 days
    return 'border-yellow-500/60 bg-yellow-900/30 text-yellow-300';
  }
  // Default (Greenish/Gold)
  return 'border-green-500/30 bg-green-900/20';
};

const openWhatsApp = (phone: string, userName: string, prizeName: string, daysLeft: number) => {
    const userFirstName = userName.split(' ')[0];
    let message: string;

    if (daysLeft > 1) {
        message = `E aí, ${userFirstName}! Tudo certo? Só pra lembrar que você tem um prêmio de *${prizeName}* aqui na Hillscut que expira em ${daysLeft} dias. Bora aproveitar? 😉`;
    } else if (daysLeft === 1) {
        message = `Corre aqui, ${userFirstName}! Seu prêmio de *${prizeName}* expira AMANHÃ. Não vai deixar passar, né? Te esperamos!`;
    } else {
        message = `ÚLTIMA CHANCE, ${userFirstName}! Seu prêmio de *${prizeName}* expira HOJE. Passa aqui na Hillscut pra não perder!`;
    }

    const whatsappUrl = `https://api.whatsapp.com/send?phone=55${phone.replace(/\D/g, '')}&text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

export function PrizesList({ prizes }: { prizes: any[] }) {
  if (!prizes || prizes.length === 0) {
    return (
      <Card className="bg-dark-gray border-dashed border-gold/30 text-center p-8">
        <CardTitle className="text-muted-foreground font-normal">Nenhum prêmio ativo no momento.</CardTitle>
        <CardDescription className="mt-2 text-sm">Quando os clientes ganharem prêmios, eles aparecerão aqui.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
      {prizes.map((prize) => {
        const daysLeft = differenceInDays(prize.expiresAt, new Date());
        const urgencyStyles = getUrgencyStyles(daysLeft);
        const urgencyIconColor = daysLeft <= 0 ? 'text-red-400' : daysLeft <= 3 ? 'text-yellow-400' : 'text-green-400';
        
        return (
          <Card key={prize.id} className={`overflow-hidden transition-all flex flex-col justify-between ${urgencyStyles}`}>
            <div>
                <CardHeader className="p-4">
                    <div className='flex justify-between items-start'>
                        <div>
                             <CardTitle className="text-ice-white text-lg font-bold">{prize.userName}</CardTitle>
                             <CardDescription className='text-muted-foreground'>{prize.title}</CardDescription>
                        </div>
                        <div className={`flex items-center gap-1 font-bold text-sm ${urgencyIconColor}`}>
                            <AlertCircle className="h-4 w-4" />
                            <span>{daysLeft < 0 ? 'Expirou' : daysLeft === 0 ? 'Hoje' : `${daysLeft}d`}</span>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                   <div className={`flex items-center gap-2 text-sm font-medium text-muted-foreground`}>
                        <Calendar className="h-4 w-4 text-gold/70" />
                        <span>Expira em: {format(prize.expiresAt, 'dd/MM/yyyy')}</span>
                    </div>
                </CardContent>
            </div>
            <div className="p-4 pt-0">
                <Button 
                    className="w-full h-11 bg-green-600/80 hover:bg-green-600 text-white font-bold"
                    onClick={() => openWhatsApp(prize.userPhone, prize.userName, prize.title, daysLeft)}
                >
                    <BotMessageSquare className='mr-2' />
                    CHAMAR NO WHATSAPP
                </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

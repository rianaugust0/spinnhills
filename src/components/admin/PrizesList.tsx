'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, Clock, Gift, User, Phone, BotMessageSquare } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const getUrgencyStyles = (daysLeft: number) => {
  if (daysLeft <= 0) {
    return 'border-red-500/50 bg-red-500/10 text-red-400 shadow-lg shadow-red-500/10';
  }
  if (daysLeft <= 3) {
    return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
  }
  return 'border-gold/20 bg-dark-gray';
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
        
        return (
          <Card key={prize.id} className={`overflow-hidden transition-all flex flex-col justify-between ${urgencyStyles}`}>
            <div>
                <CardHeader className="p-4 border-b border-[inherit]">
                <div className="flex items-center gap-3">
                    <div className="bg-gold/10 p-2 rounded-md">
                    <Gift className="h-6 w-6 text-gold" />
                    </div>
                    <CardTitle className="text-ice-white text-lg font-bold">{prize.title}</CardTitle>
                </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3 text-sm">
                    <div className='flex items-center gap-2 text-muted-foreground'>
                        <User className="h-4 w-4 text-gold/70" />
                        <span>{prize.userName}</span>
                    </div>
                    <div className='flex items-center gap-2 text-muted-foreground'>
                        <Phone className="h-4 w-4 text-gold/70" />
                        <span>{prize.userPhone}</span>
                    </div>
                    <div className={`flex items-center gap-2 font-medium ${daysLeft <= 3 ? 'text-inherit' : 'text-muted-foreground'}`}>
                        <Calendar className="h-4 w-4 text-gold/70" />
                        <span>Expira em: {format(prize.expiresAt, 'dd/MM/yyyy')}</span>
                    </div>
                    {daysLeft <= 3 && (
                        <div className="flex items-center gap-2 text-inherit font-bold p-2 bg-current/10 rounded-md">
                            <AlertCircle className="h-4 w-4" />
                            <span>
                                {daysLeft < 0 ? 'Expirado' : daysLeft === 0 ? 'Expira hoje!' : `Expira em ${daysLeft} dia${daysLeft > 1 ? 's' : ''}!`}
                            </span>
                        </div>
                    )}
                </CardContent>
            </div>
            <div className="p-4 pt-0">
                <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => openWhatsApp(prize.userPhone, prize.userName, prize.title, daysLeft)}
                >
                    <BotMessageSquare className='mr-2' />
                    Chamar no WhatsApp
                </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

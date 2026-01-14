
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Calendar, Clock, Gift, User, Phone, Check, RefreshCw } from 'lucide-react';
import { differenceInDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WhatsappIcon } from '@/components/ui/WhatsappIcon';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from '../ui/badge';

type PrizeStatus = 'active' | 'in_contact' | 'redeemed' | 'expired';

interface Prize {
    id: string;
    userName: string;
    userPhone: string;
    title: string;
    expiresAt: Date;
    status: PrizeStatus;
    contactedAt?: Date;
    redeemedAt?: Date;
}

interface PrizesListProps {
  prizes: Prize[];
  status: PrizeStatus;
  emptyMessage: string;
  onUpdateStatus: (prizeId: string, status: 'in_contact' | 'redeemed') => void;
}

const getUrgencyStyles = (daysLeft: number, status: PrizeStatus) => {
  if (status === 'redeemed') return 'border-green-500/50 bg-green-900/40 opacity-80';
  if (status === 'expired') return 'border-muted-foreground/30 bg-muted/20 opacity-60';
  if (status === 'in_contact') return 'border-blue-500/50 bg-blue-900/30';
  
  if (daysLeft < 0) return 'border-red-500/60 bg-red-900/40';
  if (daysLeft <= 3) return 'border-yellow-500/60 bg-yellow-900/40';
  
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

export function PrizesList({ prizes, status, emptyMessage, onUpdateStatus }: PrizesListProps) {
  if (!prizes || prizes.length === 0) {
    return (
      <Card className="bg-dark-gray border-dashed border-gold/30 text-center p-8">
        <Gift className='h-12 w-12 mx-auto text-muted-foreground'/>
        <CardTitle className="mt-4 text-muted-foreground font-normal">{emptyMessage}</CardTitle>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in-up">
      {prizes.map((prize) => {
        const daysLeft = differenceInDays(prize.expiresAt, new Date());
        const urgencyStyles = getUrgencyStyles(daysLeft, prize.status);
        
        return (
          <Card key={prize.id} className={`overflow-hidden transition-all flex flex-col justify-between ${urgencyStyles}`}>
            <div>
                <CardHeader className="p-4">
                    <div className='flex justify-between items-start'>
                        <div>
                             <CardTitle className="text-ice-white text-lg font-bold">{prize.userName}</CardTitle>
                             <CardDescription className='text-muted-foreground'>{prize.title}</CardDescription>
                        </div>
                        {status === 'active' && daysLeft >= 0 && (
                            <div className={`flex items-center gap-1 font-bold text-sm ${daysLeft <= 0 ? 'text-red-400' : daysLeft <= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                                <AlertCircle className="h-4 w-4" />
                                <span>{daysLeft === 0 ? 'Hoje' : `${daysLeft}d`}</span>
                            </div>
                        )}
                        {status === 'in_contact' && <Badge variant="outline" className='border-blue-400/50 text-blue-300'>Em Contato</Badge>}
                        {status === 'redeemed' && <Badge variant="outline" className='border-green-400/50 text-green-300'>Resgatado</Badge>}
                        {status === 'expired' && <Badge variant="destructive">Expirado</Badge>}
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 space-y-2 text-sm">
                   <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 text-gold/70" />
                        <span>Expira em: {format(prize.expiresAt, 'dd/MM/yyyy')}</span>
                    </div>
                    {prize.contactedAt && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <WhatsappIcon className="h-4 w-4 text-whatsapp" />
                            <span>Contatado em: {format(prize.contactedAt, 'dd/MM/yyyy')}</span>
                        </div>
                    )}
                    {prize.redeemedAt && (
                         <div className="flex items-center gap-2 text-muted-foreground">
                            <Check className="h-4 w-4 text-green-400" />
                            <span>Resgatado em: {format(prize.redeemedAt, 'dd/MM/yyyy')}</span>
                        </div>
                    )}
                </CardContent>
            </div>
            <div className="p-4 pt-0">
                {status === 'active' && (
                    <Button 
                        className="w-full h-11 bg-whatsapp hover:bg-whatsapp/90 text-white font-bold"
                        onClick={() => {
                            openWhatsApp(prize.userPhone, prize.userName, prize.title, daysLeft);
                            onUpdateStatus(prize.id, 'in_contact');
                        }}
                    >
                        <WhatsappIcon className='mr-2' />
                        CHAMAR E MARCAR
                    </Button>
                )}
                 {status === 'in_contact' && (
                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button className="w-full h-11">
                                <Check className='mr-2'/>
                                Confirmar Resgate
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-dark-gray border-gold/20 text-ice-white">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl text-gold font-headline">Confirmar Resgate do Prêmio</AlertDialogTitle>
                                <AlertDialogDescription className="text-base text-ice-white/80">
                                    Este prêmio só deve ser resgatado presencialmente na barbearia. Ao confirmar, o prêmio será movido para a aba "Resgatados".
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel asChild><Button variant="secondary">Cancelar</Button></AlertDialogCancel>
                                <AlertDialogAction asChild>
                                    <Button onClick={() => onUpdateStatus(prize.id, 'redeemed')}>Confirmar Resgate</Button>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
                 {(status === 'redeemed' || status === 'expired') && (
                     <Button className="w-full h-11" disabled>
                        <Check className='mr-2'/>
                        Ação Finalizada
                    </Button>
                 )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

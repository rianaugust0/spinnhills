
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Share2, Copy, Check } from 'lucide-react';
import { WhatsappIcon } from '@/components/ui/WhatsappIcon';

interface ShareReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
}

export function ShareReferralModal({ isOpen, onClose, referralCode }: ShareReferralModalProps) {
  const { toast } = useToast();
  const [referralLink, setReferralLink] = useState('');
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReferralLink(`${window.location.origin}/entrar?ref=${referralCode}`);
    }
  }, [referralCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setHasCopied(true);
    toast({ title: 'Link copiado!' });
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const emojiScissors = String.fromCodePoint(0x2702, 0xFE0F);
    const emojiPoint = String.fromCodePoint(0x1F449);

    const text = `Fala, craque! ${emojiScissors} \n\nDescobri a Hills Cut Barbearia e lembrei de você. Os caras são feras!\n\nSe cadastra pelo meu link pra garantir os benefícios e bora dar um tapa no visual: \n${emojiPoint} ${referralLink}`;
    
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-gray border-gold/20 text-ice-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl text-gold uppercase">
            <Share2 /> Indicar um Amigo
          </DialogTitle>
          <DialogDescription>
            Compartilhe seu link. Quando seu amigo fizer o primeiro corte, você ganha 1 giro!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex items-center space-x-2">
            <Input value={referralLink} readOnly className="bg-deep-black border-gold/30" />
            <Button size="icon" variant="outline" onClick={handleCopy}>
              {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <Button onClick={handleShareWhatsApp} className="w-full bg-whatsapp text-white font-bold h-12">
            <WhatsappIcon className="h-5 w-5 mr-2" /> Compartilhar no WhatsApp
          </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild><Button variant="secondary">Fechar</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

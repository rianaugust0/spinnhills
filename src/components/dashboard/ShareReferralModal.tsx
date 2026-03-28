
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
      const link = `${window.location.origin}/entrar?ref=${referralCode}`;
      setReferralLink(link);
    }
  }, [referralCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setHasCopied(true);
    toast({ title: 'Link copiado!' });
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    // Usando Unicode escapes para emojis (✂️ = \u{2702}\u{FE0F}, 👉 = \u{1F449})
    const text = `Fala, craque! \u{2702}\u{FE0F} \n\nDescobri a Hills Cut Barbearia e lembrei de você. Os caras são feras!\n\nUsando meu link, você já começa com 50% DE DESCONTO no primeiro corte. Só fazer o cadastro e já era.\n\nBora dar um tapa no visual? Clica aí: \n\u{1F449} ${referralLink}`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark-gray border-gold/20 text-ice-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl text-gold uppercase">
            <Share2 /> Indicar um Amigo
          </DialogTitle>
          <DialogDescription>
            Compartilhe seu link exclusivo. Quando seu amigo se cadastrar e fizer o primeiro corte, você ganha 1 giro!
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <p className='text-sm text-muted-foreground'>Seu link de indicação:</p>
            <div className="flex items-center space-x-2">
                <Input value={referralLink} readOnly className="bg-deep-black border-gold/30" />
                <Button size="icon" variant="outline" onClick={handleCopy}>
                    {hasCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
            </div>
            
            <Button onClick={handleShareWhatsApp} className="w-full bg-whatsapp text-white font-bold uppercase tracking-wider hover:bg-whatsapp/90 h-12 text-base">
                <WhatsappIcon className='h-5 w-5 mr-2' />
                Compartilhar no WhatsApp
            </Button>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


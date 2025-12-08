import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

export function Location() {
  return (
    <section id="localizacao" className="py-20 sm:py-32 bg-deep-black">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="font-headline text-5xl sm:text-6xl text-ice-white uppercase">
              Nosso <span className="text-gold">Endereço</span>
            </h2>
            <div className="flex items-start space-x-4">
              <MapPin className="h-8 w-8 text-gold mt-1 shrink-0" />
              <div>
                <p className="text-xl font-bold text-ice-white">
                  Rua das Navalhas, 123 - Bairro Centro
                </p>
                <p className="text-muted-foreground">São Paulo - SP, 01234-567</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Localizados no coração da cidade, com fácil acesso e estacionamento conveniado. O lugar perfeito para uma pausa na rotina e um cuidado especial com seu estilo.
            </p>
            <Button asChild size="lg" className="bg-transparent border-2 border-gold text-gold font-bold uppercase tracking-wider hover:bg-gold hover:text-deep-black transition-colors w-full sm:w-auto">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                Traçar Rota
              </a>
            </Button>
          </div>
          <div className="h-80 lg:h-[450px] w-full rounded-lg overflow-hidden shadow-lg bg-dark-gray">
             {/* Placeholder for Google Maps iframe */}
             <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.145833234994!2d-46.65657128498835!3d-23.5630994675409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0x26417ad00c73a4b!2sAv.%20Paulista%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1622573030383!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="filter grayscale-[1] contrast-[1.2] opacity-70 hover:opacity-100 transition-opacity"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

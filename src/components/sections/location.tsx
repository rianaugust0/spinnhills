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
                  Av. Bernardo Sayão, 1347 - St. Centro Oeste
                </p>
                <p className="text-muted-foreground">Goiânia - GO, 74550-020</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Localizados no coração da cidade, com fácil acesso e estacionamento conveniado. O lugar perfeito para uma pausa na rotina e um cuidado especial com seu estilo.
            </p>
            <Button asChild size="lg" className="bg-transparent border-2 border-gold text-gold font-bold uppercase tracking-wider hover:bg-gold hover:text-deep-black transition-colors w-full sm:w-auto">
              <a href="https://www.google.com/maps/search/?api=1&query=Av.+Bernardo+Sayão,+1347+-+St.+Centro+Oeste,+Goiânia+-+GO,+74550-020" target="_blank" rel="noopener noreferrer">
                Traçar Rota
              </a>
            </Button>
          </div>
          <div className="h-80 lg:h-[450px] w-full rounded-lg overflow-hidden shadow-lg bg-dark-gray">
             {/* Placeholder for Google Maps iframe */}
             <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3821.996720418578!2d-49.2882156856114!3d-16.65072048850027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef6b0b5f553f1%3A0xbf3029191c73a4d6!2sAv.%20Bernardo%20Say%C3%A3o%2C%201347%20-%20St.%20Centro%20Oeste%2C%20Goi%C3%A2nia%20-%20GO%2C%2074550-020!5e0!3m2!1spt-BR!2sbr!4v1672252548485!5m2!1spt-BR!2sbr"
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

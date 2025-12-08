import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: '#' },
  { name: 'Facebook', icon: Facebook, href: '#' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'Youtube', icon: Youtube, href: '#' },
];

export function Footer() {
  return (
    <footer className="bg-dark-gray border-t border-gold/20 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
          {/* Coluna 1: Logo e Descrição */}
          <div className="flex flex-col items-center md:items-start">
            <h2 className="text-4xl font-headline text-gold uppercase tracking-widest mb-4">
              HillsCut
            </h2>
            <p className="text-muted-foreground max-w-sm">
              Onde seu estilo ganha vida. A experiência premium em barbearia que você merece.
            </p>
          </div>

          {/* Coluna 2: Horários */}
          <div>
            <h3 className="text-lg font-bold uppercase text-ice-white tracking-wider mb-4">
              Horários
            </h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Terça - Sábado: 9:00 - 21:00</li>
              <li>Domingo: 9:00 - 14:00</li>
              <li>Segunda: Fechado</li>
            </ul>
          </div>

          {/* Coluna 3: Contato e Redes */}
          <div>
            <h3 className="text-lg font-bold uppercase text-ice-white tracking-wider mb-4">
              Siga-nos
            </h3>
            <div className="flex justify-center md:justify-start space-x-4 mb-4">
              {socialLinks.map((social) => (
                <Link key={social.name} href={social.href} passHref>
                  <span className="sr-only">{social.name}</span>
                  <social.icon className="h-6 w-6 text-muted-foreground transition-colors hover:text-gold" />
                </Link>
              ))}
            </div>
            <p className="text-muted-foreground">contato@hillscut.com</p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-gold/10 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HillsCut. Todos os direitos reservados.</p>
          <p className="mt-2">
            Desenvolvido com ♥ por{' '}
            <a
              href="https://firebasestudio.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/80 hover:text-gold transition-colors"
            >
              Firebase Studio
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

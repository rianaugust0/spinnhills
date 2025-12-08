'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { href: '#sobre', label: 'Sobre' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#barbeiros', label: 'Barbeiros' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#contato', label: 'Contato' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-deep-black/80 backdrop-blur-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-3xl font-headline text-gold uppercase tracking-widest">
            HillsCut
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold text-ice-white uppercase tracking-wider transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button asChild className="bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 hover:shadow-gold-glow">
              <Link href="#agendar">Agendar Agora</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-ice-white hover:text-gold"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-deep-black/95 backdrop-blur-md absolute top-20 left-0 right-0">
          <nav className="flex flex-col items-center space-y-6 py-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-semibold text-ice-white uppercase tracking-wider transition-colors hover:text-gold"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Button asChild className="bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 hover:shadow-gold-glow mt-4">
              <Link href="#agendar" onClick={() => setIsOpen(false)}>Agendar Agora</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

import type { Metadata } from 'next';
import { Bebas_Neue, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bebas-neue',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'HillsCut - Onde seu estilo ganha vida',
  description: 'Barbearia premium com foco em corte masculino, barba e um ambiente exclusivo. Agende seu horário e viva a experiência HillsCut.',
  icons: {
    icon: 'https://i.imgur.com/2U2l5aD.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${bebasNeue.variable} ${poppins.variable} scroll-smooth`}>
      <body className="bg-[#0D0D0D] text-[#F2F2F2] font-body">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

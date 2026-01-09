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
  title: 'Club Hills - HillsCut Barbearia',
  description: 'Clube de fidelidade e roleta de prêmios da Hillscut Barbearia.',
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
    <html lang="pt-BR" className={`${bebasNeue.variable} ${poppins.variable} dark`}>
      <body className="bg-deep-black text-ice-white font-body">
        {children}
        <Toaster />
      </body>
    </html>
  );
}

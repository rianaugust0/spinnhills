
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { Bebas_Neue, Poppins } from 'next/font/google';

export const metadata: Metadata = {
  title: 'SPIN HILLS - HillsCut Barbearia',
  description: 'Corte, gire e ganhe prêmios exclusivos!',
  openGraph: {
    title: 'SPIN HILLS - HillsCut Barbearia',
    description: 'Corte, gire e ganhe vantagens exclusivas na HillsCut.',
    url: 'https://spinhills.vercel.app', // Placeholder, será substituído pelo seu domínio
    siteName: 'SPIN HILLS',
    images: [
      {
        url: 'https://i.imgur.com/5zBjbwT.jpeg',
        width: 1200,
        height: 630,
        alt: 'SPIN HILLS - HillsCut Barbearia',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SPIN HILLS - HillsCut Barbearia',
    description: 'Corte, gire e ganhe vantagens exclusivas!',
    images: ['https://i.imgur.com/5zBjbwT.jpeg'],
  },
  icons: {
    icon: 'https://imgur.com/GUoe19M',
  }
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`${bebasNeue.variable} ${poppins.variable} bg-deep-black text-ice-white font-body`}>
        <FirebaseClientProvider>
          {children}
          <FirebaseErrorListener />
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}

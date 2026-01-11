import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export const metadata: Metadata = {
  title: 'SPIN HILLS - HillsCut Barbearia',
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
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --font-bebas-neue: 'Bebas Neue', sans-serif;
            --font-poppins: 'Poppins', sans-serif;
          }
        `}</style>
      </head>
      <body className="bg-deep-black text-ice-white font-body">
        <FirebaseClientProvider>
          {children}
          <FirebaseErrorListener />
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}

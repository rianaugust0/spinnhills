import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Barbearia Imperial',
  description: 'A sua barbearia de confiança.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body>
        {children}
      </body>
    </html>
  );
}

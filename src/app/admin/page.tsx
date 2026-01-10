'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-deep-black p-4 text-ice-white">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="bg-dark-gray border-gold/20">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl text-gold uppercase">Área do Barbeiro</CardTitle>
            <CardDescription>Ações restritas para a equipe.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/admin/confirmar-corte')}
              className="w-full bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-12 text-base"
            >
              <Scissors className="mr-2" />
              Confirmar Corte de Cliente
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

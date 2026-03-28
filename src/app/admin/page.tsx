
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Scissors, LayoutDashboard, UserPlus, Users, Gift, CheckCircle, FerrisWheel } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-deep-black p-4 text-ice-white">
      <div className="w-full max-w-md animate-fade-in-up">
        <Card className="bg-dark-gray border-gold/20">
          <CardHeader className="text-center">
            <CardTitle className="font-headline text-4xl text-gold uppercase">Área do Barbeiro</CardTitle>
            <CardDescription>Painel administrativo Hillscut.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => router.push('/admin/confirmar-corte')}
              className="w-full bg-gold text-deep-black font-bold h-12 text-base"
            >
              <Scissors className="mr-2" />
              Confirmar Corte
            </Button>
            <Button
              onClick={() => router.push('/admin/confirmar-giros')}
              variant="outline"
              className="w-full h-12 border-gold/50 text-gold font-bold"
            >
              <CheckCircle className="mr-2" />
              Confirmar Giros Usados
            </Button>
            <Button
              onClick={() => router.push('/admin/giro-manual')}
              variant="outline"
              className="w-full h-12 border-gold/50 text-gold font-bold"
            >
              <FerrisWheel className="mr-2" />
              Conceder Giro Manual
            </Button>
             <Button
              onClick={() => router.push('/admin/liberar-giro')}
              variant="outline"
              className="w-full h-12 border-gold/50 text-gold font-bold"
            >
              <Gift className="mr-2" />
              Liberar Giro por Ação
            </Button>
             <Button
              onClick={() => router.push('/admin/retorno-clientes')}
              variant="outline"
              className="w-full h-12 border-gold/50 text-gold font-bold"
            >
              <Users className="mr-2" />
              Retorno de Clientes
            </Button>
             <Button
              onClick={() => router.push('/admin/dashboard')}
              variant="outline"
              className="w-full h-12 border-gold/50 text-gold font-bold"
            >
              <LayoutDashboard className="mr-2" />
              Painel de Prêmios
            </Button>
            <Button
              onClick={() => router.push('/entrar')}
              variant="secondary"
              className="w-full h-12 font-bold"
            >
              <UserPlus className="mr-2" />
              Cadastrar Novo Cliente
            </Button>
          </CardContent>
        </Card>
        <div className="text-center mt-4">
          <Button variant="link" onClick={() => router.push('/')} className="text-gold/70">
            Sair do Painel
          </Button>
        </div>
      </div>
    </div>
  );
}

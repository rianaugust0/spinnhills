import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

export function Offer() {
  return (
    <section id="offer" className="bg-secondary py-16 sm:py-24">
      <div className="container">
        <Card className="max-w-3xl mx-auto p-6 sm:p-10 text-center shadow-2xl">
          <CardContent className="p-0">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-muted-foreground">
              Acesso Imediato a Todo o Pacote
            </h2>
            <div className="my-4 text-center">
              <p className="text-lg line-through text-muted-foreground">
                Valor total: R$392
              </p>
              <p className="text-lg text-muted-foreground">
                De <span className="line-through">R$97</span> por apenas:
              </p>
              <p className="font-headline text-6xl font-extrabold text-primary sm:text-7xl">
                R$29<span className="text-4xl sm:text-5xl">,90</span>
              </p>
              <p className="text-muted-foreground">Pagamento único. Acesso vitalício.</p>
            </div>
            <Button asChild size="lg" className="w-full text-xl h-14 animate-pulse">
              <a href="https://pay.kiwify.com.br/SehdLVR">🟩 QUERO GARANTIR MEU PACOTE COMPLETO</a>
            </Button>
            <div className="mt-8 flex items-center justify-center gap-4">
              <ShieldCheck className="h-10 w-10 text-primary" />
              <div>
                <h3 className="font-bold">Garantia Incondicional de 7 Dias</h3>
                <p className="text-sm text-muted-foreground">
                  Se não sentir evolução, devolvemos 100% do seu dinheiro. Sem perguntas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

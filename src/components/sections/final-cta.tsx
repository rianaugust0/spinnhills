import { Button } from "@/components/ui/button";

export function FinalCta() {
  return (
    <section id="final-cta" className="py-16 sm:py-24">
      <div className="container text-center">
        <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
          🚀 A Escolha é Sua
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Você pode continuar perdido, esperando que "caia um tema fácil"... ou pode garantir agora um método testado e comprovado, por menos que o preço de uma pizza.
        </p>
        <p className="mt-4 text-xl font-bold">O Enem está batendo na porta. Sua redação pode ser o que muda seu futuro.</p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg" className="text-sm sm:text-lg h-auto whitespace-normal py-3 px-4 sm:px-8">
            <a href="https://pay.kiwify.com.br/SehdLVR" target="_blank" rel="noopener noreferrer">🔥 QUERO MINHA REDAÇÃO 920+ AGORA!</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

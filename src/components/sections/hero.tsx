import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="pt-28 pb-20 text-center sm:pt-40 sm:pb-32">
      <div className="container">
        <Badge
          variant="outline"
          className="mb-6 animate-fade-in text-sm font-medium text-primary"
        >
          Oferta especial válida até a véspera da prova!
        </Badge>
        <h1 className="font-headline text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up">
          Como Tirar <span className="text-primary">920+</span> na Redação do ENEM
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground animate-fade-in-up [animation-delay:200ms]">
          E se aproximar do 1000 — mesmo que faltem poucos dias. O Enem está chegando, e a redação pode ser a virada de chave para você garantir sua vaga.
        </p>
        <div className="mt-8 flex justify-center gap-4 animate-fade-in-up [animation-delay:400ms]">
          <Button asChild size="lg" className="text-sm sm:text-lg h-12 px-4 sm:px-8">
            <a href="https://pay.kiwify.com.br/SehdLVR" target="_blank" rel="noopener noreferrer">🟢 QUERO MINHA REDAÇÃO 920+ AGORA</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

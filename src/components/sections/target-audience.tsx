import { CheckCircle, AlertTriangle, Clock, Target } from "lucide-react";

const reasons = [
  "Vai fazer o Enem e sente que ainda está longe da redação ideal.",
  "Quer um plano rápido e comprovado pra destravar e subir sua nota agora.",
  "Quer sentar no dia da prova com confiança e clareza, sem medo de travar.",
  "Está cansado de tentar sozinho e quer usar o método que já gerou notas de 920 e 980.",
  "Entende que essa pode ser sua última chance antes do Enem — e quer agarrá-la com força.",
];

export function TargetAudience() {
  return (
    <section id="para-voce" className="bg-secondary py-16 sm:py-24">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            <Target className="mx-auto mb-4 h-10 w-10 text-primary" />
            🎯 Este Guia é Pra Você Se…
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6 text-left shadow-lg">
              <h3 className="flex items-center gap-3 font-headline text-xl font-bold">
                <Clock className="h-6 w-6 text-primary" />
                O relógio está correndo...
              </h3>
              <p className="mt-4 text-muted-foreground">
                Faltam poucos dias para o Enem — e você ainda sente aquele frio na barriga só de pensar na redação. A prova que mais pesa na nota é justamente a que você menos domina.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 text-left shadow-lg">
              <h3 className="flex items-center gap-3 font-headline text-xl font-bold">
                😰 Você abre o tema e trava.
              </h3>
              <p className="mt-4 text-muted-foreground">
                Não sabe por onde começar. E, pior: sente que pode estragar todo o seu esforço do ano inteiro se errar logo na redação.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-xl border-2 border-primary/50 bg-primary/5 p-8">
            <h3 className="font-headline text-2xl font-bold text-primary">
              🔥 Mas ainda há uma boa notícia: Ainda dá tempo.
            </h3>
            <p className="mt-4 text-lg">
              Essas últimas semanas podem ser o divisor de águas entre uma nota comum e uma redação que te coloca entre os melhores.
            </p>
            <p className="mt-4 text-lg">
              💡 Este guia foi feito exatamente pra quem não pode perder tempo com teoria inútil, videoaula genérica ou método que só funciona "com sorte". Aqui, você vai direto ao ponto.
            </p>
          </div>

          <div className="mt-12 text-left">
            <h3 className="text-center font-headline text-2xl font-bold tracking-tight sm:text-3xl">
              🚀 Este guia é pra você se:
            </h3>
            <ul className="mt-8 space-y-4 max-w-2xl mx-auto">
              {reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-4 text-lg">
                  <CheckCircle className="mt-1 h-6 w-6 flex-shrink-0 text-primary" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16 rounded-lg bg-red-500/10 p-6 border border-red-500/30">
            <h4 className="flex items-center justify-center gap-3 font-headline text-xl font-bold text-red-700 dark:text-red-500">
              <AlertTriangle className="h-6 w-6" />
              Não é um guia pra "ver depois".
            </h4>
            <p className="mt-4 text-lg text-red-800 dark:text-red-400">
              Cada dia perdido agora é um ponto a menos na sua nota final. Mas quem agir hoje ainda tem tempo de virar o jogo completamente.
            </p>
          </div>

          <p className="mt-12 text-2xl font-bold text-foreground">
            💥 Este é o momento de provar pra si mesmo que dá pra sair da dúvida e entrar na redação com a tranquilidade de quem sabe o que está fazendo.
          </p>
        </div>
      </div>
    </section>
  );
}

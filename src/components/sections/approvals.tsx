import Image from "next/image";

const approvalImages = [
  {
    src: "https://i.imgur.com/VeALXGy.png",
    alt: "Print de aprovação de aluno 1",
    hint: "university acceptance"
  },
  {
    src: "https://i.imgur.com/D57YqTb.png",
    alt: "Print de aprovação de aluno 2",
    hint: "university acceptance letter"
  },
  {
    src: "https://i.imgur.com/c8hoqDN.png",
    alt: "Print de aprovação de aluno 3",
    hint: "university acceptance note"
  }
];

export function Approvals() {
  return (
    <section id="aprovacoes" className="bg-secondary py-16 sm:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
            Da Redação 920+ para a Aprovação dos Sonhos
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Uma boa redação não te dá só uma boa nota. Ela te dá isso aqui:
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          {approvalImages.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105 h-[600px] bg-card"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                data-ai-hint={image.hint}
              />
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-xl font-medium">
          A sua aprovação começa com uma redação que impressiona. <span className="text-primary font-bold">Vamos buscar a sua?</span>
        </p>
      </div>
    </section>
  );
}

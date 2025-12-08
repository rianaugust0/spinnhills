import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqItems = [
  {
    question: 'Preciso agendar ou posso ir direto?',
    answer: 'Trabalhamos exclusivamente com hora marcada para garantir um atendimento premium e sem espera. Você pode agendar facilmente através do nosso site ou app.',
  },
  {
    question: 'Quais são as formas de pagamento?',
    answer: 'Aceitamos PIX, cartões de débito e crédito das principais bandeiras. O pagamento é feito de forma segura no momento do agendamento.',
  },
  {
    question: 'Posso cancelar ou reagendar meu horário?',
    answer: 'Sim! Você pode cancelar ou reagendar seu horário com até 2 horas de antecedência sem custo algum, diretamente pelo nosso sistema de agendamento.',
  },
  {
    question: 'Existe algum programa de fidelidade?',
    answer: 'Sim! A cada 10 serviços, você ganha um corte de cabelo como cortesia. Além disso, temos promoções exclusivas para membros do nosso clube de fidelidade.',
  },
  {
    question: 'A barbearia possui estacionamento?',
    answer: 'Oferecemos estacionamento conveniado com manobrista para sua total comodidade e segurança. Basta chegar e deixar que cuidamos do seu veículo.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="py-20 sm:py-32 bg-dark-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl sm:text-6xl text-ice-white uppercase">
            Dúvidas Frequentes
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Respostas rápidas para as perguntas mais comuns. Se sua dúvida não estiver aqui, entre em contato.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-deep-black rounded-lg border border-gold/20 px-6"
              >
                <AccordionTrigger className="text-left font-bold text-lg text-ice-white hover:text-gold transition-colors hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-2">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

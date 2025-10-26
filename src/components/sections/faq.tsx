import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  const faqs = [
    {
      question: "O acesso ao guia é vitalício?",
      answer: "Sim! Ao adquirir, você terá acesso para sempre, incluindo todas as futuras atualizações do material, sem nenhum custo adicional."
    },
    {
      question: "Vou aprender a fazer a redação do zero?",
      answer: "Com certeza. O guia te pega pela mão e ensina desde a estrutura básica até as técnicas mais avançadas para impressionar o corretor, mesmo que você nunca tenha tirado uma boa nota."
    },
    {
      question: "E se eu não gostar do guia? Tenho garantia?",
      answer: "Sim, sua satisfação é garantida. Você tem 7 dias para testar todo o material. Se por qualquer motivo não ficar satisfeito, basta pedir o reembolso e devolveremos 100% do seu dinheiro, sem burocracia."
    },
    {
      question: "Funciona pra mim que tenho pouco tempo para estudar?",
      answer: "Sim! O método foi pensado para ser rápido e direto ao ponto. Em menos de 2 horas você já consegue entender e aplicar as principais técnicas. É perfeito para quem tem uma rotina corrida na reta final."
    },
    {
      question: "Os bônus também são de acesso vitalício?",
      answer: "Sim! Todos os bônus que você receber na compra são seus para sempre. É o nosso presente para te ajudar a chegar na aprovação."
    },
    {
        question: "Como recebo o acesso após a compra?",
        answer: "O acesso é imediato. Assim que o pagamento for confirmado, você receberá um e-mail com todas as instruções para acessar o guia e os bônus na nossa plataforma."
    }
  ]
  
  export function Faq() {
    return (
      <section id="faq" className="py-16 sm:py-24 bg-secondary">
        <div className="container max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold tracking-tight sm:text-4xl">
              🤔 Perguntas Frequentes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ainda tem alguma dúvida? A gente te ajuda a resolver.
            </p>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-bold text-lg">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    )
  }
  
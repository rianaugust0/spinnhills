'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const formSchema = z.object({
  name: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  phone: z.string().min(10, { message: 'Por favor, insira um telefone válido.' }),
  service: z.string().optional(),
  message: z.string().min(10, { message: 'A mensagem deve ter pelo menos 10 caracteres.' }),
});

export function Contact() {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      service: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Mensagem Enviada!",
      description: "Obrigado por entrar em contato. Retornaremos em breve.",
    });
    form.reset();
  }


  return (
    <section id="contato" className="py-20 sm:py-32 bg-dark-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-headline text-5xl sm:text-6xl text-ice-white uppercase">
            Fale Conosco
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Dúvidas, sugestões ou elogios? Preencha o formulário abaixo e nossa equipe entrará em contato.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ice-white">Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ice-white">Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(XX) XXXXX-XXXX" {...field} className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="service"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ice-white">Serviço de Interesse (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Corte Premium" {...field} className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-ice-white">Sua Mensagem</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Deixe sua mensagem aqui..." {...field} className="bg-deep-black border-gold/30 focus:ring-gold focus:border-gold" rows={5} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center">
                <Button type="submit" size="lg" className="bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 hover:shadow-gold-glow w-full md:w-auto">
                  Enviar Mensagem
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}

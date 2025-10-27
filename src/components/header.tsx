import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export function Header() {
  return (
    <header className="sticky top-[45px] sm:top-[41px] z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <Logo />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button asChild>
            <a href="https://pay.kiwify.com.br/SehdLVR" target="_blank" rel="noopener noreferrer">Quero meu Guia</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

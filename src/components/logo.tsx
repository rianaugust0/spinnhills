import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("font-headline font-bold text-xl", className)}>
      <span>Redação</span>
      <span className="text-primary">920+</span>
    </div>
  );
}

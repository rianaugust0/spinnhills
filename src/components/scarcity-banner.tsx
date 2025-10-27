"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle } from "lucide-react";

export function ScarcityBanner() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const calculateTimeLeft = () => {
    const now = new Date();
    // Véspera da prova: 8 de Novembro de 2024, 23:59:59
    const endDate = new Date(now.getFullYear(), 10, 9, 0, 0, 0); 

    const difference = endDate.getTime() - now.getTime();
    
    let timeLeft: { days?: number; hours?: number; minutes?: number; seconds?: number } = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<{ days?: number; hours?: number; minutes?: number; seconds?: number }>({});

  useEffect(() => {
    if (!isClient) return;

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 text-center text-sm font-medium">
        <div className="container flex flex-col sm:flex-row items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-center">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            <span><b>VAGAS COM DESCONTO ESGOTANDO!</b> Garanta com <b>R$362 de desconto</b></span>
          </div>
          <div className="flex items-center gap-1.5 bg-background/20 rounded-md px-3 py-1 min-w-[120px] justify-center">
            <span className="font-bold tabular-nums">Calculando...</span>
          </div>
        </div>
      </div>
    );
  }
  
  const timerComponents: JSX.Element[] = [];

  if (timeLeft.days !== undefined) {
    timerComponents.push(<span key="days" className="font-bold tabular-nums">{String(timeLeft.days).padStart(2, '0')}d</span>);
  }
  if (timeLeft.hours !== undefined) {
    timerComponents.push(<span key="hours" className="font-bold tabular-nums">{String(timeLeft.hours).padStart(2, '0')}h</span>);
  }
  if (timeLeft.minutes !== undefined) {
    timerComponents.push(<span key="minutes" className="font-bold tabular-nums">{String(timeLeft.minutes).padStart(2, '0')}m</span>);
  }
  if (timeLeft.seconds !== undefined) {
    timerComponents.push(<span key="seconds" className="font-bold tabular-nums">{String(timeLeft.seconds).padStart(2, '0')}s</span>);
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 text-center text-sm font-medium">
      <div className="container flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-2 text-center">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span><b>VAGAS COM DESCONTO ESGOTANDO!</b> Garanta com <b>R$362 de desconto</b></span>
        </div>
        <div className="flex items-center gap-1.5 bg-background/20 rounded-md px-3 py-1 min-w-[120px] justify-center">
          {timerComponents.length > 0 ? timerComponents.reduce((prev, curr) => <>{prev}:{curr}</>) : <span>Tempo Esgotado!</span>}
        </div>
      </div>
    </div>
  );
}

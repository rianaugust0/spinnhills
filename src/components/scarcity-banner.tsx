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
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const difference = endOfDay.getTime() - now.getTime();
    
    let timeLeft: { hours?: number; minutes?: number; seconds?: number } = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (!isClient) return;

    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  if (!isClient) {
    // Renderiza um placeholder ou nada no servidor e na primeira renderização do cliente
    return (
      <div className="bg-destructive text-destructive-foreground py-2 text-center text-sm font-medium">
        <div className="container flex flex-col sm:flex-row items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <span><b>OFERTA TERMINA HOJE!</b> Garanta seu guia com <b>R$362 de desconto</b></span>
          </div>
          <div className="flex items-center gap-1.5 bg-background/20 rounded-md px-3 py-1 min-w-[120px] justify-center">
            <span className="font-bold tabular-nums">Calculando...</span>
          </div>
        </div>
      </div>
    );
  }

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    const key = interval as keyof typeof timeLeft;
    const value = timeLeft[key];
    if (value !== undefined) {
      timerComponents.push(
        <span key={interval} className="font-bold tabular-nums">
          {String(value).padStart(2, '0')}
          {interval.charAt(0)}
        </span>
      );
    }
  });

  return (
    <div className="bg-destructive text-destructive-foreground py-2 text-center text-sm font-medium">
      <div className="container flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span><b>OFERTA TERMINA HOJE!</b> Garanta seu guia com <b>R$362 de desconto</b></span>
        </div>
        <div className="flex items-center gap-1.5 bg-background/20 rounded-md px-3 py-1 min-w-[120px] justify-center">
          {timerComponents.length > 0 ? timerComponents.reduce((prev, curr) => <>{prev}:{curr}</>) : <span>Tempo Esgotado!</span>}
        </div>
      </div>
    </div>
  );
}

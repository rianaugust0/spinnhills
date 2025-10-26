"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle } from "lucide-react";

export function ScarcityBanner() {
  const calculateTimeLeft = () => {
    const now = new Date();
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    
    const difference = endOfDay.getTime() - now.getTime();
    
    let timeLeft = {};

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
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: JSX.Element[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft] && timeLeft[interval as keyof typeof timeLeft] !== 0) {
      return;
    }
    timerComponents.push(
      <span key={interval} className="font-bold tabular-nums">
        {String(timeLeft[interval as keyof typeof timeLeft]).padStart(2, '0')}
        {interval.charAt(0)}
      </span>
    );
  });

  return (
    <div className="bg-destructive text-destructive-foreground py-2 text-center text-sm font-medium">
      <div className="container flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          <span><b>OFERTA TERMINA HOJE!</b> Garanta seu guia com <b>R$362 de desconto</b></span>
        </div>
        <div className="flex items-center gap-1.5 bg-background/20 rounded-md px-3 py-1">
          {timerComponents.length ? timerComponents.reduce((prev, curr) => <>{prev}:{curr}</>) : <span>Tempo Esgotado!</span>}
        </div>
      </div>
    </div>
  );
}

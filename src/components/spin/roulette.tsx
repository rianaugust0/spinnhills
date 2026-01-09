
'use client';

import React, { useState, useRef } from 'react';
import { prizeOptions, PrizeOption } from '@/lib/prizes';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

interface RouletteProps {
  onSpinFinish: (prize: PrizeOption) => void;
  spinning: boolean;
}

const colors = ['#D4AF37', '#121212']; // Gold and Dark Gray
const segments = prizeOptions.map(p => p.nome);

export function Roulette({ onSpinFinish, spinning }: RouletteProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  const drawRoulette = (rotationAngle = 0) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const numSegments = segments.length;
    const anglePerSegment = (2 * Math.PI) / numSegments;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = centerX - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 16px Poppins';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    segments.forEach((segment, i) => {
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, i * anglePerSegment + rotationAngle, (i + 1) * anglePerSegment + rotationAngle);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#0A0A0A';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.fillStyle = '#F2F2F2';
      const textAngle = i * anglePerSegment + anglePerSegment / 2 + rotationAngle;
      ctx.translate(centerX + (radius / 1.5) * Math.cos(textAngle), centerY + (radius / 1.5) * Math.sin(textAngle));
      ctx.rotate(textAngle + Math.PI / 2);
      ctx.fillText(segment, 0, 0);
      ctx.restore();
    });
  };

  React.useEffect(() => {
    drawRoulette();
  }, []);

  const startSpin = () => {
    const spinAngleStart = Math.random() * 10 + 10; // Random rotations
    const spinTimeTotal = (Math.random() * 3 + 4) * 1000; // 4-7 seconds
    let spinAngle = spinAngleStart;
    let spinTime = 0;
    
    function rotate() {
      spinTime += 30;
      if (spinTime >= spinTimeTotal) {
        stopSpin();
        return;
      }
      const spinAngleNew = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
      spinAngle = spinAngleNew;

      drawRoulette(spinAngle);
      requestAnimationFrame(rotate);
    }

    rotate();
  };
  
  const stopSpin = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine winning segment
    const degrees = (ctx.canvas.style.transform.replace(/[^0-9.]/g, '')) as any as number; // simplified
    const arcd = (2 * Math.PI) / segments.length;
    const winningSegmentIndex = Math.floor(Math.random() * segments.length); // Mock random winner
    const winningPrize = prizeOptions[winningSegmentIndex];
    
    if (winningPrize.nome !== 'Não foi dessa vez') {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
    
    onSpinFinish(winningPrize);
  };
  
  const easeOut = (t: number, b: number, c: number, d: number) => {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
  };

  return (
    <div className="relative flex flex-col items-center justify-center space-y-8">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      <div className='relative'>
        <canvas ref={canvasRef} width="350" height="350"></canvas>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 
          border-l-8 border-l-transparent
          border-r-8 border-r-transparent
          border-t-[16px] border-t-red-500 transform rotate-90"
          style={{right: "-20px"}}
        ></div>
         <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-dark-gray w-12 h-12 rounded-full border-4 border-gold' />
      </div>
     
      <Button
        onClick={startSpin}
        disabled={spinning}
        className="w-full max-w-xs bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-14 text-lg"
      >
        {spinning ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2" /> Girar Agora!</>}
      </Button>
    </div>
  );
}

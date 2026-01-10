'use client';

import React, { useState } from 'react';
import { prizeOptions, PrizeOption } from '@/lib/prizes';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { Wheel } from 'react-custom-roulette';

interface RouletteProps {
  mustSpin: boolean;
  isSpinning: boolean;
  startSpinning: () => void;
  onStopSpinning: () => void;
  onPrizeDefined: (prize: PrizeOption) => void;
}

const backgroundColors = ['#D4AF37', '#121212'];
const textColors = ['#0A0A0A', '#F2F2F2'];
const outerBorderColor = '#222';
const outerBorderWidth = 10;
const innerBorderColor = '#0A0A0A';
const innerBorderWidth = 12;
const innerRadius = 20;
const radiusLineColor = '#222';
const radiusLineWidth = 2;
const fontFamily = 'Bebas Neue';
const fontSize = 18;
const textDistance = 85;

export function Roulette({ mustSpin, isSpinning, startSpinning, onStopSpinning, onPrizeDefined }: RouletteProps) {
  const [prizeNumber, setPrizeNumber] = useState(0);

  const data = prizeOptions.map(option => ({
    option: option.title,
    style: { 
      backgroundColor: backgroundColors[prizeOptions.indexOf(option) % backgroundColors.length],
      textColor: textColors[prizeOptions.indexOf(option) % textColors.length] 
    }
  }));

  const handleSpinClick = () => {
    if (!mustSpin && !isSpinning) {
      const newPrizeNumber = Math.floor(Math.random() * prizeOptions.length);
      setPrizeNumber(newPrizeNumber);
      startSpinning();
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center space-y-8">
      <div className="relative pointer-events-none">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            onPrizeDefined(prizeOptions[prizeNumber]);
            onStopSpinning();
          }}
          backgroundColors={backgroundColors}
          textColors={textColors}
          fontFamily={fontFamily}
          fontSize={fontSize}
          outerBorderColor={outerBorderColor}
          outerBorderWidth={outerBorderWidth}
          innerRadius={innerRadius}
          innerBorderColor={innerBorderColor}
          innerBorderWidth={innerBorderWidth}
          radiusLineColor={radiusLineColor}
          radiusLineWidth={radiusLineWidth}
          textDistance={textDistance}
        />
      </div>
     
      <Button
        onClick={handleSpinClick}
        disabled={isSpinning || mustSpin}
        className="w-full max-w-xs bg-gold text-deep-black font-bold uppercase tracking-wider hover:bg-gold/90 h-14 text-lg"
      >
        {isSpinning ? <Loader2 className="animate-spin" /> : <><Sparkles className="mr-2" /> Girar Agora!</>}
      </Button>
    </div>
  );
}

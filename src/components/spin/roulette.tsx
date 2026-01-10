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

const backgroundColors = ['#121212', '#D4AF37'];
const outerBorderColor = '#D4AF37';
const outerBorderWidth = 5;
const innerBorderColor = '#D4AF37';
const innerBorderWidth = 6;
const innerRadius = 0;
const radiusLineColor = '#D4AF37';
const radiusLineWidth = 2;
const fontFamily = 'Bebas Neue';
const fontSize = 18;
const textDistance = 68;

export function Roulette({ mustSpin, isSpinning, startSpinning, onStopSpinning, onPrizeDefined }: RouletteProps) {
  const [prizeNumber, setPrizeNumber] = useState(0);

  const data = prizeOptions.map((option, index) => ({
    option: option.title.toUpperCase(),
    style: { 
      backgroundColor: backgroundColors[index % backgroundColors.length],
      textColor: index % 2 === 0 ? '#F2F2F2' : '#0A0A0A'
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
      <div className="relative">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            onPrizeDefined(prizeOptions[prizeNumber]);
            onStopSpinning();
          }}
          backgroundColors={backgroundColors}
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

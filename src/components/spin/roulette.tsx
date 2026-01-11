
'use client';

import React, { useState } from 'react';
import { allOutcomes, PrizeOption } from '@/lib/prizes';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { Wheel } from 'react-custom-roulette';
import { useWindowSize } from 'react-use';

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
const textColors = ['#FFFFFF'];

export function Roulette({ mustSpin, isSpinning, startSpinning, onStopSpinning, onPrizeDefined }: RouletteProps) {
  const [prizeNumber, setPrizeNumber] = useState(0);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const data = allOutcomes.map((option, index) => ({
    option: option.title.toUpperCase(),
    style: { 
      backgroundColor: backgroundColors[index % backgroundColors.length],
      textColor: '#ffffff'
    }
  }));

  const handleSpinClick = () => {
    if (!mustSpin && !isSpinning) {
      const newPrizeNumber = Math.floor(Math.random() * allOutcomes.length);
      setPrizeNumber(newPrizeNumber);
      startSpinning();
    }
  };

  const rouletteSize = isMobile ? 300 : 400;
  const fontSize = isMobile ? 12 : 16;
  const textDistance = isMobile ? 65 : 75;


  return (
    <div className="relative flex flex-col items-center justify-center space-y-6 md:space-y-8">
      <div className="relative pointer-events-none" style={{width: `${rouletteSize}px`, height: `${rouletteSize}px`}}>
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={data}
          onStopSpinning={() => {
            onPrizeDefined(allOutcomes[prizeNumber]);
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
          perpendicularText={true}
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

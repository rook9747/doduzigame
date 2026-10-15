import React from 'react';
import { MoleState } from '@/types/game';
import { FloatingText } from '@/hooks/useWhackAMole';
import { MoleHole } from './MoleHole';

interface GameBoardProps {
  moles: MoleState[];
  onWhack: (holeId: number) => void;
  floatingTexts: FloatingText[];
}

export const GameBoard: React.FC<GameBoardProps> = ({
  moles,
  onWhack,
  floatingTexts,
}) => {
  return (
    <div className="relative w-full max-w-xl aspect-square bg-neutral-100 dark:bg-neutral-900 p-4 sm:p-6 rounded-3xl shadow-sm border border-neutral-200/90 dark:border-neutral-800 select-none overflow-hidden transition-colors">
      {/* 3x3 구멍 그리드 */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full h-full relative z-10">
        {moles.map((mole) => (
          <MoleHole
            key={mole.id}
            mole={mole}
            onWhack={onWhack}
            floatingTexts={floatingTexts}
          />
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { MoleState } from '@/types/game';
import { FloatingText } from '@/hooks/useWhackAMole';

interface MoleHoleProps {
  mole: MoleState;
  onWhack: (holeId: number) => void;
  floatingTexts: FloatingText[];
}

export const MoleHole: React.FC<MoleHoleProps> = ({
  mole,
  onWhack,
  floatingTexts,
}) => {
  const currentFloating = floatingTexts.filter((t) => t.holeId === mole.id);

  return (
    <div
      onClick={() => onWhack(mole.id)}
      className="relative aspect-square w-full rounded-2xl bg-neutral-200/80 dark:bg-neutral-800/80 flex flex-col justify-end items-center overflow-hidden cursor-pointer select-none group border border-neutral-300/60 dark:border-neutral-700/60 active:scale-95 transition-transform touch-manipulation"
      style={{
        boxShadow: 'inset 0 6px 12px rgba(0,0,0,0.08)',
      }}
    >
      {/* 플로팅 텍스트 (+10, Miss!) */}
      {currentFloating.map((item) => (
        <div
          key={item.id}
          className={`absolute top-2 z-30 font-bold text-base sm:text-lg pointer-events-none drop-shadow-sm animate-out fade-out slide-out-to-top duration-500 ${
            item.isBonus
              ? 'text-amber-500 dark:text-amber-400 font-extrabold'
              : item.text === 'Miss!'
              ? 'text-neutral-400 dark:text-neutral-500'
              : 'text-neutral-900 dark:text-neutral-100'
          }`}
        >
          {item.text}
        </div>
      ))}

      {/* 두더지 캐릭터 */}
      <div
        className={`w-3/4 h-3/4 absolute bottom-2 flex flex-col items-center justify-center transition-all duration-100 ease-out z-10 ${
          mole.isActive
            ? mole.isHit
              ? 'translate-y-2 scale-90 rotate-3'
              : 'translate-y-0 scale-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            {/* 귀 */}
            <circle cx="28" cy="30" r="11" fill="#78716C" />
            <circle cx="28" cy="30" r="6" fill="#D6D3D1" />
            <circle cx="72" cy="30" r="11" fill="#78716C" />
            <circle cx="72" cy="30" r="6" fill="#D6D3D1" />

            {/* 몸통/얼굴 */}
            <path
              d="M 22 85 Q 22 30 50 30 Q 78 30 78 85 Z"
              fill="#A8A29E"
            />
            {/* 주둥이 */}
            <ellipse cx="50" cy="58" rx="20" ry="14" fill="#F5F5F4" />

            {/* 눈 */}
            {mole.isHit ? (
              <g stroke="#44403C" strokeWidth="2.5" strokeLinecap="round">
                <line x1="35" y1="44" x2="43" y2="50" />
                <line x1="43" y1="44" x2="35" y2="50" />
                <line x1="57" y1="44" x2="65" y2="50" />
                <line x1="65" y1="44" x2="57" y2="50" />
              </g>
            ) : (
              <g>
                <circle cx="39" cy="46" r="4.5" fill="#292524" />
                <circle cx="40.5" cy="44.5" r="1.5" fill="#FFFFFF" />
                <circle cx="61" cy="46" r="4.5" fill="#292524" />
                <circle cx="62.5" cy="44.5" r="1.5" fill="#FFFFFF" />
              </g>
            )}

            {/* 코 & 입 */}
            <ellipse cx="50" cy="54" rx="5" ry="3.8" fill="#F43F5E" />
            <path
              d="M 46 60 Q 50 63 54 60"
              stroke="#57534E"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {mole.isHit && (
            <div className="absolute -top-3 text-lg pointer-events-none">
              💫
            </div>
          )}
        </div>
      </div>

      {/* 구멍 앞 덮개 (차분한 톤) */}
      <div
        className="absolute -bottom-1 w-full h-6 sm:h-8 bg-neutral-300 dark:bg-neutral-700 rounded-t-xl z-20 border-t border-neutral-400/30 dark:border-neutral-600/30"
      />
    </div>
  );
};

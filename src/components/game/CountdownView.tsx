import React from 'react';

interface CountdownViewProps {
  countdown: number;
}

export const CountdownView: React.FC<CountdownViewProps> = ({ countdown }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="text-center">
        <div
          key={countdown}
          className="text-8xl sm:text-9xl font-black text-amber-400 drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)] animate-in zoom-in-50 duration-300"
        >
          {countdown > 0 ? countdown : 'START!'}
        </div>
        <p className="mt-4 text-xl sm:text-2xl font-bold text-white tracking-widest animate-pulse">
          두더지를 잡을 준비를 하세요!
        </p>
      </div>
    </div>
  );
};

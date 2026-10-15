import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Timer, Zap, Pause } from 'lucide-react';

interface GameHudProps {
  remainingTime: number;
  score: number;
  combo: number;
  onPause: () => void;
}

export const GameHud: React.FC<GameHudProps> = ({
  remainingTime,
  score,
  combo,
  onPause,
}) => {
  const isTimeCritical = remainingTime <= 5;

  return (
    <Card className="w-full max-w-xl p-3.5 sm:p-4 mb-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-xs border border-neutral-200/80 dark:border-neutral-800 rounded-2xl flex items-center justify-between gap-2">
      {/* 타이머 */}
      <div className="flex items-center gap-2.5">
        <div
          className={`p-2 rounded-xl flex items-center justify-center transition-colors ${
            isTimeCritical
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 animate-pulse'
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}
        >
          <Timer className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 block leading-tight">시간</span>
          <span
            className={`text-xl sm:text-2xl font-bold tabular-nums ${
              isTimeCritical ? 'text-rose-600 dark:text-rose-400' : 'text-neutral-900 dark:text-neutral-100'
            }`}
          >
            {remainingTime}s
          </span>
        </div>
      </div>

      {/* 현재 점수 */}
      <div className="flex flex-col items-center">
        <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 leading-tight">점수</span>
        <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight tabular-nums">
          {score}
        </span>
      </div>

      {/* 콤보 & 일시정지 */}
      <div className="flex items-center gap-2.5">
        <div className="flex flex-col items-end">
          <span className="text-[11px] font-medium text-neutral-400 dark:text-neutral-500 leading-tight">콤보</span>
          <Badge
            variant={combo > 2 ? 'default' : 'secondary'}
            className={`text-xs sm:text-sm font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 ${
              combo > 2
                ? 'bg-rose-500 text-white dark:bg-rose-600'
                : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
            }`}
          >
            <Zap className="w-3 h-3 fill-current" />
            {combo}x
          </Badge>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onPause}
          className="h-10 w-10 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 cursor-pointer"
          title="일시정지"
        >
          <Pause className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

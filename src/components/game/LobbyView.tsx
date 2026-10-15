import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trophy, Play, Flame } from 'lucide-react';

interface LobbyViewProps {
  nickname: string;
  setNickname: (val: string) => void;
  onStart: () => void;
  onOpenRanking: () => void;
}

export const LobbyView: React.FC<LobbyViewProps> = ({
  nickname,
  setNickname,
  onStart,
  onOpenRanking,
}) => {
  const isReady = nickname.trim().length >= 2;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isReady) {
      onStart();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-8">
      {/* 첫 화면 가운데 박스 크기 대폭 확장 (max-w-xl ~ 576px, p-8~10) */}
      <Card className="w-full max-w-xl shadow-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md rounded-3xl overflow-hidden transition-all">
        {/* 심플하고 단정한 헤더 영역 */}
        <CardHeader className="pt-10 pb-6 px-8 sm:px-12 text-center border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 mb-4 shadow-xs mx-auto">
            <span className="text-3xl select-none">🐹</span>
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            두더지 게임
          </CardTitle>
          <CardDescription className="text-neutral-500 dark:text-neutral-400 text-sm sm:text-base mt-2 font-normal">
            30초 동안 쉴 틈 없이 튀어나오는 두더지를 터치하세요!
          </CardDescription>

          {/* 고난도 경고 뱃지 */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 mt-4 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-semibold mx-auto">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>하드코어 스피드 모드 적용됨</span>
          </div>
        </CardHeader>

        {/* 폼 및 액션 영역 */}
        <CardContent className="p-8 sm:p-12 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                플레이어 닉네임
              </label>
              <Input
                type="text"
                placeholder="2~10자 이내 닉네임 입력"
                maxLength={10}
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="h-14 text-base sm:text-lg px-4 border border-neutral-300 dark:border-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-neutral-100 rounded-2xl bg-neutral-50/50 dark:bg-neutral-950/50"
                autoFocus
              />
              <p className="text-xs text-neutral-400 dark:text-neutral-500">
                기록된 점수는 명예의 전당 랭킹에 등록됩니다.
              </p>
            </div>

            <Button
              type="submit"
              disabled={!isReady}
              className="w-full h-14 text-base sm:text-lg font-bold bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-2xl shadow-sm transition-all active:scale-[0.99] cursor-pointer disabled:opacity-40"
            >
              <Play className="w-4 h-4 mr-2 fill-current" /> 게임 시작
            </Button>
          </form>

          <div className="pt-2">
            <Button
              variant="outline"
              onClick={onOpenRanking}
              className="w-full h-12 border border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800/60 rounded-2xl font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              <Trophy className="w-4 h-4 mr-2 text-amber-500" /> 명예의 전당 (Top 10 랭킹)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

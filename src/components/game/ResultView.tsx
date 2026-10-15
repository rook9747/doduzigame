import React, { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameResult } from '@/types/game';
import { RotateCcw, Home, Trophy, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ResultViewProps {
  result: GameResult;
  isSaving: boolean;
  saveError: string | null;
  onRestart: () => void;
  onGoToLobby: () => void;
  onOpenRanking: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  isSaving,
  saveError,
  onRestart,
  onGoToLobby,
  onOpenRanking,
}) => {
  useEffect(() => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full px-4 py-8">
      <Card className="w-full max-w-xl shadow-lg border border-neutral-200/80 dark:border-neutral-800 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        <CardHeader className="pt-8 pb-5 px-8 text-center border-b border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/40">
          <div className="inline-block px-3 py-1 mb-2 rounded-full bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold text-xs mx-auto">
            TIME UP
          </div>
          <CardTitle className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            게임 결과
          </CardTitle>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
            {result.nickname} 님의 최종 기록입니다.
          </p>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* 점수 요약 */}
          <div className="bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-6 text-center">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
              최종 획득 점수
            </span>
            <span className="text-5xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
              {result.score.toLocaleString()}
              <span className="text-xl font-normal text-neutral-400 dark:text-neutral-500 ml-1">점</span>
            </span>
          </div>

          {/* 세부 수치 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl text-center border border-neutral-200/60 dark:border-neutral-800">
              <span className="text-xs text-neutral-400 dark:text-neutral-500 block mb-0.5">잡은 두더지</span>
              <span className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                {result.hits}마리
              </span>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl text-center border border-neutral-200/60 dark:border-neutral-800">
              <span className="text-xs text-neutral-400 dark:text-neutral-500 block mb-0.5">명중률</span>
              <span className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                {result.accuracy}%
              </span>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-2xl text-center border border-neutral-200/60 dark:border-neutral-800">
              <span className="text-xs text-neutral-400 dark:text-neutral-500 block mb-0.5">최대 콤보</span>
              <span className="text-xl font-bold text-rose-500 dark:text-rose-400">
                {result.maxCombo}x
              </span>
            </div>
          </div>

          {/* 구글 시트 저장 피드백 */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-neutral-500 py-1">
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-500" />
                <span>결과를 저장하고 있습니다...</span>
              </>
            ) : saveError ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-neutral-500">로컬 임시 기록 완료</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-neutral-600 dark:text-neutral-400">
                  결과가 정상 등록되었습니다.
                </span>
              </>
            )}
          </div>

          {/* 버튼 */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={onRestart}
              className="w-full h-13 text-base font-bold bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-2xl shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> 다시 도전하기
            </Button>

            <Button
              variant="outline"
              onClick={onOpenRanking}
              className="w-full h-12 text-sm font-medium border border-neutral-200 dark:border-neutral-800 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-2xl text-neutral-700 dark:text-neutral-300 cursor-pointer"
            >
              <Trophy className="w-4 h-4 mr-2 text-amber-500" /> 명예의 전당 보기
            </Button>

            <Button
              variant="ghost"
              onClick={onGoToLobby}
              className="w-full h-10 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 rounded-xl cursor-pointer"
            >
              <Home className="w-3.5 h-3.5 mr-1.5" /> 닉네임 입력 화면으로
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

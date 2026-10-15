'use client';

import React, { useState } from 'react';
import { useWhackAMole } from '@/hooks/useWhackAMole';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { GameResult } from '@/types/game';
import { LobbyView } from '@/components/game/LobbyView';
import { GameHud } from '@/components/game/GameHud';
import { GameBoard } from '@/components/game/GameBoard';
import { CountdownView } from '@/components/game/CountdownView';
import { PauseModal } from '@/components/game/PauseModal';
import { ResultView } from '@/components/game/ResultView';
import { RankingModal } from '@/components/game/RankingModal';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Home() {
  const [nickname, setNickname] = useState<string>('');
  const [lastResult, setLastResult] = useState<GameResult | null>(null);
  const [isRankingOpen, setIsRankingOpen] = useState<boolean>(false);

  // 구글 시트 연동 훅
  const {
    rankings,
    isLoading: isRankingLoading,
    isSaving,
    error: rankingError,
    fetchRankings,
    saveGameResult,
  } = useLeaderboard();

  // 게임 종료 시 콜백
  const handleGameOver = async (result: GameResult) => {
    setLastResult(result);
    await saveGameResult(result);
  };

  // 두더지 잡기 핵심 로직 훅
  const {
    gameState,
    countdown,
    remainingTime,
    score,
    combo,
    moles,
    floatingTexts,
    whack,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    goToLobby,
  } = useWhackAMole(nickname, handleGameOver);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-neutral-100/70 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors select-none">
      {/* 상단 네비게이션 바 / 테마 토글 버튼 */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <span className="text-xl">🐹</span>
          <span>두더지 게임</span>
        </div>
        <ThemeToggle />
      </header>

      {/* 중앙 메인 콘텐츠 */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 w-full max-w-5xl mx-auto">
        {/* 1. 로비 화면 (닉네임 입력 & 랭킹) */}
        {gameState === 'LOBBY' && (
          <LobbyView
            nickname={nickname}
            setNickname={setNickname}
            onStart={startGame}
            onOpenRanking={() => setIsRankingOpen(true)}
          />
        )}

        {/* 2. 카운트다운 오버레이 */}
        {gameState === 'COUNTDOWN' && <CountdownView countdown={countdown} />}

        {/* 3. 게임 플레이 및 일시정지 화면 */}
        {(gameState === 'PLAYING' || gameState === 'PAUSED' || gameState === 'COUNTDOWN') && (
          <div className="flex flex-col items-center w-full max-w-xl animate-in fade-in duration-200">
            <GameHud
              remainingTime={remainingTime}
              score={score}
              combo={combo}
              onPause={pauseGame}
            />
            <GameBoard
              moles={moles}
              onWhack={whack}
              floatingTexts={floatingTexts}
            />
          </div>
        )}

        {/* 일시정지 모달 */}
        {gameState === 'PAUSED' && (
          <PauseModal
            onResume={resumeGame}
            onRestart={restartGame}
            onGoToLobby={goToLobby}
          />
        )}

        {/* 4. 게임 종료 및 결과 화면 */}
        {gameState === 'GAME_OVER' && lastResult && (
          <ResultView
            result={lastResult}
            isSaving={isSaving}
            saveError={rankingError}
            onRestart={restartGame}
            onGoToLobby={goToLobby}
            onOpenRanking={() => setIsRankingOpen(true)}
          />
        )}

        {/* 랭킹 팝업 모달 */}
        <RankingModal
          isOpen={isRankingOpen}
          onClose={() => setIsRankingOpen(false)}
          rankings={rankings}
          isLoading={isRankingLoading}
          error={rankingError}
          onRefresh={fetchRankings}
          currentNickname={nickname}
        />
      </main>

      {/* 하단 푸터 (Footer) */}
      <footer className="w-full py-6 text-center border-t border-neutral-200/60 dark:border-neutral-800/80 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-normal">
        Copyright INU 카드 맞추기 게임 by Kyungrok Kim
      </footer>
    </div>
  );
}

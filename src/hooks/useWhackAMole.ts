import { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, MoleState, GameResult } from '@/types/game';
import { GAME_CONFIG, getComboBonus } from '@/constants/gameConfig';

export interface FloatingText {
  id: string;
  holeId: number;
  text: string;
  isBonus?: boolean;
}

export function useWhackAMole(nickname: string, onGameOver: (result: GameResult) => void) {
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [countdown, setCountdown] = useState<number>(GAME_CONFIG.COUNTDOWN_SEC);
  const [remainingTime, setRemainingTime] = useState<number>(GAME_CONFIG.TOTAL_DURATION_SEC);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);
  const [hits, setHits] = useState<number>(0);
  const [misses, setMisses] = useState<number>(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);

  // 9개 구멍 상태 초기화 (0 ~ 8)
  const [moles, setMoles] = useState<MoleState[]>(() =>
    Array.from({ length: 9 }, (_, id) => ({
      id,
      isActive: false,
      isHit: false,
      stayTime: 0,
    }))
  );

  // 내부 델타타임 루프 참조
  const lastTimeRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);
  const remainingTimeRef = useRef<number>(GAME_CONFIG.TOTAL_DURATION_SEC * 1000);
  const isPausedRef = useRef<boolean>(false);
  const gameStateRef = useRef<GameState>('LOBBY');
  const animFrameRef = useRef<number | null>(null);

  // 실시간 통계 참조 (종료 시 정확한 취합용)
  const statsRef = useRef({
    score: 0,
    hits: 0,
    misses: 0,
    maxCombo: 0,
    combo: 0,
  });

  // 플로팅 텍스트 팝업 헬퍼
  const addFloatingText = useCallback((holeId: number, text: string, isBonus = false) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, holeId, text, isBonus }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 800);
  }, []);

  // 게임 종료 핸들러
  const handleGameEnd = useCallback(() => {
    setGameState('GAME_OVER');
    gameStateRef.current = 'GAME_OVER';

    const totalClicks = statsRef.current.hits + statsRef.current.misses;
    const accuracy = totalClicks > 0
      ? Number(((statsRef.current.hits / totalClicks) * 100).toFixed(1))
      : 0;

    const pad = (n: number) => n.toString().padStart(2, '0');
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

    const finalResult: GameResult = {
      timestamp: formattedDate,
      nickname: nickname.trim() || '플레이어',
      score: statsRef.current.score,
      hits: statsRef.current.hits,
      misses: statsRef.current.misses,
      accuracy,
      maxCombo: statsRef.current.maxCombo,
    };

    onGameOver(finalResult);
  }, [nickname, onGameOver]);

  // 카운트다운 루프
  useEffect(() => {
    if (gameState !== 'COUNTDOWN') return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // 카운트다운 완료 -> 게임 시작
      setGameState('PLAYING');
      gameStateRef.current = 'PLAYING';
      lastTimeRef.current = performance.now();
      spawnTimerRef.current = 0;
      remainingTimeRef.current = GAME_CONFIG.TOTAL_DURATION_SEC * 1000;
    }
  }, [gameState, countdown]);

  // 메인 게임 애니메이션 프레임 루프
  useEffect(() => {
    if (gameState !== 'PLAYING') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const loop = (currentTime: number) => {
      if (isPausedRef.current || gameStateRef.current !== 'PLAYING') {
        lastTimeRef.current = currentTime;
        animFrameRef.current = requestAnimationFrame(loop);
        return;
      }

      const delta = currentTime - (lastTimeRef.current || currentTime);
      lastTimeRef.current = currentTime;

      // 1. 남은 시간 차감
      remainingTimeRef.current = Math.max(0, remainingTimeRef.current - delta);
      const secondsLeft = Math.ceil(remainingTimeRef.current / 1000);
      setRemainingTime(secondsLeft);

      if (remainingTimeRef.current <= 0) {
        handleGameEnd();
        return;
      }

      // 2. 난이도 가속 파라미터 계산 (시간이 지날수록 빨라짐)
      const progress = 1 - (remainingTimeRef.current / (GAME_CONFIG.TOTAL_DURATION_SEC * 1000)); // 0 -> 1
      const currentSpawnInterval = GAME_CONFIG.SPAWN_INTERVAL_INITIAL - progress * (GAME_CONFIG.SPAWN_INTERVAL_INITIAL - GAME_CONFIG.SPAWN_INTERVAL_MIN);
      const currentStayDuration = GAME_CONFIG.MOLE_STAY_INITIAL - progress * (GAME_CONFIG.MOLE_STAY_INITIAL - GAME_CONFIG.MOLE_STAY_MIN);

      // 3. 두더지 체류 시간 갱신 및 자동 소멸(놓침) 처리
      setMoles((prevMoles) =>
        prevMoles.map((mole) => {
          if (!mole.isActive) return mole;
          const newStay = mole.stayTime - delta;

          if (newStay <= 0) {
            // 맞지 않고 그냥 내려간 경우 -> 콤보 리셋
            if (!mole.isHit) {
              statsRef.current.combo = 0;
              setCombo(0);
            }
            return { ...mole, isActive: false, isHit: false, stayTime: 0 };
          }
          return { ...mole, stayTime: newStay };
        })
      );

      // 4. 새로운 두더지 스폰 주기 체크
      spawnTimerRef.current += delta;
      if (spawnTimerRef.current >= currentSpawnInterval) {
        spawnTimerRef.current = 0;

        setMoles((prevMoles) => {
          const inactiveHoles = prevMoles.filter((m) => !m.isActive);
          if (inactiveHoles.length === 0) return prevMoles;

          // 난이도 상승에 따른 다중 스폰 (최대 3마리)
          const allowTriple = remainingTimeRef.current <= (GAME_CONFIG.TRIPLE_SPAWN_THRESHOLD_SEC * 1000);
          const allowDouble = remainingTimeRef.current <= (GAME_CONFIG.DOUBLE_SPAWN_THRESHOLD_SEC * 1000);

          let spawnCount = 1;
          if (allowTriple && Math.random() < GAME_CONFIG.TRIPLE_SPAWN_CHANCE && inactiveHoles.length >= 3) {
            spawnCount = 3;
          } else if (allowDouble && Math.random() < GAME_CONFIG.DOUBLE_SPAWN_CHANCE && inactiveHoles.length >= 2) {
            spawnCount = 2;
          }

          // 랜덤 셔플 후 선택
          const shuffled = [...inactiveHoles].sort(() => Math.random() - 0.5);
          const chosenIds = new Set(shuffled.slice(0, spawnCount).map((m) => m.id));

          return prevMoles.map((mole) => {
            if (chosenIds.has(mole.id)) {
              return {
                ...mole,
                isActive: true,
                isHit: false,
                stayTime: currentStayDuration,
              };
            }
            return mole;
          });
        });
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, handleGameEnd]);

  // 두더지 타격 또는 구멍 클릭 핸들러
  const whack = useCallback((holeId: number) => {
    if (gameStateRef.current !== 'PLAYING' || isPausedRef.current) return;

    setMoles((prevMoles) => {
      const target = prevMoles[holeId];

      // 1. 이미 맞았거나 활성화되지 않은 구멍 클릭 (헛손질)
      if (!target.isActive || target.isHit) {
        statsRef.current.misses += 1;
        statsRef.current.combo = 0;
        setMisses(statsRef.current.misses);
        setCombo(0);
        addFloatingText(holeId, 'Miss!');
        return prevMoles;
      }

      // 2. 명중!
      const newCombo = statsRef.current.combo + 1;
      const bonus = getComboBonus(newCombo);
      const earned = GAME_CONFIG.BASE_SCORE_PER_HIT + bonus;

      statsRef.current.combo = newCombo;
      statsRef.current.hits += 1;
      statsRef.current.score += earned;
      if (newCombo > statsRef.current.maxCombo) {
        statsRef.current.maxCombo = newCombo;
        setMaxCombo(newCombo);
      }

      setCombo(newCombo);
      setHits(statsRef.current.hits);
      setScore(statsRef.current.score);

      if (bonus > 0) {
        addFloatingText(holeId, `+${earned} (COMBO!)`, true);
      } else {
        addFloatingText(holeId, `+${earned}`);
      }

      // 피격 상태로 전환 및 빠르게 들어가도록 stayTime 단축
      return prevMoles.map((mole) =>
        mole.id === holeId
          ? { ...mole, isHit: true, stayTime: Math.min(mole.stayTime, 250) }
          : mole
      );
    });
  }, [addFloatingText]);

  // 게임 조작 기능들
  const startGame = useCallback(() => {
    // 초기화
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setHits(0);
    setMisses(0);
    setRemainingTime(GAME_CONFIG.TOTAL_DURATION_SEC);
    setCountdown(GAME_CONFIG.COUNTDOWN_SEC);
    setFloatingTexts([]);
    setMoles(Array.from({ length: 9 }, (_, id) => ({ id, isActive: false, isHit: false, stayTime: 0 })));

    statsRef.current = { score: 0, hits: 0, misses: 0, maxCombo: 0, combo: 0 };
    remainingTimeRef.current = GAME_CONFIG.TOTAL_DURATION_SEC * 1000;
    isPausedRef.current = false;

    setGameState('COUNTDOWN');
    gameStateRef.current = 'COUNTDOWN';
  }, []);

  const pauseGame = useCallback(() => {
    if (gameStateRef.current === 'PLAYING') {
      isPausedRef.current = true;
      setGameState('PAUSED');
      gameStateRef.current = 'PAUSED';
    }
  }, []);

  const resumeGame = useCallback(() => {
    if (gameStateRef.current === 'PAUSED') {
      isPausedRef.current = false;
      lastTimeRef.current = performance.now();
      setGameState('PLAYING');
      gameStateRef.current = 'PLAYING';
    }
  }, []);

  const restartGame = useCallback(() => {
    startGame();
  }, [startGame]);

  const goToLobby = useCallback(() => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    isPausedRef.current = false;
    setGameState('LOBBY');
    gameStateRef.current = 'LOBBY';
  }, []);

  return {
    gameState,
    countdown,
    remainingTime,
    score,
    combo,
    maxCombo,
    hits,
    misses,
    moles,
    floatingTexts,
    whack,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    goToLobby,
  };
}

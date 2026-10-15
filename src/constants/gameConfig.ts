export const GAME_CONFIG = {
  TOTAL_DURATION_SEC: 30, // 30초
  COUNTDOWN_SEC: 3,        // 3초
  BASE_SCORE_PER_HIT: 10,  // 두더지 처치 기본 점수
  
  // 두더지 스폰 주기 (ms) - 훨씬 어렵고 빠르게 세팅
  SPAWN_INTERVAL_INITIAL: 750, // 시작부터 0.75초 간격으로 빠르게 등장
  SPAWN_INTERVAL_MIN: 380,     // 후반부에는 0.38초 간격으로 쏟아짐

  // 두더지 체류 시간 (ms) - 깜빡하면 놓칠 정도로 대폭 단축
  MOLE_STAY_INITIAL: 700,      // 초기 0.7초
  MOLE_STAY_MIN: 340,          // 후반부 0.34초

  // 다중 스폰 (더블 & 트리플 스폰) 강화
  DOUBLE_SPAWN_THRESHOLD_SEC: 24, // 시작 6초 후부터 바로 더블 스폰 가동
  DOUBLE_SPAWN_CHANCE: 0.5,       // 50% 확률로 2마리 동시 등장
  TRIPLE_SPAWN_THRESHOLD_SEC: 12, // 남은 시간 12초 이하부터는 3마리 동시 출현 가능
  TRIPLE_SPAWN_CHANCE: 0.35,      // 35% 확률로 3마리 동시 등장
} as const;

// 콤보 보너스 계산
export const getComboBonus = (combo: number): number => {
  if (combo < 3) return 0;
  return Math.floor(combo / 3) * 5; // 3콤보: +5, 6콤보: +10, 9콤보: +15 ...
};

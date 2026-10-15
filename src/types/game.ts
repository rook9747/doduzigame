export interface GameResult {
  timestamp: string;
  nickname: string;
  score: number;
  hits: number;
  misses: number;
  accuracy: number;
  maxCombo: number;
}

export interface MoleState {
  id: number;
  isActive: boolean;
  isHit: boolean;
  stayTime: number; // 남은 시간 (ms)
}

export type GameState = 'LOBBY' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface LeaderboardEntry {
  rank?: number;
  timestamp: string;
  nickname: string;
  score: number;
  hits: number;
  accuracy: string | number;
  maxCombo: number;
}

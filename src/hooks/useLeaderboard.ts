import { useState, useEffect, useCallback } from 'react';
import { LeaderboardEntry, GameResult } from '@/types/game';

// 로컬 환경 또는 Apps Script URL이 설정되지 않았을 때 사용하는 기본 샘플 랭킹
const DEFAULT_MOCK_RANKINGS: LeaderboardEntry[] = [
  { rank: 1, nickname: '황금망치', score: 480, hits: 32, accuracy: '94.1%', maxCombo: 18, timestamp: '2026-10-15 12:00' },
  { rank: 2, nickname: '두더지사냥꾼', score: 410, hits: 28, accuracy: '90.3%', maxCombo: 14, timestamp: '2026-10-15 13:10' },
  { rank: 3, nickname: '빛의속도', score: 375, hits: 26, accuracy: '89.6%', maxCombo: 11, timestamp: '2026-10-15 14:05' },
  { rank: 4, nickname: '스피드킹', score: 340, hits: 24, accuracy: '85.7%', maxCombo: 9, timestamp: '2026-10-15 14:22' },
  { rank: 5, nickname: '땅굴파기', score: 290, hits: 22, accuracy: '81.4%', maxCombo: 8, timestamp: '2026-10-15 14:50' },
];

export function useLeaderboard(scriptUrl?: string) {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 랭킹 불러오기
  const fetchRankings = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // 구글 앱스 스크립트 URL이 없을 경우 로컬스토리지 + 목업 데이터 활용
    const effectiveUrl = scriptUrl || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    if (!effectiveUrl) {
      try {
        const localData = localStorage.getItem('whack_mole_rankings');
        if (localData) {
          setRankings(JSON.parse(localData));
        } else {
          setRankings(DEFAULT_MOCK_RANKINGS);
        }
      } catch {
        setRankings(DEFAULT_MOCK_RANKINGS);
      }
      setIsLoading(false);
      return;
    }

    try {
      const targetUrl = effectiveUrl ? '/api/leaderboard' : '';
      if (!targetUrl) throw new Error('URL 미설정');

      const response = await fetch(targetUrl, {
        method: 'GET',
      });
      const data = await response.json();
      if (data && data.rankings) {
        setRankings(data.rankings);
        try {
          localStorage.setItem('whack_mole_rankings', JSON.stringify(data.rankings));
        } catch {
          // ignore localStorage error
        }
      } else {
        throw new Error('랭킹 데이터 형식이 올바르지 않습니다.');
      }
    } catch (err: any) {
      console.warn('구글 시트 랭킹 로드 실패, 로컬 캐시를 사용합니다:', err);
      setError(null);
      try {
        const localData = localStorage.getItem('whack_mole_rankings');
        setRankings(localData ? JSON.parse(localData) : DEFAULT_MOCK_RANKINGS);
      } catch {
        setRankings(DEFAULT_MOCK_RANKINGS);
      }
    } finally {
      setIsLoading(false);
    }
  }, [scriptUrl]);

  // 게임 결과 저장하기
  const saveGameResult = useCallback(async (result: GameResult): Promise<boolean> => {
    setIsSaving(true);
    const effectiveUrl = scriptUrl || process.env.NEXT_PUBLIC_GOOGLE_SCRIPT_URL;

    // 로컬 스토리지 선반영 (오프라인/미연동 환경에서도 랭킹 갱신 확인 가능하도록)
    try {
      const localData = localStorage.getItem('whack_mole_rankings');
      let currentList: LeaderboardEntry[] = localData ? JSON.parse(localData) : DEFAULT_MOCK_RANKINGS;
      const newEntry: LeaderboardEntry = {
        nickname: result.nickname,
        score: result.score,
        hits: result.hits,
        accuracy: `${result.accuracy}%`,
        maxCombo: result.maxCombo,
        timestamp: result.timestamp,
      };
      currentList = [...currentList, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10)
        .map((item, idx) => ({ ...item, rank: idx + 1 }));
      localStorage.setItem('whack_mole_rankings', JSON.stringify(currentList));
      setRankings(currentList);
    } catch (e) {
      console.error(e);
    }

    if (!effectiveUrl) {
      setIsSaving(false);
      return true; // 로컬 저장 성공으로 처리
    }

    try {
      const payload = {
        timestamp: result.timestamp,
        name: result.nickname,
        nickname: result.nickname,
        score: result.score,
        hits: result.hits,
        accuracy: `${result.accuracy}%`,
        max_combo: result.maxCombo,
        maxCombo: result.maxCombo,
      };

      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      setIsSaving(false);
      return data?.success ?? true;
    } catch (err) {
      console.warn('구글 시트 저장 실패 (로컬 저장은 완료됨):', err);
      setIsSaving(false);
      return false;
    }
  }, [scriptUrl]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  return {
    rankings,
    isLoading,
    isSaving,
    error,
    fetchRankings,
    saveGameResult,
  };
}

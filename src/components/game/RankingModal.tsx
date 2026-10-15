import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { LeaderboardEntry } from '@/types/game';
import { Trophy, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rankings: LeaderboardEntry[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  currentNickname?: string;
}

export const RankingModal: React.FC<RankingModalProps> = ({
  isOpen,
  onClose,
  rankings,
  isLoading,
  error,
  onRefresh,
  currentNickname,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-6 rounded-3xl bg-card border-2 border-amber-500/30">
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/60">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            <div>
              <DialogTitle className="text-xl font-bold">명예의 전당 (Top 10)</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                가장 높은 점수를 기록한 플레이어들입니다.
              </DialogDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            disabled={isLoading}
            className="h-8 w-8 rounded-lg"
            title="새로고침"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </DialogHeader>

        {error && (
          <div className="flex items-center gap-1.5 p-2 bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex-1 overflow-y-auto space-y-2 py-3 pr-1">
          {isLoading && rankings.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground animate-pulse">
              랭킹 정보를 불러오는 중입니다...
            </div>
          ) : rankings.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              아직 등록된 랭킹 데이터가 없습니다.
            </div>
          ) : (
            rankings.map((entry, index) => {
              const rank = entry.rank || index + 1;
              const isCurrentUser = currentNickname && entry.nickname === currentNickname;

              let rankBadge = `${rank}위`;
              let badgeColor = 'bg-muted text-muted-foreground';

              if (rank === 1) {
                rankBadge = '🥇 1위';
                badgeColor = 'bg-amber-500/20 text-amber-600 dark:text-amber-400 font-extrabold';
              } else if (rank === 2) {
                rankBadge = '🥈 2위';
                badgeColor = 'bg-slate-300/40 text-slate-700 dark:text-slate-300 font-bold';
              } else if (rank === 3) {
                rankBadge = '🥉 3위';
                badgeColor = 'bg-amber-700/20 text-amber-800 dark:text-amber-500 font-bold';
              }

              return (
                <div
                  key={`${entry.nickname}-${entry.timestamp}-${index}`}
                  className={`flex items-center justify-between p-3 rounded-xl border text-sm transition-colors ${
                    isCurrentUser
                      ? 'border-emerald-500 bg-emerald-500/10 font-bold'
                      : 'border-border/60 bg-muted/30 hover:bg-muted/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded-md text-xs ${badgeColor}`}>
                      {rankBadge}
                    </span>
                    <div>
                      <div className="font-semibold text-foreground flex items-center gap-1.5">
                        {entry.nickname}
                        {isCurrentUser && (
                          <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full font-normal">
                            나
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        명중률 {entry.accuracy} · 최대 {entry.maxCombo}콤보
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-amber-500">
                      {entry.score.toLocaleString()}점
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

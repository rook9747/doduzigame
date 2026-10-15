import React from 'react';
import { Card, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, RotateCcw, Home } from 'lucide-react';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onGoToLobby: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onGoToLobby,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-sm p-6 text-center shadow-2xl rounded-3xl border-2 border-emerald-500/30 bg-card/95">
        <div className="text-4xl mb-2">⏸️</div>
        <CardTitle className="text-2xl font-black mb-6">게임 일시정지</CardTitle>
        <CardContent className="p-0 space-y-3">
          <Button
            onClick={onResume}
            className="w-full h-12 text-base font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md cursor-pointer transition-transform active:scale-95"
          >
            <Play className="w-4 h-4 mr-2 fill-current" /> 이어하기
          </Button>

          <Button
            variant="outline"
            onClick={onRestart}
            className="w-full h-12 text-base font-semibold border-2 border-amber-500/30 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 mr-2" /> 다시 시작
          </Button>

          <Button
            variant="ghost"
            onClick={onGoToLobby}
            className="w-full h-12 text-base text-muted-foreground hover:text-foreground rounded-xl cursor-pointer"
          >
            <Home className="w-4 h-4 mr-2" /> 처음으로 (로비)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

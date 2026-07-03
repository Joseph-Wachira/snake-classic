interface ScoreDisplayProps {
  score: number;
  highScore: number;
  status: string;
}

export function ScoreDisplay({ score, highScore, status }: ScoreDisplayProps) {
  return (
    <div className="flex items-center justify-between gap-6 px-6 py-3 glass rounded-2xl">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium uppercase tracking-wider opacity-60">Score</span>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <div className="h-8 w-px bg-white/20" />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium uppercase tracking-wider opacity-60">Best</span>
        <span className="text-2xl font-bold">{highScore}</span>
      </div>
      <div className="h-8 w-px bg-white/20" />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium uppercase tracking-wider opacity-60">Status</span>
        <span className="text-sm font-semibold capitalize">{status.toLowerCase()}</span>
      </div>
    </div>
  );
}
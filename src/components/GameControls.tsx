interface GameControlsProps {
  status: 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export function GameControls({ status, onStart, onPause, onReset }: GameControlsProps) {
  const isIdle = status === 'IDLE';
  const isPlaying = status === 'PLAYING';
  const isPaused = status === 'PAUSED';
  const isGameOver = status === 'GAME_OVER';

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {isIdle && (
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-xl glass glass-hover font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Start Game
        </button>
      )}
      {isPlaying && (
        <button
          onClick={onPause}
          className="px-6 py-3 rounded-xl glass glass-hover font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Pause
        </button>
      )}
      {isPaused && (
        <button
          onClick={onStart}
          className="px-6 py-3 rounded-xl glass glass-hover font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
        >
          Resume
        </button>
      )}
      {(isGameOver || isIdle) && (
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-xl glass glass-hover font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isGameOver ? 'Play Again' : 'Reset'}
        </button>
      )}
    </div>
  );
}
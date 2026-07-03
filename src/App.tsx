import { ThemeProvider } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { GameCanvas } from '@/components/GameCanvas';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { GameControls } from '@/components/GameControls';
import { useGame } from '@/hooks/useGame';
import { useKeyboard } from '@/hooks/useKeyboard';

function App() {
  const {
    snake,
    food,
    score,
    status,
    highScore,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
  } = useGame();

  const isPlaying = status === 'PLAYING';
  useKeyboard(changeDirection, isPlaying);

  return (
    <ThemeProvider>
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-colors duration-500">
        <div className="w-full max-w-2xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
              🐍 Snake Classic
            </h1>
            <ThemeToggle />
          </div>

          {/* Score */}
          <ScoreDisplay score={score} highScore={highScore} status={status} />

          {/* Game Board */}
          <div className="flex justify-center">
            <GameCanvas snake={snake} food={food} />
          </div>

          {/* Controls */}
          <GameControls
            status={status}
            onStart={startGame}
            onPause={pauseGame}
            onReset={resetGame}
          />

          {/* Keyboard hint */}
          <p className="text-center text-sm opacity-60">
            Use arrow keys to control the snake
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
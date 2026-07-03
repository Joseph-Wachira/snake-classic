export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type Position = {
  x: number;
  y: number;
};

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export type GameConfig = {
  gridSize: number;
  cellSize: number;
  initialSnake: Position[];
  initialDirection: Direction;
  speed: number;
};
import { GameConfig, Direction } from '@/types';

export const GRID_SIZE = 20;
export const CELL_SIZE = 25;

export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export const INITIAL_DIRECTION: Direction = 'RIGHT';

export const GAME_SPEED = 150;

export const DEFAULT_CONFIG: GameConfig = {
  gridSize: GRID_SIZE,
  cellSize: CELL_SIZE,
  initialSnake: INITIAL_SNAKE,
  initialDirection: INITIAL_DIRECTION,
  speed: GAME_SPEED,
};

export const STORAGE_KEYS = {
  HIGH_SCORE: 'snake-high-score',
  THEME: 'snake-theme',
};
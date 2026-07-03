import { useState, useEffect, useCallback, useRef } from 'react';
import { Direction, Position, GameStatus, GameConfig } from '@/types';
import { DEFAULT_CONFIG } from '@/utils/constants';

export function useGame(config: Partial<GameConfig> = {}) {
  const {
    gridSize = DEFAULT_CONFIG.gridSize,
    initialSnake = DEFAULT_CONFIG.initialSnake,
    initialDirection = DEFAULT_CONFIG.initialDirection,
    speed = DEFAULT_CONFIG.speed,
  } = { ...DEFAULT_CONFIG, ...config };

  const [snake, setSnake] = useState<Position[]>(initialSnake);
  const [direction, setDirection] = useState<Direction>(initialDirection);
  const [food, setFood] = useState<Position>(() => generateFood(initialSnake, gridSize));
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastTickTime = useRef<number>(0);
  const accumulatedTime = useRef<number>(0);

  function generateFood(snakePositions: Position[], gridSize: number): Position {
    const freeCells: Position[] = [];
    const snakeSet = new Set(snakePositions.map(p => `${p.x},${p.y}`));
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        if (!snakeSet.has(`${x},${y}`)) {
          freeCells.push({ x, y });
        }
      }
    }
    if (freeCells.length === 0) {
      return { x: -1, y: -1 };
    }
    const idx = Math.floor(Math.random() * freeCells.length);
    return freeCells[idx];
  }

  const isCollision = useCallback((head: Position, snakeBody: Position[], gridSize: number): boolean => {
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return true;
    }
    for (let i = 1; i < snakeBody.length; i++) {
      if (snakeBody[i].x === head.x && snakeBody[i].y === head.y) {
        return true;
      }
    }
    return false;
  }, []);

  const moveSnake = useCallback(() => {
    if (status !== 'PLAYING') return;

    const head = snake[0];
    let newHead: Position;
    switch (direction) {
      case 'UP': newHead = { x: head.x, y: head.y - 1 }; break;
      case 'DOWN': newHead = { x: head.x, y: head.y + 1 }; break;
      case 'LEFT': newHead = { x: head.x - 1, y: head.y }; break;
      case 'RIGHT': newHead = { x: head.x + 1, y: head.y }; break;
      default: return;
    }

    let newSnake: Position[];
    let ate = false;
    if (newHead.x === food.x && newHead.y === food.y) {
      ate = true;
      newSnake = [newHead, ...snake];
    } else {
      newSnake = [newHead, ...snake.slice(0, -1)];
    }

    if (isCollision(newHead, newSnake, gridSize)) {
      setStatus('GAME_OVER');
      if (score > highScore) {
        setHighScore(score);
      }
      return;
    }

    setSnake(newSnake);
    if (ate) {
      setScore(prev => prev + 1);
      const newFood = generateFood(newSnake, gridSize);
      if (newFood.x === -1) {
        setStatus('GAME_OVER');
        if (score + 1 > highScore) {
          setHighScore(score + 1);
        }
        return;
      }
      setFood(newFood);
    }
  }, [snake, direction, food, status, gridSize, score, highScore, isCollision]);

  const tick = useCallback(() => {
    moveSnake();
  }, [moveSnake]);

  const startGame = useCallback(() => {
    setStatus('PLAYING');
  }, []);

  const pauseGame = useCallback(() => {
    setStatus('PAUSED');
  }, []);

  const resetGame = useCallback(() => {
    setSnake(initialSnake);
    setDirection(initialDirection);
    setScore(0);
    setStatus('IDLE');
    const newFood = generateFood(initialSnake, gridSize);
    setFood(newFood);
  }, [initialSnake, initialDirection, gridSize]);

  const changeDirection = useCallback((newDirection: Direction) => {
    const opposite = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    } as const;
    if (direction !== opposite[newDirection]) {
      setDirection(newDirection);
    }
  }, [direction]);

  useEffect(() => {
    if (status === 'PLAYING') {
      const loop = (timestamp: number) => {
        if (lastTickTime.current === 0) {
          lastTickTime.current = timestamp;
        }
        const delta = timestamp - lastTickTime.current;
        lastTickTime.current = timestamp;
        accumulatedTime.current += delta;

        while (accumulatedTime.current >= speed) {
          tick();
          accumulatedTime.current -= speed;
        }

        gameLoopRef.current = requestAnimationFrame(loop);
      };
      gameLoopRef.current = requestAnimationFrame(loop);
    } else {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      lastTickTime.current = 0;
      accumulatedTime.current = 0;
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [status, speed, tick]);

  useEffect(() => {
    const saved = localStorage.getItem('snake-high-score');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) {
        setHighScore(parsed);
      }
    }
  }, []);

  useEffect(() => {
    if (highScore > 0) {
      localStorage.setItem('snake-high-score', String(highScore));
    }
  }, [highScore]);

  return {
    snake,
    direction,
    food,
    score,
    status,
    highScore,
    startGame,
    pauseGame,
    resetGame,
    changeDirection,
  };
}
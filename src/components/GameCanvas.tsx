import { useRef, useEffect } from 'react';
import { Position } from '@/types';
import { GRID_SIZE, CELL_SIZE } from '@/utils/constants';

interface GameCanvasProps {
  snake: Position[];
  food: Position;
  gridSize?: number;
  cellSize?: number;
}

export function GameCanvas({ snake, food, gridSize = GRID_SIZE, cellSize = CELL_SIZE }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const width = gridSize * cellSize;
  const height = gridSize * cellSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.1)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= gridSize; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, height);
      ctx.stroke();
    }
    for (let y = 0; y <= gridSize; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(width, y * cellSize);
      ctx.stroke();
    }

    // Food
    if (food.x >= 0 && food.y >= 0) {
      const fx = food.x * cellSize + cellSize / 2;
      const fy = food.y * cellSize + cellSize / 2;
      const radius = cellSize / 2 - 2;

      const gradient = ctx.createRadialGradient(fx, fy, 0, fx, fy, radius + 6);
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(fx, fy, radius + 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = 'rgba(239, 68, 68, 0.5)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(fx, fy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Snake
    snake.forEach((segment, index) => {
      const x = segment.x * cellSize;
      const y = segment.y * cellSize;
      const padding = 1;
      const radius = 4;

      const isHead = index === 0;
      const color = isHead ? '#22c55e' : '#16a34a';
      const darkColor = isHead ? '#4ade80' : '#22c55e';

      const gradient = ctx.createRadialGradient(
        x + padding, y + padding, 2,
        x + cellSize - padding, y + cellSize - padding, cellSize / 2
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, darkColor);

      ctx.shadowColor = isHead ? 'rgba(34, 197, 94, 0.4)' : 'rgba(22, 163, 74, 0.2)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x + padding, y + padding, cellSize - padding * 2, cellSize - padding * 2, radius);
      ctx.fill();
      ctx.shadowBlur = 0;

      if (isHead) {
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.arc(x + cellSize / 2 - 4, y + cellSize / 2 - 4, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, width, height);

  }, [snake, food, gridSize, cellSize, width, height]);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-2xl glass p-2">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto rounded-xl bg-gray-800/10 dark:bg-gray-700/20"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  );
}

// Polyfill for roundRect
declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, w: number, h: number, radii: number | number[]): void;
  }
}
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
  const r = Array.isArray(radii) ? radii : [radii, radii, radii, radii];
  this.moveTo(x + r[0], y);
  this.lineTo(x + w - r[1], y);
  this.quadraticCurveTo(x + w, y, x + w, y + r[1]);
  this.lineTo(x + w, y + h - r[2]);
  this.quadraticCurveTo(x + w, y + h, x + w - r[2], y + h);
  this.lineTo(x + r[3], y + h);
  this.quadraticCurveTo(x, y + h, x, y + h - r[3]);
  this.lineTo(x, y + r[0]);
  this.quadraticCurveTo(x, y, x + r[0], y);
  this.closePath();
  return this;
};
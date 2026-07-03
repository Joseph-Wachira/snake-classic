import { useEffect } from 'react';
import { Direction } from '@/types';

export function useKeyboard(onDirectionChange: (dir: Direction) => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      e.preventDefault();

      switch (key) {
        case 'ArrowUp':
          onDirectionChange('UP');
          break;
        case 'ArrowDown':
          onDirectionChange('DOWN');
          break;
        case 'ArrowLeft':
          onDirectionChange('LEFT');
          break;
        case 'ArrowRight':
          onDirectionChange('RIGHT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onDirectionChange, enabled]);
}
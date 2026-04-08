import React, { useEffect, useState } from 'react';

/** Mesma ideia do `body { cursor: none }` em index.css: só mouse de verdade, não touch/celular */
const FINE_CURSOR_MQ = '(hover: hover) and (pointer: fine)';

function useFinePointerCursor(): boolean {
  const [active, setActive] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(FINE_CURSOR_MQ).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(FINE_CURSOR_MQ);
    const sync = () => setActive(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return active;
}

export const Cursor: React.FC = () => {
  const useCustomCursor = useFinePointerCursor();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (!useCustomCursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.tagName.toLowerCase() === 'input'
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [useCustomCursor]);

  if (!useCustomCursor) return null;

  return (
    <>
      <div 
        className="cursor-dot"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${hovered ? 1.5 : 1})`,
          backgroundColor: hovered ? 'var(--neon-blue)' : 'var(--neon-red)',
          boxShadow: hovered ? '0 0 10px var(--neon-blue), 0 0 20px var(--neon-blue)' : '0 0 10px var(--neon-red), 0 0 20px var(--neon-red)'
        }} 
      />
      <div 
        className="cursor-outline"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          transform: `translate(-50%, -50%) scale(${hovered ? 1.2 : 1})`,
          borderColor: hovered ? 'var(--neon-red)' : 'var(--neon-purple)',
          boxShadow: hovered ? '0 0 10px var(--neon-red-glow), inset 0 0 10px var(--neon-red-glow)' : '0 0 10px var(--neon-purple-glow), inset 0 0 10px var(--neon-purple-glow)'
        }}
      />
    </>
  );
};

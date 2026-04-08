import React, { useEffect, useState } from 'react';

export const Cursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
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
  }, []);

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

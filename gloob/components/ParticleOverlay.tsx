
import React, { useMemo } from 'react';
import { ThemeMode } from '../types';

interface ParticleOverlayProps {
  theme: ThemeMode;
}

export const ParticleOverlay: React.FC<ParticleOverlayProps> = ({ theme }) => {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: theme === 'desert' ? `${Math.random() * 2 + 1}px` : `${Math.random() * 4 + 1}px`,
      duration: theme === 'desert' ? `${Math.random() * 5 + 5}s` : `${Math.random() * 10 + 8}s`,
      delay: `${Math.random() * 15}s`,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }, [theme]);

  const getParticleColor = (id: number) => {
    switch (theme) {
      case 'dark':
        return id % 2 === 0 ? '#ffffff' : '#a855f7';
      case 'light':
        return id % 2 === 0 ? '#38bdf8' : '#ffffff';
      case 'desert':
        return id % 2 === 0 ? '#f59e0b' : '#fbbf24';
      default:
        return '#ffffff';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="snowflake"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            backgroundColor: getParticleColor(p.id),
            borderRadius: theme === 'desert' ? '1px' : '50%',
            filter: theme === 'light' ? 'blur(2px)' : 'blur(1px)',
            transform: theme === 'desert' ? `rotate(${Math.random() * 360}deg)` : 'none',
          }}
        />
      ))}
    </div>
  );
};

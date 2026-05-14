import React, { useEffect, useState } from 'react';

const Background: React.FC = () => {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
          style={{
            left: p.x,
            top: p.y,
          }}
        />
      ))}
    </div>
  );
};

export default Background;
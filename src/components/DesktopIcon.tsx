import React, { useEffect, useRef } from 'react';

type Props = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

const DesktopIcon: React.FC<Props> = ({ icon, label, onClick }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();

      const iconX = rect.left + rect.width / 2;
      const iconY = rect.top + rect.height / 2;

      const dx = e.clientX - iconX;
      const dy = e.clientY - iconY;

      const distance = Math.sqrt(dx * dx + dy * dy);

      const radius = 180;

      if (distance < radius) {
        const force = 1 - distance / radius;

        const moveX = dx * force * 0.25;
        const moveY = dy * force * 0.25;

        const scale = 1 + force * 0.12;

        ref.current.style.transform =
          `translate3d(${moveX}px, ${moveY}px, 0) scale(${scale})`;
      } else {
        ref.current.style.transform =
          `translate3d(0px, 0px, 0) scale(1)`;
      }
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className="flex flex-col items-center gap-1 cursor-pointer transition-transform duration-150 ease-out"
    >
      <div className="text-3xl">{icon}</div>
      <div className="text-xs text-white/80">{label}</div>
    </div>
  );
};

export default DesktopIcon;
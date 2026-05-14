import React, { useState, useRef } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;

  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;

  zIndex: number;
  maximized?: boolean;

  animating?: boolean;
  animX?: number;
  animY?: number;
}

const Window: React.FC<Props> = ({
  title,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onFocus,
  zIndex,
  maximized,
  animating,
  animX = 0,
  animY = 0,
}) => {
  const [pos, setPos] = useState({ x: 120, y: 80 });

  const dragRef = useRef(false);

  const last = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });

  // =========================
  // CLAMP FUNCTION (IMPORTANT)
  // =========================

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(val, max));

  // =========================
  // DRAG START
  // =========================

  const startDrag = (e: React.MouseEvent) => {
    if (maximized) return;

    dragRef.current = true;

    last.current = {
      x: e.clientX,
      y: e.clientY,
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', stop);
  };

  // =========================
  // DRAG MOVE (WITH CLAMP)
  // =========================

  const move = (e: MouseEvent) => {
    if (!dragRef.current) return;

    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;

    setPos((prev) => ({
      x: clamp(prev.x + dx, 0, window.innerWidth - 300),
      y: clamp(prev.y + dy, 0, window.innerHeight - 200),
    }));

    velocity.current = { x: dx, y: dy };

    last.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  // =========================
  // DRAG STOP + INERTIA
  // =========================

  const stop = () => {
    dragRef.current = false;

    window.removeEventListener('mousemove', move);
    window.removeEventListener('mouseup', stop);

    let frame: number;
    const decay = 0.92;

    const animate = () => {
      if (
        Math.abs(velocity.current.x) < 0.1 &&
        Math.abs(velocity.current.y) < 0.1
      ) {
        cancelAnimationFrame(frame);
        return;
      }

      setPos((prev) => ({
        x: clamp(prev.x + velocity.current.x, 0, window.innerWidth - 300),
        y: clamp(prev.y + velocity.current.y, 0, window.innerHeight - 200),
      }));

      velocity.current.x *= decay;
      velocity.current.y *= decay;

      frame = requestAnimationFrame(animate);
    };

    animate();
  };

  // =========================
  // MAXIMIZE
  // =========================

  const handleDoubleClick = () => {
    onMaximize();
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div
      onMouseDown={onFocus}
      style={{
        position: 'absolute',
        top: maximized ? 0 : pos.y,
        left: maximized ? 0 : pos.x,
        width: maximized ? '100vw' : 800,
        height: maximized ? '100vh' : 500,
        zIndex,

        transform: animating
          ? `translate(${animX - pos.x}px, ${animY - pos.y}px) scale(0.1)`
          : 'translate(0,0) scale(1)',

        opacity: animating ? 0 : 1,
        transition: 'transform 250ms ease, opacity 250ms ease',
      }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden"
    >
      {/* TITLE BAR */}
      <div
        onMouseDown={startDrag}
        onDoubleClick={handleDoubleClick}
        className="flex items-center justify-between px-4 py-2 bg-black/40 cursor-move select-none"
      >
        <div className="text-white font-semibold">{title}</div>

        <div className="flex gap-3">
          <button onClick={onMinimize} className="w-3 h-3 bg-yellow-400 rounded-full" />
          <button onClick={onMaximize} className="w-3 h-3 bg-green-400 rounded-full" />
          <button onClick={onClose} className="w-3 h-3 bg-red-500 rounded-full" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4 h-full overflow-auto text-white">
        {children}
      </div>
    </div>
  );
};

export default Window;
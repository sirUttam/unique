import React, { useState, useRef } from 'react';

interface Props {
  title: string;
  children: React.ReactNode;

  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
onDoubleClickTitle?: () => void;
  zIndex: number;
  maximized?: boolean;
}

const Window: React.FC<Props> = ({
  title,
  children,
  onClose,
  onMinimize,
  onMaximize,
  onDoubleClickTitle,
  onFocus,
  zIndex,
  maximized,
}) => {

  const [pos, setPos] = useState({ x: 120, y: 80 });
  const [size, setSize] = useState({ width: 800, height: 500 });

  const drag = useRef(false);
  const resize = useRef(false);

  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ w: 0, h: 0 });

  // =========================
  // DRAG
  // =========================
  const startDrag = (e: React.MouseEvent) => {
    if (maximized) return;

    drag.current = true;
    startPos.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };

    window.onmousemove = (ev) => {
      if (!drag.current) return;

      setPos({
        x: ev.clientX - startPos.current.x,
        y: ev.clientY - startPos.current.y,
      });
    };

    window.onmouseup = () => {
      drag.current = false;
      window.onmousemove = null;
    };
  };

  // =========================
  // RESIZE FIX
  // =========================
  const startResize = (e: React.MouseEvent) => {
    e.stopPropagation();

    resize.current = true;
    startSize.current = { w: size.width, h: size.height };

    const startX = e.clientX;
    const startY = e.clientY;

    window.onmousemove = (ev) => {
      if (!resize.current) return;

      setSize({
        width: Math.max(300, startSize.current.w + (ev.clientX - startX)),
        height: Math.max(200, startSize.current.h + (ev.clientY - startY)),
      });
    };

    window.onmouseup = () => {
      resize.current = false;
      window.onmousemove = null;
    };
  };

  return (
    <div
      onMouseDown={onFocus}
      style={{
        position: 'absolute',
        top: maximized ? 0 : pos.y,
        left: maximized ? 0 : pos.x,
        width: maximized ? '100vw' : size.width,
        height: maximized ? '100vh' : size.height,
        zIndex,
      }}
      className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden shadow-2xl"
    >

      {/* TITLE BAR */}
      <div
        onMouseDown={startDrag}
        onDoubleClick={onDoubleClickTitle}
        className="flex justify-between px-3 py-2 bg-black/40 cursor-move"
      >
        <div className="text-white">{title}</div>

        <div className="flex gap-2">
          <button onClick={onMinimize} className="w-3 h-3 bg-yellow-400 rounded-full" />
          <button onClick={onMaximize} className="w-3 h-3 bg-green-400 rounded-full" />
          <button onClick={onClose} className="w-3 h-3 bg-red-500 rounded-full" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-3 text-white h-full overflow-auto">
        {children}
      </div>

      {/* RESIZE HANDLE */}
      <div
        onMouseDown={startResize}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize"
      />
    </div>
  );
};

export default Window;
import React, { useEffect, useState } from 'react';
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
} from 'react-icons/fa';

interface Props {
  windows: any[];
  onOpen: (type: string) => void;   // ✅ REQUIRED
  onRestore: (id: string) => void;
  onHome: () => void;
  onFocus: (id: string) => void;
}

const Taskbar: React.FC<Props> = ({
  windows,
  onHome,
  onFocus,
  onRestore,
}) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () =>
    time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const formatDate = () =>
    time.toLocaleDateString([], {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });

  const activeId =
    windows.length > 0
      ? windows.reduce((max, w) =>
          w.zIndex > max.zIndex ? w : max,
        windows[0]).id
      : null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black/40 backdrop-blur-xl flex gap-10 justify-center z-[9999] px-2 py-3">

      <div className="flex flex-nowrap items-center justify-between gap-3 w-full max-w-6xl px-4 py-2 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto">

        {/* HOME */}
        <button
          onClick={onHome}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          🏠
        </button>

        {/* APP WINDOWS */}
        <div className="flex flex-wrap items-center gap-2 max-w-[55%]">
          {windows.map((w) => {
  const isActive = w.id === activeId;

  return (
    <button
      key={w.id}
      onClick={() => {
  if (w.minimized) {
    onRestore(w.id);
    onFocus(w.id);
  } else if (w.id === activeId) {
    onRestore(w.id); // acts like toggle minimize
  } else {
    onFocus(w.id);
  }
}}
      className={`p-2 rounded-lg transition-all text-white
        ${isActive
          ? 'bg-blue-500/60 border border-blue-300'
          : 'bg-white/10 hover:bg-white/20'}
      `}
    >
      {w.icon ?? '📁'}
    </button>
  );
})}
        </div>

        {/* ⭐ RESTORED SOCIAL ICONS (WERE LOST BEFORE) */}
        <div className="flex flex-wrap items-center gap-3 ml-0 sm:ml-3">

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/10 hover:scale-110 transition"
          >
            <FaGithub size={24} color="#ffffff" />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/10 hover:scale-110 transition"
          >
            <FaLinkedin size={24} color="#0A66C2" />
          </a>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-white/10 hover:scale-110 transition"
          >
            <FaFacebook size={24} color="#1877F2" />
          </a>

        </div>

      </div>

      {/* CLOCK */}
      <div className="hidden sm:block w-auto text-right text-white text-sm leading-tight">
        <div className="text-sm">{formatTime()}</div>
        <div className="text-xs opacity-70">{formatDate()}</div>
      </div>

    </div>
  );
};

export default Taskbar;
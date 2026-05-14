import React, { useEffect, useRef, useState } from 'react';

import {
  FaFolder,
  FaCode,
  FaUser,
  FaEnvelope,
  FaFileAlt,
} from 'react-icons/fa';

import DesktopIcon from './components/DesktopIcon';
import Taskbar from './components/Taskbar';
import Window from './components/Window';

import ProjectsWindow from './components/ProjectsWindow';
import SkillsWindow from './components/SkillsWindow';
import AboutWindow from './components/AboutWindow';
import ContactWindow from './components/ContactWindow';
import ResumeWindow from './components/ResumeWindow';

// =========================
// TYPES
// =========================

type Win = {
  id: string;
  type: string;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  icon?: React.ReactNode;
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  rot: number;
};

// =========================
// APP REGISTRY
// =========================

const APP_REGISTRY = [
  { type: 'projects', label: 'Projects', icon: <FaFolder color="#fbbf24" size={30} />, taskIcon: <FaFolder color="#fbbf24" size={16} /> },
  { type: 'skills', label: 'Skills', icon: <FaCode color="#60a5fa" size={30} />, taskIcon: <FaCode color="#60a5fa" size={16} /> },
  { type: 'about', label: 'About', icon: <FaUser color="#34d399" size={30} />, taskIcon: <FaUser color="#34d399" size={16} /> },
  { type: 'contact', label: 'Contact', icon: <FaEnvelope color="#f472b6" size={30} />, taskIcon: <FaEnvelope color="#f472b6" size={16} /> },
  { type: 'resume', label: 'Resume', icon: <FaFileAlt color="#a78bfa" size={30} />, taskIcon: <FaFileAlt color="#a78bfa" size={16} /> },
];

const App: React.FC = () => {
  // =========================
  // STATE
  // =========================

  const [windows, setWindows] = useState<Win[]>([]);
  const [zIndex, setZIndex] = useState(10);
  const [missionControl, setMissionControl] = useState(false);

  const mouse = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const particles = useRef<Particle[]>([]);
  const shockwaves = useRef<{ x: number; y: number; r: number; a: number }[]>([]);

  // =========================
  // KEYBOARD
  // =========================

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'ArrowUp') {
        setMissionControl((v) => !v);
      }
      if (e.key === 'Escape') setMissionControl(false);
    };

    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  // =========================
  // PERSISTENCE
  // =========================

  useEffect(() => {
    const saved = localStorage.getItem('os-windows');
    if (saved) setWindows(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('os-windows', JSON.stringify(windows));
  }, [windows]);

  // =========================
  // MOUSE + PARTICLES (UNCHANGED)
  // =========================

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      for (let i = 0; i < 6; i++) {
        particles.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          life: 1,
          size: Math.random() * 2.5 + 1,
          rot: Math.random() * 360,
        });
      }
    };

    const click = (e: MouseEvent) => {
      shockwaves.current.push({
        x: e.clientX,
        y: e.clientY,
        r: 0,
        a: 1,
      });
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('click', click);

    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('click', click);
    };
  }, []);

  // =========================
  // CURSOR ENGINE
  // =========================

  useEffect(() => {
    const el = cursorRef.current;
    if (!el) return;

    let frame: number;

    const animate = () => {
      cursor.current.x += (mouse.current.x - cursor.current.x) * 0.25;
      cursor.current.y += (mouse.current.y - cursor.current.y) * 0.25;

      el.style.transform =
        `translate3d(${cursor.current.x}px, ${cursor.current.y}px, 0)`;

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // =========================
  // PARTICLE ENGINE
  // =========================

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    let frame: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          return;
        }

        ctx.beginPath();
        ctx.fillStyle = `rgba(140,200,255,${p.life})`;
        ctx.shadowBlur = 18;
        ctx.shadowColor = 'rgba(120,200,255,0.9)';
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // =========================
  // FIXED FOCUS SYSTEM (IMPORTANT)
  // =========================

  const focusWindow = (id: string) => {
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex || 0), 10);

      return prev.map((w) =>
        w.id === id
          ? { ...w, zIndex: maxZ + 1 }
          : w
      );
    });
  };

  // =========================
  // WINDOW SYSTEM
  // =========================

  const openApp = (type: string) => {
    const app = APP_REGISTRY.find((a) => a.type === type);
    if (!app) return;

    setWindows((prev) => {
      const exists = prev.find((w) => w.type === type);

      if (exists) {
        return prev.map((w) =>
          w.type === type ? { ...w, minimized: false } : w
        );
      }

      return [
        ...prev,
        {
          id: `${type}-${Date.now()}`,
          type,
          minimized: false,
          maximized: false,
          zIndex,
          icon: app.taskIcon,
        },
      ];
    });

    setZIndex((z) => z + 1);
  };

  const closeWindow = (id: string) =>
    setWindows((p) => p.filter((w) => w.id !== id));

  const minimizeWindow = (id: string) =>
    setWindows((p) =>
      p.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      )
    );

  const handleHome = () => setWindows([]);

  const renderContent = (type: string) => {
    switch (type) {
      case 'projects': return <ProjectsWindow />;
      case 'skills': return <SkillsWindow />;
      case 'about': return <AboutWindow />;
      case 'contact': return <ContactWindow />;
      case 'resume': return <ResumeWindow />;
      default: return null;
    }
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="w-screen h-screen overflow-hidden relative">

      <div className="absolute inset-0 bg-gradient-to-br from-[#1c1f26] via-[#111827] to-[#0b0f17]" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div
        ref={cursorRef}
        className="fixed w-4 h-4 rounded-full bg-cyan-300 shadow-lg pointer-events-none z-[9999]"
      />

      {/* DESKTOP */}
      <div className="absolute top-10 left-6 flex flex-col gap-5 z-10">
        {APP_REGISTRY.map((app) => (
          <DesktopIcon
            key={app.type}
            icon={app.icon}
            label={app.label}
            onClick={() => openApp(app.type)}
          />
        ))}
      </div>

      {/* WINDOWS */}
      {!missionControl ? (
        windows.map((win) =>
          !win.minimized ? (
            <div
              key={win.id}
              onMouseDown={() => focusWindow(win.id)}
            >
              <Window
                title={win.type}
                zIndex={win.zIndex}
                maximized={win.maximized}
                onClose={() => closeWindow(win.id)}
                onMinimize={() => minimizeWindow(win.id)}
                onMaximize={() =>
                  setWindows((p) =>
                    p.map((w) =>
                      w.id === win.id
                        ? { ...w, maximized: !w.maximized }
                        : w
                    )
                  )
                }
                onFocus={() => focusWindow(win.id)}
              >
                {renderContent(win.type)}
              </Window>
            </div>
          ) : null
        )
      ) : (
        <div className="absolute inset-0 z-50 backdrop-blur-xl bg-black/40 flex flex-wrap gap-6 p-10">
          {windows.map((win) => (
            <div
              key={win.id}
              onClick={() => {
                focusWindow(win.id);
                setMissionControl(false);
              }}
              className="w-[240px] h-[140px] bg-white/10 border border-white/20 rounded-xl p-3 cursor-pointer hover:scale-105 transition"
            >
              <div className="text-white text-sm mb-2">
                {win.type}
              </div>
              <div className="scale-[0.25] origin-top-left">
                {renderContent(win.type)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TASKBAR */}
      <Taskbar
        windows={windows}
        onOpen={openApp}
        onRestore={(id) =>
          setWindows((prev) => {
            const maxZ = Math.max(...prev.map((w) => w.zIndex || 0), 10);

            return prev.map((w) =>
              w.id === id
                ? { ...w, minimized: false, zIndex: maxZ + 1 }
                : w
            );
          })
        }
        onFocus={focusWindow}
        onHome={handleHome}
      />
    </div>
  );
};

export default App;
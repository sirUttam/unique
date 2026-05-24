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
};

type Shockwave = {
  x: number;
  y: number;
  r: number;
  a: number;
};

const APP_REGISTRY = [
  { type: 'projects', label: 'Projects', icon: <FaFolder color="#fbbf24" size={30} />, taskIcon: <FaFolder color="#fbbf24" size={16} /> },
  { type: 'skills', label: 'Skills', icon: <FaCode color="#60a5fa" size={30} />, taskIcon: <FaCode color="#60a5fa" size={16} /> },
  { type: 'about', label: 'About', icon: <FaUser color="#34d399" size={30} />, taskIcon: <FaUser color="#34d399" size={16} /> },
  { type: 'contact', label: 'Contact', icon: <FaEnvelope color="#f472b6" size={30} />, taskIcon: <FaEnvelope color="#f472b6" size={16} /> },
  { type: 'resume', label: 'Resume', icon: <FaFileAlt color="#a78bfa" size={30} />, taskIcon: <FaFileAlt color="#a78bfa" size={16} /> },
];

const App: React.FC = () => {

  const [windows, setWindows] = useState<Win[]>([]);
  const [zIndex, setZIndex] = useState(10);

  const mouse = useRef({ x: 0, y: 0 });
  const cursor = useRef({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);

  const particles = useRef<Particle[]>([]);
  const shockwaves = useRef<Shockwave[]>([]);

  // =========================
  // WINDOW FOCUS
  // =========================
  const focusWindow = (id: string) => {
    setZIndex(prev => {
      const newZ = prev + 1;

      setWindows(prev =>
        prev.map(w =>
          w.id === id ? { ...w, zIndex: newZ } : w
        )
      );

      return newZ;
    });
  };

  // =========================
  // OPEN APP
  // =========================
  const openApp = (type: string) => {
    const app = APP_REGISTRY.find(a => a.type === type);
    if (!app) return;

    setWindows(prev => {
      const exists = prev.find(w => w.type === type);

      if (exists) {
        return prev.map(w =>
          w.type === type
            ? { ...w, minimized: false }
            : w
        );
      }

      return [
        ...prev,
        {
          id: `${type}-${Date.now()}`,
          type,
          minimized: false,
          maximized: false,
          zIndex: zIndex + 1,
          icon: app.taskIcon,
        }
      ];
    });

    setZIndex(z => z + 1);
  };

  const closeWindow = (id: string) =>
    setWindows(p => p.filter(w => w.id !== id));

  const minimizeWindow = (id: string) =>
    setWindows(p =>
      p.map(w =>
        w.id === id ? { ...w, minimized: true } : w
      )
    );

  const handleHome = () => setWindows([]);

  const onRestore = (id: string) => {
    setWindows(prev =>
      prev.map(w =>
        w.id === id ? { ...w, minimized: false } : w
      )
    );
  };

  // =========================
  // ⭐ NEW: SHOCKWAVE FUNCTION
  // =========================
  const addShockwave = (x: number, y: number) => {
    shockwaves.current.push({
      x,
      y,
      r: 0,
      a: 1,
    });
  };

  // =========================
  // CONTENT
  // =========================
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
  // CURSOR (UNCHANGED)
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
  // PARTICLES (UNCHANGED)
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
        const dx = mouse.current.x - p.x;
        const dy = mouse.current.y - p.y;

        const angle = Math.atan2(dy, dx);

        const orbit = 3.2;
        const pull = 0.3;

        p.vx += dx * pull * 0.02;
        p.vy += dy * pull * 0.02;

        p.vx += Math.cos(angle + Math.PI / 2) * orbit;
        p.vy += Math.sin(angle + Math.PI / 2) * orbit;

        p.vx *= 0.78;
        p.vy *= 0.78;

        p.x += p.vx;
        p.y += p.vy;

        p.life -= 0.012;

        if (p.life <= 0) {
          particles.current.splice(i, 1);
          return;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = `rgba(140,200,255,${p.life})`;
        ctx.fillRect(-2, -2, 3, 3);
        ctx.restore();
      });

      // ⭐ SHOCKWAVE ANIMATION
      shockwaves.current.forEach((s, i) => {
        s.r += 8;
        s.a -= 0.03;

        if (s.a <= 0) {
          shockwaves.current.splice(i, 1);
          return;
        }

        ctx.beginPath();
        ctx.strokeStyle = `rgba(120,200,255,${s.a})`;
        ctx.lineWidth = 2;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.stroke();
      });

      frame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frame);
  }, []);

  // =========================
  // MOUSE
  // =========================
  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };

      for (let i = 0; i < 20; i++) {
        particles.current.push({
          x: mouse.current.x,
          y: mouse.current.y,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          life: 1,
        });
      }
    };

    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div
      className="w-screen h-screen relative overflow-hidden"
      onDoubleClick={(e) => addShockwave(e.clientX, e.clientY)}
    >

      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div ref={cursorRef} className="fixed w-4 h-4 bg-cyan-300 rounded-full" />

      {/* DESKTOP ICONS */}
      <div className="absolute top-6 left-4 sm:top-10 sm:left-6 flex flex-col gap-5 z-10">
        {APP_REGISTRY.map(app => (
          <DesktopIcon
            key={app.type}
            icon={app.icon}
            label={app.label}
            onClick={() => openApp(app.type)}
          />
        ))}
      </div>

      {/* WINDOWS */}
      {windows.map(win =>
        !win.minimized && (
          <Window
            key={win.id}
            title={win.type}
            zIndex={win.zIndex}
            maximized={win.maximized}
            onClose={() => closeWindow(win.id)}
            onMinimize={() => minimizeWindow(win.id)}
            onMaximize={() =>
              setWindows(p =>
                p.map(w =>
                  w.id === win.id
                    ? {
                        ...w,
                        maximized: !w.maximized,
                        minimized: false
                      }
                    : w
                )
              )
            }
            onFocus={() => focusWindow(win.id)}
            onDoubleClickTitle={() =>
              setWindows(p =>
                p.map(w =>
                  w.id === win.id
                    ? {
                        ...w,
                        maximized: !w.maximized,
                        minimized: false
                      }
                    : w
                )
              )
            }
          >
            {renderContent(win.type)}
          </Window>
        )
      )}

      {/* TASKBAR */}
      <Taskbar
        windows={windows}
        onOpen={openApp}
        onRestore={onRestore}
        onFocus={focusWindow}
        onHome={handleHome}
      />
    </div>
  );
};

export default App;
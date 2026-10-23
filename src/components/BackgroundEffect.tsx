import React, { useEffect, useRef } from 'react';

export const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Deep tech particles: Neon-Cyan, Electric Blue, Subtle Gold, Crisp White
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      pulseSpeed: number;
    }

    const particles: Particle[] = [];
    const particleCount = 48;
    const colors = [
      '#06b6d4', // Neon Cyan
      '#38bdf8', // Electric Sky
      '#f59e0b', // Elegant Gold
      '#10b981', // Emerald Accents
      '#ffffff', // Crisp White
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: Math.random() * 2.0 + 0.7,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.35 + 0.12,
        pulseSpeed: Math.random() * 0.02 + 0.008,
      });
    }

    let t = 0;

    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      // 1. Sleek Modern Tech Perspective Grid (Floor section)
      const gridYStart = height * 0.48;
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.06)'; // Subtle dark cyan-navy grid

      const gridSize = 64;

      // Vertical perspective lines converging toward horizon
      const horizonY = height * 0.42;
      const horizonX = width * 0.5;
      const fovLines = 20;

      for (let i = -fovLines; i <= fovLines; i++) {
        const spreadX = horizonX + i * 105;
        ctx.beginPath();
        ctx.moveTo(horizonX + (i * 14), horizonY);
        ctx.lineTo(spreadX, height);
        ctx.stroke();
      }

      // Horizontal depth lines
      for (let y = gridYStart; y < height; y += gridSize * 0.7) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Flowing Quantum Neon-Cyan & Gold Neural Waves
      ctx.beginPath();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.18)'; // Neon Cyan Wave
      for (let x = 0; x <= width; x += 12) {
        const y = height * 0.46 + Math.sin(x * 0.0035 + t) * 35 + Math.cos(x * 0.008 + t * 0.6) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      ctx.beginPath();
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.14)'; // Subtle Golden Wave
      for (let x = 0; x <= width; x += 14) {
        const y = height * 0.50 + Math.cos(x * 0.004 - t * 0.7) * 28 + Math.sin(x * 0.007 + t * 0.9) * 14;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 3. Cyber Nodes and Connective Tech Filaments
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = p.alpha + Math.sin(t * 1.8 + i) * 0.1;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0.04, Math.min(0.75, currentAlpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby nodes with delicate filaments
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 85) {
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 85) * 0.08;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* 1. Base Deep Tech Charcoal/Navy Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030611] via-[#060c1a] to-[#02050c]" />

      {/* 2. Sleek Deep Navy / Charcoal Glassmorphic Glows */}
      {/* Top Center: Electric Cyan & Ice-Blue Tech Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-15%,rgba(14,165,233,0.15),transparent_70%)]" />

      {/* Left Flank: Subtle Cyber Neon-Cyan Ambient Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_5%_45%,rgba(6,182,212,0.08),transparent_65%)]" />

      {/* Right Flank: Luxurious Subtle Golden Tech Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_95%_55%,rgba(245,158,11,0.07),transparent_65%)]" />

      {/* Bottom Center: Gentle Emerald Liquidity Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_105%,rgba(16,185,129,0.06),transparent_60%)]" />

      {/* 3. High-Tech Glass Dot Matrix Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* 4. Dynamic Canvas Layer (Grid, Neural Waves & Nodes) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 5. Delicate Vignette to Keep Center Content Crystal-Clear */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#02040a]/80 via-transparent to-[#02040a]/40" />
    </div>
  );
};

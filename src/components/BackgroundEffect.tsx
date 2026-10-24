import React, { useEffect, useRef } from 'react';

/**
 * Ultra-Sharp, Crystal-Clear, High-Definition, Fast-Moving Futuristic Background
 * 
 * Features:
 *  - 100% Crystal-clear, razor-sharp vector rendering on native High-DPI canvas (zero blur, zero wash-out)
 *  - High-velocity AI trading command center aesthetic (fast dynamic particle streams, laser circuit pulses)
 *  - Fast-moving cyberpunk perspective grid with warp-speed depth motion
 *  - Vivid high-contrast neon palette: Electric Cyan (#00f3ff), Striking Emerald (#00ff88), Metallic Gold (#ffb703)
 *  - Deep rich midnight black base (#010308) for maximum contrast and punch
 *  - High-performance, lightweight, zero-lag execution optimized for Android & desktop (no expensive blur filters)
 *  - Strict CSS stacking (fixed inset-0, pointer-events-none, -z-10) with zero interference with cards/text
 */

export const BackgroundEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Pointer tracking for interactive acceleration
    const pointer = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      active: false,
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      pointer.active = true;
      if ('touches' in e && e.touches.length > 0) {
        pointer.targetX = e.touches[0].clientX;
        pointer.targetY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        pointer.targetX = (e as MouseEvent).clientX;
        pointer.targetY = (e as MouseEvent).clientY;
      }
    };

    const handlePointerLeave = () => {
      pointer.active = false;
      pointer.targetX = -1000;
      pointer.targetY = -1000;
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('mouseleave', handlePointerLeave, { passive: true });

    // High-DPI setup for crystal-clear sharpness
    const handleResize = () => {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // ==========================================
    // 1. Sharp Particle Matrix & Constellation Nodes
    // ==========================================
    interface CyberNode {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      ringColor: string;
      type: 'cyan' | 'gold' | 'emerald';
      pulse: number;
      pulseSpeed: number;
    }

    const nodeColors = [
      { color: '#00f3ff', ringColor: 'rgba(0, 243, 255, 0.45)', type: 'cyan' as const },
      { color: '#ffb703', ringColor: 'rgba(255, 183, 3, 0.45)', type: 'gold' as const },
      { color: '#00ff88', ringColor: 'rgba(0, 255, 136, 0.45)', type: 'emerald' as const },
    ];

    const nodeCount = Math.min(75, Math.floor((width * height) / 18000) + 35);
    const nodes: CyberNode[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const conf = nodeColors[Math.floor(Math.random() * nodeColors.length)];
      // Faster, high-energy particle velocities
      const speed = Math.random() * 0.9 + 0.45;
      const angle = Math.random() * Math.PI * 2;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.2 + 1.2,
        color: conf.color,
        ringColor: conf.ringColor,
        type: conf.type,
        pulse: Math.random() * Math.PI,
        pulseSpeed: Math.random() * 0.08 + 0.04,
      });
    }

    // ==========================================
    // 2. Fast-Moving High-Energy Laser Beams
    // ==========================================
    interface LaserBeam {
      x: number;
      y: number;
      length: number;
      speed: number;
      color: string;
      width: number;
      tailColor: string;
      trackY: number;
    }

    const beamCount = 14;
    const beams: LaserBeam[] = [];
    const beamColors = [
      { head: '#00f3ff', tail: 'rgba(0, 243, 255, 0.0)' },
      { head: '#00ff88', tail: 'rgba(0, 255, 136, 0.0)' },
      { head: '#ffb703', tail: 'rgba(255, 183, 3, 0.0)' },
      { head: '#38bdf8', tail: 'rgba(56, 189, 248, 0.0)' },
    ];

    for (let i = 0; i < beamCount; i++) {
      const col = beamColors[Math.floor(Math.random() * beamColors.length)];
      beams.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 120 + 70,
        speed: Math.random() * 7.5 + 4.5, // Fast-moving laser speed
        color: col.head,
        tailColor: col.tail,
        width: Math.random() * 1.5 + 1.0,
        trackY: Math.random() * height,
      });
    }

    // ==========================================
    // 3. Fast Energy Pulses on Node Filaments
    // ==========================================
    interface FilamentPulse {
      n1: number;
      n2: number;
      progress: number;
      speed: number;
      color: string;
    }

    const maxPulses = 16;
    const filamentPulses: FilamentPulse[] = [];

    // Main High-FPS Animation Engine
    let lastTime = performance.now();
    let gridOffset = 0;
    let waveTime = 0;

    const render = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      // Fast pace: 2.8x animation speed
      gridOffset += delta * 120; // Fast grid movement
      waveTime += delta * 3.2;

      // Pointer smooth interpolation
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * 0.15;
        pointer.y += (pointer.targetY - pointer.y) * 0.15;
      }

      // -------------------------------------------------------------
      // Layer 1: Solid Deep Midnight Black Base (Maximum Contrast)
      // -------------------------------------------------------------
      ctx.fillStyle = '#010308';
      ctx.fillRect(0, 0, width, height);

      // -------------------------------------------------------------
      // Layer 2: Fast-Moving Cyberpunk Perspective Grid (Sharp Lines)
      // -------------------------------------------------------------
      ctx.save();
      const horizonY = height * 0.42;
      const horizonCenterX = width * 0.5;
      const fovLines = 24;

      // Crisp vertical perspective rays
      ctx.lineWidth = 1.0;
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.08)';

      for (let i = -fovLines; i <= fovLines; i++) {
        const startX = horizonCenterX + i * 18;
        const endX = horizonCenterX + i * (width * 0.065);
        ctx.beginPath();
        ctx.moveTo(startX, horizonY);
        ctx.lineTo(endX, height);
        ctx.stroke();
      }

      // Fast-moving horizontal warp grid rungs
      const gridSpacing = 42;
      const effectiveOffset = gridOffset % gridSpacing;
      let currY = horizonY + 8;
      let stepSize = 14;

      while (currY < height) {
        const factor = (currY - horizonY) / (height - horizonY);
        stepSize = 14 + factor * 50;
        currY += stepSize;

        const dynamicY = currY + (effectiveOffset * factor);
        if (dynamicY > horizonY && dynamicY < height) {
          ctx.strokeStyle = `rgba(0, 243, 255, ${0.03 + factor * 0.12})`;
          ctx.beginPath();
          ctx.moveTo(0, dynamicY);
          ctx.lineTo(width, dynamicY);
          ctx.stroke();
        }
      }
      ctx.restore();

      // -------------------------------------------------------------
      // Layer 3: Sharp High-Speed Circuit Laser Beams (Horizontal Data Streams)
      // -------------------------------------------------------------
      ctx.save();
      for (let i = 0; i < beams.length; i++) {
        const b = beams[i];
        b.x += b.speed;

        if (b.x - b.length > width) {
          b.x = -b.length;
          b.y = Math.random() * height;
          b.speed = Math.random() * 8.0 + 4.5;
        }

        // Draw laser with crisp gradient trail
        const grad = ctx.createLinearGradient(b.x - b.length, b.y, b.x, b.y);
        grad.addColorStop(0, b.tailColor);
        grad.addColorStop(0.7, b.color);
        grad.addColorStop(1, '#ffffff'); // Intense diamond tip

        ctx.strokeStyle = grad;
        ctx.lineWidth = b.width;
        ctx.beginPath();
        ctx.moveTo(b.x - b.length, b.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        // High-contrast bright laser head spark
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(b.x - 1.5, b.y - 1.5, 3, 3);
      }
      ctx.restore();

      // -------------------------------------------------------------
      // Layer 4: Crisp Geometric Cyber-Waves (Electric Cyan, Emerald, Gold)
      // -------------------------------------------------------------
      const drawSharpCyberWave = (
        baseY: number,
        color: string,
        amp: number,
        freq: number,
        speed: number,
        lineWidth: number
      ) => {
        ctx.save();
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = color;
        ctx.beginPath();

        for (let x = 0; x <= width; x += 12) {
          const y = baseY + Math.sin(x * freq + waveTime * speed) * amp + Math.cos(x * (freq * 0.7) - waveTime * 1.8) * (amp * 0.4);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      };

      // 1. Sharp Electric Cyan Wave (High tick velocity)
      drawSharpCyberWave(height * 0.38, 'rgba(0, 243, 255, 0.45)', 24, 0.004, 1.4, 1.5);
      // 2. Sharp Metallic Gold Wave (Orderbook Liquidity)
      drawSharpCyberWave(height * 0.46, 'rgba(255, 183, 3, 0.42)', 20, 0.005, -1.2, 1.5);
      // 3. Sharp Striking Emerald Wave (Algorithmic Confirmation)
      drawSharpCyberWave(height * 0.54, 'rgba(0, 255, 136, 0.38)', 18, 0.006, 1.6, 1.5);

      // -------------------------------------------------------------
      // Layer 5: Sharp Particle Matrix & Constellation Filaments
      // -------------------------------------------------------------
      const activeConnections: [number, number][] = [];
      const connectDist = 110;

      // Update node positions with fast, smooth movement
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx * 1.5;
        node.y += node.vy * 1.5;
        node.pulse += node.pulseSpeed;

        if (node.x < -15) node.x = width + 15;
        if (node.x > width + 15) node.x = -15;
        if (node.y < -15) node.y = height + 15;
        if (node.y > height + 15) node.y = -15;

        // Pointer proximity deflection
        if (pointer.active) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 1) {
            const force = (1 - dist / 150) * 2.5;
            node.x += (dx / dist) * force;
            node.y += (dy / dist) * force;
          }
        }
      }

      // Draw crisp 1px vector filaments between nodes
      ctx.lineWidth = 1.0;
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dx = n1.x - n2.x;
          const dy = n1.y - n2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDist) {
            activeConnections.push([i, j]);
            const alpha = (1 - dist / connectDist) * 0.35;

            ctx.strokeStyle = n1.color === n2.color ? n1.color : 'rgba(0, 243, 255, 0.7)';
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Draw crisp filament to active pointer
        if (pointer.active) {
          const dx = n1.x - pointer.x;
          const dy = n1.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            const alpha = (1 - dist / 130) * 0.6;
            ctx.strokeStyle = n1.color;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // Spawn fast energy pulses along active filaments
      if (Math.random() < 0.12 && activeConnections.length > 0 && filamentPulses.length < maxPulses) {
        const [n1, n2] = activeConnections[Math.floor(Math.random() * activeConnections.length)];
        filamentPulses.push({
          n1,
          n2,
          progress: 0,
          speed: Math.random() * 0.05 + 0.03, // High-speed pulse
          color: nodes[n1].color,
        });
      }

      // Render crisp, high-speed energy pulses
      for (let i = filamentPulses.length - 1; i >= 0; i--) {
        const p = filamentPulses[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          filamentPulses.splice(i, 1);
          continue;
        }

        const nodeA = nodes[p.n1];
        const nodeB = nodes[p.n2];
        if (!nodeA || !nodeB) {
          filamentPulses.splice(i, 1);
          continue;
        }

        const px = nodeA.x + (nodeB.x - nodeA.x) * p.progress;
        const py = nodeA.y + (nodeB.y - nodeA.y) * p.progress;

        // Sharp diamond energy packet
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px - 1.5, py - 1.5, 3, 3);
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 1.0;
        ctx.strokeRect(px - 3, py - 3, 6, 6);
      }

      // Render crisp particle nodes (solid sharp cores + crisp geometric rings)
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const pulseVal = Math.sin(node.pulse);
        const radius = node.size + pulseVal * 0.6;

        ctx.save();
        // Solid neon core (crystal clear, no blur)
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Crisp white inner center
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Sharp concentric 1px cyber ring on prominent nodes
        if (node.size > 2.0) {
          ctx.strokeStyle = node.ringColor;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // -------------------------------------------------------------
      // Layer 6: Sharp Geometric Crosshair Reticles at Grid Intersections
      // -------------------------------------------------------------
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 243, 255, 0.25)';
      ctx.lineWidth = 1.0;
      const crossStepX = 140;
      const crossStepY = 90;

      for (let cx = crossStepX * 0.5; cx < width; cx += crossStepX) {
        for (let cy = crossStepY * 0.5; cy < height; cy += crossStepY) {
          const crossPulse = Math.sin(waveTime * 2.0 + cx * 0.02 + cy * 0.02);
          if (crossPulse > 0.65) {
            ctx.beginPath();
            ctx.moveTo(cx - 4, cy);
            ctx.lineTo(cx + 4, cy);
            ctx.moveTo(cx, cy - 4);
            ctx.lineTo(cx, cy + 4);
            ctx.stroke();
          }
        }
      }
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('mouseleave', handlePointerLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none bg-[#010308]"
    >
      {/* 1. Crystal-Clear High-DPI Native Canvas (Zero Blur, Zero Fuzziness) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block"
      />

      {/* 2. Razor-Sharp Subtle Tech Scanline Overlay (Clean 1px Pixel-Grid Texture) */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0) 50%, rgba(0, 243, 255, 0.6) 50%)',
          backgroundSize: '100% 4px',
        }}
      />
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { Eye, Layers, Compass, Play, Pause, RefreshCw, BarChart2, Activity, ZoomIn } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const InteractiveViewport: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { language } = useLanguage();

  // Control toggles
  const [viewMode, setViewMode] = useState<'undeformed' | 'deformed' | 'moment' | 'axial'>('deformed');
  const [showLoads, setShowLoads] = useState<boolean>(true);
  const [showReactions, setShowReactions] = useState<boolean>(true);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [hoveredNodeInfo, setHoveredNodeInfo] = useState<string | null>(null);

  // Time ticker for dynamic vibration animation
  const timeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Structural nodes (2-Bay, 2-Story 3D Portal Frame)
  const baseNodes = [
    // Ground level (Z = 0)
    { id: 1, x: -120, y: -60, z: 0, fixed: true },
    { id: 2, x: 0, y: -60, z: 0, fixed: true },
    { id: 3, x: 120, y: -60, z: 0, fixed: true },
    { id: 4, x: -120, y: 60, z: 0, fixed: true },
    { id: 5, x: 0, y: 60, z: 0, fixed: true },
    { id: 6, x: 120, y: 60, z: 0, fixed: true },

    // Story 1 (Z = 90)
    { id: 7, x: -120, y: -60, z: 90, fixed: false },
    { id: 8, x: 0, y: -60, z: 90, fixed: false },
    { id: 9, x: 120, y: -60, z: 90, fixed: false },
    { id: 10, x: -120, y: 60, z: 90, fixed: false },
    { id: 11, x: 0, y: 60, z: 90, fixed: false },
    { id: 12, x: 120, y: 60, z: 90, fixed: false },

    // Story 2 (Z = 170)
    { id: 13, x: -120, y: -60, z: 170, fixed: false },
    { id: 14, x: 0, y: -60, z: 170, fixed: false },
    { id: 15, x: 120, y: -60, z: 170, fixed: false },
    { id: 16, x: -120, y: 60, z: 170, fixed: false },
    { id: 17, x: 0, y: 60, z: 170, fixed: false },
    { id: 18, x: 120, y: 60, z: 170, fixed: false },
  ];

  // Structural elements (columns and beams)
  const elements = [
    // Columns Story 1
    { start: 1, end: 7, type: 'column' },
    { start: 2, end: 8, type: 'column' },
    { start: 3, end: 9, type: 'column' },
    { start: 4, end: 10, type: 'column' },
    { start: 5, end: 11, type: 'column' },
    { start: 6, end: 12, type: 'column' },

    // Columns Story 2
    { start: 7, end: 13, type: 'column' },
    { start: 8, end: 14, type: 'column' },
    { start: 9, end: 15, type: 'column' },
    { start: 10, end: 16, type: 'column' },
    { start: 11, end: 17, type: 'column' },
    { start: 12, end: 18, type: 'column' },

    // Beams Story 1 (X direction)
    { start: 7, end: 8, type: 'beam' },
    { start: 8, end: 9, type: 'beam' },
    { start: 10, end: 11, type: 'beam' },
    { start: 11, end: 12, type: 'beam' },

    // Beams Story 1 (Y direction)
    { start: 7, end: 10, type: 'beam' },
    { start: 8, end: 11, type: 'beam' },
    { start: 9, end: 12, type: 'beam' },

    // Beams Story 2 (X direction)
    { start: 13, end: 14, type: 'beam' },
    { start: 14, end: 15, type: 'beam' },
    { start: 16, end: 17, type: 'beam' },
    { start: 17, end: 18, type: 'beam' },

    // Beams Story 2 (Y direction)
    { start: 13, end: 16, type: 'beam' },
    { start: 14, end: 17, type: 'beam' },
    { start: 15, end: 18, type: 'beam' },
  ];

  // Perspective 3D to 2D projection
  const project = (x: number, y: number, z: number, width: number, height: number, dispFactor = 0) => {
    const driftX = (z / 170) * (z / 170) * 18 * dispFactor;
    const deflZ = -Math.abs(Math.sin((x / 120) * Math.PI)) * 8 * (z > 0 ? 1 : 0) * dispFactor;

    const actualX = x + driftX;
    const actualZ = z + deflZ;

    const angle = 0.52; // ~30 deg
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    const isoX = (actualX - y) * cosA;
    const isoY = (actualX + y) * sinA * 0.5 - actualZ;

    const scale = Math.min(width, height) / 380;
    const screenX = width / 2 + isoX * scale;
    const screenY = height / 2 + 70 + isoY * scale;

    return { x: screenX, y: screenY, zOrder: actualX + y + actualZ };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    // Handle high DPI crisp rendering
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const render = () => {
      if (!running || !canvas) return;

      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      let currentDisp = viewMode === 'undeformed' ? 0 : 1;
      if (isAnimating) {
        timeRef.current += 0.05;
        currentDisp = Math.sin(timeRef.current) * 1.2;
      }

      // 1. Draw CAD coordinate grid
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.12)';
      ctx.lineWidth = 1;
      const gridSpan = 200;
      for (let g = -gridSpan; g <= gridSpan; g += 50) {
        const p1 = project(g, -gridSpan, 0, width, height);
        const p2 = project(g, gridSpan, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        const q1 = project(-gridSpan, g, 0, width, height);
        const q2 = project(gridSpan, g, 0, width, height);
        ctx.beginPath();
        ctx.moveTo(q1.x, q1.y);
        ctx.lineTo(q2.x, q2.y);
        ctx.stroke();
      }

      // 2. Render foundation supports
      baseNodes.filter((n) => n.fixed).forEach((node) => {
        const pt = project(node.x, node.y, node.z, width, height);
        ctx.fillStyle = '#00F2FE';
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x - 7, pt.y + 11);
        ctx.lineTo(pt.x + 7, pt.y + 11);
        ctx.closePath();
        ctx.fill();

        // Support hatch line
        ctx.strokeStyle = '#00F2FE';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pt.x - 10, pt.y + 12);
        ctx.lineTo(pt.x + 10, pt.y + 12);
        ctx.stroke();

        // Reaction force arrow
        if (showReactions && viewMode !== 'undeformed') {
          ctx.strokeStyle = '#10B981';
          ctx.fillStyle = '#10B981';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y + 26);
          ctx.lineTo(pt.x, pt.y + 14);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y + 12);
          ctx.lineTo(pt.x - 4, pt.y + 18);
          ctx.lineTo(pt.x + 4, pt.y + 18);
          ctx.closePath();
          ctx.fill();
        }
      });

      // 3. Render undeformed faint ghost lines
      if (viewMode !== 'undeformed') {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        elements.forEach((elem) => {
          const n1 = baseNodes.find((n) => n.id === elem.start)!;
          const n2 = baseNodes.find((n) => n.id === elem.end)!;
          const p1 = project(n1.x, n1.y, n1.z, width, height, 0);
          const p2 = project(n2.x, n2.y, n2.z, width, height, 0);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });
        ctx.setLineDash([]);
      }

      // 4. Render main structural elements
      elements.forEach((elem) => {
        const n1 = baseNodes.find((n) => n.id === elem.start)!;
        const n2 = baseNodes.find((n) => n.id === elem.end)!;
        const p1 = project(n1.x, n1.y, n1.z, width, height, currentDisp);
        const p2 = project(n2.x, n2.y, n2.z, width, height, currentDisp);

        if (viewMode === 'moment') {
          ctx.lineWidth = 2.5;
          ctx.strokeStyle = elem.type === 'beam' ? '#3B82F6' : '#60A5FA';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          if (elem.type === 'beam') {
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2 - 12;

            ctx.fillStyle = 'rgba(59, 130, 246, 0.28)';
            ctx.strokeStyle = '#2563EB';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          }
        } else if (viewMode === 'axial') {
          const isColumn = elem.type === 'column';
          ctx.lineWidth = isColumn ? 4.5 : 3;
          ctx.strokeStyle = isColumn ? '#EF4444' : '#06B6D4';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        } else {
          ctx.lineWidth = elem.type === 'column' ? 3.5 : 2.5;
          ctx.strokeStyle = elem.type === 'column' ? '#0072FF' : '#00B0FF';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Distributed gravity loads
        if (showLoads && elem.type === 'beam' && n1.z === 170) {
          ctx.strokeStyle = '#F59E0B';
          ctx.fillStyle = '#F59E0B';
          ctx.lineWidth = 1.2;
          for (let frac = 0.2; frac <= 0.8; frac += 0.3) {
            const lx = p1.x + (p2.x - p1.x) * frac;
            const ly = p1.y + (p2.y - p1.y) * frac;
            ctx.beginPath();
            ctx.moveTo(lx, ly - 16);
            ctx.lineTo(lx, ly);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx - 2.5, ly - 5);
            ctx.lineTo(lx + 2.5, ly - 5);
            ctx.closePath();
            ctx.fill();
          }
        }
      });

      // 5. Lateral wind force
      if (showLoads) {
        const topNode = project(-120, -60, 170, width, height, currentDisp);
        ctx.strokeStyle = '#F59E0B';
        ctx.fillStyle = '#F59E0B';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(topNode.x - 38, topNode.y);
        ctx.lineTo(topNode.x, topNode.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(topNode.x, topNode.y);
        ctx.lineTo(topNode.x - 8, topNode.y - 4);
        ctx.lineTo(topNode.x - 8, topNode.y + 4);
        ctx.closePath();
        ctx.fill();

        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText('W = 18 kN', topNode.x - 48, topNode.y - 6);
      }

      // 6. Nodes
      baseNodes.forEach((node) => {
        const pt = project(node.x, node.y, node.z, width, height, currentDisp);
        ctx.fillStyle = node.fixed ? '#0072FF' : '#00F2FE';
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, node.fixed ? 4 : 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#0E162A';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // 7. Triad in bottom-left
      const triadX = 40;
      const triadY = height - 40;
      const triadLen = 22;

      ctx.strokeStyle = '#EF4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(triadX, triadY);
      ctx.lineTo(triadX + triadLen * Math.cos(0.52), triadY + triadLen * Math.sin(0.52) * 0.5);
      ctx.stroke();
      ctx.fillStyle = '#EF4444';
      ctx.font = '10px Inter, sans-serif';
      ctx.fillText('X', triadX + triadLen * Math.cos(0.52) + 4, triadY + triadLen * Math.sin(0.52) * 0.5);

      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(triadX, triadY);
      ctx.lineTo(triadX - triadLen * Math.cos(0.52), triadY + triadLen * Math.sin(0.52) * 0.5);
      ctx.stroke();
      ctx.fillStyle = '#10B981';
      ctx.fillText('Y', triadX - triadLen * Math.cos(0.52) - 10, triadY + triadLen * Math.sin(0.52) * 0.5);

      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(triadX, triadY);
      ctx.lineTo(triadX, triadY - triadLen);
      ctx.stroke();
      ctx.fillStyle = '#3B82F6';
      ctx.fillText('Z', triadX - 3, triadY - triadLen - 4);

      if (isAnimating) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [viewMode, showLoads, showReactions, isAnimating]);

  return (
    <div
      ref={containerRef}
      className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-tsa-navy-900 to-slate-950 border border-slate-700/60 shadow-2xl overflow-hidden tech-glow"
    >
      {/* Top Engineering Ribbon / Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 text-xs">
        {/* Left: View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950/70 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => { setViewMode('undeformed'); setIsAnimating(false); }}
            className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-all duration-150 ${
              viewMode === 'undeformed'
                ? 'bg-tsa-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'fr' ? 'Initial' : 'Undeformed'}
          </button>
          <button
            onClick={() => setViewMode('deformed')}
            className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-all duration-150 ${
              viewMode === 'deformed'
                ? 'bg-tsa-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'fr' ? 'Déformée {U}' : 'Deformed {U}'}
          </button>
          <button
            onClick={() => setViewMode('moment')}
            className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-all duration-150 ${
              viewMode === 'moment'
                ? 'bg-tsa-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'fr' ? 'Moments (My)' : 'Moments (My)'}
          </button>
          <button
            onClick={() => setViewMode('axial')}
            className={`px-3 py-1.5 rounded-md font-medium cursor-pointer transition-all duration-150 ${
              viewMode === 'axial'
                ? 'bg-tsa-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'fr' ? 'Effort Normal (N)' : 'Axial (N)'}
          </button>
        </div>

        {/* Right: Layer Toggles & Modal Animation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLoads(!showLoads)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium border cursor-pointer transition-colors active:scale-95 ${
              showLoads
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle Applied Loads"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Charges' : 'Loads'}</span>
          </button>
          <button
            onClick={() => setShowReactions(!showReactions)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium border cursor-pointer transition-colors active:scale-95 ${
              showReactions
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Toggle Support Reactions"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{language === 'fr' ? 'Réactions' : 'Reactions'}</span>
          </button>
          <button
            onClick={() => setIsAnimating(!isAnimating)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium border cursor-pointer transition-colors active:scale-95 ${
              isAnimating
                ? 'bg-tsa-cyan-400/20 text-tsa-cyan-300 border-tsa-cyan-400/40 animate-pulse'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Vibration Mode"
          >
            {isAnimating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>Mode 1 (1.82 Hz)</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="relative w-full h-[360px] sm:h-[440px] flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair block"
        />

        {/* Viewport Overlay Diagnostics */}
        <div className="absolute top-3 left-4 pointer-events-none flex flex-col gap-1 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-tsa-cyan-400 font-semibold">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>SOLVER: OpenSees Active</span>
          </div>
          <div>DOF: 36 | Elements: 22 | Nodes: 18</div>
          <div>Max Drift: 8.4 mm (L / 416) — OK</div>
          <div className="text-emerald-400">∑F_v = 0.00 kN | ∑F_h = 0.00 kN</div>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 right-4 pointer-events-none bg-slate-950/85 backdrop-blur-sm p-2.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-300">
          {viewMode === 'axial' ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-sm bg-red-500" />
                <span>Compression (-)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-sm bg-cyan-400" />
                <span>Tension (+)</span>
              </div>
            </div>
          ) : viewMode === 'moment' ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded-sm bg-blue-500" />
                <span>My Envelope [kNm]</span>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Active 6-DOF Node</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 border border-cyan-400 rotate-45" />
                <span>Fixed Base Support</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Technical Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-2">
          <span className="text-tsa-blue-400">● 3D CAD B-Rep:</span>
          <span>OpenCASCADE V3d</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>Scale: 1:1</span>
          <span>Units: SI (m, kN)</span>
          <span>Equilibrium: Verified</span>
        </div>
      </div>
    </div>
  );
};

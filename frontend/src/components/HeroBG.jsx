import { useEffect, useRef } from 'react';

export default function HeroBG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let W, H;

    // ── Resize handler ──────────────────────────────────────────
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // ── Config ──────────────────────────────────────────────────
    const TEAL   = '#0D9488';
    const CYAN   = '#0891B2';
    const INDIGO = '#6366F1';

    // ── Helpers ─────────────────────────────────────────────────
    const rand  = (a, b) => Math.random() * (b - a) + a;
    const lerp  = (a, b, t) => a + (b - a) * t;

    // ── Particles (floating dots + cross shapes) ─────────────────
    const N_PARTS = 60;
    const particles = Array.from({ length: N_PARTS }, () => ({
      x: rand(0, 1), y: rand(0, 1),
      vx: rand(-0.00015, 0.00015), vy: rand(-0.00015, 0.00015),
      r: rand(1.5, 4),
      alpha: rand(0.2, 0.7),
      type: Math.random() < 0.25 ? 'cross' : 'dot',   // 25 % are medical crosses
      color: [TEAL, CYAN, INDIGO][Math.floor(rand(0, 3))],
      pulse: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.01, 0.025),
    }));

    // ── Orbs (big glowing blobs) ─────────────────────────────────
    const orbs = [
      { cx: 0.72, cy: 0.30, r: 0.28, color: TEAL,   alpha: 0.07 },
      { cx: 0.15, cy: 0.70, r: 0.22, color: CYAN,   alpha: 0.06 },
      { cx: 0.88, cy: 0.82, r: 0.18, color: INDIGO, alpha: 0.05 },
    ];

    // ── 3-D perspective grid ─────────────────────────────────────
    function drawGrid(t) {
      const cols = 12, rows = 8;
      const speed = t * 0.00018;
      ctx.save();
      ctx.strokeStyle = `rgba(13,148,136,0.08)`;
      ctx.lineWidth = 0.8;

      // Vertical lines with vanishing-point perspective
      for (let i = 0; i <= cols; i++) {
        const tx = (i / cols + speed) % 1;
        const x0 = lerp(-W * 0.5, W * 1.5, tx);
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(lerp(W * 0.3, W * 0.7, tx), H * 0.55);  // vanish point
        ctx.stroke();
      }
      // Horizontal curved lines
      for (let j = 1; j <= rows; j++) {
        const ty = j / rows;
        const yBase = H * 0.55 * ty;
        const xL = lerp(-W * 0.5, W * 0.3, ty);
        const xR = lerp(W * 1.5, W * 0.7, ty);
        ctx.beginPath();
        ctx.moveTo(xL, yBase);
        ctx.lineTo(xR, yBase);
        ctx.stroke();
      }
      ctx.restore();
    }

    // ── Draw glowing orbs ────────────────────────────────────────
    function drawOrbs(t) {
      orbs.forEach(o => {
        const pulsate = Math.sin(t * 0.0007) * 0.03;
        const rPx = (o.r + pulsate) * Math.min(W, H);
        const grad = ctx.createRadialGradient(
          o.cx * W, o.cy * H, 0,
          o.cx * W, o.cy * H, rPx,
        );
        grad.addColorStop(0,   hexAlpha(o.color, o.alpha));
        grad.addColorStop(1,   hexAlpha(o.color, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.cx * W, o.cy * H, rPx, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    // ── Draw medical cross ────────────────────────────────────────
    function drawCross(x, y, size, color, alpha) {
      const arm = size * 1.2;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      // Vertical bar
      ctx.beginPath();
      ctx.roundRect(x - size * 0.3, y - arm, size * 0.6, arm * 2, size * 0.2);
      ctx.fill();
      // Horizontal bar
      ctx.beginPath();
      ctx.roundRect(x - arm, y - size * 0.3, arm * 2, size * 0.6, size * 0.2);
      ctx.fill();
      ctx.restore();
    }

    // ── Draw particle network (connecting lines) ──────────────────
    function drawNetwork() {
      const maxDist = 0.18;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < maxDist) {
            ctx.save();
            ctx.globalAlpha = (1 - d / maxDist) * 0.12;
            ctx.strokeStyle = TEAL;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x * W, particles[i].y * H);
            ctx.lineTo(particles[j].x * W, particles[j].y * H);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    }

    // ── Update + draw particles ───────────────────────────────────
    function drawParticles(t) {
      particles.forEach(p => {
        // Move
        p.x += p.vx; p.y += p.vy;
        if (p.x < -0.05) p.x = 1.05;
        if (p.x > 1.05)  p.x = -0.05;
        if (p.y < -0.05) p.y = 1.05;
        if (p.y > 1.05)  p.y = -0.05;

        p.pulse += p.pulseSpeed;
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));

        if (p.type === 'cross') {
          drawCross(p.x * W, p.y * H, p.r * 2.5, p.color, a * 0.8);
        } else {
          // Glowing dot
          const grad = ctx.createRadialGradient(
            p.x * W, p.y * H, 0,
            p.x * W, p.y * H, p.r * 3,
          );
          grad.addColorStop(0, hexAlpha(p.color, a));
          grad.addColorStop(1, hexAlpha(p.color, 0));
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x * W, p.y * H, p.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // ── Hex → rgba helper ─────────────────────────────────────────
    function hexAlpha(hex, a) {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${a})`;
    }

    // ── Main animation loop ───────────────────────────────────────
    function draw(t) {
      ctx.clearRect(0, 0, W, H);

      // Base gradient background
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0,   '#edfaf8');
      bg.addColorStop(0.5, '#f5fbff');
      bg.addColorStop(1,   '#ecf9ff');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      drawGrid(t);
      drawOrbs(t);
      drawNetwork();
      drawParticles(t);

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0, display: 'block' }}
    />
  );
}

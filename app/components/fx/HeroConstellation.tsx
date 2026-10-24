'use client';

import { useEffect, useRef } from 'react';
import styles from '../../business.module.css';

/**
 * Decorative hero canvas: an "automation constellation".
 * - Ambient nodes drift slowly and link to near neighbours, densest around the example card.
 * - A route traced just outside the example card (id = targetId) carries a travelling pulse:
 *   New lead → Instant reply → Follow-up → Booked call. Each stop flares as the pulse passes.
 * The headline is server-rendered text; this canvas mounts after it and never blocks it.
 * Pauses when off-screen or the tab is hidden; draws one static frame for reduced motion.
 */

const STOPS = ['New lead', 'Instant reply', 'Follow-up', 'Booked call'];
const GOLD = '215, 167, 68';
const GOLD_HI = '238, 196, 104';
const BLUE = '124, 196, 255';
const LOOP_MS = 7200;

type Ambient = { nx: number; ny: number; ax: number; ay: number; sp: number; ph: number; r: number; blue: boolean };
type Pt = { x: number; y: number };

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Rounded rectangle as a dense polyline, clockwise from the start of the top edge.
function roundedRectPath(x: number, y: number, w: number, h: number, r: number): Pt[] {
  const pts: Pt[] = [];
  const seg = (x1: number, y1: number, x2: number, y2: number) => {
    const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / 6));
    for (let i = 0; i < n; i += 1) pts.push({ x: x1 + ((x2 - x1) * i) / n, y: y1 + ((y2 - y1) * i) / n });
  };
  const arc = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i < 10; i += 1) {
      const a = a0 + (Math.PI / 2) * (i / 10);
      pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
    }
  };
  seg(x + r, y, x + w - r, y);
  arc(x + w - r, y + r, -Math.PI / 2);
  seg(x + w, y + r, x + w, y + h - r);
  arc(x + w - r, y + h - r, 0);
  seg(x + w - r, y + h, x + r, y + h);
  arc(x + r, y + h - r, Math.PI / 2);
  seg(x, y + h - r, x, y + r);
  arc(x + r, y + r, Math.PI);
  return pts;
}

export default function HeroConstellation({ targetId }: { targetId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = mulberry32(20261024);
    let W = 0;
    let H = 0;
    let dpr = 1;
    // Fixed pool in normalized coordinates, so resizes never re-scatter the nodes.
    const pool: Ambient[] = Array.from({ length: 64 }, () => ({
      nx: rand(),
      ny: rand(),
      ax: 4 + rand() * 8,
      ay: 4 + rand() * 8,
      sp: 0.00012 + rand() * 0.00018,
      ph: rand() * Math.PI * 2,
      r: 0.8 + rand() * 1.4,
      blue: rand() < 0.22,
    }));
    let ambient: Ambient[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    const flash = [0, 0, 0, 0];
    let lastStop = -1;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(64, Math.max(22, Math.round((W * H) / 24000)));
      ambient = pool.slice(0, count);
      if (!running) draw(performance.now());
    };

    // Example card rectangle in canvas coordinates (it can move during its entrance).
    const cardRect = () => {
      const card = document.getElementById(targetId);
      if (!card) return null;
      const c = canvas.getBoundingClientRect();
      const r = card.getBoundingClientRect();
      return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height };
    };

    const weightAt = (p: Pt, card: { x: number; y: number; w: number; h: number } | null) => {
      if (!card) return 0.5;
      const dx = Math.max(card.x - p.x, 0, p.x - (card.x + card.w));
      const dy = Math.max(card.y - p.y, 0, p.y - (card.y + card.h));
      // Stacked (phone) layout: the text sits directly above the card, so fade faster there.
      const falloff = W < 960 && p.y < card.y ? 70 : 240;
      return 0.16 * (falloff === 70 ? 0.5 : 1) + 0.84 * Math.exp(-Math.hypot(dx, dy) / falloff);
    };

    function draw(now: number) {
      const t = now - start;
      ctx!.clearRect(0, 0, W, H);
      const card = cardRect();

      // Ambient constellation
      const pts = ambient.map((n) => ({
        x: n.nx * W + (reduce ? 0 : Math.sin(t * n.sp + n.ph) * n.ax),
        y: n.ny * H + (reduce ? 0 : Math.cos(t * n.sp * 0.9 + n.ph) * n.ay),
        n,
      }));
      const maxD = W < 700 ? 110 : 140;
      for (let i = 0; i < pts.length; i += 1) {
        for (let j = i + 1; j < pts.length; j += 1) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d > maxD) continue;
          const w = Math.min(weightAt(pts[i], card), weightAt(pts[j], card));
          ctx!.strokeStyle = `rgba(${GOLD}, ${(1 - d / maxD) * 0.2 * w})`;
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(pts[i].x, pts[i].y);
          ctx!.lineTo(pts[j].x, pts[j].y);
          ctx!.stroke();
        }
      }
      for (const p of pts) {
        const w = weightAt(p, card);
        ctx!.fillStyle = `rgba(${p.n.blue ? BLUE : GOLD_HI}, ${0.55 * w})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.n.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (!card || card.w < 120) return;

      // Route around the card
      const e = 12;
      const route = roundedRectPath(card.x - e, card.y - e, card.w + 2 * e, card.h + 2 * e, 18 + e);
      const len = [0];
      for (let i = 1; i < route.length; i += 1) {
        len.push(len[i - 1] + Math.hypot(route[i].x - route[i - 1].x, route[i].y - route[i - 1].y));
      }
      const total = len[len.length - 1] + Math.hypot(route[0].x - route[route.length - 1].x, route[0].y - route[route.length - 1].y);
      const at = (s: number): Pt => {
        const m = ((s % total) + total) % total;
        let lo = 0;
        let hi = len.length - 1;
        while (lo < hi) {
          const mid = (lo + hi + 1) >> 1;
          if (len[mid] <= m) lo = mid;
          else hi = mid - 1;
        }
        const a = route[lo];
        const b = route[(lo + 1) % route.length];
        const segLen = (lo + 1 < len.length ? len[lo + 1] : total) - len[lo] || 1;
        const f = (m - len[lo]) / segLen;
        return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
      };

      ctx!.setLineDash([2, 7]);
      ctx!.strokeStyle = `rgba(${GOLD}, 0.32)`;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      route.forEach((p, i) => (i ? ctx!.lineTo(p.x, p.y) : ctx!.moveTo(p.x, p.y)));
      ctx!.closePath();
      ctx!.stroke();
      ctx!.setLineDash([]);

      // Stops: top edge at 22% / 78%, bottom edge at 78% / 22% (clockwise order).
      const topLen = card.w + 2 * e - 2 * (18 + e);
      const sideLen = card.h + 2 * e - 2 * (18 + e);
      const quarterArc = (Math.PI / 2) * (18 + e);
      const xs = [0.22, 0.78];
      const stopS = [
        xs[0] * (card.w + 2 * e) - (18 + e),
        xs[1] * (card.w + 2 * e) - (18 + e),
        topLen + quarterArc + sideLen + quarterArc + (1 - xs[1]) * (card.w + 2 * e) - (18 + e),
        topLen + quarterArc + sideLen + quarterArc + (1 - xs[0]) * (card.w + 2 * e) - (18 + e),
      ];
      const stops = stopS.map((s) => at(s));

      // Pulse with tail
      const head = reduce ? -1 : stopS[0] + ((t % LOOP_MS) / LOOP_MS) * total;
      if (!reduce) {
        const tail = Math.min(140, total * 0.12);
        for (let k = 0; k < 28; k += 1) {
          const s1 = head - (tail * k) / 28;
          const s2 = head - (tail * (k + 1)) / 28;
          const p1 = at(s1);
          const p2 = at(s2);
          ctx!.strokeStyle = `rgba(${GOLD_HI}, ${0.9 * (1 - k / 28)})`;
          ctx!.lineWidth = 2.2 * (1 - k / 40);
          ctx!.beginPath();
          ctx!.moveTo(p1.x, p1.y);
          ctx!.lineTo(p2.x, p2.y);
          ctx!.stroke();
        }
        const hp = at(head);
        const g = ctx!.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, 16);
        g.addColorStop(0, `rgba(${GOLD_HI}, 0.9)`);
        g.addColorStop(1, `rgba(${GOLD_HI}, 0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(hp.x, hp.y, 16, 0, Math.PI * 2);
        ctx!.fill();

        // Which stop did the pulse pass last?
        const travelled = ((head - stopS[0]) % total + total) % total;
        let current = 0;
        for (let i = 0; i < 4; i += 1) {
          const rel = ((stopS[i] - stopS[0]) % total + total) % total;
          if (travelled >= rel) current = i;
        }
        if (current !== lastStop) {
          flash[current] = 1;
          lastStop = current;
        }
        for (let i = 0; i < 4; i += 1) flash[i] = Math.max(0, flash[i] - 0.012);
      }

      // Stop nodes, links to nearby ambient nodes, labels
      ctx!.font = '600 10.5px "DM Sans", system-ui, sans-serif';
      stops.forEach((p, i) => {
        const f = reduce ? 0.5 : flash[i];
        let near = pts
          .map((q) => ({ q, d: Math.hypot(q.x - p.x, q.y - p.y) }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 2);
        near = near.filter((n) => n.d < 180);
        for (const n of near) {
          ctx!.strokeStyle = `rgba(${GOLD}, ${0.12 + 0.25 * f})`;
          ctx!.beginPath();
          ctx!.moveTo(p.x, p.y);
          ctx!.lineTo(n.q.x, n.q.y);
          ctx!.stroke();
        }
        const halo = 6 + 14 * f;
        const g = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, halo);
        g.addColorStop(0, `rgba(${GOLD_HI}, ${0.35 + 0.5 * f})`);
        g.addColorStop(1, `rgba(${GOLD_HI}, 0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, halo, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.fillStyle = `rgba(${GOLD_HI}, ${0.75 + 0.25 * f})`;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 3.4, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.strokeStyle = 'rgba(10, 12, 13, 0.9)';
        ctx!.lineWidth = 1.2;
        ctx!.stroke();
        ctx!.lineWidth = 1;

        const label = STOPS[i].toUpperCase();
        ctx!.textAlign = 'center';
        ctx!.textBaseline = i < 2 ? 'bottom' : 'top';
        ctx!.fillStyle = `rgba(241, 238, 231, ${0.5 + 0.5 * f})`;
        ctx!.fillText(label, p.x, i < 2 ? p.y - 9 : p.y + 9);
      });
    }

    const loop = (now: number) => {
      draw(now);
      if (running) raf = requestAnimationFrame(loop);
    };
    const play = () => {
      if (reduce || running || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const pause = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const card = document.getElementById(targetId);
    if (card) ro.observe(card);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) play();
      else pause();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? pause() : play());
    document.addEventListener('visibilitychange', onVis);
    // Fonts change the card's height; redraw once they are ready.
    document.fonts?.ready.then(() => !running && draw(performance.now())).catch(() => {});

    resize();
    play();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [targetId]);

  return <canvas ref={canvasRef} className={styles.constellation} aria-hidden="true" />;
}

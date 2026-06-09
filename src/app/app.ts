import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {

  ngAfterViewInit() {
    this.initStarfield();
    this.initReveal();
  }

  private initStarfield() {
    const c = document.getElementById('starfield') as HTMLCanvasElement;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    let w: number, h: number, dpr: number;
    let stars: any[] = [], sparkles: any[] = [];
    const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.width = innerWidth * dpr;
      h = c.height = innerHeight * dpr;
      c.style.width = innerWidth + 'px';
      c.style.height = innerHeight + 'px';
      build();
    };

    const build = () => {
      const count = Math.round((innerWidth * innerHeight) / 5200);
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w, y: Math.random() * h,
          r: (Math.random() * 1.3 + 0.3) * dpr,
          base: Math.random() * 0.5 + 0.2,
          amp: Math.random() * 0.5 + 0.3,
          sp: Math.random() * 0.0016 + 0.0006,
          ph: Math.random() * Math.PI * 2,
          hue: Math.random()
        });
      }
      sparkles = [];
      const sc = Math.max(5, Math.round(innerWidth / 180));
      for (let i = 0; i < sc; i++) sparkles.push(makeSparkle(true));
    };

    const makeSparkle = (init: boolean) => {
      const cols = ['#f4d6e8', '#a8d8f0', '#c8a8e0', '#ffffff', '#c078a8'];
      return {
        x: Math.random() * w,
        y: init ? Math.random() * h : h + 20 * dpr,
        size: (Math.random() * 7 + 4) * dpr,
        vy: -(Math.random() * 0.18 + 0.05) * dpr,
        vx: (Math.random() - 0.5) * 0.12 * dpr,
        ph: Math.random() * Math.PI * 2,
        sp: Math.random() * 0.02 + 0.01,
        col: cols[Math.floor(Math.random() * cols.length)]
      };
    };

    const star4 = (x: number, y: number, s: number, col: string, alpha: number) => {
      ctx.save(); ctx.translate(x, y); ctx.globalAlpha = alpha;
      ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = s * 1.6;
      ctx.beginPath();
      ctx.moveTo(0, -s); ctx.quadraticCurveTo(0, 0, s, 0);
      ctx.quadraticCurveTo(0, 0, 0, s); ctx.quadraticCurveTo(0, 0, -s, 0);
      ctx.quadraticCurveTo(0, 0, 0, -s); ctx.fill();
      ctx.restore();
    };

    let t = 0;
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      t += 1;
      for (const s of stars) {
        const tw = s.base + s.amp * (0.5 + 0.5 * Math.sin(t * s.sp * 60 + s.ph));
        const col = s.hue < 0.6 ? '#ffffff' : (s.hue < 0.85 ? '#cfe6f7' : '#f3d8ec');
        ctx.beginPath();
        ctx.fillStyle = col; ctx.globalAlpha = Math.max(0, Math.min(1, tw));
        ctx.shadowColor = col; ctx.shadowBlur = s.r * 2;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      if (!reduce) {
        for (const p of sparkles) {
          p.y += p.vy; p.x += p.vx; p.ph += p.sp;
          const a = 0.45 + 0.45 * Math.sin(p.ph);
          star4(p.x, p.y, p.size * (0.7 + 0.3 * Math.sin(p.ph)), p.col, a);
          if (p.y < -20 * dpr) Object.assign(p, makeSparkle(false));
        }
      }
      ctx.globalAlpha = 1; ctx.shadowBlur = 0;
      requestAnimationFrame(frame);
    };

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(frame);
  }

  private initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  }
}

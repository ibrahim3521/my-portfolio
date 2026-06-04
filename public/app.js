// Custom cursor
const cursor = document.createElement('div');
cursor.className = 'cursor';
const ring = document.createElement('div');
ring.className = 'cursor-ring';
document.body.appendChild(cursor);
document.body.appendChild(ring);
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
  setTimeout(() => { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; }, 80);
});
document.querySelectorAll('a, button').forEach(el => {
  el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.8)');
  el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
});

// Resume modal
const modal = document.getElementById('resumeModal');
document.getElementById('openResume').addEventListener('click', () => modal.classList.add('open'));
document.getElementById('openResume2').addEventListener('click', () => modal.classList.add('open'));
document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });

// Nav scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 100);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Active nav
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 150) current = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current}`));
});

// ── HERO CANVAS ANIMATION ──
const cv = document.getElementById('f1canvas');
if (cv) {
  const ctx = cv.getContext('2d');
  cv.width = cv.offsetWidth;
  cv.height = cv.offsetHeight;
  window.addEventListener('resize', () => { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; });
  const W = () => cv.width, H = () => cv.height;

  // Planet color palette cycling
  const COLS = [
    [255, 215, 0],
    [224, 80, 32],
    [74, 144, 217],
    [228, 209, 145],
    [200, 139, 58],
  ];
  let colIdx = 0, blend = 0;

  function getCol(a = 1) {
    const c1 = COLS[colIdx], c2 = COLS[(colIdx + 1) % COLS.length];
    const r = ~~(c1[0] + (c2[0] - c1[0]) * blend);
    const g = ~~(c1[1] + (c2[1] - c1[1]) * blend);
    const b = ~~(c1[2] + (c2[2] - c1[2]) * blend);
    return `rgba(${r},${g},${b},${a})`;
  }

  // Solar system
  const planets = [
    { r: 4,  o: 45,  spd: 0.025, a: 0,   c: [170,170,170] },
    { r: 7,  o: 75,  spd: 0.016, a: 1.2, c: [232,200,122] },
    { r: 8,  o: 108, spd: 0.011, a: 2.4, c: [74,144,217], moon: true },
    { r: 6,  o: 145, spd: 0.008, a: 0.8, c: [193,68,14] },
    { r: 16, o: 195, spd: 0.005, a: 3.5, c: [200,139,58] },
    { r: 13, o: 248, spd: 0.003, a: 5.0, c: [228,209,145], rings: true },
  ];

  // Whiteboard equations
  const EQS = [
    ['∫e^(-x²)dx', '=√π'], ['det(λI-A)', '=0'],
    ['∑1/n²', '=π²/6'],   ['eⁱᵖ+1', '=0'],
    ["f'(x)=lim Δf", '/Δx'], ['T(n)=2T(n/2)', '=Θ(n)'],
  ];
  const lines = EQS.map((eq, i) => ({
    eq, p: Math.min(i * 0.15, 0.9), ap: 0,
    phase: i * 0.15 >= 1 ? 'pause' : 'write', pt: 0
  }));

  // Answer particles
  const ANS = ['=√π', '=0', '✓', 'Q.E.D', '∎', '=λ'];
  function newAP() {
    const a = -(0.3 + Math.random() * 0.8), s = 1.5 + Math.random() * 2;
    const w = W(), h = H();
    const WX = w * 0.44, WY = h * 0.08, WW = w * 0.25, WH = h * 0.5;
    return {
      x: WX + Math.random() * WW, y: WY + Math.random() * WH,
      vx: Math.cos(a) * s, vy: Math.sin(a) * s, grav: 0.025,
      text: ANS[~~(Math.random() * ANS.length)],
      life: ~~(Math.random() * 120), ml: 80 + ~~(Math.random() * 60),
      sz: 9 + Math.random() * 5, rot: 0, rs: (Math.random() - .5) * 0.06, alpha: 0
    };
  }
  const AP = Array.from({ length: 8 }, () => newAP());

  // Compass shapes
  const CTYPES = ['hexagon', 'triangle', 'pentagon', 'square', 'octagon'];
  function newShape() {
    return {
      cx: 10 + Math.random() * (W() * 0.38), cy: 10 + Math.random() * (H() - 20),
      type: CTYPES[~~(Math.random() * CTYPES.length)],
      r: 18 + Math.random() * 35, prog: Math.random() * 0.5,
      spd: 0.003 + Math.random() * 0.003, alpha: 0.3 + Math.random() * 0.3,
      done: false, ht: 0, rot: Math.random() * Math.PI * 2
    };
  }
  const shapes = Array.from({ length: 5 }, () => newShape());
  function shapeN(t) { return { hexagon: 6, triangle: 3, pentagon: 5, square: 4, octagon: 8 }[t]; }
  function shapePt(s, i, n) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2 + s.rot;
    return [s.cx + Math.cos(a) * s.r, s.cy + Math.sin(a) * s.r];
  }

  // Person equations flying
  const PEQLIST = ['∫f(x)dx', '∑xᵢ/n', 'λ=eig', 'P(A|B)', 'det(A)', 'Ax=b'];
  function newPEQ() {
    const px = W() * 0.86, py = H() * 0.55;
    const a = -(0.2 + Math.random() * 0.9), s = 0.8 + Math.random() * 1.4;
    return {
      x: px + (Math.random() - .5) * 20, y: py - 30,
      vx: Math.cos(a) * s, vy: Math.sin(a) * s, grav: 0.015,
      text: PEQLIST[~~(Math.random() * PEQLIST.length)],
      life: ~~(Math.random() * 100), ml: 90 + ~~(Math.random() * 70),
      sz: 10 + Math.random() * 5, alpha: 0
    };
  }
  const PEQ = Array.from({ length: 6 }, () => newPEQ());

  let t = 0;

  function draw() {
    t++;
    blend += 0.0015;
    if (blend >= 1) { blend = 0; colIdx = (colIdx + 1) % COLS.length; }

    const w = W(), h = H();
    const SX = w * 0.72, SY = h * 0.4;
    const WX = w * 0.44, WY = h * 0.08, WW = w * 0.25, WH = h * 0.5;

    ctx.fillStyle = '#03040a';
    ctx.fillRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = getCol(0.04); ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 50) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += 50) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

    // LED strip top/bottom
    for (let i = 0; i < w; i += 18) {
      const a = 0.2 + Math.sin(t * 0.05 + i * 0.02) * 0.3;
      ctx.fillStyle = getCol(a); ctx.shadowColor = getCol(0.7); ctx.shadowBlur = 5;
      ctx.beginPath(); ctx.arc(i, 3, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(i, h - 3, 1.8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;

    // ── SOLAR SYSTEM ──
    const sunGrad = ctx.createRadialGradient(SX, SY, 0, SX, SY, 80);
    sunGrad.addColorStop(0, 'rgba(255,220,80,0.12)');
    sunGrad.addColorStop(1, 'rgba(255,140,0,0)');
    ctx.fillStyle = sunGrad; ctx.beginPath(); ctx.arc(SX, SY, 80, 0, Math.PI * 2); ctx.fill();

    const sg = ctx.createRadialGradient(SX - 4, SY - 4, 1, SX, SY, 22);
    sg.addColorStop(0, '#fffae0'); sg.addColorStop(0.5, '#ffd700'); sg.addColorStop(1, '#ff8c00');
    ctx.fillStyle = sg; ctx.shadowColor = 'rgba(255,180,0,0.7)'; ctx.shadowBlur = 18;
    ctx.beginPath(); ctx.arc(SX, SY, 22, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;

    planets.forEach(p => {
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.5; ctx.setLineDash([3, 8]);
      ctx.beginPath(); ctx.arc(SX, SY, p.o, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    });

    planets.forEach(p => {
      p.a += p.spd;
      const px = SX + Math.cos(p.a) * p.o, py = SY + Math.sin(p.a) * p.o;
      const [r, g, b] = p.c;
      ctx.shadowColor = `rgba(${r},${g},${b},0.5)`; ctx.shadowBlur = 10;
      if (p.rings) {
        ctx.save(); ctx.translate(px, py); ctx.rotate(0.4);
        ctx.strokeStyle = 'rgba(228,209,145,0.35)'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(0, 0, p.r + 10, 4, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      const pg = ctx.createRadialGradient(px - p.r * .3, py - p.r * .3, 0, px, py, p.r);
      pg.addColorStop(0, 'rgba(255,255,255,0.3)');
      pg.addColorStop(0.5, `rgb(${r},${g},${b})`);
      pg.addColorStop(1, `rgba(${r},${g},${b},0.5)`);
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, p.r, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      if (p.moon) {
        const mx = px + Math.cos(p.a * 8) * 14, my = py + Math.sin(p.a * 8) * 9;
        ctx.fillStyle = 'rgba(200,210,220,0.8)'; ctx.beginPath(); ctx.arc(mx, my, 2, 0, Math.PI * 2); ctx.fill();
      }
    });

    // ── COMPASS SHAPES ──
    shapes.forEach((s, idx) => {
      if (!s.done) { s.prog = Math.min(s.prog + s.spd, 1); if (s.prog >= 1) s.done = true; }
      else { s.ht++; if (s.ht > 80) { s.alpha -= 0.008; } if (s.alpha <= 0) shapes[idx] = newShape(); }
      const n = shapeN(s.type), drawn = ~~(s.prog * n), frac = s.prog * n - drawn;
      ctx.strokeStyle = getCol(s.alpha); ctx.lineWidth = 1;
      ctx.shadowColor = getCol(0.3); ctx.shadowBlur = 4;
      ctx.beginPath();
      const [sx, sy] = shapePt(s, 0, n); ctx.moveTo(sx, sy);
      for (let i = 1; i <= drawn; i++) { const [px, py] = shapePt(s, i % n, n); ctx.lineTo(px, py); }
      if (drawn < n) {
        const [ax, ay] = shapePt(s, drawn, n); const [bx, by] = shapePt(s, (drawn + 1) % n, n);
        ctx.lineTo(ax + (bx - ax) * frac, ay + (by - ay) * frac);
      }
      ctx.stroke(); ctx.shadowBlur = 0;
      if (!s.done) {
        const [ax, ay] = shapePt(s, drawn, n); const [bx, by] = shapePt(s, (drawn + 1) % n, n);
        const tx = ax + (bx - ax) * frac, ty = ay + (by - ay) * frac;
        ctx.setLineDash([3, 5]); ctx.strokeStyle = getCol(s.alpha * .3); ctx.lineWidth = 0.7;
        ctx.beginPath(); ctx.moveTo(s.cx, s.cy); ctx.lineTo(tx, ty); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = getCol(s.alpha); ctx.shadowColor = getCol(0.8); ctx.shadowBlur = 6;
        ctx.beginPath(); ctx.arc(s.cx, s.cy, 2.5, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(tx, ty, 2, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      }
    });

    // ── WHITEBOARD ──
    ctx.fillStyle = 'rgba(3,5,15,0.93)'; ctx.strokeStyle = getCol(0.4); ctx.lineWidth = 1.5;
    ctx.shadowColor = getCol(0.2); ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.roundRect(WX, WY, WW, WH, 4); ctx.fill(); ctx.stroke(); ctx.shadowBlur = 0;
    [[WX + 4, WY + 4], [WX + WW - 4, WY + 4], [WX + 4, WY + WH - 4], [WX + WW - 4, WY + WH - 4]].forEach(([x, y]) => {
      const a = 0.4 + Math.sin(t * 0.05) * 0.5;
      ctx.fillStyle = getCol(a); ctx.shadowColor = getCol(0.9); ctx.shadowBlur = 8;
      ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill();
    });
    ctx.shadowBlur = 0;
    ctx.fillStyle = getCol(0.5); ctx.font = '8px monospace';
    ctx.fillText('◈ MATH SOLUTIONS', WX + 10, WY + 13);

    lines.forEach((l, i) => {
      if (l.phase === 'write') { l.p = Math.min(l.p + 0.012, 1); if (l.p >= 1) { l.phase = 'pause'; l.pt = 0; } }
      else if (l.phase === 'pause') { l.pt++; if (l.pt > 30) l.phase = 'answer'; }
      else if (l.phase === 'answer') { l.ap = Math.min(l.ap + 0.02, 1); if (l.ap >= 1) l.phase = 'done'; }
      const x = WX + 12, y = WY + 28 + (i / EQS.length) * (WH - 36);
      ctx.font = '9px monospace'; ctx.fillStyle = 'rgba(230,235,255,0.8)';
      ctx.fillText(l.eq[0].slice(0, ~~(l.p * l.eq[0].length)) + (l.phase === 'write' && l.p < 1 ? '▌' : ''), x, y);
      if (l.phase === 'answer' || l.phase === 'done') {
        const aw = ctx.measureText(l.eq[0]).width + 4;
        ctx.fillStyle = getCol(0.9); ctx.shadowColor = getCol(0.4); ctx.shadowBlur = 4;
        ctx.fillText(l.eq[1].slice(0, ~~(l.ap * l.eq[1].length)) + (l.phase === 'answer' ? '▌' : ''), x + aw, y);
        ctx.shadowBlur = 0;
      }
    });
    ctx.strokeStyle = getCol(0.2); ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(WX + WW * .35, WY + WH); ctx.lineTo(WX + WW * .25, WY + WH + 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(WX + WW * .65, WY + WH); ctx.lineTo(WX + WW * .75, WY + WH + 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(WX + WW * .2, WY + WH + 18); ctx.lineTo(WX + WW * .8, WY + WH + 18); ctx.stroke();

    // ── ANSWER PARTICLES ──
    AP.forEach((a, idx) => {
      a.life++; a.vy += a.grav; a.x += a.vx; a.y += a.vy; a.rot += a.rs;
      const pk = a.ml * .2;
      a.alpha = a.life < pk ? Math.min(a.life / pk * .85, .85) : Math.max(.85 * (1 - (a.life - pk) / (a.ml - pk)), 0);
      if (a.life > a.ml) AP[idx] = newAP();
      ctx.save(); ctx.translate(a.x, a.y); ctx.rotate(a.rot);
      ctx.font = `700 ${a.sz}px sans-serif`;
      ctx.fillStyle = getCol(a.alpha); ctx.shadowColor = getCol(0.5); ctx.shadowBlur = 7;
      ctx.fillText(a.text, -ctx.measureText(a.text).width / 2, 0); ctx.restore();
    });

    // ── PERSON ──
    const ppx = w * .86, ppy = h * .60;
    ctx.save();
    const gr = ctx.createRadialGradient(ppx, ppy, 0, ppx, ppy, 90);
    gr.addColorStop(0, getCol(0.06)); gr.addColorStop(1, getCol(0));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(ppx, ppy, 90, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 3; i++) {
      const ri = ((t * .5 + i * 60) % 180) / 180;
      ctx.strokeStyle = getCol((1 - ri) * 0.08); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(ppx, ppy + h * .22, ri * 110, ri * 110 * .18, 0, 0, Math.PI * 2); ctx.stroke();
    }
    const F = 'rgba(3,5,15,0.97)', S = getCol(0.55);
    ctx.fillStyle = F; ctx.strokeStyle = S; ctx.lineWidth = 1.4;
    // Legs
    ctx.beginPath(); ctx.moveTo(ppx - 9, ppy + 28); ctx.bezierCurveTo(ppx - 13, ppy + 60, ppx - 12, ppy + 92, ppx - 8, ppy + 118); ctx.lineTo(ppx + 2, ppy + 118); ctx.bezierCurveTo(ppx, ppy + 92, ppx - 1, ppy + 60, ppx - 1, ppy + 28); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ppx + 1, ppy + 28); ctx.bezierCurveTo(ppx + 4, ppy + 60, ppx + 5, ppy + 90, ppx + 3, ppy + 118); ctx.lineTo(ppx + 13, ppy + 118); ctx.bezierCurveTo(ppx + 16, ppy + 90, ppx + 14, ppy + 60, ppx + 10, ppy + 28); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Torso
    ctx.beginPath(); ctx.moveTo(ppx - 14, ppy - 42); ctx.bezierCurveTo(ppx - 20, ppy - 5, ppx - 18, ppy + 13, ppx - 8, ppy + 30); ctx.lineTo(ppx + 8, ppy + 30); ctx.bezierCurveTo(ppx + 18, ppy + 13, ppx + 20, ppy - 5, ppx + 14, ppy - 42); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Arm up
    ctx.beginPath(); ctx.moveTo(ppx + 12, ppy - 26); ctx.bezierCurveTo(ppx + 28, ppy - 44, ppx + 48, ppy - 55, ppx + 64, ppy - 60); ctx.lineTo(ppx + 62, ppy - 50); ctx.bezierCurveTo(ppx + 46, ppy - 44, ppx + 26, ppy - 32, ppx + 9, ppy - 15); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Arm down
    ctx.beginPath(); ctx.moveTo(ppx - 12, ppy - 26); ctx.bezierCurveTo(ppx - 24, ppy - 3, ppx - 26, ppy + 10, ppx - 20, ppy + 22); ctx.lineTo(ppx - 11, ppy + 20); ctx.bezierCurveTo(ppx - 15, ppy + 8, ppx - 13, ppy - 3, ppx - 4, ppy - 22); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Head
    ctx.beginPath(); ctx.arc(ppx, ppy - 56, 17, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    // Chalk glow
    ctx.fillStyle = getCol(0.9); ctx.shadowColor = getCol(1); ctx.shadowBlur = 12;
    ctx.beginPath(); ctx.arc(ppx + 65, ppy - 54, 2.5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    // Mini board
    ctx.strokeStyle = getCol(0.35); ctx.fillStyle = 'rgba(3,5,15,0.88)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(ppx + 68, ppy - 78, 62, 48, 3); ctx.fill(); ctx.stroke();
    ['∇f=0', 'λ=?', 'P(B|A)'].forEach((eq, i) => {
      const p = Math.min(((t * 0.007) - i * .4 + 1) % 1, 1);
      ctx.font = '7px monospace'; ctx.fillStyle = getCol(0.65);
      ctx.fillText(eq.slice(0, ~~(p * eq.length)), ppx + 72, ppy - 64 + i * 15);
    });
    ctx.restore();

    // ── PERSON EQUATIONS FLYING ──
    PEQ.forEach((e, idx) => {
      e.life++; e.vy += e.grav; e.x += e.vx; e.y += e.vy;
      const pk = e.ml * .2;
      e.alpha = e.life < pk ? Math.min(e.life / pk * .85, .85) : Math.max(.85 * (1 - (e.life - pk) / (e.ml - pk)), 0);
      if (e.life > e.ml) PEQ[idx] = newPEQ();
      ctx.font = `600 ${e.sz}px sans-serif`;
      ctx.fillStyle = getCol(e.alpha); ctx.shadowColor = getCol(0.4); ctx.shadowBlur = 5;
      ctx.fillText(e.text, e.x, e.y); ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }
  draw();
}

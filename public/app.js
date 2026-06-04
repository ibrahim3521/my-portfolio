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

// ── F1 CIRCUIT ANIMATION ──
const canvas = document.getElementById('f1canvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

// Define an F1-style oval/circuit track path
function getTrackPath(w, h) {
  const cx = w * 0.62, cy = h * 0.55;
  const rx = w * 0.28, ry = h * 0.3;
  // Simplified Monaco-inspired circuit
  const pts = [];
  // Main straight bottom
  pts.push({x: cx - rx, y: cy + ry});
  pts.push({x: cx + rx * 0.3, y: cy + ry});
  // Hairpin right bottom
  pts.push({x: cx + rx, y: cy + ry * 0.5});
  pts.push({x: cx + rx, y: cy - ry * 0.2});
  // Chicane top right
  pts.push({x: cx + rx * 0.6, y: cy - ry});
  pts.push({x: cx + rx * 0.1, y: cy - ry * 0.7});
  pts.push({x: cx - rx * 0.2, y: cy - ry});
  // Top left curve
  pts.push({x: cx - rx, y: cy - ry * 0.5});
  pts.push({x: cx - rx, y: cy + ry * 0.2});
  // Back to start
  pts.push({x: cx - rx, y: cy + ry});
  return pts;
}

function getPointOnPath(pts, t) {
  const total = pts.length;
  const scaled = t * (total - 1);
  const i = Math.floor(scaled);
  const f = scaled - i;
  const a = pts[i % total];
  const b = pts[(i + 1) % total];
  return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
}

function getAngle(pts, t) {
  const delta = 0.005;
  const a = getPointOnPath(pts, (t + delta) % 1);
  const b = getPointOnPath(pts, (t - delta + 1) % 1);
  return Math.atan2(a.y - b.y, a.x - b.x);
}

const cars = [
  { t: 0,    speed: 0.0008, color: '#10b981', trailColor: 'rgba(16,185,129,', width: 18, height: 8 },
  { t: 0.33, speed: 0.0006, color: '#ffffff', trailColor: 'rgba(255,255,255,', width: 16, height: 7 },
  { t: 0.66, speed: 0.0007, color: '#34d399', trailColor: 'rgba(52,211,153,',  width: 15, height: 7 },
];

const trails = cars.map(() => []);

function drawCar(x, y, angle, color, w, h) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  // Car body
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(-w/2, -h/2, w, h, 2);
  ctx.fill();

  // Cockpit
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.beginPath();
  ctx.roundRect(-w*0.05, -h*0.4, w*0.25, h*0.8, 1);
  ctx.fill();

  // Front wing
  ctx.fillStyle = color;
  ctx.fillRect(w/2 - 2, -h*0.7, 4, h*1.4);

  // Rear wing
  ctx.fillRect(-w/2 - 2, -h*0.6, 3, h*1.2);

  // Wheels
  ctx.fillStyle = '#111';
  ctx.fillRect(-w*0.3, -h*0.7, w*0.15, h*0.35);
  ctx.fillRect(-w*0.3, h*0.35, w*0.15, h*0.35);
  ctx.fillRect(w*0.15, -h*0.7, w*0.15, h*0.35);
  ctx.fillRect(w*0.15, h*0.35, w*0.15, h*0.35);

  ctx.restore();
}

function drawTrack(pts) {
  // Outer track border
  ctx.strokeStyle = 'rgba(16,185,129,0.08)';
  ctx.lineWidth = 40;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.stroke();

  // Track surface
  ctx.strokeStyle = 'rgba(20,30,20,0.6)';
  ctx.lineWidth = 36;
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.stroke();

  // Center line dashes
  ctx.strokeStyle = 'rgba(16,185,129,0.15)';
  ctx.lineWidth = 1;
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);

  // Start/finish line
  ctx.strokeStyle = 'rgba(16,185,129,0.6)';
  ctx.lineWidth = 3;
  const s = pts[0];
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(0, 20);
  ctx.stroke();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const pts = getTrackPath(canvas.width, canvas.height);

  drawTrack(pts);

  cars.forEach((car, ci) => {
    car.t = (car.t + car.speed) % 1;
    const pos = getPointOnPath(pts, car.t);
    const angle = getAngle(pts, car.t);

    // Trail
    trails[ci].push({ x: pos.x, y: pos.y, a: 1 });
    if (trails[ci].length > 40) trails[ci].shift();

    // Draw trail
    for (let i = 0; i < trails[ci].length - 1; i++) {
      const alpha = (i / trails[ci].length) * 0.5;
      ctx.strokeStyle = car.trailColor + alpha + ')';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(trails[ci][i].x, trails[ci][i].y);
      ctx.lineTo(trails[ci][i+1].x, trails[ci][i+1].y);
      ctx.stroke();
    }

    drawCar(pos.x, pos.y, angle, car.color, car.width, car.height);
  });

  requestAnimationFrame(animate);
}

animate();

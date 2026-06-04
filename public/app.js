// ── CURSOR
const cursor = document.createElement('div');
cursor.className = 'cursor';
const ring = document.createElement('div');
ring.className = 'cursor-ring';
document.body.appendChild(cursor);
document.body.appendChild(ring);
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
  setTimeout(() => { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px'; }, 80);
});
document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => ring.style.transform = 'translate(-50%,-50%) scale(1.8)');
  el.addEventListener('mouseleave', () => ring.style.transform = 'translate(-50%,-50%) scale(1)');
});

// ── TYPING ANIMATION
const roles = ['a Software Engineer', 'a CS & Math Student', 'a Research Assistant', 'a Problem Solver', 'a Cricket Captain 🏏'];
let ri = 0, ci = 0, deleting = false;
const typed = document.getElementById('typedRole');
function typeLoop() {
  const word = roles[ri];
  if (!deleting) {
    typed.textContent = word.slice(0, ci + 1); ci++;
    if (ci === word.length) { deleting = true; setTimeout(typeLoop, 1800); return; }
    setTimeout(typeLoop, 80);
  } else {
    typed.textContent = word.slice(0, ci - 1); ci--;
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; setTimeout(typeLoop, 400); return; }
    setTimeout(typeLoop, 45);
  }
}
typeLoop();

// ── MODAL
const modal = document.getElementById('resumeModal');
document.getElementById('openResume').addEventListener('click', () => modal.classList.add('open'));
document.getElementById('openResume2').addEventListener('click', () => modal.classList.add('open'));
document.getElementById('closeModal').addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { modal.classList.remove('open'); chatPanel.classList.remove('open'); } });

// ── NAV
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 40));

// ── HAMBURGER
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

// ── REVEAL
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => { if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 100); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── ACTIVE NAV + CURSOR COLOR
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionColors = { hero:'#ffd700', about:'#b5b5b5', education:'#e05020', experience:'#e8d080', projects:'#d09040', contact:'#4a90d9' };
window.addEventListener('scroll', () => {
  let cur = 'hero';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 150) cur = s.id; });
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${cur}`));
  const col = sectionColors[cur] || '#ffd700';
  cursor.style.background = col;
  ring.style.borderColor = col + '80';
});

// ── PROJECT FILTERS
document.querySelectorAll('.proj-filter').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.proj-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      if (filter === 'all' || card.dataset.cat === filter) card.classList.remove('hidden');
      else card.classList.add('hidden');
    });
  });
});

// ── COPY EMAIL
document.getElementById('copyEmail').addEventListener('click', () => {
  navigator.clipboard.writeText('ibrahim3@union.edu').then(() => {
    const btn = document.getElementById('copyEmail');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
});

// ── SOLAR SYSTEM
const cv = document.getElementById('solarCanvas');
if (cv) {
  const ctx = cv.getContext('2d');
  function resize() { cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }
  resize(); window.addEventListener('resize', resize);
  const planets = [
    { r:3,  o:52,  spd:0.028, a:0,   c:[180,180,180] },
    { r:6,  o:85,  spd:0.018, a:1.2, c:[232,200,122] },
    { r:7,  o:122, spd:0.012, a:2.4, c:[74,144,217], moon:true },
    { r:5,  o:162, spd:0.009, a:0.8, c:[193,68,14] },
    { r:15, o:215, spd:0.005, a:3.5, c:[200,139,58] },
    { r:12, o:270, spd:0.003, a:5.0, c:[228,209,145], rings:true },
  ];
  let stars = null;
  function drawSolar() {
    const W = cv.width, H = cv.height, SX = W * 0.72, SY = H * 0.48;
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#03040a'; ctx.fillRect(0, 0, W, H);
    if (!stars) stars = Array.from({length:120}, () => ({ x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.2, a:Math.random() }));
    stars.forEach(s => { ctx.fillStyle = `rgba(255,255,255,${s.a*0.45})`; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); });
    const sg = ctx.createRadialGradient(SX,SY,0,SX,SY,90);
    sg.addColorStop(0,'rgba(255,220,80,0.18)'); sg.addColorStop(1,'rgba(255,140,0,0)');
    ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(SX,SY,90,0,Math.PI*2); ctx.fill();
    const sun = ctx.createRadialGradient(SX-4,SY-4,1,SX,SY,24);
    sun.addColorStop(0,'#fffae0'); sun.addColorStop(0.5,'#ffd700'); sun.addColorStop(1,'#ff8c00');
    ctx.fillStyle = sun; ctx.shadowColor = 'rgba(255,180,0,0.7)'; ctx.shadowBlur = 22;
    ctx.beginPath(); ctx.arc(SX,SY,24,0,Math.PI*2); ctx.fill(); ctx.shadowBlur = 0;
    planets.forEach(p => {
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.5; ctx.setLineDash([3,8]);
      ctx.beginPath(); ctx.arc(SX,SY,p.o,0,Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
    });
    planets.forEach(p => {
      p.a += p.spd;
      const px = SX+Math.cos(p.a)*p.o, py = SY+Math.sin(p.a)*p.o;
      const [r,g,b] = p.c;
      ctx.shadowColor = `rgba(${r},${g},${b},0.5)`; ctx.shadowBlur = 10;
      if (p.rings) {
        ctx.save(); ctx.translate(px,py); ctx.rotate(0.4);
        ctx.strokeStyle = `rgba(${r},${g},${b},0.35)`; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.ellipse(0,0,p.r+10,4,0,0,Math.PI*2); ctx.stroke(); ctx.restore();
      }
      const pg = ctx.createRadialGradient(px-p.r*.3,py-p.r*.3,0,px,py,p.r);
      pg.addColorStop(0,'rgba(255,255,255,0.3)'); pg.addColorStop(0.5,`rgb(${r},${g},${b})`); pg.addColorStop(1,`rgba(${r},${g},${b},0.5)`);
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px,py,p.r,0,Math.PI*2); ctx.fill(); ctx.shadowBlur = 0;
      if (p.moon) {
        const mx = px+Math.cos(p.a*8)*14, my = py+Math.sin(p.a*8)*9;
        ctx.fillStyle = 'rgba(200,210,220,0.8)'; ctx.beginPath(); ctx.arc(mx,my,2,0,Math.PI*2); ctx.fill();
      }
    });
    requestAnimationFrame(drawSolar);
  }
  drawSolar();
}

// ── ASK IBRAHIM CHATBOT
const chatBubble = document.getElementById('chatBubble');
const chatPanel = document.getElementById('chatPanel');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

chatBubble.addEventListener('click', () => chatPanel.classList.toggle('open'));
chatClose.addEventListener('click', () => chatPanel.classList.remove('open'));

document.querySelectorAll('.chat-suggest').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.q));
});

chatSend.addEventListener('click', () => {
  const msg = chatInput.value.trim();
  if (msg) { chatInput.value = ''; sendMessage(msg); }
});
chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') { const msg = chatInput.value.trim(); if (msg) { chatInput.value = ''; sendMessage(msg); } }
});

const IBRAHIM_CONTEXT = `You are an AI assistant for Muhammad Ibrahim's portfolio website. Answer questions about Muhammad Ibrahim based on this information:

PERSONAL: Muhammad Ibrahim is a Computer Science & Mathematics (Double Major) student at Union College, Schenectady NY. Graduating 2028. Captain of Union College Cricket Club (Aug 2025-Present).

EXPERIENCE:
1. Research Assistant at Templeton Institute (Sep 2024 - Present): Conducting funded research transcribing Persian and Arabic mathematical manuscripts into base-60 computation. Implemented 6+ arithmetic operations (addition, subtraction, multiplication, division, modulo, exponentiation) in a Python iterator engine. Engineered a Python-based sexagesimal expression parser.
2. IT Intern at iTech Solutions, Pakistan (Aug 2023 - Present): Assisted 3-4 member IT team with system checks, troubleshooting, and technical support for 10+ office staff. Managed ~200 data records.

PROJECTS:
1. Stock Price Predictor (Python, scikit-learn, Pandas, yfinance): ML pipeline forecasting stock closing prices using Linear Regression and Random Forest across 5+ years of data. 87% directional accuracy, 23% RMSE reduction.
2. PathFinder (TypeScript, React, Flask, OpenAI API): Full-stack course planning web app with GPT-powered recommendations across 100+ Union College courses. 40% fewer runtime errors, 50+ beta users.
3. CampusQuery (SQL, Python, SQLite): Normalized relational database with 3+ tables, automated query pipelines across 200+ records.
4. Poker Game Simulation (Java, JUnit): Full poker engine with community cards, player actions, JUnit tested.

SKILLS: Python, Java, SQL, TypeScript, JavaScript, HTML/CSS, React, Flask, scikit-learn, Pandas, Git, SQLite, LaTeX.

CONTACT: ibrahim3@union.edu | LinkedIn: linkedin.com/in/muhammad-ibrahim4 | GitHub: github.com/ibrahim3521

Answer concisely and helpfully. If asked about interview topics, highlight his research work, ML projects, and TypeScript/Python skills. Keep responses under 3 sentences unless more detail is needed.`;

async function sendMessage(userMsg) {
  addMsg(userMsg, 'user');
  const loading = addMsg('Thinking...', 'bot loading');
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: IBRAHIM_CONTEXT,
        messages: [{ role: 'user', content: userMsg }]
      })
    });
    const data = await res.json();
    loading.remove();
    const reply = data.content?.[0]?.text || 'Sorry, I could not get a response.';
    addMsg(reply, 'bot');
  } catch (e) {
    loading.remove();
    addMsg('Sorry, something went wrong. Please try again!', 'bot');
  }
}

function addMsg(text, type) {
  const div = document.createElement('div');
  div.className = 'chat-msg ' + type;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}

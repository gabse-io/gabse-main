import { experiences, ownProjects, typingTexts } from './data.js';
import { trackEvent } from './analytics.js';

/* ===== Particle Canvas ===== */
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrameId = null;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

const isMobile = window.innerWidth <= 480;
const PARTICLE_COUNT = isMobile ? 30 : 80;

function createParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.3 + 0.2,
      alpha: Math.random() * 0.5 + 0.2,
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0A0F1A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const p of particles) {
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(45, 156, 124, ${p.alpha})`;
    ctx.fill();

    for (const p2 of particles) {
      const dx = p.x - p2.x;
      const dy = p.y - p2.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(45, 156, 124, ${0.1 * (1 - dist / 100)})`;
        ctx.stroke();
      }
    }
  }

  animFrameId = requestAnimationFrame(animateParticles);
}

let particlesRunning = true;

document.addEventListener('visibilitychange', () => {
  if (document.hidden && particlesRunning) {
    cancelAnimationFrame(animFrameId);
    particlesRunning = false;
  } else if (!document.hidden && !particlesRunning) {
    animateParticles();
    particlesRunning = true;
  }
});

window.addEventListener('resize', () => {
  resizeCanvas();
  createParticles();
});

if (!isMobile) {
  resizeCanvas();
  createParticles();
  animateParticles();
}

/* ===== Typing Effect ===== */
const typedTextSpan = document.getElementById('typedText');
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentText = typingTexts[textIndex];
  if (isDeleting) {
    typedTextSpan.textContent = currentText.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedTextSpan.textContent = currentText.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(typeEffect, 2000);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % typingTexts.length;
    setTimeout(typeEffect, 500);
  } else {
    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }
}

typeEffect();

/* ===== Timeline ===== */
function renderTimeline() {
  const container = document.getElementById('timelineContainer');
  container.innerHTML = '';

  for (const exp of experiences) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'timeline-item';
    itemDiv.setAttribute('role', 'listitem');

    const blockDiv = document.createElement('div');
    blockDiv.className = 'exp-block';
    blockDiv.setAttribute('data-id', exp.id);

    blockDiv.innerHTML = `
      <div class="exp-header-block">
        <div class="exp-company">
          <i class="fas fa-building" aria-hidden="true"></i> ${exp.company}
          ${exp.companyUrl !== '#' ? `<a href="${exp.companyUrl}" target="_blank" rel="noopener noreferrer" aria-label="Visitar sitio de ${exp.company}"><i class="fas fa-external-link-alt" aria-hidden="true"></i> Visitar sitio</a>` : ''}
        </div>
        <div class="exp-period">${exp.period}</div>
      </div>
      <div class="exp-body-split">
        <div class="exp-summary">
          <div class="exp-title">${exp.title}</div>
          <div class="exp-preview">${exp.preview}</div>
          <div class="exp-tech" role="list" aria-label="Tecnologías utilizadas">${exp.tech.map(t => `<span role="listitem">⚡ ${t}</span>`).join('')}</div>
          <button class="btn-toggle-detail" data-id="${exp.id}" aria-expanded="false" aria-controls="detail-${exp.id}"><i class="fas fa-chevron-down" aria-hidden="true"></i> Ver más</button>
        </div>
        <div class="exp-detail" id="detail-${exp.id}" role="region" aria-label="Detalles de ${exp.title} en ${exp.company}">
          <div class="exp-detail-text">${exp.detail}</div>
          <div class="exp-highlight"><i class="fas fa-trophy" aria-hidden="true"></i> Logro destacado: ${exp.highlight}</div>
        </div>
      </div>
    `;

    itemDiv.appendChild(blockDiv);

    const nodeDiv = document.createElement('div');
    nodeDiv.className = 'timeline-node';
    nodeDiv.setAttribute('aria-hidden', 'true');
    itemDiv.appendChild(nodeDiv);

    container.appendChild(itemDiv);
  }
}

/* ===== Event delegation for toggle buttons ===== */
document.getElementById('timelineContainer').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-toggle-detail');
  if (!btn) return;

  const id = btn.getAttribute('data-id');
  const detailDiv = document.getElementById(`detail-${id}`);
  if (!detailDiv) return;

  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  const newExpanded = !isExpanded;

  btn.setAttribute('aria-expanded', String(newExpanded));
  if (newExpanded) {
    detailDiv.classList.add('expanded');
    btn.innerHTML = '<i class="fas fa-chevron-up" aria-hidden="true"></i> Ver menos';
  } else {
    detailDiv.classList.remove('expanded');
    btn.innerHTML = '<i class="fas fa-chevron-down" aria-hidden="true"></i> Ver más';
  }

  const exp = experiences.find(e => e.id === Number(id));
  trackEvent('toggle_detail', 'engagement', exp ? exp.company : '', newExpanded ? 1 : 0);
});

/* ===== Projects Carousel ===== */
function renderProjectsCarousel() {
  const track = document.getElementById('projectsCarousel');
  track.innerHTML = '';

  for (const proj of ownProjects) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <div class="project-image" aria-hidden="true"><i class="${proj.icon}"></i></div>
      <div class="project-info">
        <div class="project-title">${proj.title}</div>
        <div class="project-desc">${proj.description}</div>
        <div class="project-tech" role="list" aria-label="Tecnologías">${proj.tech.map(t => `<span role="listitem">${t}</span>`).join('')}</div>
      </div>
    `;
    track.appendChild(card);
  }
}

/* ===== Carousel navigation ===== */
const carouselTrack = document.getElementById('projectsCarousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function scrollCarousel(direction) {
  const card = document.querySelector('.project-card');
  if (!card) return;
  const cardWidth = card.offsetWidth;
  const gap = 24;
  const scrollAmount = cardWidth + gap;
  carouselTrack.scrollBy({
    left: direction === 'next' ? scrollAmount : -scrollAmount,
    behavior: 'smooth',
  });
  trackEvent('carousel_nav', 'engagement', direction);
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => scrollCarousel('prev'));
  nextBtn.addEventListener('click', () => scrollCarousel('next'));
}

carouselTrack.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    scrollCarousel('prev');
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    scrollCarousel('next');
  }
});

/* ===== Scroll Reveal ===== */
let scrollObserver = null;

function initBidirectionalScrollReveal() {
  if (scrollObserver) {
    scrollObserver.disconnect();
  }

  const elementsToObserve = [
    ...document.querySelectorAll('.exp-block'),
    ...document.querySelectorAll('.project-card'),
    ...document.querySelectorAll('.section-title'),
    ...document.querySelectorAll('.timeline-node'),
    document.getElementById('footer'),
  ].filter(el => el !== null);

  scrollObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const target = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio >= 0.15) {
        target.classList.remove('hidden-up');
        target.classList.add('revealed');
      } else if (!entry.isIntersecting || entry.intersectionRatio < 0.1) {
        target.classList.remove('revealed');
        target.classList.add('hidden-up');
      }
    }
  }, { threshold: [0, 0.1, 0.15, 0.5, 0.8, 1], rootMargin: '0px 0px -50px 0px' });

  for (const el of elementsToObserve) {
    scrollObserver.observe(el);
  }

  const rootMargin = 50;
  for (const el of elementsToObserve) {
    const rect = el.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight - rootMargin && rect.bottom > rootMargin;
    if (isVisible) {
      el.classList.remove('hidden-up');
      el.classList.add('revealed');
    }
  }
}

/* ===== Outbound link tracking ===== */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href]');
  if (!link) return;

  const href = link.getAttribute('href');

  if (href.includes('linkedin.com')) {
    trackEvent('outbound_link', 'social', 'linkedin_profile');
  } else if (href.startsWith('mailto:')) {
    trackEvent('outbound_link', 'contact', 'email');
  } else if (href.startsWith('https://wa.me')) {
    trackEvent('outbound_link', 'contact', 'whatsapp');
  } else if (href.startsWith('http') && !href.includes(window.location.hostname)) {
    trackEvent('outbound_link', 'external', href);
  }
});

/* ===== Scroll depth tracking ===== */
const SCROLL_MARKS = [25, 50, 75, 100];
let scrollFired = {};

function checkScrollDepth() {
  const scrollPct = Math.round(
    (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100
  );

  for (const mark of SCROLL_MARKS) {
    if (scrollPct >= mark && !scrollFired[mark]) {
      scrollFired[mark] = true;
      trackEvent('scroll_depth', 'engagement', `${mark}%`, mark);
    }
  }
}

let scrollTick = null;
window.addEventListener('scroll', () => {
  if (scrollTick) return;
  scrollTick = requestAnimationFrame(() => {
    checkScrollDepth();
    scrollTick = null;
  });
});

/* ===== Section view tracking ===== */
const SECTION_LABELS = {
  'hero-elegant': 'hero',
  'timeline': 'timeline',
  'showcase-section': 'projects',
  'footer': 'footer',
};

function trackVisibleSections(entries) {
  for (const entry of entries) {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
      const cls = entry.target.className;
      const label = SECTION_LABELS[cls] || cls;
      trackEvent('section_view', 'engagement', label);
    }
  }
}

const sectionObserver = new IntersectionObserver(trackVisibleSections, {
  threshold: [0.3],
});

for (const cls of Object.keys(SECTION_LABELS)) {
  const el = document.querySelector(`.${cls}`) || document.getElementById(cls);
  if (el) sectionObserver.observe(el);
}

/* ===== SVG mockup generators ===== */
function mockupFormSVG() {
  return `<svg viewBox="0 0 240 420" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;border-radius:8px;">
    <rect width="240" height="420" rx="16" fill="#0c0c0c"/>
    <rect x="0" y="0" width="240" height="420" rx="16" stroke="#222" stroke-width="1"/>
    <rect x="80" y="8" width="80" height="6" rx="3" fill="#333"/>
    <text x="120" y="38" text-anchor="middle" fill="#888" font-size="7" font-family="monospace">BARBERS</text>
    <text x="120" y="48" text-anchor="middle" fill="#555" font-size="5" font-family="monospace">TURNOS</text>
    <rect x="16" y="62" width="208" height="30" rx="6" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="0.5"/>
    <text x="24" y="74" fill="#555" font-size="5" font-family="sans-serif">NOMBRE Y APELLIDO</text>
    <text x="24" y="84" fill="#999" font-size="6" font-family="sans-serif">Juan P�rez</text>
    <rect x="16" y="98" width="208" height="30" rx="6" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="0.5"/>
    <text x="24" y="110" fill="#555" font-size="5" font-family="sans-serif">CORREO ELECTR�NICO</text>
    <text x="24" y="120" fill="#999" font-size="6" font-family="sans-serif">juan@gmail.com</text>
    <rect x="16" y="134" width="208" height="30" rx="6" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="0.5"/>
    <text x="24" y="146" fill="#555" font-size="5" font-family="sans-serif">WHATSAPP</text>
    <text x="24" y="156" fill="#999" font-size="6" font-family="sans-serif">362 4123456</text>
    <rect x="16" y="170" width="208" height="30" rx="6" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="0.5"/>
    <text x="24" y="182" fill="#555" font-size="5" font-family="sans-serif">BARBERO</text>
    <text x="24" y="192" fill="#999" font-size="6" font-family="sans-serif">Elias</text>
    <rect x="16" y="206" width="208" height="30" rx="6" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="0.5"/>
    <text x="24" y="218" fill="#555" font-size="5" font-family="sans-serif">SERVICIOS</text>
    <text x="24" y="228" fill="#28a745" font-size="5" font-family="sans-serif">2 servicios seleccionados</text>
    <rect x="16" y="242" width="208" height="30" rx="6" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="0.5"/>
    <text x="24" y="254" fill="#555" font-size="5" font-family="sans-serif">FECHA</text>
    <text x="24" y="264" fill="#999" font-size="6" font-family="sans-serif">15/07/2026</text>
    <rect x="16" y="278" width="208" height="30" rx="6" fill="#1a1a1a" stroke="#2a2a2a" stroke-width="0.5"/>
    <text x="24" y="290" fill="#555" font-size="5" font-family="sans-serif">HORARIO</text>
    <text x="24" y="300" fill="#999" font-size="6" font-family="sans-serif">10:00 hs</text>
    <rect x="16" y="320" width="208" height="36" rx="10" fill="#fff"/>
    <text x="120" y="343" text-anchor="middle" fill="#000" font-size="8" font-weight="bold" font-family="sans-serif">SOLICITAR TURNO</text>
    <text x="120" y="400" text-anchor="middle" fill="#333" font-size="5" font-family="sans-serif">POWERED BY GABSE</text>
  </svg>`;
}

function mockupCalSVG() {
  return `<svg viewBox="0 0 240 320" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;border-radius:8px;">
    <rect width="240" height="320" rx="16" fill="#111"/>
    <rect x="0" y="0" width="240" height="320" rx="16" stroke="#222" stroke-width="1"/>
    <rect x="70" y="8" width="100" height="6" rx="3" fill="#333"/>
    <text x="120" y="38" text-anchor="middle" fill="#fff" font-size="8" font-weight="bold" font-family="sans-serif">Julio 2026</text>
    <rect x="100" y="26" width="20" height="20" rx="10" fill="none" stroke="#444" stroke-width="1"/>
    <text x="110" y="38" text-anchor="middle" fill="#888" font-size="7" font-family="sans-serif">-</text>
    <rect x="120" y="26" width="20" height="20" rx="10" fill="none" stroke="#444" stroke-width="1"/>
    <text x="130" y="38" text-anchor="middle" fill="#888" font-size="7" font-family="sans-serif">+</text>
    <text x="12" y="58" fill="#666" font-size="6" font-family="sans-serif">D</text>
    <text x="46" y="58" fill="#666" font-size="6" font-family="sans-serif">L</text>
    <text x="80" y="58" fill="#666" font-size="6" font-family="sans-serif">M</text>
    <text x="114" y="58" fill="#666" font-size="6" font-family="sans-serif">M</text>
    <text x="148" y="58" fill="#666" font-size="6" font-family="sans-serif">J</text>
    <text x="182" y="58" fill="#666" font-size="6" font-family="sans-serif">V</text>
    <text x="216" y="58" fill="#666" font-size="6" font-family="sans-serif">S</text>
    ${[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34].map((d,i) => {
      const x = 12 + (i%7)*34;
      const y = 70 + Math.floor(i/7)*32;
      if (i < 3) return `<text x="${x+8}" y="${y+12}" fill="#333" font-size="6" font-family="sans-serif">${29+i}</text>`;
      const day = i-2;
      const fill = day === 15 ? '#28a745' : day === 16 ? '#3d1a1a' : day < 13 ? '#333' : '#ccc';
      const textFill = day === 15 ? '#fff' : fill;
      const bg = day === 15 ? 'fill="#28a745"' : '';
      if (fill === '#3d1a1a') return `<rect x="${x-1}" y="${y-2}" width="20" height="20" rx="10" fill="#3d1a1a" opacity="0.5"/><text x="${x+8}" y="${y+12}" text-anchor="middle" fill="#ff8888" font-size="6" font-family="sans-serif">${day}</text>`;
      if (day < 13) return '';
      return `${bg ? `<rect x="${x-1}" y="${y-2}" width="20" height="20" rx="10" ${bg}/>` : ''}<text x="${x+8}" y="${y+12}" text-anchor="middle" fill="${day === 15 ? '#fff' : '#ccc'}" font-size="6" font-family="sans-serif">${day}</text>`;
    }).join('')}
    <text x="120" y="280" text-anchor="middle" fill="#555" font-size="5" font-family="sans-serif">CERRAR</text>
    <text x="120" y="306" text-anchor="middle" fill="#333" font-size="5" font-family="sans-serif">POWERED BY GABSE</text>
  </svg>`;
}

function mockupSuccessSVG() {
  return `<svg viewBox="0 0 240 380" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;border-radius:8px;">
    <rect width="240" height="380" rx="16" fill="#0c0c0c"/>
    <rect x="0" y="0" width="240" height="380" rx="16" stroke="#222" stroke-width="1"/>
    <text x="120" y="30" text-anchor="middle" fill="#888" font-size="7" font-family="monospace">BARBERS</text>
    <text x="120" y="40" text-anchor="middle" fill="#555" font-size="5" font-family="monospace">TURNOS</text>
    <circle cx="120" cy="80" r="18" fill="#1a4a1a" opacity="0.3"/>
    <circle cx="120" cy="80" r="12" fill="none" stroke="#28a745" stroke-width="2"/>
    <text x="120" y="84" text-anchor="middle" fill="#28a745" font-size="12" font-family="sans-serif">✓</text>
    <text x="120" y="112" text-anchor="middle" fill="#fff" font-size="10" font-weight="bold" font-family="sans-serif">Pre-Reserva Recibida</text>
    <text x="120" y="128" text-anchor="middle" fill="#888" font-size="6" font-family="sans-serif">Tu lugar est� apartado para:</text>
    <text x="120" y="146" text-anchor="middle" fill="#fff" font-size="11" font-weight="bold" font-family="sans-serif">15/07/2026 - 10:00 hs</text>
    <text x="120" y="162" text-anchor="middle" fill="#666" font-size="5" font-family="sans-serif">Barbero: Elias | Corte + Barba</text>
    <rect x="16" y="178" width="208" height="130" rx="10" fill="#141414" stroke="#2a2a2a" stroke-width="0.5"/>
    <text x="120" y="196" text-anchor="middle" fill="#aaa" font-size="5" font-weight="bold" font-family="sans-serif">PASOS PARA CONFIRMAR</text>
    <text x="24" y="216" fill="#eee" font-size="6" font-family="sans-serif">1. Transfer� la se�a:</text>
    <text x="120" y="232" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold" font-family="sans-serif">$6.000</text>
    <text x="24" y="252" fill="#aaa" font-size="5" font-family="sans-serif">Alias MP:</text>
    <rect x="16" y="258" width="208" height="30" rx="6" fill="#fff"/>
    <text x="120" y="278" text-anchor="middle" fill="#000" font-size="7" font-weight="bold" font-family="monospace">BARBERS.TURNOS.MP</text>
    <text x="120" y="300" text-anchor="middle" fill="#ff8b8b" font-size="5" font-style="italic" font-family="sans-serif">Nombre y horario en el motivo</text>
    <text x="120" y="355" text-anchor="middle" fill="#333" font-size="5" font-family="sans-serif">POWERED BY GABSE</text>
  </svg>`;
}

function mockupAdminSVG() {
  return `<svg viewBox="0 0 320 220" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;border-radius:8px;">
    <rect width="320" height="220" rx="12" fill="#0d0d0d"/>
    <rect x="0" y="0" width="320" height="220" rx="12" stroke="#222" stroke-width="1"/>
    <rect x="0" y="0" width="320" height="32" rx="12" fill="#151515"/>
    <text x="12" y="20" fill="#fff" font-size="8" font-weight="bold" font-family="sans-serif">PANEL ADMIN - GUAPOS</text>
    <rect x="240" y="8" width="30" height="16" rx="4" fill="#28a745"/>
    <text x="255" y="19" text-anchor="middle" fill="#fff" font-size="5" font-family="sans-serif">Admin</text>
    <rect x="274" y="8" width="30" height="16" rx="4" fill="#dc3545"/>
    <text x="289" y="19" text-anchor="middle" fill="#fff" font-size="5" font-family="sans-serif">Salir</text>
    <rect x="8" y="40" width="96" height="36" rx="6" fill="#151515" stroke="#2a2a2a" stroke-width="0.5"/>
    <text x="56" y="56" text-anchor="middle" fill="#28a745" font-size="12" font-weight="bold" font-family="sans-serif">12</text>
    <text x="56" y="68" text-anchor="middle" fill="#666" font-size="5" font-family="sans-serif">Total Turnos</text>
    <rect x="112" y="40" width="96" height="36" rx="6" fill="#151515" stroke="#2a2a2a" stroke-width="0.5"/>
    <text x="160" y="56" text-anchor="middle" fill="#ffc107" font-size="12" font-weight="bold" font-family="sans-serif">5</text>
    <text x="160" y="68" text-anchor="middle" fill="#666" font-size="5" font-family="sans-serif">Pendientes</text>
    <rect x="216" y="40" width="96" height="36" rx="6" fill="#151515" stroke="#2a2a2a" stroke-width="0.5"/>
    <text x="264" y="56" text-anchor="middle" fill="#28a745" font-size="12" font-weight="bold" font-family="sans-serif">7</text>
    <text x="264" y="68" text-anchor="middle" fill="#666" font-size="5" font-family="sans-serif">Confirmados</text>
    <rect x="8" y="84" width="304" height="128" rx="6" fill="#151515" stroke="#2a2a2a" stroke-width="0.5"/>
    <rect x="8" y="84" width="304" height="18" rx="6" fill="#1a1a1a"/>
    <text x="20" y="96" fill="#888" font-size="5" font-weight="bold" font-family="sans-serif">FECHA</text>
    <text x="68" y="96" fill="#888" font-size="5" font-weight="bold" font-family="sans-serif">CLIENTE</text>
    <text x="140" y="96" fill="#888" font-size="5" font-weight="bold" font-family="sans-serif">BARBERO</text>
    <text x="200" y="96" fill="#888" font-size="5" font-weight="bold" font-family="sans-serif">ESTADO</text>
    <text x="270" y="96" fill="#888" font-size="5" font-weight="bold" font-family="sans-serif">ACCI�N</text>
    ${[
      {f:'15/07 10:00', c:'Juan P�rez', b:'Elias', s:'Pagado'},
      {f:'15/07 11:00', c:'Pedro G.', b:'Lucas', s:'Pendiente'},
      {f:'16/07 09:00', c:'Mart�n L.', b:'Elias', s:'Pendiente'}
    ].map((r, i) => {
      const y = 108 + i*22;
      const statusColor = r.s === 'Pagado' ? '#28a745' : '#ffc107';
      return `
        <text x="20" y="${y+8}" fill="#ccc" font-size="5" font-family="sans-serif">${r.f}</text>
        <text x="68" y="${y+8}" fill="#eee" font-size="5" font-weight="bold" font-family="sans-serif">${r.c}</text>
        <text x="140" y="${y+8}" fill="#ccc" font-size="5" font-family="sans-serif">${r.b}</text>
        <rect x="196" y="${y-3}" width="42" height="12" rx="6" fill="${statusColor}" opacity="0.2"/>
        <text x="217" y="${y+6}" text-anchor="middle" fill="${statusColor}" font-size="4" font-family="sans-serif">${r.s === 'Pagado' ? '✓ Confirmado' : '⏳ Pendiente'}</text>
        <rect x="252" y="${y-3}" width="22" height="12" rx="4" fill="#28a745"/>
        <text x="263" y="${y+6}" text-anchor="middle" fill="#fff" font-size="4" font-family="sans-serif">Conf.</text>
        <rect x="276" y="${y-3}" width="22" height="12" rx="4" fill="#dc3545"/>
        <text x="287" y="${y+6}" text-anchor="middle" fill="#fff" font-size="4" font-family="sans-serif">Can.</text>
        ${i < 2 ? `<line x1="8" y1="${y+14}" x2="312" y2="${y+14}" stroke="#222" stroke-width="0.5"/>` : ''}`;
    }).join('')}
    <text x="160" y="200" text-anchor="middle" fill="#333" font-size="5" font-family="sans-serif">POWERED BY GABSE</text>
  </svg>`;
}

/* ===== Project Detail Modal ===== */
function openProjectDetail(projId) {
  const proj = ownProjects.find(p => p.id === projId);
  if (!proj || !proj.detailDescription) return;

  const existing = document.getElementById('projectModal');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'projectModal';
  overlay.className = 'project-modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');

  const mockupMap = { form: mockupFormSVG, calendar: mockupCalSVG, success: mockupSuccessSVG, admin: mockupAdminSVG };

  const mockupsHTML = (proj.mockups || []).map(m => {
    const svgFn = mockupMap[m.id];
    const svg = svgFn ? svgFn() : '';
    return `<div class="modal-mockup-card">
      <div class="modal-mockup-frame">${svg}</div>
      <span class="modal-mockup-label">${m.label}</span>
    </div>`;
  }).join('');

  overlay.innerHTML = `
    <div class="project-modal-content">
      <div class="modal-header">
        <h3><i class="${proj.icon}" aria-hidden="true"></i> ${proj.title}</h3>
        <button class="modal-close-btn" aria-label="Cerrar">&times;</button>
      </div>
      <div class="modal-body">
        <div class="modal-description">
          <p>${proj.detailDescription}</p>
        </div>
        <div class="modal-tech"><span>Tecnolog�as:</span> ${proj.tech.map(t => `<span class="modal-tech-tag">${t}</span>`).join('')}</div>
        <div class="modal-mockups">
          ${mockupsHTML}
        </div>
        <div class="modal-advantages">
          <h4><i class="fas fa-star" aria-hidden="true"></i> Ventajas</h4>
          <ul>${(proj.advantages || []).map(a => `<li>${a}</li>`).join('')}</ul>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelector('.modal-close-btn').addEventListener('click', () => overlay.remove());
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { const m = document.getElementById('projectModal'); if (m) m.remove(); } }, { once: true });

  trackEvent('project_detail', 'engagement', proj.title);
}

/* ===== Make project cards clickable ===== */
document.getElementById('projectsCarousel').addEventListener('click', (e) => {
  const card = e.target.closest('.project-card');
  if (!card) return;
  const idx = Array.from(card.parentNode.children).indexOf(card);
  const proj = ownProjects[idx];
  if (proj && proj.detailDescription) {
    openProjectDetail(proj.id);
  }
});

/* ===== Debounced resize ===== */
let resizeTimeout = null;

window.addEventListener('resize', () => {
  if (resizeTimeout) clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    renderTimeline();
    initBidirectionalScrollReveal();
    resizeTimeout = null;
  }, 250);
});

/* ===== Init ===== */
renderTimeline();
renderProjectsCarousel();

const elementsToReveal = [
  ...document.querySelectorAll('.exp-block'),
  ...document.querySelectorAll('.project-card'),
  ...document.querySelectorAll('.section-title'),
  ...document.querySelectorAll('.timeline-node'),
  document.getElementById('footer'),
].filter(el => el !== null);

for (const el of elementsToReveal) {
  const rect = el.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    el.classList.add('revealed');
  }
}

requestAnimationFrame(() => {
  initBidirectionalScrollReveal();
});

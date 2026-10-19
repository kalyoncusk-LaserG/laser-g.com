// Dil seçimi (TR/EN)
const btn = document.getElementById('lang');
function setLang(l) {
  document.documentElement.lang = l;
  document.querySelectorAll('[data-' + l + ']').forEach(el => { el.innerHTML = el.dataset[l]; });
  document.querySelectorAll('[data-alt-' + l + ']').forEach(el => { el.alt = el.getAttribute('data-alt-' + l); });
  btn.textContent = l === 'tr' ? 'EN' : 'TR';
  try { localStorage.setItem('lang', l); } catch (e) {}
}
btn.addEventListener('click', () => setLang(document.documentElement.lang === 'tr' ? 'en' : 'tr'));
let saved = null;
try { saved = localStorage.getItem('lang'); } catch (e) {}
if (saved === 'en' || (!saved && !navigator.language.startsWith('tr'))) setLang('en');

// Kaydırınca menü arka planı
const nav = document.querySelector('.nav');
const onScroll = () => nav.classList.toggle('solid', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Bölüm girişi animasyonu
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.sec h2, .card, .steps li, .values div, .info li, .photo, .apps-list li, .adv div, .vm > div, .founder').forEach(el => { el.classList.add('rv'); io.observe(el); });

document.getElementById('yil').textContent = new Date().getFullYear();

// Hero: hareketli lazer ışınları
const cv = document.getElementById('beam'), cx = cv.getContext('2d');
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
let W, H, beams = [];
function size() {
  const r = devicePixelRatio || 1;
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = W * r; cv.height = H * r; cx.setTransform(r, 0, 0, r, 0, 0);
  beams = Array.from({ length: 7 }, (_, i) => ({ y: H * (0.25 + i * 0.09), a: -0.18 + i * 0.06, p: Math.random() * 1000, s: 0.4 + Math.random() * 0.6 }));
}
function draw(t) {
  cx.clearRect(0, 0, W, H);
  beams.forEach((b, i) => {
    const x0 = W * 0.35, y0 = b.y, x1 = W, y1 = b.y + Math.tan(b.a) * (W - x0);
    const g = cx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, 'rgba(31,179,191,0)'); g.addColorStop(0.5, 'rgba(31,179,191,.35)'); g.addColorStop(1, 'rgba(28,103,154,.05)');
    cx.strokeStyle = g; cx.lineWidth = 1.2; cx.beginPath(); cx.moveTo(x0, y0); cx.lineTo(x1, y1); cx.stroke();
    const k = ((t * 0.00012 * b.s + b.p / 1000) % 1);
    const px = x0 + (x1 - x0) * k, py = y0 + (y1 - y0) * k;
    const rg = cx.createRadialGradient(px, py, 0, px, py, 26);
    rg.addColorStop(0, 'rgba(127,227,234,.9)'); rg.addColorStop(1, 'rgba(31,179,191,0)');
    cx.fillStyle = rg; cx.beginPath(); cx.arc(px, py, 26, 0, 7); cx.fill();
  });
  if (!still) requestAnimationFrame(draw);
}
addEventListener('resize', size); size(); requestAnimationFrame(draw);

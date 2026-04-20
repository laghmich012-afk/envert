// ── Nav scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30));

// ── Mobile hamburger
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// ── Active nav link
const path = location.pathname.replace(/\/$/, '').split('/').pop() || 'index';
document.querySelectorAll('.nav-links a').forEach(a => {
  const href = a.getAttribute('href').replace(/\/$/, '').split('/').pop() || 'index';
  if (href === path || (path === '' && href === 'index')) a.classList.add('active');
});

// ── Scroll-triggered fade-in
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); observer.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.fade').forEach(el => observer.observe(el));

// ── Smooth counter animation
function animateCount(el, target, duration = 1800) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString() + (el.dataset.suffix || '');
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCount(e.target, parseInt(e.target.dataset.count));
      countObs.unobserve(e.target);
    }
  });
}, { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

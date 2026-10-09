// Reveal content once; keep it visible when reduced motion is requested.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const targets = document.querySelectorAll('.project-card,.about-grid,.service-list>div');
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    }, { threshold: .12 });
    targets.forEach(el => { el.classList.add('reveal'); observer.observe(el); });
  }
  const logos = document.querySelectorAll('.client-logo');
  logos.forEach(el => el.classList.add('client-reveal'));
  requestAnimationFrame(() => requestAnimationFrame(() => logos.forEach(el => el.classList.add('show'))));

  const portrait = document.querySelector('.hero-portrait');
  const hero = document.querySelector('.hero');
  const arrow = document.querySelector('.nav-arrow');
  const desktop = matchMedia('(min-width:801px)');
  let frame = 0, heroVisible = true, heroTop = 0, heroHeight = 1, maxScroll = 1;
  let lastShift = '', lastAngle = '';
  const measure = () => {
    // Layout reads happen on size changes, never after style writes on scroll.
    heroTop = hero ? hero.getBoundingClientRect().top + scrollY : 0;
    heroHeight = hero ? hero.offsetHeight : 1;
    maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    schedule();
  };
  const update = () => {
    frame = 0;
    if (reduced.matches) return;
    const y = scrollY;
    if (portrait && desktop.matches && heroVisible) {
      const shift = `${(-38 * Math.max(0, Math.min(1, (y - heroTop) / heroHeight))).toFixed(2)}px`;
      if (shift !== lastShift) { portrait.style.setProperty('--parallax-y', shift); lastShift = shift; }
    }
    if (arrow && desktop.matches) {
      const angle = `rotate(${(Math.min(1, Math.max(0, y / maxScroll)) * 180).toFixed(2)}deg)`;
      if (angle !== lastAngle) { arrow.style.transform = angle; lastAngle = angle; }
    }
  };
  function schedule() {
    if (!frame && !reduced.matches && desktop.matches && !document.hidden) frame = requestAnimationFrame(update);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', measure, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  addEventListener('pageshow', measure);
  reduced.addEventListener('change', () => {
    if (portrait) portrait.style.removeProperty('--parallax-y');
    if (arrow) arrow.style.removeProperty('transform');
    lastShift = lastAngle = ''; schedule();
  });
  desktop.addEventListener('change', measure);
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; schedule(); }).observe(hero);
  }
  if ('ResizeObserver' in window) {
    const sizes = new ResizeObserver(measure);
    sizes.observe(document.body);
    if (hero) sizes.observe(hero);
  }
  measure();
})();

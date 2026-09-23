const io=new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('show');
      io.unobserve(e.target);
    }
  });
},{threshold:.12});

document.querySelectorAll('.project-card,.about-grid,.service-list>div').forEach(el=>{
  el.classList.add('reveal');
  io.observe(el);
});

const clientObserver=new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    entry.target.querySelectorAll('.client-logo').forEach((logo,i)=>{
      window.setTimeout(()=>logo.classList.add('show'), i*120);
    });
    clientObserver.unobserve(entry.target);
  });
},{threshold:.18});

const clientsSection=document.querySelector('.hero-clients');
if(clientsSection){
  clientsSection.querySelectorAll('.client-logo').forEach((logo,i)=>{
    window.setTimeout(()=>logo.classList.add('show'), 420 + i*110);
  });
}


// V23 — subtle scroll parallax on the hero portrait.
(() => {
  const portrait = document.querySelector('.hero-portrait');
  const hero = document.querySelector('.hero');
  if (!portrait || !hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;
  const updateParallax = () => {
    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, hero.offsetHeight)));
    const shift = progress * -38;
    portrait.style.setProperty('--parallax-y', `${shift.toFixed(2)}px`);
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive:true });
  updateParallax();
})();

// V32 — project video state: keeps the blurred artwork visible around the 9:16 video.
(() => {
  document.querySelectorAll('.project-video').forEach(video => {
    const section = video.closest('.project-video-section');
    if (!section) return;
    video.addEventListener('play', () => section.classList.add('is-playing'));
    video.addEventListener('pause', () => section.classList.remove('is-playing'));
    video.addEventListener('ended', () => section.classList.remove('is-playing'));
  });
})();

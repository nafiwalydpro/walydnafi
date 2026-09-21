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

const clientsSection=document.querySelector('.clients');
if(clientsSection) clientObserver.observe(clientsSection);

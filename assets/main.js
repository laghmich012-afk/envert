/* main.js — Envert Canada */

// Nav scroll
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30),{passive:true});

// Hamburger
const hbg=document.getElementById('hamburger');
const nl=document.getElementById('navLinks');
if(hbg){
  hbg.addEventListener('click',()=>{
    hbg.classList.toggle('open');
    nl.classList.toggle('open');
    document.body.style.overflow=nl.classList.contains('open')?'hidden':'';
  });
  nl.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    hbg.classList.remove('open');nl.classList.remove('open');document.body.style.overflow='';
  }));
}

// Active nav
const p=location.pathname.replace(/\/$/,'').split('/').pop()||'index';
document.querySelectorAll('.nav-links a').forEach(a=>{
  const h=a.getAttribute('href').replace(/\/$/,'').split('/').pop()||'index';
  if(h===p||(p===''&&h==='index'))a.classList.add('active');
});

// Intersection observer for all animated elements
const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.fade,.fade-left,.scale-in,.stagger').forEach(el=>io.observe(el));

// Lazy images
const imgObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const img=e.target;
      img.src=img.dataset.src;
      img.addEventListener('load',()=>img.classList.add('img-loaded'),{once:true});
      imgObs.unobserve(img);
    }
  });
},{rootMargin:'200px'});
document.querySelectorAll('img[data-src]').forEach(img=>imgObs.observe(img));

// Animated counter
function animCount(el,target,dur=1800){
  const suffix=el.dataset.suffix||'';
  const prefix=el.dataset.prefix||'';
  let start=null;
  const step=ts=>{
    if(!start)start=ts;
    const prog=Math.min((ts-start)/dur,1);
    const ease=1-Math.pow(1-prog,3);
    el.textContent=prefix+Math.floor(ease*target).toLocaleString()+suffix;
    if(prog<1)requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const countObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      animCount(e.target,parseInt(e.target.dataset.count));
      countObs.unobserve(e.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>countObs.observe(el));

// Hero canvas particles (only on homepage)
const canvas=document.getElementById('particles');
if(canvas){
  const ctx=canvas.getContext('2d');
  let W,H,pts=[];
  function resize(){
    W=canvas.width=canvas.offsetWidth;
    H=canvas.height=canvas.offsetHeight;
  }
  function mkPt(){
    return{
      x:Math.random()*W,y:Math.random()*H,
      vx:(Math.random()-.5)*.3,vy:(Math.random()-.5)*.3,
      r:Math.random()*1.5+.5,
      a:Math.random()
    };
  }
  resize();
  for(let i=0;i<80;i++)pts.push(mkPt());
  window.addEventListener('resize',()=>{resize();},{ passive:true});

  function draw(){
    ctx.clearRect(0,0,W,H);
    pts.forEach(p=>{
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>W)p.vx*=-1;
      if(p.y<0||p.y>H)p.vy*=-1;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(61,206,105,${p.a*.4})`;
      ctx.fill();
    });
    // Draw connections
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x,dy=pts[i].y-pts[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          ctx.beginPath();
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(61,206,105,${.12*(1-dist/120)})`;
          ctx.lineWidth=.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

// Smooth parallax on hero image (subtle)
const heroImg=document.querySelector('.hero-parallax');
if(heroImg){
  window.addEventListener('scroll',()=>{
    heroImg.style.transform=`translateY(${scrollY*.25}px)`;
  },{passive:true});
}

// Form submission via Formspree
const form=document.getElementById('contactForm');
if(form){
  form.addEventListener('submit',async e=>{
    e.preventDefault();
    const btn=form.querySelector('.fsub');
    const msg=document.getElementById('formMsg');
    btn.textContent='Sending…';btn.disabled=true;
    try{
      const res=await fetch(form.action,{
        method:'POST',
        body:new FormData(form),
        headers:{Accept:'application/json'}
      });
      if(res.ok){
        btn.textContent='✓ Message Sent!';
        btn.style.background='#059669';
        msg.textContent='Thank you! We\'ll get back to you within 1–2 business days.';
        msg.style.color='var(--green3)';
        form.reset();
      } else {
        throw new Error();
      }
    } catch{
      btn.textContent='Send Message →';
      btn.disabled=false;
      msg.textContent='Something went wrong. Please email us directly at contact@envert.ca';
      msg.style.color='#f87171';
    }
  });
}

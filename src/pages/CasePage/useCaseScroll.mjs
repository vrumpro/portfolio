import {onMounted,onBeforeUnmount} from 'vue';
const clamp=value=>Math.max(0,Math.min(1,value));
export function useCaseScroll(root,next){
 let frame=0,timer=0,observer,disposed=false,opening=false,scrolled=false,previous=0,explicit=false,section,link,origin=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 function cancel(){clearTimeout(timer);timer=0;section?.classList.remove('is-counting');}
 function navigate(){
  if(disposed||opening||document.querySelector('.reference-transition'))return;
  opening=true;cancel();
  window.dispatchEvent(new CustomEvent('portfolio:next-case',{detail:{href:next.value.slug+'.html'}}));
 }
 function start(){
  if(timer)return;
  section.classList.add('is-counting');section.dataset.countdownStarted=String(performance.now());
  timer=setTimeout(()=>{if(!document.hidden&&document.documentElement.scrollHeight-innerHeight-scrollY<2)navigate();else cancel();},5000);
 }
 function render(){
  frame=0;if(!root.value||opening)return;
  const top=origin-scrollY,h=innerHeight,remaining=Math.max(0,document.documentElement.scrollHeight-h-scrollY);
  const progress=clamp(1-top/h);
  section.style.setProperty('--next-progress',String(progress));section.dataset.progress=progress.toFixed(4);
  if(remaining<1.5&&scrolled&&(explicit||(innerWidth>800&&!reduced.matches))&&!document.hidden&&!document.querySelector('.reference-transition'))start();
  else cancel();
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(render);}
 function measure(){origin=link.getBoundingClientRect().top+scrollY;schedule();}
 function scroll(){if(scrollY>previous+1)scrolled=true;if(scrollY<previous-1)explicit=false;previous=scrollY;schedule();}
 function visibility(){if(document.hidden){explicit=false;cancel();}else schedule();}
 function openNext(event){
  if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  event.preventDefault();navigate();
 }
 onMounted(()=>{
  section=root.value.querySelector('.project-next');link=section.querySelector('.project-next-link');
  previous=scrollY;window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',measure);
  document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',schedule);
  observer=new ResizeObserver(measure);observer.observe(root.value);measure();
 });
 onBeforeUnmount(()=>{disposed=true;cancel();cancelAnimationFrame(frame);observer?.disconnect();window.removeEventListener('scroll',scroll);window.removeEventListener('resize',measure);document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',schedule);});
 return{openNext};
}

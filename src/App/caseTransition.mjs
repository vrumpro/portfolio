import {caseGeometry} from '../components/ProjectGallery/caseGeometry.mjs';
import {cases} from '../cases.mjs';
import {projectPresentation} from '../presentation.mjs';
import {createGalleryRenderer,galleryTime} from '../components/ProjectGallery/renderer.mjs';
import {transitionFrame,motionTiming} from '../components/ProjectGallery/motion.mjs';
import './caseTransition.css';

const element=(className,parent)=>{const node=document.createElement('div');node.className=className;parent?.append(node);return node;};
const clipLeft=value=>'inset(0 0 0 '+value*100+'%)';
const clipRight=value=>'inset(0 '+value*100+'% 0 0)';
const mixBlack=(hex,amount)=>'#'+hex.slice(1).match(/../g).map(x=>Math.round(parseInt(x,16)*(1-amount)).toString(16).padStart(2,'0')).join('');
function cloneViewport(source){
 const clone=source.cloneNode(true);
 const originals=source.querySelectorAll('canvas'),copies=clone.querySelectorAll('canvas');
 originals.forEach((canvas,i)=>{try{copies[i].getContext('2d')?.drawImage(canvas,0,0)}catch{}});
 clone.querySelectorAll('[id]').forEach(node=>node.removeAttribute('id'));
 clone.removeAttribute('id');clone.inert=true;clone.setAttribute('aria-hidden','true');
 return clone;
}

export async function runCaseTransition(update,from,to){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches){await update();return;}
 const outgoing=document.querySelector('#app>.page-surface');
 if(!outgoing){await update();return;}
 const type=!from?'home-case':!to?'case-home':'case-case';
 const returning=type==='case-home',opening=type==='home-case',desktop=innerWidth>800;
 const project=to||from,index=cases.findIndex(p=>p.slug===project.slug),palette=projectPresentation(project.slug);
 const previousScroll=scrollY,oldTitle=outgoing.querySelector('.gallery-copy h2')?.getBoundingClientRect();
 const oldCanvas=outgoing.querySelector('.webgl-gallery canvas');
 const initialTime=Number(oldCanvas?.dataset.time)||0,rawPosition=Number(oldCanvas?.dataset.position??index);
 const initialPosition=rawPosition-Math.round((rawPosition-index)/cases.length)*cases.length;
 const oldMobile=outgoing.querySelector('.mobile-cover.active')?.getBoundingClientRect();
 const old=cloneViewport(outgoing),stage=element('reference-transition '+type);
 stage.setAttribute('aria-hidden','true');stage.inert=true;
 const background=element('reference-transition-background',stage),secondary=element('reference-transition-secondary',stage);
 const scene=element('reference-transition-scene',stage),canvas=document.createElement('canvas');scene.append(canvas);
 const oldLayer=element('reference-transition-old',stage);oldLayer.append(old);
 old.style.transform='translateY(-'+previousScroll+'px)';old.style.setProperty('--old-scroll',previousScroll+'px');
 const cover=element('reference-transition-return',stage);
 cover.hidden=!returning;
 background.style.background=opening?palette.background:type==='case-case'?projectPresentation(from.slug).surface:palette.surface;
 secondary.style.background=palette.surface;
 secondary.style.clipPath=opening?clipRight(1):"none";
 if(type==="case-case"){secondary.style.clipPath="inset(0 0 100% 0)";scene.style.opacity="0";}
 stage.style.visibility='hidden';
 document.getElementById('app').append(stage);
 const overflow=document.documentElement.style.overflow;
 document.documentElement.style.overflow='hidden';
 let start=performance.now(),watchdog;
 let renderer,native,frameId,preparationFrame,complete,disposed=false,state={highlight:opening?0:1};
 let time=initialTime,frame=transitionFrame(type,0);
 const styleKeys=['clip-path','--case-button-opacity'];
 const previousStyles=new Map();
 const clean=()=>{
  if(disposed)return;disposed=true;
  clearTimeout(watchdog);cancelAnimationFrame(frameId);cancelAnimationFrame(preparationFrame);stage.remove();
  document.documentElement.style.overflow=overflow;
  if(native){
   native.classList.remove('reference-transition-native','return-home');
   for(const key of styleKeys){const value=previousStyles.get(key);value?native.style.setProperty(key,value):native.style.removeProperty(key);}
   native.querySelector('.case-cover-title')?.style.removeProperty('translate');
   native.querySelector('.case-cover-artwork')?.style.removeProperty('visibility');
  }
  document.documentElement.style.overflow=overflow;
  window.removeEventListener('resize',finish);document.removeEventListener('visibilitychange',visibility);
  reduced.removeEventListener('change',finish);
  try{renderer?.destroy();}catch(error){console.error('Transition cleanup',error);}
 };
 const finish=()=>{clean();complete?.();};
 const visibility=()=>{if(document.hidden)finish();};
 watchdog=setTimeout(finish,6000);
 try{
  if(desktop)try{renderer=await createGalleryRenderer(canvas,scene,cases,()=>index,{
   manual:true,loop:opening,initialTime,initialPosition:opening?initialPosition:index,position:()=>opening?initialPosition+(index-initialPosition)*frame.highlight:index,state:()=>state,time:()=>time,
   geometry:type==='case-case'?(w,h)=>caseGeometry(w,h,{mode:'next',open:frame.highlight}):undefined
  });}catch{renderer=null;}
  if(disposed){renderer?.destroy();await update();return;}
  function prepare(){if(disposed)return;renderer?.render();preparationFrame=requestAnimationFrame(prepare);}
  prepare();stage.style.visibility="visible";
  await update();
  native=document.querySelector('#app>.page-surface');
  if(!native)return;
  for(const key of styleKeys)previousStyles.set(key,native.style.getPropertyValue(key));
  native.classList.add('reference-transition-native');
  native.style.clipPath=opening?clipRight(1):returning?clipLeft(1):'inset(0 0 100% 0)';
  if(returning)native.classList.add('return-home');
  const title=native.querySelector('.case-cover-title'),newTitle=native.querySelector('.case-cover-title h1')?.getBoundingClientRect();
  const titleOffset=oldTitle&&newTitle?oldTitle.top-newTitle.top:0;
  const mobileCard=!desktop&&opening&&oldMobile?element('reference-transition-mobile-card',stage):null;
  const destination=native.querySelector('.case-cover-artwork')?.getBoundingClientRect();
  if(mobileCard){
   const poster=old.querySelector('.mobile-cover.active .brand-cover');
   if(poster){const clone=poster.cloneNode(true);clone.classList.add('outgoing-logo');mobileCard.append(clone);}
   const mark=native.querySelector('.case-cover-artwork .brand-cover');
   if(mark){const clone=mark.cloneNode(true);clone.classList.add('incoming-logo');mobileCard.append(clone);}
   old.querySelector('.mobile-cover.active')?.style.setProperty('visibility','hidden');
   native.querySelector('.case-cover-artwork')?.style.setProperty('visibility','hidden');
  }
  // Wait for the destination cover before handing the transition canvas over.
  if(desktop&&!returning){const readyAt=performance.now();while(!native.querySelector('.case-poster[data-ready]')&&performance.now()-readyAt<2500)await new Promise(r=>setTimeout(r,16));}
  if(disposed)return;
  cancelAnimationFrame(preparationFrame);clearTimeout(watchdog);
  start=performance.now();
  await new Promise(resolve=>{
   complete=resolve;
   watchdog=setTimeout(finish,3000);
   function tick(now){
    if(disposed)return;
    try{
    const elapsed=now-start;frame=transitionFrame(type,elapsed);
    const p=frame.progress;
    stage.dataset.elapsed=elapsed.toFixed(2);stage.dataset.progress=p.toFixed(6);stage.dataset.highlight=frame.highlight.toFixed(6);
    time=galleryTime();
    if(opening){
     state={highlight:frame.highlight,otherMaskLeft:p,activeMaskLeft:0};
     secondary.style.clipPath=clipRight(1-p);
     oldLayer.style.clipPath=clipLeft(p);native.style.clipPath=clipRight(1-p);
     if(desktop&&title)title.style.translate='0 '+titleOffset*(1-p)+'px';
     native.style.setProperty('--case-button-opacity',String(Math.max(0,(p-.85)/.15)));
     if(mobileCard&&destination){
      const h=frame.highlight,mix=(a,b)=>a+(b-a)*h;
      mobileCard.querySelector('.outgoing-logo')?.style.setProperty('opacity',String(1-h));
      mobileCard.querySelector('.incoming-logo')?.style.setProperty('opacity',String(h));
      Object.assign(mobileCard.style,{left:mix(oldMobile.left,destination.left)+'px',top:mix(oldMobile.top,destination.top)+'px',width:mix(oldMobile.width,destination.width)+'px',height:mix(oldMobile.height,destination.height)+'px'});
     }
    }else if(returning){
     const reset=elapsed>=motionTiming.returnReset;
     state={highlight:frame.highlight,...(!reset?{onlyIndex:index}:{}),activeMaskLeft:reset?1-frame.homeReveal:0,otherMaskLeft:reset?1-frame.homeReveal:1};
     background.style.background=palette.surface;
     secondary.hidden=true;
     cover.style.background=mixBlack(palette.surface,p<.5?.1:.2*(1-p));
     cover.style.clipPath=clipLeft(frame.returnCover);
     oldLayer.style.clipPath=clipRight(1-Math.min((1-p)/.35,1));
     native.style.clipPath=clipLeft(1-frame.homeReveal);
     // At 900ms the scene is reset under the opaque return mask.
     scene.style.visibility=reset?'hidden':'visible';
    }else{
     state={highlight:1,onlyIndex:index};
     secondary.style.clipPath='inset(0 0 '+(1-p)*100+'% 0)';
     native.style.clipPath='inset(0 0 '+(1-p)*100+'% 0)';
     oldLayer.style.clipPath='inset('+p*100+'% 0 0 0)';
     scene.style.clipPath='none';
     scene.style.opacity=String(Math.max(0,(p-.35)/.65));
    }
    renderer?.render();
    if(frame.done){
     native.querySelector('.case-cover-artwork')?.style.removeProperty('visibility');
     finish();
    }else frameId=requestAnimationFrame(tick);
    }catch(error){console.error("Transition frame",error);finish();}
   }
   window.addEventListener('resize',finish,{once:true});
   document.addEventListener('visibilitychange',visibility);
   reduced.addEventListener('change',finish,{once:true});
   tick(performance.now());
  });
 }finally{clean();}
}

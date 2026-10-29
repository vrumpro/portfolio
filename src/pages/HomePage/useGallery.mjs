import {computed,onMounted,onBeforeUnmount,ref} from 'vue';
import {createWheelGesture} from './wheelGesture.mjs';
import {cases} from '../../cases.mjs';
export function useGallery(){
 const wrap=i=>(i%cases.length+cases.length)%cases.length;
 const position=ref(Math.max(0,cases.findIndex(p=>p.slug===history.state?.selectedProject))),root=ref();
 const selected=computed(()=>wrap(position.value)),project=computed(()=>cases[selected.value]);
 let lastChange=-2000,start,suppressClickUntil=0;const consumeWheel=createWheelGesture();
 function move(delta){if(!delta)return;position.value+=delta;lastChange=performance.now();history.replaceState({...history.state,selectedProject:project.value.slug},'');}
 function select(index){const target=wrap(index);let delta=target-selected.value;if(Math.abs(delta)>cases.length/2)delta-=Math.sign(delta)*cases.length;move(delta);}
 function wheel(event){
  if(event.ctrlKey)return;event.preventDefault();const now=performance.now();
  if(now<suppressClickUntil)return;
  const raw=Math.abs(event.deltaY)>=Math.abs(event.deltaX)?event.deltaY:event.deltaX;
  const delta=raw*(event.deltaMode===1?20:event.deltaMode===2?innerHeight:1);
  const direction=consumeWheel(delta,now,event.deltaMode!==0);if(direction)move(direction);
 }
 function keydown(event){
  if(event.repeat||event.ctrlKey||event.altKey||event.metaKey||event.target.closest('input,textarea,select,[contenteditable]'))return;
  const dir=['ArrowDown','ArrowRight','PageDown'].includes(event.key)?1:['ArrowUp','ArrowLeft','PageUp'].includes(event.key)?-1:0;
  if(dir){event.preventDefault();if(performance.now()-lastChange>=180)move(dir);}
  else if(event.key==='Home'){event.preventDefault();select(0);}else if(event.key==='End'){event.preventDefault();select(cases.length-1);}
 }
 function touchstart(event){if(event.touches.length!==1){start=null;return;}const t=event.touches[0];start={x:t.clientX,y:t.clientY};}
 function touchend(event){if(!start)return;const t=event.changedTouches[0],dx=start.x-t.clientX,dy=start.y-t.clientY;start=null;
  if(Math.max(Math.abs(dx),Math.abs(dy))>45){const now=performance.now();suppressClickUntil=now+350;if(now-lastChange>=180)move(Math.sign(Math.abs(dx)>Math.abs(dy)?dx:dy));}
 }
 function touchcancel(){start=null;}
 function click(event){if(performance.now()<suppressClickUntil){event.preventDefault();event.stopImmediatePropagation();}}
 onMounted(()=>{root.value?.addEventListener('wheel',wheel,{passive:false});root.value?.addEventListener('click',click,true);root.value?.addEventListener('touchcancel',touchcancel);window.addEventListener('keydown',keydown);});
 onBeforeUnmount(()=>{root.value?.removeEventListener('wheel',wheel);root.value?.removeEventListener('click',click,true);root.value?.removeEventListener('touchcancel',touchcancel);window.removeEventListener('keydown',keydown);});
 return{root,selected,position,project,select,touchstart,touchend};
}

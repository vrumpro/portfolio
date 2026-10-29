<script setup>
import {onMounted,onBeforeUnmount,ref} from 'vue';
import {createGalleryRenderer} from './renderer.mjs';
import {caseGeometry} from './caseGeometry.mjs';
const props=defineProps({project:Object,scrollMode:{type:String,default:'hero'}});
const root=ref(),canvas=ref();let renderer,disposed=false,frame=0,observer,intersection,origin=0,visible=false,current=0,target=0,last=0;
const preference=matchMedia('(prefers-reduced-motion:reduce)');
function geometry(width,height){
 return caseGeometry(width,height,{mode:props.scrollMode,scroll:preference.matches?0:Math.max(0,-current),remaining:preference.matches?0:Math.max(0,current)});
}
function update(now){
 frame=0;if(disposed||!renderer||!visible)return;
 target=origin-scrollY;
 current=target;
 renderer.render();root.value.dataset.ready="true";

}
function schedule(){if(!frame&&visible){last=performance.now();frame=requestAnimationFrame(update);}}
function measure(){
 const parent=root.value?.parentElement;if(!parent)return;
 origin=parent.getBoundingClientRect().top+scrollY;current=target=origin-scrollY;schedule();
}
onMounted(async()=>{
 const parent=root.value.parentElement;
 intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting&&innerWidth>800;if(visible){current=target=origin-scrollY;schedule();}else{cancelAnimationFrame(frame);frame=0;}});
 intersection.observe(parent);
 observer=new ResizeObserver(measure);observer.observe(root.value.closest('main'));observer.observe(parent);
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',measure);preference.addEventListener('change',measure);
 measure();
 try{
  renderer=await createGalleryRenderer(canvas.value,root.value,[props.project],()=>0,{static:true,state:()=>({highlight:1}),geometry});
  if(disposed)renderer?.destroy();
  if(!renderer){root.value?.classList.add('poster-unavailable');root.value.dataset.ready='fallback';}
  schedule();
 }catch{root.value?.classList.add('poster-unavailable');if(root.value)root.value.dataset.ready='fallback';}
});
onBeforeUnmount(()=>{disposed=true;cancelAnimationFrame(frame);observer?.disconnect();intersection?.disconnect();window.removeEventListener('scroll',schedule);window.removeEventListener('resize',measure);preference.removeEventListener('change',measure);renderer?.destroy();});
</script>
<template><div ref="root" class="case-poster" aria-hidden="true"><canvas ref="canvas"/></div></template>
<style scoped>
.case-poster{position:fixed;inset:0;pointer-events:none}.case-poster canvas{width:100%;height:100%;display:block}
@media(max-width:800px){.case-poster{display:none}}
</style>

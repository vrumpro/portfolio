<script setup>
import {computed,onMounted,onBeforeUnmount,ref,watch} from 'vue';
import {cases} from '../../cases.mjs';
import {projectPresentation} from '../../presentation.mjs';
import ProjectGallery from '../../components/ProjectGallery/ProjectGallery.vue';
import ProjectLogo from '../../components/ProjectLogo/ProjectLogo.vue';
import rings from '../../../assets/optimized/ambient/sokolov-rings.webp';
import parcels from '../../../assets/optimized/ambient/wikkeo-wholesale.webp';
import route from '../../../assets/optimized/ambient/indrive-driver-choice.webp';
const ambient={sokolov:rings,wikkeo:parcels,indriver:route,indrive:route};
import {useGallery} from './useGallery.mjs';
const {root,selected,position,project,select,touchstart,touchend}=useGallery();
const mobile=ref(innerWidth<=800);
const mobileItems=[cases.at(-1),...cases,cases[0]],mobileIndex=ref(selected.value+1),trackReset=ref(false);
let resetFrame=0,settleTimer=0;
function settleTrack(){clearTimeout(settleTimer);trackReset.value=true;mobileIndex.value=selected.value+1;cancelAnimationFrame(resetFrame);resetFrame=requestAnimationFrame(()=>{resetFrame=requestAnimationFrame(()=>{trackReset.value=false;});});}
watch(position,(value,old)=>{clearTimeout(settleTimer);const delta=value-old,previous=(old%cases.length+cases.length)%cases.length;mobileIndex.value=delta===1&&previous===cases.length-1?cases.length+1:delta===-1&&previous===0?0:selected.value+1;if(!mobile.value||matchMedia('(prefers-reduced-motion:reduce)').matches)settleTrack();else settleTimer=setTimeout(settleTrack,940);});
watch(mobile,settleTrack);
onBeforeUnmount(()=>{cancelAnimationFrame(resetFrame);clearTimeout(settleTimer);});
const palette=computed(()=>projectPresentation(project.value.slug));
function resize(){mobile.value=innerWidth<=800;}
watch(palette,value=>{document.documentElement.style.setProperty('--gallery-bg',value.background);document.documentElement.style.setProperty('--gallery-fg',value.foreground);document.documentElement.style.setProperty('--gallery-copy',value.copy);},{immediate:true});
onMounted(()=>window.addEventListener('resize',resize));onBeforeUnmount(()=>window.removeEventListener('resize',resize));
</script>
<template>
 <main id="main" ref="root" class="home-projects" tabindex="-1" @touchstart.passive="touchstart" @touchend.passive="touchend">
  <div v-if="!mobile" class="brand-ambience" aria-hidden="true"><img v-for="item in cases" :key="item.slug" :src="ambient[item.slug]" :class="{visible:item.slug===project.slug}" alt=""/></div><h1 class="visually-hidden">Портфолио Алексея Пашкова</h1>
  <section id="cases" class="project-gallery" aria-label="Проекты">
   <template v-if="!mobile">
    <div class="gallery-copy" aria-live="polite"><Transition name="project-copy" mode="out-in"><div :key="project.slug">
     <h2>{{project.brand}}</h2><p class="gallery-caption">{{project.cardCaption}}</p>
    </div></Transition></div>
    <ProjectGallery :projects="cases" :selected="selected" :position="position" @select="select"/>
   </template>
   <div v-else class="mobile-gallery">
    <div class="mobile-track" :class="{reset:trackReset}" @transitionend.self="settleTrack" :style="{transform:'translate3d('+(-mobileIndex*100)+'%,0,0)'}">
     <article v-for="(item,index) in mobileItems" :key="index" class="mobile-project" :aria-hidden="index!==mobileIndex">
      <a class="mobile-cover case-card" :class="{active:index===mobileIndex}" :href="item.slug+'.html'" :tabindex="index===mobileIndex?0:-1"><ProjectLogo :project="item" card/></a>
      <div class="mobile-copy"><h2>{{item.brand}}</h2><p class="gallery-caption">{{item.cardCaption}}</p></div>
     </article>
    </div>
   </div>
   <nav class="project-selector" aria-label="Выбор проекта"><button v-for="(item,index) in cases" :key="item.slug" type="button" :aria-label="item.brand+' — '+item.cardCaption" :aria-pressed="index===selected" @click="select(index)"><i aria-hidden="true"></i><span>{{item.brand}}</span></button></nav>
  </section>
 </main>
</template>
<style scoped src="./HomePage.css"></style>

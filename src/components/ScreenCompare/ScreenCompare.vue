<script setup>
import {computed,ref,watch,onMounted,onBeforeUnmount} from 'vue';
import {getScreen} from '../../media.mjs';
const props=defineProps({images:{type:Array,required:true},label:{type:String,required:true}});
const before=computed(()=>getScreen(props.images[0].name)),after=computed(()=>getScreen(props.images[1].name));
const compact=computed(()=>Math.max(before.value.width,after.value.width)<=600&&Math.max(before.value.height,after.value.height)<400);
const position=ref(50),stage=ref(null),range=ref(null),dragging=ref(false);
watch(()=>props.images,()=>{position.value=50;dragging.value=false;});
function update(event){const bounds=stage.value.getBoundingClientRect();position.value=Math.max(0,Math.min(100,(event.clientX-bounds.left)/bounds.width*100));}
function start(event){if(!event.isPrimary||event.button!==0)return;event.preventDefault();range.value.focus({preventScroll:true});stage.value.setPointerCapture(event.pointerId);dragging.value=true;update(event);}
function move(event){if(dragging.value){if(event.pointerType==='mouse'&&!(event.buttons&1)){dragging.value=false;return;}update(event);}}
function end(event){dragging.value=false;if(stage.value.hasPointerCapture(event.pointerId))stage.value.releasePointerCapture(event.pointerId);}
function cancel(){dragging.value=false;}
onMounted(()=>{window.addEventListener('pointermove',move);window.addEventListener('pointerup',end);window.addEventListener('pointercancel',cancel);window.addEventListener('blur',cancel);});
onBeforeUnmount(()=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',end);window.removeEventListener('pointercancel',cancel);window.removeEventListener('blur',cancel);});
</script>
<template>
 <figure class="screen-comparison" :class="{compact}">
  <div ref="stage" class="comparison-stage" :class="{'is-dragging':dragging}" :style="{'--split':position+'%','--original-width':Math.max(before.width,after.width)+'px','--original-ratio':before.width+' / '+before.height}" @pointerdown="start" @pointermove="move" @pointerup="end" @pointercancel="end">
   <img class="comparison-before" :src="before.url" :alt="images[0].alt" :width="before.width" :height="before.height" draggable="false" loading="lazy">
   <div class="comparison-after"><img :src="after.url" :alt="images[1].alt" :width="after.width" :height="after.height" draggable="false" loading="lazy"></div>
   <div class="comparison-divider" aria-hidden="true"><span><svg viewBox="0 0 32 18" fill="none"><path d="m7 5-4 4 4 4M25 5l4 4-4 4M14 5v8M18 5v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div>
   <input ref="range" class="comparison-range" type="range" min="0" max="100" step="1" :value="position" :aria-label="'Сравнение «'+label+'»'" :aria-valuetext="'Исходная версия: '+Math.round(position)+'%. Обновлённая версия: '+(100-Math.round(position))+'%.'" @input="position=Number($event.target.value)">
  </div>
 </figure>
</template>
<style scoped src="./ScreenCompare.css"></style>

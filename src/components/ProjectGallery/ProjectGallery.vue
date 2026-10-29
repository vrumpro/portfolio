<script setup>
import {onMounted,onBeforeUnmount,ref,watch} from 'vue';
import {createGalleryRenderer} from './renderer.mjs';
const props=defineProps({projects:Array,selected:Number,position:Number});
const emit=defineEmits(['select']);
const canvas=ref(),root=ref(),ready=ref(false);
let renderer,disposed=false;
onMounted(async()=>{try{renderer=await createGalleryRenderer(canvas.value,root.value,props.projects,()=>props.position,{loop:true});if(disposed){renderer?.destroy();return;}ready.value=!!renderer;}catch{ready.value=false;}});
watch(()=>props.position,()=>renderer?.invalidate());
onBeforeUnmount(()=>{disposed=true;renderer?.destroy();});
function open(event,index){if(index!==props.selected){event.preventDefault();emit('select',index);}}
</script>
<template><div ref="root" class="webgl-gallery" :class="{ready}">
 <canvas ref="canvas" aria-hidden="true"/>
 <a v-for="(item,index) in projects" :key="item.slug" class="gallery-hit case-card" :class="{active:index===selected}" :href="item.slug+'.html'" :tabindex="index===selected?0:-1" :aria-label="item.brand+' — '+item.cardCaption" @click="open($event,index)"><span>{{item.brand}}</span></a>
</div></template>
<style scoped>
.webgl-gallery{position:absolute;inset:0;pointer-events:none}.webgl-gallery canvas{display:block;width:100%;height:100%}.gallery-hit{position:absolute;inset:0;pointer-events:auto;clip-path:inset(100%);cursor:pointer}.gallery-hit span{position:absolute;left:60%;top:45%;font-size:60px}.ready .gallery-hit span{opacity:0}.gallery-hit:focus-visible{background:#ffffff18;outline:0}.webgl-gallery:not(.ready) .gallery-hit.active{inset:28% 12% 23% 51%;clip-path:none;background:#ffffff22;transform:skewX(-13deg)}.webgl-gallery:not(.ready) .gallery-hit span{left:10%;top:40%;font-size:36px}
</style>

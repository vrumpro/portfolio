<script setup>
import {computed} from 'vue';
import {getScreen} from '../../media.mjs';
const props=defineProps({decision:{type:Object,required:true}});
const isPrice=computed(()=>props.decision.layout==='price-detail');
const items=computed(()=>props.decision.images.map(item=>{
  const screen=getScreen(item.name);
  // The exported frames include presentation borders, not product UI.
  const inset=isPrice.value?6:10;
  const width=screen.width-inset*2,height=screen.height-inset*2;
  return {...item,url:screen.url,ratio:width+'/'+height,style:{
    width:screen.width/width*100+'%',height:screen.height/height*100+'%',
    left:-inset/width*100+'%',top:-inset/height*100+'%'
  }};
}));
</script>

<template>
  <div class="sokolov-creative" :class="isPrice?'price-detail':'purchase-states'">
    <figure v-for="item in items" :key="item.name" class="detail-card">
      <div class="detail-crop" :style="{aspectRatio:item.ratio}">
        <img :src="item.url" :alt="item.alt" :style="item.style" loading="lazy" decoding="async" draggable="false">
      </div>
    </figure>
  </div>
</template>

<style scoped>
.sokolov-creative{display:grid;gap:var(--space-24);align-items:center;justify-items:center;padding:var(--space-42) var(--space-32);border-radius:24px;background:radial-gradient(ellipse at 15% 0%,#faf9f7,transparent 70%),#eaeef1;overflow:hidden}
.detail-card{margin:0;width:100%;background:#fff;box-shadow:0 22px 44px -24px #26384840;overflow:hidden}
.price-detail{min-height:540px}
.price-detail .detail-card{max-width:332px;padding:var(--space-24);border-radius:22px}
.purchase-states{grid-template-columns:repeat(2,minmax(0,1fr));min-height:370px;gap:var(--space-32) var(--space-24)}
.purchase-states .detail-card{max-width:352px;border-radius:16px;padding:var(--space-20)}
.detail-crop{position:relative;width:100%;overflow:hidden;background:white}
.detail-crop img{position:absolute;display:block;max-width:none;object-fit:fill}
@media(max-width:1100px) and (min-width:901px){.purchase-states{padding:var(--space-32) var(--space-20);gap:var(--space-20) var(--space-20)}.purchase-states .detail-card{padding:var(--space-6)}}
@media(max-width:600px){.sokolov-creative{padding:var(--space-32) var(--space-20);border-radius:20px}.price-detail{min-height:0}.price-detail .detail-card{padding:var(--space-20)}.purchase-states{grid-template-columns:1fr;gap:var(--space-20);min-height:0}.purchase-states .detail-card{padding:var(--space-12);max-width:348px}}
</style>

<script setup>
import {computed,ref} from 'vue';
const quantities=ref([1,0,0]);
const variants=[{name:'Black',color:'#292b30',stock:461},{name:'Pacific Blue',color:'#657786',stock:491},{name:'Dark Cherry',color:'#65424d',stock:488}];
const count=computed(()=>quantities.value.reduce((a,b)=>a+b,0));
const total=computed(()=>new Intl.NumberFormat('ru-RU').format(count.value*990)+' ₽');
function change(index,delta){quantities.value[index]=Math.max(0,Math.min(variants[index].stock,quantities.value[index]+delta));}
</script>
<template>
 <div class="variants-demo">
  <div class="demo-top"><h3>Соберите набор</h3><button class="reset" @click="quantities=[1,0,0]" aria-label="Сбросить выбор вариантов">Сбросить</button></div>
  <p>iPhone 16 Pro Max · 990 ₽ за штуку</p>
  <div v-for="(variant,index) in variants" :key="variant.name" class="variant-row">
   <span class="color-sample" :style="{background:variant.color}" aria-hidden="true"></span>
   <div class="variant-name"><strong>{{variant.name}}</strong><span>Осталось {{variant.stock}} шт.</span></div>
   <div class="quantity"><button :disabled="!quantities[index]" :aria-label="'Убрать '+variant.name" @click="change(index,-1)">−</button><output :aria-label="'Количество '+variant.name">{{quantities[index]}}</output><button :disabled="quantities[index]>=variant.stock" :aria-label="'Добавить '+variant.name" @click="change(index,1)">+</button></div>
  </div>
  <div class="selection-total" aria-live="polite"><span>Выбрано {{count}} шт.</span><strong>{{total}}</strong></div>
 </div>
</template>
<style scoped>
.variants-demo{background:#fff;border-radius:20px;padding:24px;box-shadow:0 20px 50px #55421210;font-family:var(--font-body);color:#171921}.demo-top{display:flex;justify-content:space-between;align-items:center;gap:8px}.demo-top h3{font-size:20px;font-weight:600;letter-spacing:-.035em}.reset{background:none;border:0;font-size:11px;padding:6px 0;color:#223bdd;cursor:pointer}.variants-demo>p{font-size:12px;color:#737682;margin:8px 0 24px;line-height:1.5}
.variant-row{display:flex;gap:10px;align-items:center;padding:15px 0}.color-sample{width:20px;height:32px;border-radius:5px;flex-shrink:0;box-shadow:inset 0 0 0 2px #ffffff25}.variant-name{flex:1;min-width:0}.variant-name strong,.variant-name span{display:block}.variant-name strong{font-size:12px;font-weight:500}.variant-name span{font-size:10px;color:#858793;margin-top:6px;white-space:nowrap}.quantity{display:flex;align-items:center;gap:2px;background:#f4f5fa;border-radius:8px;flex-shrink:0}.quantity button{border:0;background:none;width:26px;height:32px;color:#223bdd;font-size:18px;cursor:pointer}.quantity button:disabled{color:#bdc0cc;cursor:default}.quantity output{font-size:12px;min-width:16px;text-align:center}
.selection-total{display:flex;justify-content:space-between;gap:12px;background:#223bdd;color:white;margin-top:24px;padding:16px;border-radius:12px;font-size:12px;align-items:center}.selection-total strong{font-size:22px;letter-spacing:-.025em}
@media(max-width:380px){.variants-demo{padding:18px}.quantity button{width:23px}.variant-row{gap:6px}.color-sample{width:16px}}
</style>

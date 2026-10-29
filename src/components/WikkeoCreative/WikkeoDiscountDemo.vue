<script setup>
import {computed,ref} from 'vue';
const amount=ref(5000);
const tiers=[{from:0,price:2000},{from:5000,price:1100},{from:15000,price:1050},{from:45000,price:990}];
const selected=computed(()=>tiers.findLastIndex(t=>amount.value>=t.from));
const active=computed(()=>tiers[selected.value]);
const next=computed(()=>tiers[selected.value+1]);
const rub=value=>new Intl.NumberFormat('ru-RU').format(value)+' ₽';
</script>
<template>
 <div class="price-demo">
  <p class="demo-title">Как меняется цена</p>
  <p class="demo-description">Выберите сумму заказа в магазине</p>
  <div class="tier-options" role="group" aria-label="Порог скидки">
   <button v-for="(tier,index) in tiers" :key="tier.from" :aria-pressed="selected===index" @click="amount=tier.from"><strong>{{rub(tier.price)}}</strong><span>{{tier.from?'от '+rub(tier.from):'Без скидки'}}</span></button>
  </div>
  <label for="order-amount">Сумма заказа <output>{{rub(amount)}}</output></label>
  <input id="order-amount" v-model.number="amount" :style="{'--fill':amount/50000*100+'%'}" type="range" min="0" max="50000" step="100" :aria-valuetext="rub(amount)"/>
  <div class="price-result" aria-live="polite"><span>Цена за штуку</span><strong>{{rub(active.price)}}</strong><p>{{next?'До следующей цены осталось '+rub(next.from-amount):'Достигнут последний порог скидки'}}</p></div>
 </div>
</template>
<style scoped>
.price-demo{background:#fff;padding:24px;border-radius:20px;box-shadow:0 20px 50px #223bdd14;font-family:var(--font-body);color:#171921}
.demo-title{font-size:20px;font-weight:600;letter-spacing:-.035em}.demo-description{font-size:13px;color:#737682;margin:6px 0 22px;line-height:1.5}
.tier-options{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:26px}.tier-options button{border:0;background:#f4f5fa;border-radius:12px;padding:12px 6px;text-align:left;color:inherit;cursor:pointer}.tier-options strong,.tier-options span{display:block}.tier-options strong{font-size:17px;font-weight:600}.tier-options span{font-size:10px;color:#737682;margin-top:4px;white-space:nowrap}.tier-options button[aria-pressed=true]{background:#223bdd;color:#fff}.tier-options button[aria-pressed=true] span{color:#e6eaff}
label{display:flex;justify-content:space-between;font-size:12px;gap:8px}output{font-weight:600}
input{display:block;width:100%;margin:20px 0 24px;accent-color:#223bdd;cursor:ew-resize}
.price-result{background:#f3f5ff;border-radius:14px;padding:16px}.price-result>span{display:block;font-size:12px;color:#737682}.price-result strong{display:block;font-size:36px;line-height:1.3;letter-spacing:-.045em;color:#223bdd;font-weight:600}.price-result p{font-size:12px;line-height:1.5;margin-top:8px}
@media(prefers-reduced-motion:no-preference){.tier-options button{transition:background 180ms,color 180ms}}
input[type=range]{appearance:none;height:6px;border-radius:9px;background:linear-gradient(to right,#223bdd var(--fill),#e6e9f4 var(--fill));border:0}input[type=range]::-webkit-slider-thumb{appearance:none;width:20px;height:20px;border-radius:50%;background:#223bdd;box-shadow:0 2px 8px #223bdd33;cursor:ew-resize}input[type=range]::-moz-range-thumb{width:20px;height:20px;border:0;border-radius:50%;background:#223bdd;cursor:ew-resize}input[type=range]:focus-visible{outline:2px solid #223bdd;outline-offset:7px}
</style>

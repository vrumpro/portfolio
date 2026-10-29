<script setup>
import ScreenFigure from '../ScreenFigure/ScreenFigure.vue';
import ScreenCompare from '../ScreenCompare/ScreenCompare.vue';
import StoreDemo from '../StoreDemo/StoreDemo.vue';
import WikkeoDetail from './WikkeoDetail.vue';
import WikkeoDiscountDemo from './WikkeoDiscountDemo.vue';
import VariantPhone from './VariantPhone.vue';
defineProps({decision:Object});
</script>
<template>
 <div class="wikkeo-creative" :class="decision.creative">
  <template v-if="decision.layout==='comparison'">
   <div class="comparison-window"><ScreenCompare :images="decision.images" :label="decision.title"/></div>
  </template>
  <template v-else-if="decision.creative==='metrics'">
   <div class="creative-phone"><StoreDemo :images="decision.images"/></div>
   <div class="creative-details">
    <WikkeoDetail name="onshop-details-mobile" :crop="[16,54,358,224]" alt="OnShop: рейтинг, подписчики, заказы и минимальная покупка"/>
    <WikkeoDetail name="onshop-details-mobile" :crop="[16,285,358,232]" alt="Показатели OnShop: скорость ответа, успешные сделки и повторные покупки за 90 дней"/>
   </div>
  </template>
  <template v-else-if="decision.creative==='search'">
   <div class="creative-details">
    <WikkeoDetail name="onshop-search-mobile" :crop="[0,0,390,58]" alt="Строка поиска на Wikkeo"/>
    <WikkeoDetail name="onshop-search-mobile" :crop="[0,332,390,81]" alt="Поиск товаров магазина: популярные, бесплатная доставка, категория"/>
   </div>
   <ScreenFigure class="creative-phone" :item="decision.images[0]"/>
  </template>
  <template v-else-if="decision.creative==='discounts'">
   <ScreenFigure class="creative-phone" :item="decision.images[0]"/>
   <div class="creative-details">
    <WikkeoDiscountDemo/>
    
   </div>
   
  </template>
  <template v-else-if="decision.creative==='variants'"><VariantPhone kind="case"/><VariantPhone kind="controller"/></template>
  <template v-else-if="decision.creative==='purchase'">
   <ScreenFigure class="creative-phone" :item="decision.images[0]"/>
   <div class="creative-details">
    <WikkeoDetail name="drill-options-mobile" :crop="[0,0,390,120]" alt="Закреплённые название товара и цены от суммы заказа"/>
    <WikkeoDetail name="drill-options-mobile" :crop="[0,775,390,69]" alt="Нижняя панель: магазин, избранное, чат и кнопка покупки"/>
   </div>
  </template>
 </div>
</template>
<style scoped src="./WikkeoCreative.css"></style>

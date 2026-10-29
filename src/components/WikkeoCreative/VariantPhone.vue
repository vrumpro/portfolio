<script setup>
import {ref,onMounted,onBeforeUnmount} from 'vue';
import {getScreen} from '../../media.mjs';
import VariantIcon from './VariantIcon.vue';
import {useVariantScreen} from './useVariantScreen.mjs';
const props=defineProps({kind:String});
const {controller,models,active,favorite,panel,added,message,colors,stock,rows,count,selectedModels,prices,priceIndex,total,rub,change,selectModel,badge,reset,cart}=useVariantScreen(props.kind);
const root=ref(),scale=ref(1);let observer;
const screen=getScreen(controller?'wholesale-options-sheet':'wholesale-options-mobile');
const crops=controller?[[12,533,48,48],[12,605,48,48],[12,677,48,48]]:[[21,462,45,52],[21,538,45,52],[21,612,45,52]];
function thumb(i){const [x,y,w,h]=crops[i];return {backgroundImage:'url('+screen.url+')',backgroundSize:screen.width+'px '+screen.height+'px',backgroundPosition:-x+'px '+-y+'px',width:w+'px',height:h+'px'};}
onMounted(()=>{observer=new ResizeObserver(([e])=>{scale.value=Math.min(1,e.contentRect.width/392);});observer.observe(root.value);});
onBeforeUnmount(()=>observer?.disconnect());
</script>
<template>
 <div ref="root" class="variant-phone" :data-kind="kind" :style="{height:(controller?842:780)*scale+'px'}">
  <div class="variant-canvas" :class="{controller}" :style="{transform:'scale('+scale+')'}">
   <template v-if="!controller">
    <header class="product-top"><button @click="reset" aria-label="Сбросить макет чехлов"><VariantIcon name="back"/></button><span>Кожаный чехол Leather Case<br>MagSafe с анимацией для iPhone</span><button class="cart-icon" @click="panel='cart'" aria-label="Показать выбранные чехлы"><VariantIcon name="bag"/><i>{{selectedModels}}</i></button><button @click="panel='share'" aria-label="Поделиться выбором"><VariantIcon name="share"/></button></header>
    <div class="phone-prices"><button v-for="(value,i) in prices" :key="value" :class="{active:priceIndex===i}" @click="priceIndex=i"><strong>{{rub(value)}}</strong><small>{{['Без скидки','от 5000 ₽','от 15000 ₽','от 50000 ₽'][i]}}</small></button></div>
    <div class="discount-strip"><span>Скидка {{[0,55,62,65][priceIndex]}}%</span><div class="discount-segments"><i v-for="i in 4" :key="i" :class="{filled:i<=priceIndex+1}"></i></div><div class="discount-labels"><span>0</span><span>5к</span><span>15к</span><span>50к</span></div></div>
   </template>
   <template v-else>
    <header class="favorites-top"><button @click="reset" aria-label="Сбросить макет геймпадов"><VariantIcon name="back"/></button><strong>Избранное</strong><button @click="panel='models'">Выбрать</button></header>
    <div class="sheet-top"><i class="sheet-handle"></i><button class="delivery" @click="panel='delivery'"><VariantIcon name="pin"/><span><strong>125009, Россия, Москва, Москва, ул. Тверс...</strong><small>Доставка от 200₽ - 3 дня</small></span><VariantIcon name="chevron"/></button></div>
    <div class="controller-discount">Добавьте любых товаров в магазине <b>Wikkeo</b> еще<br>на <b class="blue">{{rub(Math.max(0,[20000,20000,40000,100000][priceIndex]-total))}}</b>, чтобы увеличить скидку<button class="help" @click="panel='discount'" aria-label="Условия скидки">?</button><div class="discount-strip"><span>Скидка -{{[0,10,15,20][priceIndex]}}%</span><div class="discount-segments"><i v-for="i in 4" :key="i" :class="{filled:i<=priceIndex+1}"></i></div><div class="discount-labels"><span>0</span><span>20к</span><span>40к</span><span>100к</span></div></div></div>
    <div class="controller-price"><div class="controller-picture" :style="{backgroundImage:'url('+screen.url+')'}"></div><div class="controller-price-values"><button @click="priceIndex=0"><strong>850₽</strong> Без скидки</button><div><button v-for="(value,i) in prices.slice(1)" :key="value" :class="{active:priceIndex===i+1}" @click="priceIndex=i+1"><strong>{{value}}₽</strong><small>{{['от 20к₽','от 40к₽','от 100к₽'][i]}}</small></button></div></div></div>
   </template>
   <section class="options-body">
    <h3 v-if="controller">Вид товара</h3>
    <div class="model-options"><template v-for="(model,i) in models" :key="i"><i v-if="!controller&&[4,7,10,13].includes(i)" class="model-break" aria-hidden="true"></i><button :style="{width:(!controller?[54,82,114,54,82,118,54,82,118,54,82,118,54,77,82,114][i]:[45,45,77,77,71,69][i])+'px'}" :class="{selected:active===i}" :aria-pressed="active===i" @click="selectModel(i)">{{model}}<i v-if="!controller&&badge(i)">{{badge(i)}}</i></button></template></div>
    <h3 v-if="controller" class="color-title">Цвет</h3>
    <div class="color-options">
     <div v-for="(color,i) in colors" :key="i" class="color-row"><div class="product-thumb" :style="thumb(i)" role="img" :aria-label="controller?'Цвет геймпада '+(i+1):color"></div><div class="color-copy"><span>{{color}}</span><small>Осталось {{stock[i]}}{{controller?'шт':' шт'}}</small></div><div class="counter"><button :disabled="rows[i]===0" :aria-label="'Уменьшить '+(i+1)" @click="change(i,-1)">−</button><output :aria-label="'Количество цвета '+(i+1)">{{rows[i]}}</output><button :disabled="rows[i]>=stock[i]" :aria-label="'Увеличить '+(i+1)" @click="change(i,1)">+</button></div></div>
    </div>
   </section>
   <footer class="selection-footer"><div class="selection-summary" aria-live="polite"><span>{{controller?'Выбран '+selectedModels+' вид '+count+'шт':'Выбрано '+count+' шт'}}</span><strong :class="{old:controller}">{{rub(total)}}</strong></div><div class="selection-actions"><template v-if="!controller"><button aria-label="Открыть магазин" @click="panel='store'"><VariantIcon name="store"/></button><button aria-label="В избранное" :aria-pressed="favorite" :class="{liked:favorite}" @click="favorite=!favorite"><VariantIcon name="heart"/></button><button aria-label="Открыть чат" @click="panel='chat'"><VariantIcon name="chat"/></button></template><button class="add-to-cart" :disabled="count===0" @click="cart">{{added?'Добавлено':'В корзину'}}</button></div></footer>
   <div v-if="panel" class="phone-overlay" @click.self="panel=''">
    <section class="phone-panel" role="dialog" :aria-label="panel==='cart'?'Ваш заказ':'Детали выбора'"><button class="close-panel" @click="panel=''" aria-label="Закрыть"><VariantIcon name="close"/></button>
     <template v-if="panel==='cart'"><h3>{{added?'Добавлено в корзину':'Ваш заказ'}}</h3><p>{{count}} шт. · {{selectedModels}} {{selectedModels===1?'модель':'модели'}}</p><strong class="panel-total">{{rub(total)}}</strong><button class="panel-action" @click="panel=''">Продолжить выбор</button></template>
     <template v-else-if="panel==='models'"><h3>Вид товара</h3><div class="panel-models"><button v-for="(model,i) in models" :key="i" @click="selectModel(i);panel=''">{{model}}</button></div></template>
     <template v-else-if="panel==='delivery'"><h3>Доставка</h3><p>Москва, Тверская улица</p><p>От 200 ₽ · 3 дня</p><button class="panel-action" @click="panel=''">Понятно</button></template>
     <template v-else-if="panel==='discount'"><h3>Цена от суммы</h3><p>Порог скидки зависит от суммы товаров в магазине. Нажмите на цену, чтобы посмотреть другой уровень.</p><button class="panel-action" @click="panel=''">Понятно</button></template>
     <template v-else-if="panel==='chat'"><h3>Вопрос продавцу</h3><textarea v-model="message" placeholder="Ваш вопрос о товаре" aria-label="Текст вопроса"></textarea><p>Текст остаётся в демонстрации.</p><button class="panel-action" @click="panel=''">Вернуться к выбору</button></template>
     <template v-else-if="panel==='store'"><h3>Магазин</h3><p>Модели, цвета и условия покупки доступны в этом макете.</p><button class="panel-action" @click="panel=''">К товару</button></template>
     <template v-else><h3>Ваш набор</h3><p>{{count}} шт. на {{rub(total)}}</p><button class="panel-action" @click="panel=''">Готово</button></template>
    </section>
   </div>
  </div>
 </div>
</template>
<style scoped src="./VariantPhone.css"></style>

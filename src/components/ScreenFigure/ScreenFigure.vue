<script setup>
import {computed} from 'vue';
import ScreenImage from '../ScreenImage/ScreenImage.vue';
import {getScreen} from '../../media.mjs';
const props=defineProps({item:{type:Object,required:true}});
const screen=computed(()=>getScreen(props.item.name));
</script>
<template>
 <figure class="screen-figure" :class="item.type" :style="{'--screen-original-width':screen.width+'px'}">
  <div class="screen-surface"><ScreenImage :name="item.name" :alt="item.alt"/></div>
 </figure>
</template>
<style scoped>
.screen-surface{overflow:hidden;border-radius:14px;background:#fff;box-shadow:0 8px 28px #2427350b,0 24px 64px -32px #24273524}
.screen-surface :deep(img){display:block;width:100%;height:auto}
.mobile .screen-surface{border-radius:22px}
@media(max-width:760px){.screen-surface{border-radius:10px}.mobile .screen-surface{border-radius:16px}}
</style>

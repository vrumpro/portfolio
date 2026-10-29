<script setup>
import {computed} from 'vue';
import {getScreen} from '../../media.mjs';
const props=defineProps({name:String,crop:Array,alt:String});
const screen=computed(()=>getScreen(props.name));
const style=computed(()=>({width:screen.value.width/props.crop[2]*100+'%',height:screen.value.height/props.crop[3]*100+'%',left:-props.crop[0]/props.crop[2]*100+'%',top:-props.crop[1]/props.crop[3]*100+'%'}));
</script>
<template><figure class="ui-detail" :style="{aspectRatio:crop[2]+'/'+crop[3]}"><img :src="screen.url" :alt="alt" :style="style" loading="lazy" draggable="false"/></figure></template>
<style scoped>
.ui-detail{position:relative;overflow:hidden;width:100%;margin:0;background:#fff;border-radius:18px;box-shadow:0 14px 40px #18224e12}
.ui-detail img{position:absolute;max-width:none;object-fit:fill;display:block}
</style>

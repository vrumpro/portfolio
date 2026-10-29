<script setup>
import {ref,onMounted} from 'vue';
import {previewCanvas} from './artwork.mjs';
import {projectPresentation} from '../../presentation.mjs';
const props=defineProps({project:Object}),url=ref('');
onMounted(async()=>{url.value=(await previewCanvas(props.project)).toDataURL('image/png');});
</script>
<template><div class="preview-cover" :style="{background:projectPresentation(project.slug).card}"><img v-if="url" :src="url" :alt="'Экраны '+project.brand" width="1366" height="844" draggable="false"/></div></template>
<style scoped>
.preview-cover{width:100%;height:100%;overflow:hidden}.preview-cover img{display:block;width:100%;height:100%;object-fit:cover}
</style>

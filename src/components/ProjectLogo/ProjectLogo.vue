<script setup>
import {projectPresentation} from '../../presentation.mjs';
import {logoURL,logoWidth} from '../ProjectGallery/artwork.mjs';
defineProps({project:Object,card:Boolean});
</script>
<template><div class="brand-cover" :style="card?{background:projectPresentation(project.slug).card}:undefined"><img :src="logoURL(project.slug)" :style="{width:logoWidth(project.slug)/1366*100+'%'}" :alt="project.brand" draggable="false"/></div></template>
<style scoped>
.brand-cover{display:grid;place-items:center;width:100%;height:100%;background:transparent}.brand-cover img{display:block;height:auto;max-height:86%;object-fit:contain;user-select:none}
</style>

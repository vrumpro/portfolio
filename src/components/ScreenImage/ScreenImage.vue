<script setup>
import { computed } from 'vue';
import { getScreen } from '../../media.mjs';

const props = defineProps({ name: { type: String, required: true }, alt: { type: String, required: true }, eager: Boolean });
const screen = computed(() => getScreen(props.name));
</script>

<template>
  <img :src="screen.url" :alt="alt" :width="screen.width" :height="screen.height" :loading="eager ? 'eager' : 'lazy'" decoding="async">
</template>

<script setup>
defineProps({name:String});
const paths={
 back:'M15 5 8 12l7 7M8 12h12',
 bag:'M5 8h14l1 12H4L5 8Zm3 0V5a4 4 0 0 1 8 0v3',
 share:'M12 16V3m-4 4 4-4 4 4M5 12v8h14v-8',
 store:'M3 10 5 3h14l2 7M3 10a3 3 0 0 0 6 0 3 3 0 0 0 6 0 3 3 0 0 0 6 0M5 13v8h14v-8M10 21v-6h4v6M9 3v7m6-7v7',
 heart:'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z',
 chat:'M21 11a9 9 0 0 1-9 9H3l1.6-4A9 9 0 1 1 21 11ZM8 11h.01M12 11h.01M16 11h.01',
 pin:'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
 close:'m6 6 12 12M6 18 18 6',
 chevron:'m9 5 7 7-7 7'
};
</script>
<template><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path :d="paths[name]||paths.bag" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></template>
<style scoped>svg{width:24px;height:24px;display:block}</style>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { getScreen } from '../../media.mjs';

const props = defineProps({ images: { type: Array, required: true } });
const store = computed(() => getScreen(props.images[0].name));
const details = computed(() => getScreen(props.images[1].name));
const root = ref(null);
const visible = ref(false);
const hidden = ref(false);
const reduced = ref(false);
const manual = ref(false);
const showDetails = ref(false);
const loaded = ref(0);
const running = computed(() => visible.value && !hidden.value && !manual.value && !reduced.value && loaded.value >= 2);
let observer, preference;

function syncVisibility() { hidden.value = document.hidden; }
function syncPreference() { reduced.value = preference.matches; }

function toggleDetails() {
  manual.value = true;
  showDetails.value = !showDetails.value;
}

onMounted(() => {
  preference = matchMedia('(prefers-reduced-motion: reduce)');
  syncPreference();
  syncVisibility();
  preference.addEventListener('change', syncPreference);
  document.addEventListener('visibilitychange', syncVisibility);
  observer = new IntersectionObserver(([entry]) => { visible.value = entry.isIntersecting; }, { threshold: .2 });
  observer.observe(root.value);
});
onBeforeUnmount(() => {
  observer?.disconnect();
  preference?.removeEventListener('change', syncPreference);
  document.removeEventListener('visibilitychange', syncVisibility);
});
</script>

<template>
  <div ref="root" class="store-animation" :class="{ 'is-running': running, 'is-manual': manual || reduced, 'show-details': showDetails }">
    <button type="button" class="demo-screen" :aria-label="showDetails ? 'Вернуться к странице магазина' : 'Открыть детали магазина'" :aria-pressed="showDetails" @click="toggleDetails">
      <img class="demo-store" :src="store.url" :width="store.width" :height="store.height" alt="" draggable="false" @load="loaded++">
      <span class="demo-dimmer" aria-hidden="true"></span><span class="demo-sheet"><span class="sheet-grip" aria-hidden="true"></span><img class="demo-details" :src="details.url" :width="details.width" :height="details.height" alt="" draggable="false" @load="loaded++"></span>
      <span class="demo-tap demo-tap-open" aria-hidden="true"></span>
      <span class="demo-tap demo-tap-back" aria-hidden="true"></span>
    </button>
  </div>
</template>

<style scoped src="./StoreDemo.css"></style>

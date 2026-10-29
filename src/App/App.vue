<script setup>
import { computed, nextTick, onMounted } from 'vue';
import { projectPresentation } from '../presentation.mjs';
import { cases } from '../cases.mjs';
import HomePage from '../pages/HomePage/HomePage.vue';
import CasePage from '../pages/CasePage/CasePage.vue';

import { useProjectNavigation } from './useProjectNavigation.mjs';

const props = defineProps({ caseSlug: { type: String, default: '' } });
const currentSlug = useProjectNavigation(props.caseSlug);
const project = computed(() => cases.find(item => item.slug === currentSlug.value));

onMounted(async () => {
  await nextTick();
  if (window.location.hash) {
    const id = decodeURIComponent(window.location.hash.slice(1));
    document.getElementById(id)?.scrollIntoView({ behavior: 'instant' });
  }
});
</script>

<template>
  <a class="skip-link" href="#main">К содержимому</a>
  <div class="page-surface" :class="{ 'case-surface': project, 'home-surface':!project }" :style="project?{'--project-surface':projectPresentation(project.slug).surface,'--project-background':projectPresentation(project.slug).background,'--project-header-ink':projectPresentation(project.slug).copy}:undefined">
  <header class="site-header wrap">
    <a class="identity" href="index.html" aria-label="Алексей Пашков — главная">{{project?'Все проекты':'Алексей Пашков'}}</a>
    <nav aria-label="Основная навигация">
      <a class="contact-link" href="https://t.me/alexpawkov" target="_blank" rel="noopener noreferrer">Телеграм</a>
    </nav>
  </header>
  <CasePage v-if="project" :key="project.slug" :project="project" />
  <HomePage v-else />
  </div>


</template>

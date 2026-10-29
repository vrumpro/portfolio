<script setup>
import { computed,ref } from 'vue';
import { cases } from '../../cases.mjs';
import ScreenImage from '../../components/ScreenImage/ScreenImage.vue';
import ScreenFigure from '../../components/ScreenFigure/ScreenFigure.vue';
import ScreenCompare from '../../components/ScreenCompare/ScreenCompare.vue';
import StoreDemo from '../../components/StoreDemo/StoreDemo.vue';
import SokolovCreative from '../../components/SokolovCreative/SokolovCreative.vue';
import WikkeoCreative from '../../components/WikkeoCreative/WikkeoCreative.vue';
import MeetingPhoto from '../../components/WikkeoCreative/MeetingPhoto.vue';
import CasePoster from '../../components/ProjectGallery/CasePoster.vue';
import ProjectLogo from '../../components/ProjectLogo/ProjectLogo.vue';

import {useCaseScroll} from './useCaseScroll.mjs';
const root=ref();
const props = defineProps({ project: { type: Object, required: true } });
const other = computed(() => cases[(cases.findIndex(item => item.slug === props.project.slug) + 1) % cases.length]);
const {openNext}=useCaseScroll(root,other);
const story = computed(() => props.project);
const fullScreenGroups = computed(() => story.value.fullScreenGroups);
</script>

<template>
  <main ref="root" id="main" class="case-page" tabindex="-1" :class="{ 'mobile-project': project.mobileOnly, 'desktop-project': project.desktopOnly, 'wikkeo-project':project.slug==='wikkeo' }">
    <article class="case-study-panel" aria-labelledby="case-title">
      <header class="case-cover">
        <h1 id="case-title" class="visually-hidden">{{project.brand}}</h1>
        <div class="case-cover-artwork"><ProjectLogo :project="project"/></div>
        <CasePoster :project="project" scroll-mode="hero"/>
        <a class="case-cover-more" href="#problem" aria-label="Перейти к содержанию кейса"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></a>
      </header>
      
      <section class="case-meta case-width" aria-label="Информация о проекте"><dl class="case-facts"><div><dt>Роль</dt><dd>{{project.role}}</dd></div><div><dt>Платформы</dt><dd>{{project.platforms}}</dd></div><div><dt>Задачи</dt><dd>{{project.focus}}</dd></div></dl></section>
      <section id="problem" class="case-context case-columns case-width">
        <h2 class="case-label">Задача</h2>
        <div><p class="case-statement">{{ story.problemTitle }}</p><p class="case-body">{{ story.problem }}</p><p class="case-body">{{ story.goal }}</p></div>
      </section>
      <section id="contribution" class="case-context case-columns case-width">
        <h2 class="case-label">Моя работа</h2>
        <div><p class="case-body">{{ story.collaboration }}</p><ul v-if="story.workSteps" class="work-steps"><li v-for="step in story.workSteps" :key="step">{{step}}</li></ul></div>
      </section>
      <section id="constraints" class="case-context case-columns case-width">
        <h2 class="case-label">Ограничения</h2>
        <div><p class="case-body">{{ story.constraint }}</p></div>
      </section>
      <section v-if="story.research" id="research" class="case-context case-columns case-width research-section"><div class="research-copy"><h2 class="case-label">{{ story.research.title }}</h2><p class="case-body">{{ story.research.text }}</p></div><MeetingPhoto v-if="project.slug==='wikkeo'"/></section>
      <div id="decisions" class="case-solutions case-width">
        <section v-for="decision in story.decisions" :key="decision.title" class="case-decision case-columns" :class="{ 'interactive-desktop': decision.layout === 'versta-demo' }">
          <div class="case-decision-copy">
            <h2>{{ decision.title }}</h2><p>{{ decision.text }}</p>
          </div>
          <div class="case-visual">
            <WikkeoCreative v-if="project.slug==='wikkeo'" :decision="decision"/>
            <SokolovCreative v-else-if="project.slug==='sokolov' && ['price-detail','purchase-states'].includes(decision.layout)" :decision="decision"/>
            <div v-else class="case-media" :class="decision.layout">
              
              <ScreenCompare v-if="decision.layout === 'comparison'" :images="decision.images" :label="decision.title" />
              <StoreDemo v-else-if="decision.layout === 'store-demo'" :images="decision.images" />
              <template v-else><ScreenFigure v-for="item in decision.images" :key="item.name" :item="item" /></template>
            </div>
          </div>
        </section>
      </div>
      <section v-if="fullScreenGroups?.length" id="full-screens" class="case-complete case-width">
        <div class="case-columns"><h2>Экраны целиком</h2></div>
        <div v-for="group in fullScreenGroups" :key="group.title" class="case-screen-group">
          <h3>{{ group.title }}</h3>
          <div class="case-complete-images" :class="{ 'single-screen': group.images.length === 1 }"><ScreenFigure v-for="item in group.images" :key="item.name" :item="item" class="full-screen" :class="item.type" /></div>
        </div>
      </section>
      <section id="result" class="case-context case-columns case-width">
        <h2 class="case-label">Результат</h2>
        <div>
          <p class="case-statement">{{ story.conclusion }}</p><p class="case-body">{{ story.result }}</p>
        </div>
      </section>
    </article>
    <section class="project-next case-width" aria-label="Следующий проект">
      <a :href="other.slug+'.html'" class="project-next-link" @click="openNext">
        
        <div class="project-next-copy"><h2>{{other.brand}}</h2><span>Следующий кейс</span></div>
        <span class="next-countdown" aria-label="Открыть следующий кейс"><svg class="countdown-ring" viewBox="0 0 64 64" fill="none" aria-hidden="true"><circle class="countdown-track" cx="32" cy="32" r="29"/><circle class="countdown-fill" cx="32" cy="32" r="29" pathLength="100"/></svg><svg class="countdown-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 4v15m-6-6 6 6 6-6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      </a>
    </section>
  </main>
</template>

<style scoped src="./CasePage.css"></style>
<style scoped src="./ReferenceCase.css"></style>

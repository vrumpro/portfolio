import { createApp } from 'vue';
import App from './src/App/App.vue';
import './styles.css';
import './src/styles/typography.css';
import './src/styles/spacing.css';

const element = document.getElementById('app');
createApp(App, { caseSlug: element.dataset.case || '' }).mount(element);

import {finishPreloader} from './src/preloader.mjs';
finishPreloader();

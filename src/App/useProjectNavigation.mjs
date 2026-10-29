import { onMounted, onBeforeUnmount, nextTick, ref } from 'vue';
import { cases } from '../cases.mjs';
import {runCaseTransition} from './caseTransition.mjs';

export function useProjectNavigation(initial) {
  const slug = ref(initial);
  let navigating = false;
  let pendingNavigation;
  const fromPath = path => cases.find(p => path.endsWith(`/${p.slug}.html`))?.slug || '';
  async function render(url, push) {
    if (navigating) { pendingNavigation = { url, push }; return; }
    navigating = true;
    const from = cases.find(p => p.slug === slug.value);
    const to = cases.find(p => p.slug === fromPath(url.pathname));
    const update = async () => {
      const previousSlug = slug.value;
      slug.value = fromPath(url.pathname);
      if (push) history.pushState(slug.value ? {} : { selectedProject: previousSlug || history.state?.selectedProject }, '', url);
      const project = cases.find(p => p.slug === slug.value);
      document.title = project ? `${project.brand} — ${project.title} · Алексей Пашков` : 'Алексей Пашков — Product Designer';
      document.body.className = project ? `case-page ${project.theme}` : '';
      await nextTick();
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (url.hash) document.getElementById(decodeURIComponent(url.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' });
      document.querySelector('#app>.page-surface main')?.focus({ preventScroll: true });
    };
    try {
      await runCaseTransition(update, from, to);
    } finally {
      navigating = false;
      if (pendingNavigation) { const pending = pendingNavigation; pendingNavigation = null; render(pending.url, pending.push); }
    }
  }
  function click(event) {
    const link = event.target.closest?.('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target || link.hasAttribute('download')) return;
    const url = new URL(link.href);
    if (url.origin !== location.origin || url.pathname.substring(0, url.pathname.lastIndexOf('/') + 1) !== location.pathname.substring(0, location.pathname.lastIndexOf('/') + 1)) return;
    if (!['index.html', ...cases.map(p => `${p.slug}.html`)].includes(url.pathname.split('/').pop())) return;
    if (url.pathname === location.pathname) return;
    event.preventDefault(); render(url, true);
  }
  function nextCase(event) { render(new URL(event.detail.href, location.href), true); }
  function pop() { if (fromPath(location.pathname) !== slug.value) render(new URL(location.href), false); }
  onMounted(() => { document.addEventListener('click', click); window.addEventListener('portfolio:next-case', nextCase); window.addEventListener('popstate', pop); });
  onBeforeUnmount(() => { document.removeEventListener('click', click); window.removeEventListener('portfolio:next-case', nextCase); window.removeEventListener('popstate', pop); });
  return slug;
}

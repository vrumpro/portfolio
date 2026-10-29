import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

export function useCaseStudies(project) {
  const studies = project.studies || [];
  const readSelection = () => {
    const id = new URLSearchParams(window.location.search).get('case');
    return studies.find(study => study.id === id)?.id || studies[0]?.id || '';
  };
  const selectedStudy = ref(readSelection());
  const story = computed(() => studies.find(study => study.id === selectedStudy.value) || project);
  const syncHistory = () => { selectedStudy.value = readSelection(); };

  function selectStudy(id) {
    if (id === selectedStudy.value || !studies.some(study => study.id === id)) return false;
    const url = new URL(window.location.href);
    url.searchParams.set('case', id);
    url.hash = '';
    window.history.pushState(null, '', url);
    selectedStudy.value = id;
    return true;
  }

  onMounted(() => { if (studies.length) window.addEventListener('popstate', syncHistory); });
  onBeforeUnmount(() => window.removeEventListener('popstate', syncHistory));
  return { story, selectedStudy, selectStudy };
}


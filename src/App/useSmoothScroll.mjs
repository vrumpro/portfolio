import { onBeforeUnmount, onMounted } from 'vue';

// Smooth the document wheel only. Touch, keyboard, nested scrolling and dialogs
// keep their native behavior, and no content is moved with transforms.
export function useSmoothScroll() {
  let dispose;
  onMounted(() => {
    const root = document.documentElement;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = matchMedia('(pointer: fine)');
    let frame = 0, current = scrollY, target = scrollY, written = scrollY, previousTime = 0;
    const limit = () => Math.max(0, root.scrollHeight - innerHeight);
    const blocked = () => reducedMotion.matches || !finePointer.matches ||
      document.body.classList.contains('viewer-open') || !!document.querySelector('dialog[open]');

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      current = target = written = scrollY;
      root.classList.remove('is-smoothing');
    }

    function step(time) {
      if (blocked() || Math.abs(scrollY - written) > 2) { stop(); return; }
      const elapsed = Math.min(time - previousTime, 64);
      previousTime = time;
      target = Math.max(0, Math.min(target, limit()));
      current += (target - current) * (1 - Math.exp(-elapsed / 130));
      const done = Math.abs(target - current) < .5;
      if (done) current = target;
      window.scrollTo({ top: current, behavior: 'instant' });
      written = scrollY;
      if (done) stop();
      else frame = requestAnimationFrame(step);
    }

    function usesInnerScroll(event, delta) {
      return event.composedPath().some(element => {
        if (!(element instanceof HTMLElement) || element === document.body || element === root) return false;
        const style = getComputedStyle(element);
        if (!/(auto|scroll|overlay)/.test(style.overflowY) || element.scrollHeight <= element.clientHeight) return false;
        return style.overscrollBehaviorY !== 'auto' || (delta < 0 ? element.scrollTop > 0 :
          element.scrollTop + element.clientHeight < element.scrollHeight - 1);
      });
    }

    function wheel(event) {
      if (event.defaultPrevented || !event.cancelable || blocked() || event.ctrlKey || event.metaKey ||
        event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY) || !event.deltaY) { stop(); return; }
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
      if (usesInnerScroll(event, delta)) { stop(); return; }
      if (!frame) current = target = written = scrollY;
      target = Math.max(0, Math.min(target + delta, limit()));
      if (Math.abs(target - current) < .5) { stop(); return; }
      event.preventDefault();
      if (!frame) {
        root.classList.add('is-smoothing');
        previousTime = performance.now();
        frame = requestAnimationFrame(step);
      }
    }

    window.addEventListener('wheel', wheel, { passive: false });
    for (const event of ['pointerdown', 'touchstart', 'keydown', 'click', 'resize', 'hashchange', 'popstate']) {
      window.addEventListener(event, stop, { passive: true });
    }
    document.addEventListener('visibilitychange', stop);
    reducedMotion.addEventListener('change', stop);
    finePointer.addEventListener('change', stop);
    dispose = () => {
      stop();
      window.removeEventListener('wheel', wheel);
      for (const event of ['pointerdown', 'touchstart', 'keydown', 'click', 'resize', 'hashchange', 'popstate']) window.removeEventListener(event, stop);
      document.removeEventListener('visibilitychange', stop);
      reducedMotion.removeEventListener('change', stop);
      finePointer.removeEventListener('change', stop);
    };
  });
  onBeforeUnmount(() => dispose?.());
}

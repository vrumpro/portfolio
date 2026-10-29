import { onBeforeUnmount } from 'vue';

export function useCardMotion() {
  let frame = 0;
  let activeCard;
  let position = { x: 0, y: 0 };

  function moveCard(event) {
    if (event.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    activeCard = event.currentTarget;
    const rect = activeCard.getBoundingClientRect();
    position = {
      x: Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)),
      y: Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))
    };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      activeCard?.style.setProperty('--pointer-x', position.x.toFixed(3));
      activeCard?.style.setProperty('--pointer-y', position.y.toFixed(3));
      frame = 0;
    });
  }

  function resetCard(event) {
    cancelAnimationFrame(frame); frame = 0;
    event.currentTarget.style.setProperty('--pointer-x', '0');
    event.currentTarget.style.setProperty('--pointer-y', '0');
    activeCard = null;
  }

  onBeforeUnmount(() => cancelAnimationFrame(frame));
  return { moveCard, resetCard };
}

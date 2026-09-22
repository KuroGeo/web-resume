document.querySelector('[data-print]')?.addEventListener('click', () => window.print());

// Keep the card level; only the light, shadow and 1.022 hover scale move.
const card = document.querySelector('.identity-badge');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const clearCardLight = () => {
  for (const property of ['--pointer-x', '--pointer-y', '--glare', '--hover-shadow']) {
    card?.style.removeProperty(property);
  }
};
card?.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse' || reduceMotion.matches) return;
  const bounds = card.getBoundingClientRect();
  const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left - bounds.width / 2) / (bounds.width * .8)));
  const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top - bounds.height / 2) / (bounds.height * .65)));
  card.style.setProperty('--pointer-x', `${50 + x * 50}%`);
  card.style.setProperty('--pointer-y', `${50 + y * 50}%`);
  card.style.setProperty('--glare', String(.035 + Math.min(1, Math.hypot(x, y)) * .245));
  card.style.setProperty('--hover-shadow', `${-x * 13}px ${20 + y * 10}px 48px -23px rgb(34 35 33 / 48%)`);
}, { passive: true });
card?.addEventListener('pointerleave', clearCardLight);
card?.addEventListener('pointercancel', clearCardLight);
window.addEventListener('blur', clearCardLight);
reduceMotion.addEventListener('change', clearCardLight);

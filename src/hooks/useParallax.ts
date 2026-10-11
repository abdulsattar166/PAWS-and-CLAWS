import { useEffect, useRef } from 'react';

/**
 * Lightweight, performance-friendly parallax.
 * Writes the scroll offset into a `--parallax-y` CSS variable on the element,
 * so any base transform (e.g. scale) defined in CSS is preserved.
 */
export function useParallax<T extends HTMLElement>(speed = 0.08) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Measure the (un-translated) parent so the element moving itself never
    // causes a feedback loop or jitter.
    const target = el.parentElement ?? el;
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = target.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * -speed;
      el.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return ref;
}
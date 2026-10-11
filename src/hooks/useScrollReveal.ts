import { useCallback, useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

/**
 * Reveals an element as it scrolls into view.
 *
 * Uses a *callback ref* so the element is observed the moment it mounts — even
 * when it renders conditionally after async data loads (reviews, gallery, …).
 * A plain `useRef` would miss that case and leave the content stuck at
 * `opacity: 0`, which is why sections used to disappear.
 *
 * Also reveals anything already on screen at mount and falls back to visible
 * when IntersectionObserver is unavailable, so content can never stay hidden.
 */
export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0, rootMargin = '0px 0px -40px 0px', once = true } = options;
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (el: HTMLElement | null) => {
      // Clean up any observer from a previous node.
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      if (!el || typeof window === 'undefined') return;

      // Anything already within (or above) the viewport shows immediately.
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const rect = el.getBoundingClientRect();
      if (rect.top < viewportHeight && rect.bottom > 0) {
        setIsVisible(true);
        if (once) return;
      }

      if (typeof IntersectionObserver === 'undefined') {
        setIsVisible(true);
        return;
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setIsVisible(false);
          }
        },
        { threshold, rootMargin },
      );

      observer.observe(el);
      observerRef.current = observer;
    },
    [threshold, rootMargin, once],
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return { ref, isVisible };
}

export function useStaggerReveal(itemCount: number, options?: UseScrollRevealOptions) {
  const { ref, isVisible } = useScrollReveal(options);

  const getItemStyle = useCallback(
    (index: number): React.CSSProperties => ({
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 80}ms, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${index * 80}ms`,
    }),
    [isVisible]
  );

  return { ref, isVisible, getItemStyle };
}

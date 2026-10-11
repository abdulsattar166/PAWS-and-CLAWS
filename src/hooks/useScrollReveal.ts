import { useEffect, useRef, useState, useCallback } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const { threshold = 0.12, rootMargin = '0px 0px -40px 0px', once = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

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
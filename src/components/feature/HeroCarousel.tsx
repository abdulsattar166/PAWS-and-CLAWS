import { useState, useEffect, useCallback, useRef } from 'react';

interface HeroSlide {
  image: string;
  alt: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  interval?: number;
  children: React.ReactNode;
}

export default function HeroCarousel({ slides, interval = 5000, children }: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [prevSlide, setPrevSlide] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isHovered = useRef(false);
  const isTouchDevice = useRef(false);

  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  const goTo = useCallback((index: number) => {
    if (index === current) return;
    setPrevSlide(current);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setPrevSlide(current);
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [current, slides.length]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isHovered.current) {
        setPrevSlide((prev) => prev ?? 0);
        setCurrent((prev) => (prev + 1) % slides.length);
      }
    }, interval);
  }, [interval, slides.length]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  // Touch swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        setPrevSlide(current);
        setCurrent((prev) => (prev + 1) % slides.length);
      } else {
        setPrevSlide(current);
        setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
      }
    }
  };

  return (
    <section
      className="relative pt-28 pb-16 md:pt-48 md:pb-28 px-4 md:px-10 overflow-hidden hero-carousel-mobile"
      onMouseEnter={() => { isHovered.current = true; }}
      onMouseLeave={() => { isHovered.current = false; }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel slides */}
      {slides.map((slide, i) => {
        const isCurrent = i === current;
        const isLeaving = i === prevSlide;
        return (
          <div
            key={i}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ease-in-out ${
              isCurrent ? 'opacity-100 z-[1]' : 'opacity-0 z-0'
            } ${isLeaving && !isCurrent ? 'opacity-0' : ''}`}
          >
            <img
              src={slide.image}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
            />
          </div>
        );
      })}

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-background-50/90 via-background-50/80 to-background-50/95"></div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {children}
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-500 cursor-pointer ${
                i === current
                  ? 'w-8 h-2 bg-foreground-950'
                  : 'w-2 h-2 bg-foreground-950/40 hover:bg-foreground-950/70'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
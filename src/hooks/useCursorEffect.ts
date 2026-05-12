import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';

interface Ripple {
  x: number;
  y: number;
  element: HTMLDivElement;
}

export function useCursorEffect() {
  const ripplesRef = useRef<Ripple[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastRippleTime = useRef(0);

  const createRipple = useCallback((x: number, y: number) => {
    const now = Date.now();
    // Throttle ripple creation
    if (now - lastRippleTime.current < 100) return;
    lastRippleTime.current = now;

    if (!containerRef.current) {
      containerRef.current = document.createElement('div');
      containerRef.current.className = 'cursor-ripple-container';
      containerRef.current.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        overflow: hidden;
      `;
      document.body.appendChild(containerRef.current);
    }

    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border: 1px solid rgba(135, 206, 235, 0.4);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    `;

    containerRef.current.appendChild(ripple);

    const rippleObj: Ripple = { x, y, element: ripple };
    ripplesRef.current.push(rippleObj);

    // Animate ripple
    gsap.to(ripple, {
      width: 80,
      height: 80,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      onComplete: () => {
        ripple.remove();
        ripplesRef.current = ripplesRef.current.filter(r => r !== rippleObj);
      },
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      createRipple(e.clientX, e.clientY);
    };

    // Only enable on non-touch devices
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (!isTouchDevice) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
    };
  }, [createRipple]);

  return { createRipple };
}

export default useCursorEffect;

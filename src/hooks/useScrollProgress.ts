import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollProgressState {
  progress: number;
  depthProgress: number; // 0 = surface, 1 = abyss
  currentSection: string;
}

export function useScrollProgress() {
  const [state, setState] = useState<ScrollProgressState>({
    progress: 0,
    depthProgress: 0,
    currentSection: 'hero',
  });
  
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    // Main scroll progress tracker
    const mainTrigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onUpdate: (self) => {
        setState(prev => ({
          ...prev,
          progress: self.progress,
          depthProgress: Math.min(1, self.progress * 1.2),
        }));
      },
    });
    
    triggersRef.current.push(mainTrigger);

    // Section tracking
    const sections = ['hero', 'creatures', 'explore'];
    
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        const trigger = ScrollTrigger.create({
          trigger: element,
          start: 'top center',
          end: 'bottom center',
          onEnter: () => {
            setState(prev => ({ ...prev, currentSection: sectionId }));
          },
          onEnterBack: () => {
            setState(prev => ({ ...prev, currentSection: sectionId }));
          },
        });
        triggersRef.current.push(trigger);
      }
    });

    return () => {
      triggersRef.current.forEach(trigger => trigger.kill());
      triggersRef.current = [];
    };
  }, []);

  return state;
}

export default useScrollProgress;

import { useEffect, useMemo, useState } from 'react';
import { Box, CheckCircle2, MousePointer2, Rotate3D, ScrollText } from 'lucide-react';

import { PandaEarShowcase } from './components/three/PandaEarShowcase';
import { useLenis } from './hooks/useLenis';

type PointerPose = {
  x: number;
  y: number;
};

const packFacts = [
  'Open glossy white charging case',
  'Black concave lid and tray sockets',
  'Panda eye patches, nose, mouth, and LED',
  'Two loose earbuds with black rubber tips',
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? clamp(window.scrollY / scrollable) : 0);
    };

    const requestMeasure = () => {
      if (frame) {
        return;
      }

      frame = window.requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    measure();
    window.addEventListener('scroll', requestMeasure, { passive: true });
    window.addEventListener('resize', requestMeasure);

    return () => {
      window.removeEventListener('scroll', requestMeasure);
      window.removeEventListener('resize', requestMeasure);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return progress;
}

function usePointerPose() {
  const [pointer, setPointer] = useState<PointerPose>({ x: 0, y: 0 });

  useEffect(() => {
    let frame = 0;
    let target = { x: 0, y: 0 };

    const update = (event: PointerEvent) => {
      target = {
        x: clamp(event.clientX / window.innerWidth, 0, 1) * 2 - 1,
        y: clamp(event.clientY / window.innerHeight, 0, 1) * 2 - 1,
      };

      if (!frame) {
        frame = window.requestAnimationFrame(() => {
          frame = 0;
          setPointer(target);
        });
      }
    };

    window.addEventListener('pointermove', update, { passive: true });

    return () => {
      window.removeEventListener('pointermove', update);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return pointer;
}

function App() {
  useLenis();
  const scrollProgress = useScrollProgress();
  const pointer = usePointerPose();

  const progressLabel = useMemo(
    () => `${Math.round(scrollProgress * 100).toString().padStart(2, '0')}%`,
    [scrollProgress],
  );

  return (
    <div className="model-page">
      <div className="model-stage" aria-label="Live Panda Ear 3D model">
        <PandaEarShowcase pointer={pointer} scrollProgress={scrollProgress} />
      </div>

      <header className="model-header">
        <a className="brand-mark" href="#top" aria-label="Panda Ear 3D model home">
          <span className="brand-face" />
          <span>Panda Ear 3D</span>
        </a>
        <div className="model-status">
          <CheckCircle2 aria-hidden="true" size={17} />
          Live procedural model
        </div>
      </header>

      <main id="top" className="model-copy">
        <section className="model-hero">
          <p className="eyebrow">Aura Image 3DModel Perfect</p>
          <h1>Reference-pack reconstruction</h1>
          <p>
            Built from the `panda-ear-earbuds-image2base3d-pack.zip` source:
            the open panda charging case, glossy black inner tray, face graphics,
            and two loose earbuds are separated into individual 3D parts.
          </p>
          <div className="control-row">
            <span>
              <MousePointer2 aria-hidden="true" size={18} />
              Move pointer to tilt
            </span>
            <span>
              <ScrollText aria-hidden="true" size={18} />
              Scroll to turn
            </span>
            <span>
              <Rotate3D aria-hidden="true" size={18} />
              Drag to orbit
            </span>
          </div>
        </section>

        <section className="pack-panel">
          <div>
            <p className="eyebrow">Model parts</p>
            <ul>
              {packFacts.map((fact) => (
                <li key={fact}>
                  <Box aria-hidden="true" size={17} />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
          <div className="source-thumb">
            <img src="/assets/panda-ear-pack-front.jpg" alt="Panda Ear source reference from Image2Base3D pack" />
          </div>
        </section>

        <section className="pack-panel final-panel">
          <p className="eyebrow">Fidelity note</p>
          <p>
            This is a browser-ready procedural reconstruction, not a scanned or
            Meshy/Blender-generated GLB. Rear hinge, underside, and exact socket
            depth remain inferred because the pack contains one real front view.
          </p>
        </section>
      </main>

      <div className="progress-meter" aria-hidden="true">
        <span>{progressLabel}</span>
        <i>
          <b style={{ transform: `scaleY(${Math.max(0.04, scrollProgress)})` }} />
        </i>
      </div>
    </div>
  );
}

export default App;

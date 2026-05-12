import { Suspense, lazy, useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';

const LiveFireElements = lazy(() =>
  import('./LiveFireElements').then((module) => ({ default: module.LiveFireElements }))
);

interface PhoenixBackdropProps {
  scrollProgress: number;
  onReady?: () => void;
}

const PHOENIX_UID = '243fea4f846f44d18d37bf371272b7ec';

function getPhoenixEmbedUrl() {
  const params = new URLSearchParams({
    autostart: '1',
    preload: '1',
    autospin: '0.22',
    transparent: '1',
    ui_animations: '0',
    ui_annotations: '0',
    ui_controls: '0',
    ui_fullscreen: '0',
    ui_help: '0',
    ui_infos: '0',
    ui_inspector: '0',
    ui_settings: '0',
    ui_stop: '0',
    ui_vr: '0',
    ui_watermark: '0',
  });

  return `https://sketchfab.com/models/${PHOENIX_UID}/embed?${params.toString()}`;
}

export function PhoenixBackdrop({ scrollProgress, onReady }: PhoenixBackdropProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const embedUrl = useMemo(() => getPhoenixEmbedUrl(), []);

  useEffect(() => {
    let frame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      targetRef.current.x = Math.max(-0.5, Math.min(0.5, event.clientX / window.innerWidth - 0.5));
      targetRef.current.y = Math.max(-0.5, Math.min(0.5, event.clientY / window.innerHeight - 0.5));
    };

    const animatePointer = () => {
      const target = targetRef.current;
      const current = currentRef.current;
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;

      backdropRef.current?.style.setProperty('--phoenix-mouse-x', `${current.x * 30}px`);
      backdropRef.current?.style.setProperty('--phoenix-mouse-y', `${current.y * 20}px`);
      backdropRef.current?.style.setProperty('--phoenix-tilt-x', `${current.y * -1.15}deg`);
      backdropRef.current?.style.setProperty('--phoenix-tilt-y', `${current.x * 1.55}deg`);

      frame = window.requestAnimationFrame(animatePointer);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    frame = window.requestAnimationFrame(animatePointer);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={backdropRef}
      className="phoenix-backdrop"
      style={
        {
          '--phoenix-depth': scrollProgress,
          '--phoenix-rise': `${scrollProgress * -16}vh`,
          '--phoenix-shift': `${Math.sin(scrollProgress * Math.PI) * 10}vw`,
          '--phoenix-mouse-x': '0px',
          '--phoenix-mouse-y': '0px',
          '--phoenix-tilt-x': '0deg',
          '--phoenix-tilt-y': '0deg',
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div className="phoenix-depth-field" />
      <Suspense fallback={null}>
        <LiveFireElements />
      </Suspense>
      <div className="phoenix-atmosphere" />
      <div className="phoenix-ember-field" />
      <div className="phoenix-iframe-shell">
        <div className="phoenix-flight-model">
          <iframe
            title="Phoenix by NORBERTO-3D on Sketchfab"
            src={embedUrl}
            allow="autoplay; fullscreen; xr-spatial-tracking"
            loading="eager"
            onLoad={onReady}
          />
        </div>
      </div>
    </div>
  );
}

export default PhoenixBackdrop;

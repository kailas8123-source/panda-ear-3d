import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

interface SketchfabSharkBackdropProps {
  depthProgress: number;
  onReady?: () => void;
}

const SKETCHFAB_SHARK_UID = 'e913e5092d2341749ff66e4359b1e4a3';

export function getSketchfabSharkEmbedUrl(autospin = 0.16) {
  const params = new URLSearchParams({
    autostart: '1',
    preload: '1',
    autospin: String(autospin),
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

  return `https://sketchfab.com/models/${SKETCHFAB_SHARK_UID}/embed?${params.toString()}`;
}

export function SketchfabSharkBackdrop({ depthProgress, onReady }: SketchfabSharkBackdropProps) {
  const embedUrl = useMemo(() => getSketchfabSharkEmbedUrl(), []);
  const [isLoaded, setIsLoaded] = useState(false);
  const swimX = -18 + Math.sin(depthProgress * Math.PI * 1.7) * 22 + depthProgress * 22;
  const swimY = 4 - depthProgress * 19 + Math.cos(depthProgress * Math.PI * 2.2) * 6;
  const scale = 1.02 + depthProgress * 0.24;
  const opacity = 0.78 - depthProgress * 0.12;

  return (
    <div
      className={`sketchfab-shark-backdrop ${isLoaded ? 'is-loaded' : ''}`}
      style={
        {
          '--shark-x': `${swimX}vw`,
          '--shark-y': `${swimY}vh`,
          '--shark-scale': scale,
          '--shark-opacity': opacity,
        } as CSSProperties
      }
      aria-hidden="true"
    >
      <div className="sketchfab-ocean-light" />
      <div className="sketchfab-shark-frame">
        <iframe
          title="Realistic Shark by MotionStreamStudios on Sketchfab"
          src={embedUrl}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          loading="eager"
          onLoad={() => {
            setIsLoaded(true);
            onReady?.();
          }}
        />
      </div>
      <div className="sketchfab-shark-glow sketchfab-shark-glow-one" />
      <div className="sketchfab-shark-glow sketchfab-shark-glow-two" />
    </div>
  );
}

export default SketchfabSharkBackdrop;

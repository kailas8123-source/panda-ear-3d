import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferGeometry, Color, MathUtils, Points } from 'three';

const PARTICLE_COUNT = 360;

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(query.matches);

    updatePreference();
    query.addEventListener('change', updatePreference);

    return () => query.removeEventListener('change', updatePreference);
  }, []);

  return reducedMotion;
}

function FireParticles() {
  const pointsRef = useRef<Points>(null);
  const geometryRef = useRef<BufferGeometry>(null);
  const smoothMouseRef = useRef({ x: 0, y: 0 });

  const { positions, colors, seeds } = useMemo(() => {
    const positionArray = new Float32Array(PARTICLE_COUNT * 3);
    const colorArray = new Float32Array(PARTICLE_COUNT * 3);
    const seedArray = new Float32Array(PARTICLE_COUNT * 4);
    const low = new Color('#ff4512');
    const mid = new Color('#ffb84d');
    const high = new Color('#fff0b8');

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const stride = index * 3;
      const seedStride = index * 4;
      const radius = 0.28 + Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      const height = Math.random();
      const side = Math.random() > 0.5 ? 1 : -1;

      seedArray[seedStride] = radius;
      seedArray[seedStride + 1] = angle;
      seedArray[seedStride + 2] = height;
      seedArray[seedStride + 3] = side;

      positionArray[stride] = Math.cos(angle) * radius * 0.62 + side * 1.6;
      positionArray[stride + 1] = -2.4 + height * 4.8;
      positionArray[stride + 2] = -2.4 - Math.random() * 2.6;

      const flameColor = height > 0.74 ? high : height > 0.36 ? mid : low;
      colorArray[stride] = flameColor.r;
      colorArray[stride + 1] = flameColor.g;
      colorArray[stride + 2] = flameColor.b;
    }

    return { positions: positionArray, colors: colorArray, seeds: seedArray };
  }, []);

  useFrame(({ clock, mouse }, delta) => {
    const elapsed = clock.getElapsedTime();
    const positionAttribute = geometryRef.current?.attributes.position;

    if (!positionAttribute) return;

    smoothMouseRef.current.x = MathUtils.damp(smoothMouseRef.current.x, mouse.x, 3.8, delta);
    smoothMouseRef.current.y = MathUtils.damp(smoothMouseRef.current.y, mouse.y, 3.8, delta);

    const array = positionAttribute.array as Float32Array;

    for (let index = 0; index < PARTICLE_COUNT; index += 1) {
      const stride = index * 3;
      const seedStride = index * 4;
      const radius = seeds[seedStride];
      const angle = seeds[seedStride + 1];
      const heightSeed = seeds[seedStride + 2];
      const side = seeds[seedStride + 3];
      const rise = (heightSeed + elapsed * (0.055 + radius * 0.006)) % 1;
      const twist = angle + elapsed * 0.38 + rise * 2.4;
      const narrow = 1 - rise * 0.72;

      array[stride] = Math.cos(twist) * radius * narrow + side * (1.35 + smoothMouseRef.current.x * 0.24);
      array[stride + 1] = -2.55 + rise * 5.4 + Math.sin(elapsed + angle) * 0.08;
      array[stride + 2] = -2.8 - Math.sin(twist * 1.7) * 0.9 + smoothMouseRef.current.y * 0.18;
    }

    positionAttribute.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = smoothMouseRef.current.x * 0.14;
      pointsRef.current.rotation.x = -smoothMouseRef.current.y * 0.07;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        transparent
        opacity={0.82}
        depthWrite={false}
        blending={AdditiveBlending}
        size={0.095}
        sizeAttenuation
      />
    </points>
  );
}

export function LiveFireElements() {
  const reducedMotion = usePrefersReducedMotion();

  if (reducedMotion) return null;

  return (
    <Canvas
      className="phoenix-fire-canvas"
      camera={{ position: [0, 0.15, 6.4], fov: 46 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.8} />
      <FireParticles />
    </Canvas>
  );
}

export default LiveFireElements;

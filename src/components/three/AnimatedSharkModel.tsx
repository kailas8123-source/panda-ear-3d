import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import type { RefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedSharkModelProps {
  depthProgress: number;
  mousePosition: RefObject<{ x: number; y: number }>;
  onReady?: () => void;
}

const SHARK_MODEL_URL = '/models/babylon-shark.glb';

export function AnimatedSharkModel({ depthProgress, mousePosition, onReady }: AnimatedSharkModelProps) {
  const rootRef = useRef<THREE.Group>(null);
  const modelRef = useRef<THREE.Group>(null);
  const readyRef = useRef(false);
  const { scene, animations } = useGLTF(SHARK_MODEL_URL);
  const { actions } = useAnimations(animations, modelRef);

  const normalizedScene = useMemo(() => scene, [scene]);

  useLayoutEffect(() => {
    if (!modelRef.current) return;

    const box = new THREE.Box3().setFromObject(modelRef.current);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxAxis = Math.max(size.x, size.y, size.z) || 1;
    const scale = 6.1 / maxAxis;

    modelRef.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
    modelRef.current.scale.setScalar(scale);
    modelRef.current.rotation.set(0, -Math.PI / 2, 0);

    modelRef.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.frustumCulled = false;
      child.castShadow = false;
      child.receiveShadow = false;

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if ('roughness' in material) material.roughness = Math.min(0.72, material.roughness + 0.12);
        if ('metalness' in material) material.metalness = Math.min(0.08, material.metalness);
        material.needsUpdate = true;
      });
    });

    if (!readyRef.current) {
      readyRef.current = true;
      onReady?.();
    }
  }, [normalizedScene, onReady]);

  useEffect(() => {
    const swimming = actions.swimming ?? actions.Swimming ?? Object.values(actions)[0];
    swimming?.reset().fadeIn(0.5).play();

    return () => {
      swimming?.fadeOut(0.25);
    };
  }, [actions]);

  useFrame((state, delta) => {
    if (!rootRef.current) return;

    const t = state.clock.elapsedTime;
    const progress = THREE.MathUtils.clamp(depthProgress, 0, 1);
    const pointer = mousePosition.current;
    const path = t * 0.22 + progress * Math.PI * 1.45;
    const target = new THREE.Vector3(
      Math.sin(path) * 3.2 + pointer.x * 0.42,
      THREE.MathUtils.lerp(1.05, -1.1, progress) + Math.cos(path * 1.35) * 0.4 + pointer.y * 0.22,
      -3.35 - progress * 1.0 + Math.cos(path * 0.72) * 0.55,
    );

    rootRef.current.position.lerp(target, 1 - Math.exp(-delta * 1.7));

    const targetYaw = THREE.MathUtils.lerp(-0.72, 0.72, (Math.sin(path + 0.45) + 1) / 2) + pointer.x * 0.08;
    const targetPitch = Math.sin(path * 1.2) * 0.06 + pointer.y * 0.035;
    const targetRoll = -Math.sin(path) * 0.08;

    rootRef.current.rotation.y = THREE.MathUtils.damp(rootRef.current.rotation.y, targetYaw, 1.9, delta);
    rootRef.current.rotation.x = THREE.MathUtils.damp(rootRef.current.rotation.x, targetPitch, 1.9, delta);
    rootRef.current.rotation.z = THREE.MathUtils.damp(rootRef.current.rotation.z, targetRoll, 1.9, delta);
  });

  return (
    <group ref={rootRef}>
      <primitive ref={modelRef} object={normalizedScene} />
    </group>
  );
}

useGLTF.preload(SHARK_MODEL_URL);

export default AnimatedSharkModel;

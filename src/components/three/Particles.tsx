import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticlesProps {
  count?: number;
  depthProgress: number;
}

export function Particles({ count = 100, depthProgress }: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);
  
  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Spread particles in a large volume
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
      
      sizes[i] = Math.random() * 0.15 + 0.05;
    }
    
    return [pos, sizes];
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    const positionAttribute = meshRef.current.geometry.attributes.position;
    const posArray = positionAttribute.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Gentle floating motion
      posArray[i3 + 1] += Math.sin(time * 0.5 + i) * 0.002;
      posArray[i3] += Math.cos(time * 0.3 + i * 0.5) * 0.001;
      
      // Wrap around boundaries
      if (posArray[i3 + 1] > 20) posArray[i3 + 1] = -20;
      if (posArray[i3 + 1] < -20) posArray[i3 + 1] = 20;
      if (posArray[i3] > 25) posArray[i3] = -25;
      if (posArray[i3] < -25) posArray[i3] = 25;
    }
    
    positionAttribute.needsUpdate = true;
  });

  const particleColor = useMemo(() => {
    // Shift from light blue to cyan bioluminescence as depth increases
    const surfaceColor = new THREE.Color(0xE0F7FF);
    const deepColor = new THREE.Color(0x00FFD0);
    return surfaceColor.lerp(deepColor, depthProgress * 0.5);
  }, [depthProgress]);

  const opacity = Math.max(0.2, 0.6 - depthProgress * 0.3);

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color={particleColor}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default Particles;

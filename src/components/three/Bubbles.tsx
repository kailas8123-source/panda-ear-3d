import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BubblesProps {
  count?: number;
  depthProgress: number;
}

export function Bubbles({ count = 50, depthProgress }: BubblesProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const bubbles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      initialPosition: [
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30 - 10,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      scale: Math.random() * 0.15 + 0.05,
      speed: Math.random() * 0.5 + 0.3,
      wobbleSpeed: Math.random() * 2 + 1,
      wobbleAmplitude: Math.random() * 0.3 + 0.1,
    }));
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    groupRef.current.children.forEach((child, i) => {
      const bubble = bubbles[i];
      
      // Rising motion
      child.position.y += bubble.speed * 0.02;
      
      // Wobble motion
      child.position.x = bubble.initialPosition[0] + 
        Math.sin(time * bubble.wobbleSpeed + i) * bubble.wobbleAmplitude;
      child.position.z = bubble.initialPosition[2] + 
        Math.cos(time * bubble.wobbleSpeed * 0.7 + i) * bubble.wobbleAmplitude * 0.5;
      
      // Reset when reaching surface
      if (child.position.y > 15) {
        child.position.y = -15;
        child.position.x = bubble.initialPosition[0];
        child.position.z = bubble.initialPosition[2];
      }
      
      // Scale pulsing
      const scalePulse = 1 + Math.sin(time * 3 + i) * 0.1;
      child.scale.setScalar(bubble.scale * scalePulse);
    });
  });

  // Fewer bubbles at depth
  const visibleCount = Math.floor(count * (1 - depthProgress * 0.7));

  return (
    <group ref={groupRef}>
      {bubbles.slice(0, visibleCount).map((bubble) => (
        <mesh key={bubble.id} position={bubble.initialPosition}>
          <sphereGeometry args={[1, 8, 8]} />
          <meshPhysicalMaterial
            color="#E0F7FF"
            transparent
            opacity={0.3}
            transmission={0.6}
            thickness={0.5}
            roughness={0.1}
            metalness={0.1}
            clearcoat={1}
            clearcoatRoughness={0.1}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

export default Bubbles;

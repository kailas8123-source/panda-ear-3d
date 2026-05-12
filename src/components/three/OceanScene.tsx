import { useRef, useMemo, useEffect } from 'react';
import type { RefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { AnimatedSharkModel } from './AnimatedSharkModel';

interface OceanEnvironmentProps {
  depthProgress: number;
  mousePosition: RefObject<{ x: number; y: number }>;
  onReady?: () => void;
}

// Light rays component
function LightRays({ depthProgress }: { depthProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const rayCount = 12;
  
  const rays = useMemo(() => {
    return Array.from({ length: rayCount }, (_, i) => ({
      id: i,
      angle: (i / rayCount) * Math.PI * 0.5 - Math.PI * 0.25,
      intensity: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  const opacity = Math.max(0, 1 - depthProgress * 1.5);

  if (opacity <= 0) return null;

  return (
    <group ref={groupRef} position={[0, 15, -10]}>
      {rays.map((ray) => (
        <mesh
          key={ray.id}
          rotation={[0, 0, ray.angle]}
          position={[Math.sin(ray.angle) * 5, 0, 0]}
        >
          <planeGeometry args={[0.5, 30]} />
          <meshBasicMaterial
            color="#87CEEB"
            transparent
            opacity={opacity * ray.intensity * 0.15}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Caustics light effect on ocean floor
function CausticLights({ depthProgress }: { depthProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = Math.max(0, 0.3 - depthProgress * 0.4) * (0.8 + Math.sin(state.clock.elapsedTime * 2) * 0.2);
    }
  });

  if (depthProgress > 0.7) return null;

  return (
    <mesh ref={meshRef} position={[0, -10, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial
        color="#40E0D0"
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Ocean fog and atmosphere
function OceanAtmosphere({ depthProgress }: { depthProgress: number }) {
  const { scene } = useThree();
  
  useEffect(() => {
    // Update fog based on depth
    const surfaceColor = new THREE.Color(0x94e8ff);
    const deepColor = new THREE.Color(0x075f99);
    const currentColor = surfaceColor.clone().lerp(deepColor, depthProgress);
    
    scene.fog = new THREE.FogExp2(currentColor, 0.01 + depthProgress * 0.022);
    scene.background = null;
  }, [scene, depthProgress]);

  return null;
}

function SurfaceVolume({ depthProgress }: { depthProgress: number }) {
  const surfaceRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!surfaceRef.current) return;

    surfaceRef.current.position.y = THREE.MathUtils.lerp(9.5, 16, depthProgress);
    surfaceRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.18) * 0.04;
    const material = surfaceRef.current.material as THREE.MeshBasicMaterial;
    material.opacity = Math.max(0, 0.34 - depthProgress * 0.42);
  });

  return (
    <mesh ref={surfaceRef} position={[0, 9.5, -8]} rotation={[-Math.PI / 2.15, 0, 0]}>
      <planeGeometry args={[70, 42, 40, 20]} />
      <meshBasicMaterial
        color="#7bdcff"
        transparent
        opacity={0.32}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function CurrentRibbons({ depthProgress }: { depthProgress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const ribbons = useMemo(() => {
    return Array.from({ length: 9 }, (_, index) => ({
      id: index,
      y: -7 + index * 1.7,
      z: -12 - index * 1.2,
      x: (Math.random() - 0.5) * 22,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, index) => {
      const ribbon = ribbons[index];
      child.position.x = ribbon.x + Math.sin(state.clock.elapsedTime * 0.28 + ribbon.phase) * 2.8;
      child.position.y = ribbon.y + depthProgress * 6 + Math.cos(state.clock.elapsedTime * 0.18 + ribbon.phase) * 0.35;
      child.rotation.z = Math.sin(state.clock.elapsedTime * 0.2 + ribbon.phase) * 0.16;
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(0.12, 0.04, depthProgress);
    });
  });

  return (
    <group ref={groupRef}>
      {ribbons.map((ribbon) => (
        <mesh key={ribbon.id} position={[ribbon.x, ribbon.y, ribbon.z]} rotation={[0, 0, 0.2]}>
          <planeGeometry args={[18, 0.16]} />
          <meshBasicMaterial
            color="#a8f4ff"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// Main ocean environment
function OceanEnvironment({ depthProgress, mousePosition, onReady }: OceanEnvironmentProps) {
  const { camera } = useThree();
  
  useFrame((_, delta) => {
    const pointer = mousePosition.current;
    // Smooth camera movement based on mouse
    const targetX = pointer.x * 1.45;
    const targetY = THREE.MathUtils.lerp(0.6, -2.2, depthProgress) + pointer.y * 0.75;
    const targetZ = THREE.MathUtils.lerp(10.5, 8.4, depthProgress);
    
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetX, 1.6, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetY, 1.6, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetZ, 1.2, delta);
    camera.lookAt(pointer.x * 0.8, THREE.MathUtils.lerp(0, -1.6, depthProgress), -4 - depthProgress * 5);
  });

  return (
    <>
      <OceanAtmosphere depthProgress={depthProgress} />
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.62 - depthProgress * 0.22} color="#9eeeff" />
      
      {/* Sun light from above */}
      <directionalLight
        position={[10, 18, 6]}
        intensity={Math.max(0.45, 1.75 - depthProgress * 1.05)}
        color="#FFF8DC"
        castShadow
      />
      <spotLight
        position={[-8, 6, 4]}
        angle={0.48}
        penumbra={0.85}
        intensity={THREE.MathUtils.lerp(2.2, 0.9, depthProgress)}
        color="#8deeff"
      />
      <pointLight position={[4, -1, 2]} intensity={1.1 + depthProgress * 0.35} color="#d9fbff" distance={16} />
      
      {/* Deep sea bioluminescence */}
      {depthProgress > 0.4 && (
        <pointLight
          position={[0, -5, 0]}
          intensity={(depthProgress - 0.4) * 2}
          color="#00CED1"
          distance={20}
        />
      )}
      
      {/* Light rays from surface */}
      <LightRays depthProgress={depthProgress} />
      <SurfaceVolume depthProgress={depthProgress} />
      
      {/* Caustic light patterns */}
      <CausticLights depthProgress={depthProgress} />
      <CurrentRibbons depthProgress={depthProgress} />
      <AnimatedSharkModel depthProgress={depthProgress} mousePosition={mousePosition} onReady={onReady} />
    </>
  );
}

// Main Ocean Scene Component
interface OceanSceneProps {
  depthProgress?: number;
  className?: string;
  onReady?: () => void;
}

export function OceanScene({ depthProgress = 0, className = '', onReady }: OceanSceneProps) {
  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current.x = THREE.MathUtils.clamp((e.clientX / window.innerWidth - 0.5) * 2, -1, 1);
      mousePosition.current.y = THREE.MathUtils.clamp(-(e.clientY / window.innerHeight - 0.5) * 2, -1, 1);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className={`canvas-container ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <OceanEnvironment 
          depthProgress={depthProgress} 
          mousePosition={mousePosition}
          onReady={onReady}
        />
      </Canvas>
    </div>
  );
}

export default OceanScene;

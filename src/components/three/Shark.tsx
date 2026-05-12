import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SharkProps {
  depthProgress: number;
  mousePosition: { x: number; y: number };
}

function Fin({
  position,
  rotation,
  scale = [1, 1, 1],
  color,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: [number, number, number];
  color: string;
}) {
  const shape = useMemo(() => {
    const nextShape = new THREE.Shape();
    nextShape.moveTo(-0.05, 0);
    nextShape.bezierCurveTo(0.25, 0.45, 0.58, 0.95, 0.95, 1.2);
    nextShape.bezierCurveTo(0.74, 0.52, 0.52, 0.1, -0.05, 0);
    return nextShape;
  }, []);

  return (
    <mesh position={position} rotation={rotation} scale={scale}>
      <extrudeGeometry
        args={[
          shape,
          {
            depth: 0.08,
            bevelEnabled: true,
            bevelThickness: 0.025,
            bevelSize: 0.025,
            bevelSegments: 4,
          },
        ]}
      />
      <meshStandardMaterial color={color} roughness={0.48} metalness={0.08} />
    </mesh>
  );
}

function GillSlits() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((index) => (
        <group key={index}>
          <mesh
            position={[1.35 - index * 0.13, 0.02, 0.5]}
            rotation={[0.15, Math.PI / 2.1, 0.2]}
            scale={[0.55 - index * 0.035, 0.9, 0.8]}
          >
            <torusGeometry args={[0.16, 0.008, 8, 18, Math.PI]} />
            <meshStandardMaterial color="#172229" roughness={0.75} />
          </mesh>
          <mesh
            position={[1.35 - index * 0.13, 0.02, -0.5]}
            rotation={[-0.15, Math.PI / 2.1, -0.2]}
            scale={[0.55 - index * 0.035, 0.9, 0.8]}
          >
            <torusGeometry args={[0.16, 0.008, 8, 18, Math.PI]} />
            <meshStandardMaterial color="#172229" roughness={0.75} />
          </mesh>
        </group>
      ))}
    </>
  );
}

export function Shark({ depthProgress, mousePosition }: SharkProps) {
  const sharkRef = useRef<THREE.Group>(null);
  const tailRootRef = useRef<THREE.Group>(null);
  const upperTailRef = useRef<THREE.Group>(null);
  const lowerTailRef = useRef<THREE.Group>(null);
  const leftFinRef = useRef<THREE.Group>(null);
  const rightFinRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!sharkRef.current) return;

    const time = state.clock.elapsedTime;
    const descent = THREE.MathUtils.clamp(depthProgress, 0, 1);
    const lap = time * 0.24 + descent * Math.PI * 1.85;
    const orbitRadius = THREE.MathUtils.lerp(7.4, 4.6, descent);
    const target = new THREE.Vector3(
      Math.sin(lap) * orbitRadius + mousePosition.x * 1.15,
      THREE.MathUtils.lerp(2.2, -2.1, descent) + Math.sin(lap * 1.7) * 0.85 + mousePosition.y * 0.5,
      -4.8 - descent * 8 + Math.cos(lap * 0.82) * 2.4,
    );

    sharkRef.current.position.lerp(target, 1 - Math.exp(-delta * 1.65));

    const next = new THREE.Vector3(
      Math.sin(lap + 0.08) * orbitRadius,
      THREE.MathUtils.lerp(2.2, -2.1, descent) + Math.sin((lap + 0.08) * 1.7) * 0.85,
      -4.8 - descent * 8 + Math.cos((lap + 0.08) * 0.82) * 2.4,
    );
    const direction = next.sub(target).normalize();
    const targetYaw = Math.atan2(direction.x, direction.z) + Math.PI / 2;
    const targetPitch = THREE.MathUtils.clamp(-direction.y * 0.34 + mousePosition.y * 0.05, -0.35, 0.35);
    const targetRoll = THREE.MathUtils.clamp(-direction.x * 0.32 - mousePosition.x * 0.08, -0.45, 0.45);

    sharkRef.current.rotation.y = THREE.MathUtils.damp(sharkRef.current.rotation.y, targetYaw, 1.7, delta);
    sharkRef.current.rotation.x = THREE.MathUtils.damp(sharkRef.current.rotation.x, targetPitch, 2.1, delta);
    sharkRef.current.rotation.z = THREE.MathUtils.damp(sharkRef.current.rotation.z, targetRoll, 2.1, delta);

    const wag = Math.sin(time * 6.8) * THREE.MathUtils.lerp(0.22, 0.34, descent);
    if (tailRootRef.current) tailRootRef.current.rotation.y = wag;
    if (upperTailRef.current) upperTailRef.current.rotation.y = wag * 0.75;
    if (lowerTailRef.current) lowerTailRef.current.rotation.y = wag * 0.7;
    if (leftFinRef.current) leftFinRef.current.rotation.z = -0.48 + Math.sin(time * 1.8) * 0.055;
    if (rightFinRef.current) rightFinRef.current.rotation.z = 0.48 - Math.sin(time * 1.8) * 0.055;
    if (bodyRef.current) bodyRef.current.rotation.z = Math.sin(time * 3.4) * 0.025;
  });

  const bodyOpacity = Math.max(0.48, 1 - depthProgress * 0.38);

  return (
    <group ref={sharkRef} scale={THREE.MathUtils.lerp(0.9, 1.25, depthProgress)}>
      <group ref={bodyRef}>
        <mesh rotation={[0, 0, Math.PI / 2]} scale={[1, 0.72, 0.82]}>
          <capsuleGeometry args={[0.72, 3.65, 14, 32]} />
          <meshPhysicalMaterial
            color="#66747b"
            roughness={0.42}
            metalness={0.04}
            clearcoat={0.45}
            clearcoatRoughness={0.28}
            transparent
            opacity={bodyOpacity}
          />
        </mesh>

        <mesh position={[0.02, 0.23, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.56, 0.72]}>
          <capsuleGeometry args={[0.7, 3.55, 14, 32]} />
          <meshPhysicalMaterial
            color="#394950"
            roughness={0.5}
            metalness={0.03}
            clearcoat={0.35}
            transparent
            opacity={bodyOpacity}
          />
        </mesh>

        <mesh position={[0.35, -0.28, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1.02, 0.36, 0.58]}>
          <capsuleGeometry args={[0.62, 2.7, 10, 24]} />
          <meshPhysicalMaterial color="#b7c3c7" roughness={0.52} transparent opacity={bodyOpacity * 0.92} />
        </mesh>

        <mesh position={[2.35, 0.02, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1.18, 0.72, 0.74]}>
          <coneGeometry args={[0.64, 1.28, 32]} />
          <meshPhysicalMaterial color="#65747b" roughness={0.44} clearcoat={0.35} transparent opacity={bodyOpacity} />
        </mesh>

        <mesh position={[3.05, 0.01, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1, 0.56, 0.56]}>
          <coneGeometry args={[0.35, 0.82, 28]} />
          <meshPhysicalMaterial color="#54646c" roughness={0.5} transparent opacity={bodyOpacity} />
        </mesh>

        <Fin position={[0.18, 0.54, -0.04]} rotation={[Math.PI / 2, 0, -0.42]} scale={[1.65, 1.55, 1]} color="#304149" />

        <group ref={leftFinRef} position={[1.12, -0.26, 0.52]} rotation={[0.12, -0.42, -0.48]}>
          <Fin position={[0, 0, 0]} rotation={[0.2, 0.08, -1.6]} scale={[1.5, 1.25, 1]} color="#52646d" />
        </group>
        <group ref={rightFinRef} position={[1.12, -0.26, -0.52]} rotation={[-0.12, 0.42, 0.48]}>
          <Fin position={[0, 0, 0]} rotation={[-0.2, -0.08, 1.6]} scale={[1.5, 1.25, 1]} color="#52646d" />
        </group>

        <group ref={tailRootRef} position={[-2.1, 0, 0]}>
          <mesh position={[-0.42, 0, 0]} rotation={[0, 0, Math.PI / 2]} scale={[1, 0.54, 0.62]}>
            <capsuleGeometry args={[0.32, 0.95, 8, 18]} />
            <meshPhysicalMaterial color="#53636b" roughness={0.5} transparent opacity={bodyOpacity} />
          </mesh>
          <group ref={upperTailRef} position={[-0.9, 0.03, 0]} rotation={[Math.PI / 2, 0, -0.15]}>
            <Fin position={[0, 0, 0]} rotation={[0, 0, 2.88]} scale={[1.7, 1.9, 1]} color="#32434c" />
          </group>
          <group ref={lowerTailRef} position={[-0.92, -0.08, 0]} rotation={[Math.PI / 2, 0, 0.2]}>
            <Fin position={[0, 0, 0]} rotation={[0, 0, -2.72]} scale={[1.35, 1.45, 1]} color="#5a6970" />
          </group>
        </group>

        <GillSlits />

        <mesh position={[2.25, 0.14, 0.31]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color="#030608" roughness={0.18} metalness={0.55} />
        </mesh>
        <mesh position={[2.25, 0.14, -0.31]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color="#030608" roughness={0.18} metalness={0.55} />
        </mesh>
      </group>
    </group>
  );
}

export default Shark;

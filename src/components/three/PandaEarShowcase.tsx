import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  ContactShadows,
  Environment,
  Line,
  OrbitControls,
  RoundedBox,
} from '@react-three/drei';
import {
  BackSide,
  Group,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  RepeatWrapping,
  Texture,
  Vector3,
} from 'three';

type PointerPose = {
  x: number;
  y: number;
};

type PandaEarShowcaseProps = {
  scrollProgress: number;
  pointer: PointerPose;
};

type MaterialSet = {
  white: MeshPhysicalMaterial;
  whiteFine: MeshPhysicalMaterial;
  blackPlastic: MeshPhysicalMaterial;
  rubber: MeshStandardMaterial;
  printedBlack: MeshStandardMaterial;
  innerShadow: MeshPhysicalMaterial;
  led: MeshStandardMaterial;
  table: MeshStandardMaterial;
};

function makePlasticTexture() {
  const size = 96;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    ctx.fillStyle = '#f6f4ef';
    ctx.fillRect(0, 0, size, size);

    for (let index = 0; index < 850; index += 1) {
      const value = 226 + Math.floor(Math.random() * 25);
      ctx.fillStyle = `rgba(${value}, ${value}, ${value}, 0.11)`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
    }
  }

  const texture = new Texture(canvas);
  texture.needsUpdate = true;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}

function makeMaterials(): MaterialSet {
  const plasticNoise = makePlasticTexture();

  return {
    white: new MeshPhysicalMaterial({
      color: '#fbfaf6',
      roughness: 0.18,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      sheen: 0.15,
    }),
    whiteFine: new MeshPhysicalMaterial({
      color: '#faf8f2',
      map: plasticNoise,
      roughness: 0.26,
      metalness: 0,
      clearcoat: 0.85,
      clearcoatRoughness: 0.2,
    }),
    blackPlastic: new MeshPhysicalMaterial({
      color: '#050505',
      roughness: 0.2,
      metalness: 0.02,
      clearcoat: 0.95,
      clearcoatRoughness: 0.16,
    }),
    rubber: new MeshStandardMaterial({
      color: '#0f0f0f',
      roughness: 0.72,
      metalness: 0,
    }),
    printedBlack: new MeshStandardMaterial({
      color: '#111111',
      roughness: 0.5,
      metalness: 0,
    }),
    innerShadow: new MeshPhysicalMaterial({
      color: '#010101',
      roughness: 0.38,
      metalness: 0,
      clearcoat: 0.78,
      clearcoatRoughness: 0.22,
    }),
    led: new MeshStandardMaterial({
      color: '#f7ffff',
      emissive: '#c9ffff',
      emissiveIntensity: 1.8,
      roughness: 0.1,
    }),
    table: new MeshStandardMaterial({
      color: '#e9e6df',
      roughness: 0.88,
      metalness: 0,
    }),
  };
}

function arcPoints(
  centerX: number,
  centerY: number,
  radius: number,
  start: number,
  end: number,
  z: number,
) {
  return Array.from({ length: 22 }, (_, index) => {
    const t = index / 21;
    const angle = start + (end - start) * t;
    return [
      centerX + Math.cos(angle) * radius,
      centerY + Math.sin(angle) * radius,
      z,
    ] as [number, number, number];
  });
}

function PandaMouth({ materials }: { materials: MaterialSet }) {
  const frontZ = 0.515;

  return (
    <group position={[0, -0.43, frontZ]}>
      <mesh material={materials.printedBlack} position={[0, 0.08, 0.018]} scale={[0.145, 0.095, 0.05]}>
        <sphereGeometry args={[1, 32, 18]} />
      </mesh>
      <Line
        color="#111111"
        lineWidth={4}
        points={[
          [0, 0.01, 0.028],
          [0, -0.19, 0.028],
        ]}
      />
      <Line color="#111111" lineWidth={4} points={arcPoints(-0.13, -0.18, 0.13, 0.05, -Math.PI, 0.028)} />
      <Line color="#111111" lineWidth={4} points={arcPoints(0.13, -0.18, 0.13, Math.PI - 0.05, 0, 0.028)} />
    </group>
  );
}

function FaceMark({
  x,
  rotation,
  materials,
}: {
  x: number;
  rotation: number;
  materials: MaterialSet;
}) {
  return (
    <group position={[x, -0.05, 0.535]} rotation={[0, 0, rotation]} scale={[0.34, 0.42, 1]}>
      <mesh material={materials.printedBlack}>
        <circleGeometry args={[1, 72]} />
      </mesh>
      <mesh material={materials.white} position={[0.26, 0.16, 0.006]} scale={[0.22, 0.3, 1]}>
        <circleGeometry args={[1, 36]} />
      </mesh>
    </group>
  );
}

function Earbud({
  materials,
  side = 1,
}: {
  materials: MaterialSet;
  side?: 1 | -1;
}) {
  return (
    <group>
      <mesh material={materials.white} castShadow receiveShadow scale={[0.45, 0.52, 0.34]}>
        <sphereGeometry args={[1, 72, 48]} />
      </mesh>
      <mesh
        material={materials.blackPlastic}
        castShadow
        position={[side * 0.38, -0.02, -0.16]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[0.22, 0.3, 0.25]}
      >
        <sphereGeometry args={[1, 48, 32]} />
      </mesh>
      <mesh
        material={materials.rubber}
        castShadow
        position={[side * 0.62, -0.02, -0.2]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[0.28, 0.36, 0.34]}
      >
        <sphereGeometry args={[1, 48, 32]} />
      </mesh>
      <mesh
        material={materials.blackPlastic}
        castShadow
        position={[side * -0.24, -0.05, -0.2]}
        scale={[0.2, 0.28, 0.18]}
      >
        <sphereGeometry args={[1, 38, 24]} />
      </mesh>
      <RoundedBox
        args={[0.22, 0.052, 0.036]}
        radius={0.02}
        smoothness={8}
        material={materials.printedBlack}
        position={[side * 0.06, 0.08, 0.34]}
        rotation={[0, 0, side * -0.04]}
      />
    </group>
  );
}

function SocketCup({
  x,
  materials,
}: {
  x: number;
  materials: MaterialSet;
}) {
  return (
    <group position={[x, 0.13, 0.12]}>
      <mesh material={materials.blackPlastic} rotation={[Math.PI / 2, 0, 0]} scale={[0.44, 0.28, 0.17]}>
        <torusGeometry args={[1, 0.1, 18, 80]} />
      </mesh>
      <mesh material={materials.innerShadow} position={[0, -0.02, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.45, 0.28, 0.16]}>
        <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>
      <mesh material={materials.blackPlastic} position={[0.15 * Math.sign(x), -0.07, 0.05]} rotation={[0.45, 0.3 * Math.sign(x), 0]} scale={[0.34, 0.16, 0.09]}>
        <sphereGeometry args={[1, 40, 20]} />
      </mesh>
    </group>
  );
}

function CaseModel({ materials }: { materials: MaterialSet }) {
  const lidRef = useRef<Group>(null);
  const leftEarRef = useRef<Mesh>(null);
  const rightEarRef = useRef<Mesh>(null);

  useFrame((state) => {
    const pulse = Math.sin(state.clock.elapsedTime * 1.2) * 0.015;
    if (lidRef.current) {
      lidRef.current.rotation.x = -0.78 + pulse;
    }

    if (leftEarRef.current && rightEarRef.current) {
      leftEarRef.current.rotation.z = -0.1 + pulse;
      rightEarRef.current.rotation.z = 0.1 - pulse;
    }
  });

  return (
    <group>
      <RoundedBox
        name="rounded-white-case-body"
        args={[2.75, 1.18, 1.05]}
        radius={0.32}
        smoothness={24}
        material={materials.whiteFine}
        position={[0, -0.28, 0]}
        castShadow
        receiveShadow
      />

      <RoundedBox
        name="black-open-tray-rim"
        args={[2.56, 0.24, 0.88]}
        radius={0.2}
        smoothness={18}
        material={materials.blackPlastic}
        position={[0, 0.31, 0.02]}
        castShadow
        receiveShadow
      />

      <RoundedBox
        name="tray-inner-flat"
        args={[2.36, 0.08, 0.62]}
        radius={0.1}
        smoothness={14}
        material={materials.innerShadow}
        position={[0, 0.36, 0.08]}
        castShadow
      />

      <SocketCup x={-0.58} materials={materials} />
      <SocketCup x={0.58} materials={materials} />

      <group ref={lidRef} name="open-lid-with-black-interior" position={[0, 0.8, -0.38]} rotation={[-0.78, 0, 0]}>
        <RoundedBox
          args={[2.72, 0.52, 0.9]}
          radius={0.32}
          smoothness={24}
          material={materials.white}
          position={[0, 0.1, 0]}
          castShadow
          receiveShadow
        />
        <RoundedBox
          args={[2.36, 0.32, 0.62]}
          radius={0.2}
          smoothness={18}
          material={materials.innerShadow}
          position={[0, -0.06, 0.07]}
          castShadow
        />
        <mesh
          material={materials.blackPlastic}
          position={[-0.58, -0.02, 0.12]}
          scale={[0.43, 0.24, 0.13]}
          rotation={[0.18, 0.16, -0.04]}
        >
          <sphereGeometry args={[1, 64, 32]} />
        </mesh>
        <mesh
          material={materials.blackPlastic}
          position={[0.58, -0.02, 0.12]}
          scale={[0.43, 0.24, 0.13]}
          rotation={[0.18, -0.16, 0.04]}
        >
          <sphereGeometry args={[1, 64, 32]} />
        </mesh>
      </group>

      <mesh
        ref={leftEarRef}
        name="left-black-panda-ear-dome"
        material={materials.blackPlastic}
        position={[-1.35, 0.83, -0.24]}
        rotation={[0.2, 0.08, -0.18]}
        scale={[0.28, 0.43, 0.34]}
        castShadow
      >
        <sphereGeometry args={[1, 48, 32]} />
      </mesh>
      <mesh
        ref={rightEarRef}
        name="right-black-panda-ear-dome"
        material={materials.blackPlastic}
        position={[1.35, 0.83, -0.24]}
        rotation={[0.2, -0.08, 0.18]}
        scale={[0.28, 0.43, 0.34]}
        castShadow
      >
        <sphereGeometry args={[1, 48, 32]} />
      </mesh>

      <FaceMark x={-0.56} rotation={-0.18} materials={materials} />
      <FaceMark x={0.56} rotation={0.18} materials={materials} />
      <PandaMouth materials={materials} />

      <mesh material={materials.led} position={[0, -0.86, 0.54]} scale={[0.035, 0.035, 0.018]}>
        <sphereGeometry args={[1, 24, 12]} />
      </mesh>

      <mesh material={materials.whiteFine} position={[0, -0.96, -0.01]} scale={[1.35, 0.12, 0.42]} receiveShadow>
        <sphereGeometry args={[1, 64, 20]} />
      </mesh>
    </group>
  );
}

function ProductRig({
  scrollProgress,
  pointer,
}: {
  scrollProgress: number;
  pointer: PointerPose;
}) {
  const rigRef = useRef<Group>(null);
  const leftBudRef = useRef<Group>(null);
  const rightBudRef = useRef<Group>(null);
  const materials = useMemo(makeMaterials, []);
  const { size, camera } = useThree();

  useFrame((state, delta) => {
    const progress = MathUtils.clamp(scrollProgress, 0, 1);
    const isMobile = size.width < 760;
    const time = state.clock.elapsedTime;
    const targetScale = isMobile ? 0.74 : 0.72;
    const targetX = isMobile ? 0 : 0.9;
    const turn = progress * Math.PI * 1.75;

    camera.position.z = MathUtils.damp(camera.position.z, isMobile ? 5.8 : 4.9, 3, delta);
    camera.position.y = MathUtils.damp(camera.position.y, isMobile ? 0.72 : 0.62, 3, delta);
    camera.lookAt(new Vector3(0, -0.12, 0));

    if (rigRef.current) {
      rigRef.current.scale.setScalar(MathUtils.damp(rigRef.current.scale.x, targetScale, 3, delta));
      rigRef.current.position.x = MathUtils.damp(rigRef.current.position.x, targetX, 3, delta);
      rigRef.current.rotation.y = MathUtils.damp(
        rigRef.current.rotation.y,
        -0.05 + turn + pointer.x * 0.25,
        4,
        delta,
      );
      rigRef.current.rotation.x = MathUtils.damp(
        rigRef.current.rotation.x,
        pointer.y * -0.08,
        4,
        delta,
      );
      rigRef.current.position.y = MathUtils.damp(
        rigRef.current.position.y,
        isMobile ? -0.18 : -0.06,
        3,
        delta,
      );
    }

    if (leftBudRef.current) {
      leftBudRef.current.position.y = MathUtils.damp(
        leftBudRef.current.position.y,
        -1.36 + Math.sin(time * 1.1) * 0.025,
        3,
        delta,
      );
      leftBudRef.current.rotation.y = MathUtils.damp(leftBudRef.current.rotation.y, -0.6 + progress * 0.7, 3, delta);
    }

    if (rightBudRef.current) {
      rightBudRef.current.position.y = MathUtils.damp(
        rightBudRef.current.position.y,
        -1.36 + Math.cos(time * 1.1) * 0.025,
        3,
        delta,
      );
      rightBudRef.current.rotation.y = MathUtils.damp(rightBudRef.current.rotation.y, 0.6 + progress * 0.7, 3, delta);
    }
  });

  return (
    <group ref={rigRef} name="panda-ear-reference-pack-reconstruction" position={[0.9, -0.06, 0]} scale={0.72}>
      <CaseModel materials={materials} />
      <group ref={leftBudRef} position={[-1.2, -1.36, 0.7]} rotation={[0.38, -0.6, -0.2]} scale={0.64}>
        <Earbud materials={materials} side={1} />
      </group>
      <group ref={rightBudRef} position={[1.2, -1.36, 0.7]} rotation={[0.38, 0.6, 0.2]} scale={0.64}>
        <Earbud materials={materials} side={-1} />
      </group>

      <mesh material={materials.table} position={[0, -1.58, 0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[3.4, 128]} />
      </mesh>

      <mesh position={[0, 1.02, -1.6]} scale={[4, 2.4, 1]}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.16} side={BackSide} />
      </mesh>

    </group>
  );
}

export function PandaEarShowcase({ scrollProgress, pointer }: PandaEarShowcaseProps) {
  return (
    <Canvas
      className="panda-canvas"
      camera={{ position: [0, 0.62, 4.9], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      shadows
    >
      <color attach="background" args={['#f2f0eb']} />
      <fog attach="fog" args={['#f2f0eb', 7.5, 12]} />
      <ambientLight intensity={1.4} />
      <directionalLight
        castShadow
        intensity={2.2}
        position={[3.2, 4.8, 4.2]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <spotLight
        angle={0.42}
        intensity={1.15}
        penumbra={0.8}
        position={[-3, 4, 3.6]}
      />
      <ProductRig pointer={pointer} scrollProgress={scrollProgress} />
      <Suspense fallback={null}>
        <Environment preset="studio" />
      </Suspense>
      <ContactShadows
        blur={2.8}
        far={5}
        opacity={0.46}
        position={[0, -1.56, 0]}
        scale={6}
      />
      <OrbitControls
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={3.1}
        maxDistance={7.2}
        target={[0, -0.12, 0]}
      />
    </Canvas>
  );
}

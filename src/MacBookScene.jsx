import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "https://raw.githubusercontent.com/shahdinsalman23/react-macbookpro/main/public/mac.glb";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="model-loader">LOADING MACHINE {Math.round(progress)}%</div>
    </Html>
  );
}

function MacBookModel({ progress }) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef();

  const { clone, screen, screenPosition, screenRotation } = useMemo(() => {
    const clonedScene = scene.clone(true);
    const screenMesh = clonedScene.getObjectByName("screen");

    return {
      clone: clonedScene,
      screen: screenMesh,
      screenPosition: screenMesh?.position.clone() ?? new THREE.Vector3(),
      screenRotation: screenMesh?.rotation.clone() ?? new THREE.Euler(),
    };
  }, [scene]);

  useFrame(() => {
    const value = THREE.MathUtils.clamp(progress, 0, 1);
    const open = THREE.MathUtils.smoothstep(value, 0.18, 0.5);
    const movement = THREE.MathUtils.smoothstep(value, 0.5, 0.9);

    if (screen) {
      screen.position.copy(screenPosition);
      screen.rotation.set(
        THREE.MathUtils.degToRad(180 - 90 * open),
        screenRotation.y,
        screenRotation.z,
      );
      screen.position.y += movement * 0.3;
    }

    if (groupRef.current) {
      groupRef.current.position.set(0, -10 + movement * 1.2, 20);
      groupRef.current.rotation.set(
        THREE.MathUtils.degToRad(2 * movement),
        THREE.MathUtils.degToRad(-4 * movement),
        0,
      );
      groupRef.current.scale.setScalar(1 + movement * 0.03);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={clone} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export default function MacBookScene({ progress }) {
  return (
    <Canvas
      className="mac-canvas"
      camera={{ fov: 12, position: [1, -10, 220] }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera }) => {
        camera.lookAt(0, -10, 20);
      }}
    >
      <ambientLight intensity={1.7} />
      <hemisphereLight intensity={1.2} />
      <directionalLight position={[5, 7, 20]} intensity={3} />
      <directionalLight position={[-6, 4, 12]} intensity={1.5} />
      <pointLight position={[0, 5, 25]} intensity={1.2} color="#d9ff4f" />
      <Suspense fallback={<Loader />}>
        <MacBookModel progress={progress} />
      </Suspense>
    </Canvas>
  );
}

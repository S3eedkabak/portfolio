import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, useGLTF, useProgress } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "https://raw.githubusercontent.com/shahdinsalman23/react-macbookpro/main/public/mac.glb";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="model-loader">LOADING {Math.round(progress)}%</div>
    </Html>
  );
}

function getTopLevelAncestor(node) {
  if (!node) return null;
  let current = node;
  while (current.parent && current.parent.parent) current = current.parent;
  return current;
}

function MacBookModel({ progress }) {
  const { scene } = useGLTF(MODEL_URL);
  const modelRef = useRef();

  const rig = useMemo(() => {
    const clone = scene.clone(true);
    const screen = clone.getObjectByName("screen");
    const screenRoot = getTopLevelAncestor(screen);
    const bodyParts = clone.children
      .filter((child) => child !== screenRoot)
      .map((child, index) => ({
        child,
        base: child.position.clone(),
        rotation: child.rotation.clone(),
        direction: new THREE.Vector3(
          index % 2 === 0 ? -1 : 1,
          0.4 + (index % 3) * 0.12,
          index % 3 === 0 ? 0.45 : -0.25,
        ).normalize(),
      }));

    return {
      clone,
      screen,
      screenBase: screen?.position.clone() ?? new THREE.Vector3(),
      screenRotation: screen?.rotation.clone() ?? new THREE.Euler(),
      bodyParts,
    };
  }, [scene]);

  useFrame(() => {
    const value = THREE.MathUtils.clamp(progress, 0, 1);
    const lidProgress = THREE.MathUtils.smoothstep(value, 0.02, 0.32);
    const apartProgress = THREE.MathUtils.smoothstep(value, 0.34, 0.9);

    // The source model is closed at 180deg. Opening is intentionally early and obvious.
    if (rig.screen) {
      rig.screen.position.copy(rig.screenBase);
      rig.screen.rotation.set(
        THREE.MathUtils.degToRad(180 - 90 * lidProgress),
        rig.screenRotation.y,
        rig.screenRotation.z,
      );
    }

    rig.bodyParts.forEach((part, index) => {
      const distance = apartProgress * (0.12 + (index % 4) * 0.035);
      part.child.position.copy(part.base).addScaledVector(part.direction, distance);
      part.child.rotation.copy(part.rotation);
    });

    if (modelRef.current) {
      modelRef.current.position.set(0, -10, 20);
      modelRef.current.rotation.set(
        THREE.MathUtils.degToRad(apartProgress * 1.5),
        THREE.MathUtils.degToRad(apartProgress * -3),
        0,
      );
      modelRef.current.scale.setScalar(0.74 + apartProgress * 0.015);
    }
  });

  return (
    <group ref={modelRef}>
      <primitive object={rig.clone} />
    </group>
  );
}

useGLTF.preload(MODEL_URL);

export default function MacBookScene({ progress }) {
  return (
    <Canvas
      className="mac-canvas"
      camera={{ fov: 13.5, position: [1, -10, 220] }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ camera }) => camera.lookAt(0, -10, 20)}
    >
      <ambientLight intensity={1.7} />
      <hemisphereLight intensity={1.2} />
      <directionalLight position={[5, 7, 20]} intensity={3} />
      <directionalLight position={[-6, 4, 12]} intensity={1.5} />
      <pointLight position={[0, 5, 25]} intensity={1.2} color="#8CCBFF" />
      <Suspense fallback={<Loader />}>
        <MacBookModel progress={progress} />
      </Suspense>
    </Canvas>
  );
}

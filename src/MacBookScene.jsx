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

function getScreenRoot(screen) {
  if (!screen) return null;
  let node = screen;
  while (node.parent && node.parent.parent) node = node.parent;
  return node;
}

function MacBookModel({ progress }) {
  const { scene } = useGLTF(MODEL_URL);
  const rig = useMemo(() => {
    const clone = scene.clone(true);
    const screen = clone.getObjectByName("screen");
    const screenRoot = getScreenRoot(screen);
    const screenBase = screenRoot?.position.clone() ?? new THREE.Vector3();
    const screenRotation = screenRoot?.rotation.clone() ?? new THREE.Euler();

    const bodyParts = clone.children
      .filter((child) => child !== screenRoot)
      .map((child, index) => {
        const base = child.position.clone();
        const direction = new THREE.Vector3(
          index % 2 === 0 ? -1 : 1,
          0.45 + (index % 3) * 0.15,
          index % 3 === 0 ? 0.65 : -0.35,
        ).normalize();

        return {
          child,
          base,
          direction,
          rotation: child.rotation.clone(),
          distance: 0.18 + index * 0.03,
        };
      });

    return { clone, screenRoot, screenBase, screenRotation, bodyParts };
  }, [scene]);

  const modelRef = useRef();

  useFrame(() => {
    const value = THREE.MathUtils.clamp(progress, 0, 1);
    const lidProgress = THREE.MathUtils.smoothstep(value, 0.02, 0.34);
    const apartProgress = THREE.MathUtils.smoothstep(value, 0.44, 0.86);

    if (rig.screenRoot) {
      rig.screenRoot.position.copy(rig.screenBase);
      rig.screenRoot.rotation.set(
        THREE.MathUtils.degToRad(180 - 90 * lidProgress),
        rig.screenRotation.y,
        rig.screenRotation.z,
      );
      rig.screenRoot.position.y += apartProgress * 0.12;
    }

    rig.bodyParts.forEach((part) => {
      part.child.position.copy(part.base).addScaledVector(
        part.direction,
        part.distance * apartProgress,
      );
      part.child.rotation.copy(part.rotation);
    });

    if (modelRef.current) {
      modelRef.current.position.set(0, -10, 20);
      modelRef.current.rotation.set(
        THREE.MathUtils.degToRad(apartProgress * 1.5),
        THREE.MathUtils.degToRad(apartProgress * -3),
        0,
      );
      modelRef.current.scale.setScalar(0.76 + apartProgress * 0.02);
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
      onCreated={({ camera }) => {
        camera.lookAt(0, -10, 20);
      }}
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

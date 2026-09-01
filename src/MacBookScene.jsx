import React,{useMemo,useRef}from"react";import{Canvas,useFrame}from"@react-three/fiber";import{Html,useGLTF,useProgress}from"@react-three/drei";import * as THREE from"three";

const MODEL_URL="https://raw.githubusercontent.com/shahdinsalman23/react-macbookpro/main/public/mac.glb";

function Loader(){const{progress}=useProgress();return <Html center><div style={{font:"9px 'DM Mono',monospace",letterSpacing:".14em",color:"#d9ff4f",whiteSpace:"nowrap"}}>LOADING MACHINE {Math.round(progress)}%</div></Html>}

function Model({progress}){const{scene}=useGLTF(MODEL_URL);const root=useRef();const model=useMemo(()=>{const clone=scene.clone(true);const meshes={};clone.traverse(o=>{if(o.isMesh)meshes[o.name]=o});return{clone,screen:meshes.screen}},[scene]);
useFrame(()=>{const p=THREE.MathUtils.clamp(progress,0,1);
const enter=THREE.MathUtils.smoothstep(p,0,.16);
const open=THREE.MathUtils.smoothstep(p,.18,.48);
const motion=THREE.MathUtils.smoothstep(p,.28,.72);
const explode=THREE.MathUtils.smoothstep(p,.55,.95);

// The source model is CLOSED at 180deg. It opens toward 90deg.
// Do not reverse this: 90deg at progress 0 makes the laptop appear open on load.
if(model.screen){model.screen.rotation.x=THREE.MathUtils.degToRad(180-open*90);model.screen.position.y=explode*.7;}

if(root.current){
  // Start from the model's known centered position, then move visibly with scroll.
  const x=THREE.MathUtils.lerp(.35,0,enter)+Math.sin(motion*Math.PI)*1.15;
  const y=-10+THREE.MathUtils.lerp(-1.4,0,enter)+Math.sin(motion*Math.PI)*.55;
  const z=20+THREE.MathUtils.lerp(2.5,0,enter);
  root.current.position.set(x,y,z);
  root.current.rotation.set(
    THREE.MathUtils.degToRad(3-5*motion),
    THREE.MathUtils.degToRad(-7+14*motion),
    THREE.MathUtils.degToRad(2*Math.sin(motion*Math.PI))
  );
  root.current.scale.setScalar(1+explode*.08);
}});
return <group ref={root}><primitive object={model.clone}/></group>}

useGLTF.preload(MODEL_URL);

export default function MacBookScene({progress}){return <Canvas className="mac-canvas" camera={{fov:12,position:[0,-10,220]}} dpr={[1,1.5]} gl={{antialias:true,alpha:true}} onCreated={({camera})=>camera.lookAt(0,-10,20)}><ambientLight intensity={1.7}/><hemisphereLight intensity={1.2}/><directionalLight position={[5,7,20]} intensity={3}/><directionalLight position={[-6,4,12]} intensity={1.5}/><pointLight position={[0,5,25]} intensity={1.2} color="#d9ff4f"/><React.Suspense fallback={<Loader/>}><Model progress={progress}/></React.Suspense></Canvas>}
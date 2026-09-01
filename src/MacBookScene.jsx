import React,{useMemo,useRef}from"react";import{Canvas,useFrame}from"@react-three/fiber";import{Html,useGLTF,useProgress}from"@react-three/drei";import * as THREE from"three";

const MODEL_URL="https://raw.githubusercontent.com/shahdinsalman23/react-macbookpro/main/public/mac.glb";

function Loader(){const{progress}=useProgress();return <Html center><div style={{font:"9px 'DM Mono',monospace",letterSpacing:".14em",color:"#d9ff4f",whiteSpace:"nowrap"}}>LOADING MACHINE {Math.round(progress)}%</div></Html>}

function Model({progress}){const{scene}=useGLTF(MODEL_URL);const root=useRef();const model=useMemo(()=>{const clone=scene.clone(true);const meshes={};clone.traverse(o=>{if(o.isMesh)meshes[o.name]=o});return{clone,screen:meshes.screen}},[scene]);useFrame(()=>{const p=THREE.MathUtils.clamp(progress,0,1);
const entry=THREE.MathUtils.smoothstep(p,0,.16);
const open=THREE.MathUtils.smoothstep(p,.12,.38);
const reveal=THREE.MathUtils.smoothstep(p,.38,.72);
const explode=THREE.MathUtils.smoothstep(p,.55,.92);
if(model.screen){model.screen.rotation.x=THREE.MathUtils.degToRad(90+open*90);model.screen.position.y=.7*explode;}
if(root.current){root.current.position.set(
THREE.MathUtils.lerp(-1.8,0,p),
THREE.MathUtils.lerp(-15,-10,entry)+Math.sin(p*Math.PI)*1.8,
20+THREE.MathUtils.lerp(8,0,entry)
);
root.current.rotation.set(
THREE.MathUtils.degToRad(5-7*reveal),
THREE.MathUtils.degToRad(-14+22*reveal),
THREE.MathUtils.degToRad(2*Math.sin(p*Math.PI))
);
root.current.scale.setScalar(1+0.1*explode);
}});
return <group ref={root}><primitive object={model.clone}/></group>}

useGLTF.preload(MODEL_URL);

export default function MacBookScene({progress}){return <Canvas className="mac-canvas" camera={{fov:12,position:[1,-10,220]}} dpr={[1,1.5]} gl={{antialias:true,alpha:true}} onCreated={({camera})=>camera.lookAt(0,-10,20)}><ambientLight intensity={1.7}/><hemisphereLight intensity={1.2}/><directionalLight position={[5,7,20]} intensity={3}/><directionalLight position={[-6,4,12]} intensity={1.5}/><pointLight position={[0,5,25]} intensity={1.2} color="#d9ff4f"/><React.Suspense fallback={<Loader/>}><Model progress={progress}/></React.Suspense></Canvas>}
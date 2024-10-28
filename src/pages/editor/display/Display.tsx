/* eslint-disable react/no-unknown-property */
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../..";
import { sceneSelector, changeActiveState, changeHoveredState } from "../../../slices/scene";
import { SceneObject as SceneObject } from "../../../types/Scene";

// todo should it be object
function Box(props: MeshProps & { id: number }): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { scene } = useSelector(sceneSelector)
  const dispatch = useAppDispatch();

  useFrame((state, delta) => (meshRef.current.rotation.x += delta))

  const object = scene.objects.get(props.id)
  if (!object) {
    console.warn(`No object with id ${props.id} found.`)
    return (<div></div>)
  }

  const color = object.hovered ? 'hotpink' : '#2f74c0'
  const scale = object.active ? 1.5 : 1;

  useEffect(() => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).color.set(color)
    }
  }, [object.hovered])

  return (
    <mesh
      position={props.position}
      ref={meshRef}
      scale={scale}
      onClick={() => dispatch(changeActiveState(props.id as number))}
      onPointerOver={() => dispatch(changeHoveredState(props.id as number, true))}
      onPointerOut={() => dispatch(changeHoveredState(props.id as number, false))}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function Display() {
  const { scene } = useSelector(sceneSelector)

  return (
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 2000, position: [5, 5, 5] }}
      gl={{ antialias: true }}
      scene={{}}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {Array.from(scene.objects.values()).map((obj: SceneObject) => <Box id={obj.id} position={[obj.position.x, obj.position.y, obj.position.z]} />)}
    </Canvas>
  );
}

export default Display
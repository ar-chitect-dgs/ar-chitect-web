/* eslint-disable react/no-unknown-property */
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { Object, Scene } from "../../../types/Scene";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../..";
import { sceneSelector, changeActiveState, changeHoveredState } from "../../../slices/scene";

function Box(props: MeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const { hovered, active } = useSelector(sceneSelector)
  const dispatch = useAppDispatch();

  useFrame((state, delta) => (meshRef.current.rotation.x += delta))

  const color = hovered ? 'hotpink' : '#2f74c0'
  const scale = active ? 1.5 : 1;

  useEffect(() => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).color.set(color)
    }
  }, [hovered])

  return (
    <mesh
      position={props.position}
      ref={meshRef}
      scale={scale}
      onClick={() => dispatch(changeActiveState())}
      onPointerOver={() => dispatch(changeHoveredState(true))}
      onPointerOut={() => dispatch(changeHoveredState(false))}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

interface DisplayProps {
  scene: Scene;
}

function Display({ scene }: DisplayProps) {
  return (
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 2000, position: [5, 5, 5] }}
      gl={{ antialias: true }}
      scene={{}}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {scene.objects.map((val: Object) => <Box key={val.id} position={val.position} />)}
      {/* <Box position={[0, 0, 0]} /> */}
    </Canvas>
  );
}

export default Display
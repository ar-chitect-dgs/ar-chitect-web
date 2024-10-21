/* eslint-disable react/no-unknown-property */
import { Canvas, MeshProps, useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from 'three';

function Box(props: MeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  useFrame((state, delta) => (meshRef.current.rotation.x += delta))

  return (
    <mesh
      position={props.position}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : '#2f74c0'} />
    </mesh>
  )
}

function Editor() {
  return (
    <Canvas
      camera={{ fov: 45, near: 0.1, far: 2000, position: [4, 3, 10] }}
      gl={{ antialias: true }}
      scene={{}}>
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[1, 1, 1]} />
    </Canvas>
  );
}

export default Editor
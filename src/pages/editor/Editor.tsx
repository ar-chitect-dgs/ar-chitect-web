/* eslint-disable react/no-unknown-property */
import { Canvas, MeshProps, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import {
  sceneSelector,
  changeHoveredState,
  changeActiveState,
} from '../../redux/slices/scene';
import { useAppDispatch } from '../../redux';

function Box({ position }: MeshProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { hovered, active } = useSelector(sceneSelector);
  const dispatch = useAppDispatch();

  // eslint-disable-next-line no-return-assign
  useFrame((_state, delta) => (meshRef.current.rotation.x += delta));

  const color = hovered ? 'hotpink' : '#2f74c0';
  const scale = active ? 1.5 : 1;

  useEffect(() => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).color.set(color);
    }
  }, [hovered]);

  return (
    <mesh
      position={position}
      ref={meshRef}
      scale={scale}
      onClick={() => dispatch(changeActiveState())}
      onPointerOver={() => dispatch(changeHoveredState(true))}
      onPointerOut={() => dispatch(changeHoveredState(false))}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Editor(): JSX.Element {
  return (
    <div>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 2000,
          position: [4, 3, 10],
        }}
        gl={{ antialias: true }}
        scene={{}}
      >
        <ambientLight intensity={Math.PI / 2} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.15}
          penumbra={1}
          decay={0}
          intensity={Math.PI}
        />
        <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
        <Box position={[1, 1, 1]} />
      </Canvas>
    </div>
  );
}

export default Editor;

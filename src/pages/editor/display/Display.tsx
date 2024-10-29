/* eslint-disable react/no-unknown-property */
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux';
import { SceneObject } from '../../../types/Scene';
import { sceneSelector, changeActiveState, changeHoveredState } from '../../../redux/slices/scene';

function Box({
  id, position, hovered, active,
}: SceneObject): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const dispatch = useAppDispatch();

  useFrame((_state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta;
    }
  });

  const color = hovered ? 'hotpink' : '#2f74c0';
  const scale = active ? 1.5 : 1;

  useEffect(() => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).color.set(color);
    }
  }, [hovered]);

  return (
    <mesh
      position={[position.x, position.y, position.z]}
      ref={meshRef}
      scale={scale}
      onClick={() => dispatch(changeActiveState(id as number))}
      onPointerOver={() => dispatch(changeHoveredState(id as number, true))}
      onPointerOut={() => dispatch(changeHoveredState(id as number, false))}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Display(): JSX.Element {
  const { scene } = useSelector(sceneSelector);

  return (
    <Canvas
      camera={{
        fov: 45, near: 0.1, far: 2000, position: [5, 5, 5],
      }}
      gl={{ antialias: true }}
      scene={{}}
    >
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {Object.values(scene.objects).map(
        (obj: SceneObject) => (
          <Box
            key={obj.id}
            // I would like to disable this warning for the entire project, can I?
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...obj}
          />
        ),
      )}
    </Canvas>
  );
}

export default Display;

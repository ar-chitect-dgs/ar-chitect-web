/* eslint-disable react/no-unknown-property */
import { Canvas, MeshProps, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux';
import { SceneObject } from '../../../types/Scene';
import { sceneSelector, changeActiveState, changeHoveredState } from '../../../redux/slices/scene';

// todo should it be object
function Box({ id, ...meshProps }: MeshProps & { id: number }): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const meshRef = useRef<THREE.Mesh>(null!);
  const { scene } = useSelector(sceneSelector);
  const dispatch = useAppDispatch();

  // eslint-disable-next-line no-return-assign
  useFrame((_state, delta) => (meshRef.current.rotation.x += delta));

  const object = scene.objects.get(id);
  if (!object) {
    console.warn(`No object with id ${id} found.`);
    return (<div />);
  }

  const color = object.hovered ? 'hotpink' : '#2f74c0';
  const scale = object.active ? 1.5 : 1;

  useEffect(() => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.MeshStandardMaterial).color.set(color);
    }
  }, [object.hovered]);

  return (
    <mesh
      position={meshProps.position}
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
      {Array.from(scene.objects.values()).map(
        (obj: SceneObject) => (
          <Box
            id={obj.id}
            key={obj.id}
            position={[obj.position.x, obj.position.y, obj.position.z]}
          />
        ),
      )}
    </Canvas>
  );
}

export default Display;

/* eslint-disable react/no-unknown-property */
/* eslint-disable react/jsx-props-no-spreading */
import { CameraControls, Grid } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { useAppDispatch } from '../../../redux';
import {
  changeActiveState,
  changeHoveredState,
  sceneSelector,
} from '../../../redux/slices/scene';
import { SceneObject } from '../../../types/Scene';
import { test } from '../../../utils/utils';

function Ground() {
  const gridConfig = {
    cellSize: 0.5,
    cellThickness: 0.5,
    cellColor: '#6f6f6f',
    sectionSize: 3,
    sectionThickness: 1,
    sectionColor: '#595959',
    fadeDistance: 50,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };
  return <Grid position={[0, -0.01, 0]} args={[10.5, 10.5]} {...gridConfig} />;
}

function Box({ id, position, hovered, active }: SceneObject): JSX.Element {
  const meshRef = useRef<THREE.Mesh>(null);
  const dispatch = useAppDispatch();

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

function Viewport(): JSX.Element {
  const { scene } = useSelector(sceneSelector);
  const cameraControlRef = useRef<CameraControls | null>(null);
  test();
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [5, 5, 5],
      }}
      gl={{ antialias: true }}
      scene={{}}
    >
      <CameraControls
        ref={cameraControlRef}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2}
      />
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      {Object.values(scene.objects).map((obj: SceneObject) => (
        <Box key={obj.id} {...obj} />
      ))}
      <Ground />
    </Canvas>
  );
}

export default Viewport;

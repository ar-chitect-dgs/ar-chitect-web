/* eslint-disable react/no-unknown-property */
import { Grid, OrbitControls } from '@react-three/drei';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../../redux';
import { addPointToPlane, creatorSelector } from '../../../redux/slices/creator';
import { Point2D } from '../../../types/Point';

function Sphere({
  position,
  transparent,
} :
   {position: Point2D, transparent?: boolean}): JSX.Element {
  return (
    <mesh position={[position.x, 0, position.y]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      {transparent
        ? <meshStandardMaterial color="blue" transparent opacity={0.4} />
        : <meshStandardMaterial color="orange" />}
    </mesh>
  );
}

function Ground({
  onClick,
  onHover,
}
  : {
    onClick: (e: ThreeEvent<MouseEvent>) => void
    onHover: (e: ThreeEvent<PointerEvent>) => void
  }) {
  const gridConfig = {
    cellSize: 0.25,
    cellThickness: 1,
    cellColor: '#6f6f6f',
    sectionSize: 1,
    sectionThickness: 3,
    sectionColor: '#595959',
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };
  return (
    <>
      <Grid position={[0, 0, 0]} {...gridConfig} />
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={onClick}
        onPointerMove={onHover}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial opacity={0} transparent />
      </mesh>
    </>
  );
}

function CreatorViewport(): JSX.Element {
  const dispatch = useAppDispatch();
  const { points } = useSelector(creatorSelector);
  const [hoverPoint, setHoverPoint] = useState<Point2D>({ x: 0, y: 0 });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    const { point } = e.intersections[0];
    dispatch(addPointToPlane(point.x, point.z));
  };

  const onHover = (e: ThreeEvent<MouseEvent>) => {
    const { point } = e.intersections[0];
    setHoverPoint({ x: point.x, y: point.z });
  };

  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 2000,
        position: [0, 10, 0],
        rotation: [-Math.PI / 2, 0, 0],
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
      {points.map((p: Point2D) => <Sphere key={`${p.x}_${p.y}`} position={p} />)}
      <Ground onClick={onClick} onHover={onHover} />
      <Sphere key="hover" position={hoverPoint} transparent />

      <OrbitControls
        enablePan={false}
        enableRotate={false}
        zoomSpeed={0.5}
        minDistance={5}
        maxDistance={50}
      />
    </Canvas>
  );
}

export default CreatorViewport;

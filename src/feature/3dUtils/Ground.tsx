/* eslint-disable react/no-unknown-property */

import { Grid } from '@react-three/drei';
import { ThreeEvent } from '@react-three/fiber';

export function Ground({
  onClick = () => {},
  onHover = () => {},
}: {
    onClick?: (e: ThreeEvent<MouseEvent>) => void
    onHover?: (e: ThreeEvent<PointerEvent>) => void
  }): JSX.Element {
  const gridConfig = {
    cellSize: 0.25,
    cellThickness: 1,
    cellColor: '#6f6f6f',
    sectionSize: 1,
    sectionThickness: 3,
    sectionColor: '#595959',
    fadeDistance: 50,
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

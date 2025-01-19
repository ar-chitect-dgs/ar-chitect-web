/* eslint-disable react/no-unknown-property */
import { ThreeEvent } from '@react-three/fiber';
import { Grid } from '@react-three/drei';
import { GROUND } from '.';

export function Ground({
  onClick = () => {},
  onPointerMove = () => {},
  onPointerUp = () => {},
  onPointerDown = () => {},
}: {
    onClick?: (e: ThreeEvent<MouseEvent>) => void
    onPointerMove?: (e: ThreeEvent<PointerEvent>) => void
    onPointerUp?: (e: ThreeEvent<PointerEvent>) => void
    onPointerDown?: (e: ThreeEvent<PointerEvent>) => void
  }): JSX.Element {
  const gridConfig = {
    cellSize: 0.25,
    cellThickness: 1,
    cellColor: '#6f6f6f',
    sectionSize: 1,
    sectionThickness: 1.5,
    sectionColor: '#595959',
    fadeDistance: 50,
    fadeStrength: 10,
    fadeFrom: 0,
    followCamera: false,
    infiniteGrid: true,
  };
  return (
    <>
      <Grid position={[0, 0, 0]} {...gridConfig} />
      <mesh
        position={[0, -0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={onClick}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerDown={onPointerDown}
        userData={{ name: GROUND }}
      >
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial visible={false} />
      </mesh>
    </>
  );
}

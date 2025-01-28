/* eslint-disable react/no-unknown-property */
import { useThree } from '@react-three/fiber';
import { useSelector } from 'react-redux';
import * as THREE from 'three';
import { Vector2 } from 'three';
import { sceneSelector } from '../../redux/slices/editor';
import { Point2D } from '../../types/Point';

const WALL_HEIGHT = 3.5;
const HIDDEN_WALL_HEIGHT = 0.2;

function getWallMesh(
  p1: Point2D,
  p2: Point2D,
  key: number,
  color: string,
  height: number,
  transparent: boolean,
): JSX.Element {
  const dx = p2.x - p1.x;
  const dz = p2.y - p1.y;
  const distance = Math.sqrt(dx * dx + dz * dz) + 0.1; // add 0.1 to prevent jagged corners

  const midpoint = [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];
  const angle = -Math.atan2(dz, dx);

  return (
    <mesh
      key={`wall_${key}`}
      position={[midpoint[0], height / 2 - 0.1, midpoint[1]]}
      rotation={[0, angle, 0]}
    >
      <boxGeometry args={[distance, height, 0.1]} />
      {transparent
        ? <meshStandardMaterial color={color} side={THREE.DoubleSide} transparent opacity={0.5} />
        : <meshStandardMaterial color={color} side={THREE.DoubleSide} />}
    </mesh>
  );
}

function shouldBeHidden(u: Point2D, v: Point2D, camera: Point2D): boolean {
  const wall = new Vector2(v.x - u.x, v.y - u.y);
  const cameraToWallEnd = new Vector2(u.x - camera.x, u.y - camera.y);

  return cameraToWallEnd.cross(wall) <= 0;
}

export function Walls({
  points, closed, _shouldRerender, hide = true, transparent = false,
} : {
  points: Point2D[],
  closed?: boolean,
  _shouldRerender?: boolean
  hide?: boolean
  transparent?: boolean,
}): JSX.Element {
  const { scene } = useSelector(sceneSelector);
  const { camera } = useThree();

  const walls = [];
  const vertices = closed ? [...points, points[0]] : [...points];

  if (vertices.length < 2) return <></>;

  if (closed) { vertices.push(vertices[0]); }

  for (let i = 0; i < vertices.length - 1; i += 1) {
    const u = vertices[i];
    const v = vertices[i + 1];

    const height = hide
      && shouldBeHidden(u, v, { x: camera.position.x, y: camera.position.z })
      ? HIDDEN_WALL_HEIGHT : WALL_HEIGHT;

    walls.push(getWallMesh(u, v, i, scene.wallColor, height, transparent));
  }

  return (
    <>
      {walls}
    </>
  );
}

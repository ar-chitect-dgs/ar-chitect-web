/* eslint-disable react/no-unknown-property */
import { useSelector } from 'react-redux';
import { Point2D } from '../../types/Point';
import { sceneSelector } from '../../redux/slices/scene';

const WALL_HEIGHT = 3;

function getWallMesh(p1: Point2D, p2: Point2D, key: number): JSX.Element {
  const { scene } = useSelector(sceneSelector);

  const dx = p2.x - p1.x;
  const dz = p2.y - p1.y;
  const distance = Math.sqrt(dx * dx + dz * dz) + 0.1; // add 0.1 to prevent jagged corners

  const midpoint = [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];
  const angle = -Math.atan2(dz, dx);

  return (
    <mesh
      key={`wall_${key}`}
      position={[midpoint[0], WALL_HEIGHT / 2, midpoint[1]]}
      rotation={[0, angle, 0]}
    >
      <boxGeometry args={[distance, WALL_HEIGHT, 0.1]} />
      <meshStandardMaterial color={scene.wallColor} transparent opacity={0.5} />
    </mesh>
  );
}

export function Walls({ points, closed } : {
  points: Point2D[],
  closed?: boolean,
}): JSX.Element {
  const walls = [];
  const vertices = closed ? [...points, points[0]] : [...points];

  if (vertices.length < 2) return <></>;

  if (closed) { vertices.push(vertices[0]); }

  for (let i = 0; i < vertices.length - 1; i += 1) {
    walls.push(getWallMesh(vertices[i], vertices[i + 1], i));
  }

  return (
    <>
      {walls}
    </>
  );
}

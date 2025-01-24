/* eslint-disable react/no-unknown-property */
import { Point2D } from '../../types/Point';

export function Walls({ points, closed } : {
  points: Point2D[],
  closed?: boolean,
}): JSX.Element {
  const wallHeight = 3;

  const walls = [];
  const vertices = closed ? [...points, points[0]] : [...points];

  if (vertices.length < 2) return <></>;

  if (closed) { vertices.push(vertices[0]); }

  for (let i = 0; i < vertices.length - 1; i += 1) {
    const p1 = vertices[i];
    const p2 = vertices[i + 1];

    const dx = p2.x - p1.x;
    const dz = p2.y - p1.y;
    const distance = Math.sqrt(dx * dx + dz * dz) + 0.1; // add 0.1 to prevent jagged corners

    const midpoint = [(p1.x + p2.x) / 2, (p1.y + p2.y) / 2];
    const angle = -Math.atan2(dz, dx);

    walls.push(
      <mesh
        key={`wall_${i}`}
        position={[midpoint[0], wallHeight / 2, midpoint[1]]}
        rotation={[0, angle, 0]}
      >
        <boxGeometry args={[distance, wallHeight, 0.1]} />
        <meshStandardMaterial color="gray" transparent opacity={0.3} />
      </mesh>,
    );
  }
  return (
    <>
      {walls}
    </>
  );
}

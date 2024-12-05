/* eslint-disable react/no-unknown-property */
import { Point2D } from '../../types/Point';
import { Sphere, SphereType } from './Sphere';

export function DynamicSphere({
  position,
  distance,
} :
   {position: Point2D, distance: number}): JSX.Element {
  const radius = Math.exp(-10 * distance * distance) / 4;
  return (
    <>
      <mesh position={[position.x, 0, position.y]}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial color="orange" transparent opacity={0.5} />
      </mesh>
      <Sphere position={position} type={SphereType.Basic} />
    </>
  );
}

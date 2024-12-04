/* eslint-disable react/no-unknown-property */
import { Point2D } from '../../types/Point';

export enum SphereType {
  Basic = 1,
  Preview,
  Hover,
}

export function Sphere({
  position,
  type,
} :
   {position: Point2D, type: SphereType}): JSX.Element {
  switch (type) {
    case SphereType.Hover:
      return (
        <>
          <mesh position={[position.x, 0, position.y]}>
            <sphereGeometry args={[0.2, 32, 32]} />
            <meshStandardMaterial color="green" transparent opacity={0.5} />
          </mesh>
          <Sphere position={position} type={SphereType.Basic} />
        </>
      );
    case SphereType.Preview:
      return (
        <mesh position={[position.x, 0, position.y]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="blue" transparent opacity={0.5} />
        </mesh>
      );
    case SphereType.Basic:
      return (
        <mesh position={[position.x, 0, position.y]}>
          <sphereGeometry args={[0.1, 32, 32]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      );
    default:
      return <mesh />;
  }
}

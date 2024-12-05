/* eslint-disable react/no-unknown-property */
import { Point2D } from '../../types/Point';

export enum SphereType {
  Basic = 1,
  Preview,
}

export function Sphere({
  position,
  type,
} :
   {position: Point2D, type: SphereType}): JSX.Element {
  const getShpereMaterial = () => {
    switch (type) {
      case SphereType.Preview:
        return <meshStandardMaterial color="blue" transparent opacity={0.5} />;
      case SphereType.Basic:
        return <meshStandardMaterial color="orange" />;
      default:
        return <meshStandardMaterial color="gray" />;
    }
  };

  return (
    <mesh position={[position.x, 0, position.y]}>
      <sphereGeometry args={[0.1, 32, 32]} />
      {getShpereMaterial()}
    </mesh>
  );
}

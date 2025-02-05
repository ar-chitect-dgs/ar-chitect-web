/* eslint-disable react/no-unknown-property */
import * as THREE from 'three';
import { useSelector } from 'react-redux';
import { Point2D } from '../../types/Point';
import { sceneSelector } from '../../redux/slices/editor';

function getShape(points: Point2D[]): THREE.Shape {
  const shape = new THREE.Shape();
  points.forEach((point, index) => {
    if (index === 0) {
      shape.moveTo(point.x, point.y);
    } else {
      shape.lineTo(point.x, point.y);
    }
  });
  return shape;
}

export function Floor({ points }: { points: Point2D[] }): JSX.Element {
  const { scene } = useSelector(sceneSelector);

  const shape = getShape(points);
  const extrudeSettings = { depth: 0.1, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  if (points.length < 2) return (<></>);

  return (
    <mesh
      geometry={geometry}
      rotation={[Math.PI / 2, 0, 0]}
      position={[0, 0.01, 0]}
    >
      <meshStandardMaterial color={scene.floorColor} />
    </mesh>
  );
}

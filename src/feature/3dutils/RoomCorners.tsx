import { Point2D } from '../../types/Point';
import { arePointsClose } from '../../utils/utils';
import { Sphere, SphereType } from './Sphere';

export function Vertices({ points, preview } : {points: Point2D[], preview: Point2D}): JSX.Element {
  return (
    <>
      {points.map((p: Point2D) => (
        <Sphere
          key={`${p.x}_${p.y}`}
          position={p}
          type={arePointsClose(p, preview) ? SphereType.Hover : SphereType.Basic}
        />
      ))}
    </>
  );
}

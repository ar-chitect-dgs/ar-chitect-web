import { Point2D } from '../../types/Point';
import { arePointsCloseAndDistance } from '../../utils/utils';
import { DynamicSphere } from './DynamicSphere';
import { Sphere, SphereType } from './Sphere';

export function Vertices({ points, preview } : {points: Point2D[], preview: Point2D}): JSX.Element {
  return (
    <>
      {points.map((p: Point2D) => {
        const [areClose, distance] = arePointsCloseAndDistance(p, preview);
        return areClose ? (
          <DynamicSphere
            key={`${p.x}_${p.y}`}
            position={p}
            distance={distance}
          />
        ) : (
          <Sphere
            key={`${p.x}_${p.y}`}
            position={p}
            type={SphereType.Basic}
          />
        );
      })}
    </>
  );
}

/* eslint-disable react/no-array-index-key */
import { Point2D } from '../../types/Point';
import { arePointsCloseAndDistance } from '../../utils/utils';
import { DynamicSphere } from './DynamicSphere';
import { Sphere, SphereType } from './Sphere';

export function RoomCorners({ points, preview }
  : {points: Point2D[], preview: Point2D}): JSX.Element {
  return (
    <>
      {points.map((p: Point2D, index: number) => {
        const [areClose, distance] = arePointsCloseAndDistance(p, preview);
        return areClose ? (
          <DynamicSphere
            key={`${p.x}_${p.y}_${index}`}
            position={p}
            distance={distance}
          />
        ) : (
          <Sphere
            key={`${p.x}_${p.y}_${index}`}
            position={p}
            type={SphereType.Basic}
          />
        );
      })}
    </>
  );
}

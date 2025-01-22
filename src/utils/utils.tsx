import * as THREE from 'three';
import { Point2D } from '../types/Point';

export function positionToString(pos: { x: number, y: number, z: number }): string {
  return `[${pos.x}, ${pos.y}, ${pos.z}]`;
}

export function round(val: number, decimalPlaces: number): number {
  return Number(val.toFixed(decimalPlaces));
}

const pointEps = 0.2;

export function getDistance(p1: Point2D, p2: Point2D): number {
  const x = (p1.x - p2.x);
  const y = (p1.y - p2.y);
  return Math.sqrt(x * x + y * y);
}

export function arePointsClose(p1: Point2D, p2: Point2D): boolean {
  return getDistance(p1, p2) < pointEps;
}

export function arePointsCloseAndDistance(p1: Point2D, p2: Point2D): [boolean, number] {
  const dist = getDistance(p1, p2);
  return [dist < pointEps, dist];
}

function isClockwise(points: Point2D[]): boolean {
  let sum = 0;
  for (let i = 0; i < points.length; i += 1) {
    const v = points[i];
    const u = points[(i + 1) % points.length];

    sum += (u.x - v.x) * (u.y + v.y);
  }
  return sum > 0.0;
}

export function normalizePoints(p: Point2D[]): Point2D[] {
  if (p.length === 0) return [];

  let points = [...p];

  if (isClockwise(points)) {
    points = points.reverse();
  }

  const sum = points.reduce(
    (acc, point) => {
      acc.x += point.x;
      acc.y += point.y;
      return acc;
    },
    { x: 0, y: 0 },
  );

  const centerOfMass = {
    x: round(sum.x / points.length, 2),
    y: round(sum.y / points.length, 2),
  };

  return points.map((point) => ({
    x: round(point.x - centerOfMass.x, 2),
    y: round(point.y - centerOfMass.y, 2),
  }));
}

const snapEps = 0.7;

// todo move
export function distanceToSegment(
  point: THREE.Vector2, v: THREE.Vector2, u: THREE.Vector2,
): number {
  const l2 = v.distanceToSquared(u);
  if (l2 === 0) return point.distanceTo(v);
  const t = Math.max(0, Math.min(1, point.clone().sub(v).dot(u.clone().sub(v)) / l2));
  const projection = v.clone().add(u.clone().sub(v).multiplyScalar(t));
  return point.distanceTo(projection);
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function snapObject(
  position: THREE.Vector2,
  depth: number,
  corners: Point2D[],
): {
  snapped: boolean,
  position: THREE.Vector2,
  rotation: number,
} {
  let minDistance = Infinity;

  let closestWallIndex = -1;

  for (let i = 0; i < corners.length; i += 1) {
    const v = new THREE.Vector2(corners[i].x, corners[i].y);
    const u = new THREE.Vector2(
      corners[(i + 1) % corners.length].x,
      corners[(i + 1) % corners.length].y,
    );
    const distance = distanceToSegment(position, v, u);

    if (distance < minDistance && distance < snapEps) {
      minDistance = distance;
      closestWallIndex = i;
    }
  }

  if (closestWallIndex === -1) {
    return { snapped: false, position, rotation: 0 };
  }

  const i = closestWallIndex;
  const v = new THREE.Vector2(corners[i].x, corners[i].y);
  const u = new THREE.Vector2(
    corners[(i + 1) % corners.length].x,
    corners[(i + 1) % corners.length].y,
  );

  const segmentVector = u.clone().sub(v);

  let projection = position.clone().sub(v).dot(segmentVector) / v.distanceToSquared(u);
  projection = clamp(projection, 0, 1);

  const onWallPosition = v.clone().lerp(
    u,
    projection,
  );

  const isInFront = position.length() < onWallPosition.length();

  const rejectionVector = position.clone().sub(onWallPosition);
  rejectionVector.normalize();
  const objectOffsetVector = rejectionVector.multiplyScalar((isInFront ? 1 : -1) * (depth / 2));

  const ret = onWallPosition.clone().add(objectOffsetVector);

  const normal = new THREE.Vector2(segmentVector.y, -segmentVector.x);
  return { snapped: true, position: ret, rotation: Math.PI - normal.angle() };
}

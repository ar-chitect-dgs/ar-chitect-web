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
  const objectOffsetVector = rejectionVector.multiplyScalar(
    (isInFront ? 1 : -1) * ((depth / 2) + 0.06),
  );

  const ret = onWallPosition.clone().add(objectOffsetVector);

  const normal = new THREE.Vector2(segmentVector.y, -segmentVector.x);
  return { snapped: true, position: ret, rotation: -normal.angle() - Math.PI / 2 };

interface Vector2D {
  x: number;
  y: number;
}

export function positionToString(pos: {
  x: number;
  y: number;
  z: number;
}): string {
  return `[${pos.x}, ${pos.y}, ${pos.z}]`;
}

function onSegment(p: Vector2D, q: Vector2D, r: Vector2D): boolean {
  return (
    q.x <= Math.max(p.x, r.x)
    && q.x >= Math.min(p.x, r.x)
    && q.y <= Math.max(p.y, r.y)
    && q.y >= Math.min(p.y, r.y)
  );
}

function orientation(p: Vector2D, q: Vector2D, r: Vector2D): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return 0; // collinear
  return val > 0 ? 1 : 2; // clockwise or counterclockwise
}

function doIntersect(
  p1: Vector2D,
  q1: Vector2D,
  p2: Vector2D,
  q2: Vector2D,
): boolean {
  const o1 = orientation(p1, q1, p2);
  const o2 = orientation(p1, q1, q2);
  const o3 = orientation(p2, q2, p1);
  const o4 = orientation(p2, q2, q1);

  // General case
  if (o1 !== o2 && o3 !== o4) return true;

  // Special cases
  if (o1 === 0 && onSegment(p1, p2, q1)) return true;
  if (o2 === 0 && onSegment(p1, q2, q1)) return true;
  if (o3 === 0 && onSegment(p2, p1, q2)) return true;
  if (o4 === 0 && onSegment(p2, q1, q2)) return true;

  return false;
}

export function isInsidePolygon(corners: Vector2D[], point: Vector2D): boolean {
  const n = corners.length;
  if (n < 3) return false;

  const extreme: Vector2D = { x: Number.MAX_SAFE_INTEGER, y: point.y };

  let count = 0;
  let i = 0;
  do {
    const next = (i + 1) % n;

    if (doIntersect(corners[i], corners[next], point, extreme)) {
      if (orientation(corners[i], point, corners[next]) === 0) {
        return onSegment(corners[i], point, corners[next]);
      }
      count += 1;
    }
    i = next;
  } while (i !== 0);

  return count % 2 === 1;
}

export function test(): void {
  const polygon: Vector2D[] = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 5, y: 5 },
    { x: 10, y: 10 },
    { x: 0, y: 10 },
  ];
  const p: Vector2D = { x: 6, y: 5 };
  if (isInsidePolygon(polygon, p)) {
    console.log('Point is inside the polygon.\n');
  } else {
    console.log('Point is outside the polygon.\n');
  }
}

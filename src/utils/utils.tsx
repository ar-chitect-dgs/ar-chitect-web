import { Point2D } from '../types/Point';

export function positionToString(pos: { x: number, y: number, z: number }): string {
  return `[${pos.x}, ${pos.y}, ${pos.z}]`;
}

export function round(val: number, decimalPlaces: number): number {
  return Number(val.toFixed(decimalPlaces));
}

const EPS = 0.2;

export function getDistance(p1: Point2D, p2: Point2D): number {
  const x = (p1.x - p2.x);
  const y = (p1.y - p2.y);
  return Math.sqrt(x * x + y * y);
}

export function arePointsClose(p1: Point2D, p2: Point2D): boolean {
  return getDistance(p1, p2) < EPS;
}

export function arePointsCloseAndDistance(p1: Point2D, p2: Point2D): [boolean, number] {
  const dist = getDistance(p1, p2);
  return [dist < EPS, dist];
}

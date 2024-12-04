import { Point2D } from '../types/Point';

export function positionToString(pos: { x: number, y: number, z: number }): string {
  return `[${pos.x}, ${pos.y}, ${pos.z}]`;
}

export function round(val: number, decimalPlaces: number): number {
  return Number(val.toFixed(decimalPlaces));
}

const EPS = 0.2;

export function arePointsClose(p1: Point2D, p2: Point2D): boolean {
  return Math.abs(p1.x - p2.x) < EPS && Math.abs(p1.y - p2.y) < EPS;
}

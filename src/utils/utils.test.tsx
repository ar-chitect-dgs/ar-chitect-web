import { Point2D } from '../types/Point';
import {
  arePointsClose, arePointsCloseAndDistance, getDistance, normalizePoints, positionToString, round,
} from './utils';

describe('positionToString', () => {
  it('should convert position to string', () => {
    const pos = { x: 1, y: 2, z: 3 };
    expect(positionToString(pos)).toBe('[1, 2, 3]');
  });
});

describe('round', () => {
  it('should round numbers to specified decimal places', () => {
    expect(round(1.2345, 2)).toBe(1.23);
    expect(round(1.2355, 2)).toBe(1.24);
  });
});

describe('getDistance', () => {
  it('should calculate distance between two points', () => {
    const p1: Point2D = { x: 0, y: 0 };
    const p2: Point2D = { x: 3, y: 4 };
    expect(getDistance(p1, p2)).toBe(5);
  });
});

describe('arePointsClose', () => {
  it('should return true if points are within EPS distance', () => {
    const p1: Point2D = { x: 0, y: 0 };
    const p2: Point2D = { x: 0.1, y: 0.1 };
    expect(arePointsClose(p1, p2)).toBe(true);
  });

  it('should return false if points are not within EPS distance', () => {
    const p1: Point2D = { x: 0, y: 0 };
    const p2: Point2D = { x: 1, y: 1 };
    expect(arePointsClose(p1, p2)).toBe(false);
  });
});

describe('arePointsCloseAndDistance', () => {
  it('should return correct boolean and distance', () => {
    const p1: Point2D = { x: 0, y: 0 };
    const p2: Point2D = { x: 0.1, y: 0.1 };
    const [isClose, distance] = arePointsCloseAndDistance(p1, p2);
    expect(isClose).toBe(true);
    expect(distance).toBeCloseTo(0.141, 3);
  });
});

describe('normalizePoints', () => {
  it('should normalize points around the center of mass', () => {
    const points: Point2D[] = [
      { x: 1, y: 1 },
      { x: 2, y: 2 },
      { x: 3, y: 3 },
    ];
    const normalized = normalizePoints(points);
    expect(normalized).toEqual([
      { x: -1, y: -1 },
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]);
  });

  it('should return empty array for empty input', () => {
    const points: Point2D[] = [];
    expect(normalizePoints(points)).toEqual([]);
  });
});

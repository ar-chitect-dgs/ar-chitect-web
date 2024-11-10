interface Vector2D {
  x: number;
  y: number;
}

// Utility function to convert 3D position to a string
export function positionToString(pos: {
  x: number;
  y: number;
  z: number;
}): string {
  return `[${pos.x}, ${pos.y}, ${pos.z}]`;
}

// Check if point q lies on segment pr
function onSegment(p: Vector2D, q: Vector2D, r: Vector2D): boolean {
  return (
    q.x <= Math.max(p.x, r.x)
    && q.x >= Math.min(p.x, r.x)
    && q.y <= Math.max(p.y, r.y)
    && q.y >= Math.min(p.y, r.y)
  );
}

// Find orientation of triplet (p, q, r)
// Returns 0 if collinear, 1 if clockwise, 2 if counterclockwise
function orientation(p: Vector2D, q: Vector2D, r: Vector2D): number {
  const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (val === 0) return 0; // collinear
  return val > 0 ? 1 : 2; // clockwise or counterclockwise
}

// Check if two line segments intersect
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

// Check if a point is inside a polygon
export function isInsidePolygon(corners: Vector2D[], point: Vector2D): boolean {
  const n = corners.length;
  if (n < 3) return false; // A polygon must have at least 3 vertices

  // Create a point for line segment from `point` to infinity
  const extreme: Vector2D = { x: Number.MAX_SAFE_INTEGER, y: point.y };

  // Count intersections of the above line with the sides of the polygon
  let count = 0;
  let i = 0;
  do {
    const next = (i + 1) % n;

    if (doIntersect(corners[i], corners[next], point, extreme)) {
      // If the point is collinear with the line segment, check if it lies on the segment
      if (orientation(corners[i], point, corners[next]) === 0) {
        return onSegment(corners[i], point, corners[next]);
      }
      count += 1;
    }
    i = next;
  } while (i !== 0);

  // Return true if count is odd, false otherwise
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

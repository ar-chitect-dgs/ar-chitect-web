export function positionToString(pos: { x: number, y: number, z: number }): string {
  return `[${pos.x}, ${pos.y}, ${pos.z}]`;
}

export function round(val: number, decimalPlaces: number): number {
  return Number(val.toFixed(decimalPlaces));
}

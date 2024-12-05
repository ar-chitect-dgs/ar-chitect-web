import { Point3D } from './Point';

export interface Object3D {
  id: string;
  color: string;
  position: Point3D;
  rotation: Point3D;
}
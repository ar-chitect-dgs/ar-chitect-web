import { Point3D } from './Point';

export interface Object3D {
  objectId: string; // id in database
  color: string;
  position: Point3D;
  rotation: Point3D;
}

import { Vector3D } from './Scene';

export interface Object3D {
  objectId: string; // id in database
  color: string;
  position: Vector3D;
  rotation: Vector3D;
}

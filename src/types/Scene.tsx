import { Point3D } from './Point';

export interface SceneObject {
  projectId: number; // id in project
  objectId: string; // id in database
  name: string;
  color: string;
  url: string;
  position: Point3D;
  rotation: Point3D;
  active: boolean;
  hovered: boolean;
}

export interface Scene {
  objectIds: number[];
  objects: { [id: number]: SceneObject };
  selectedObjectId: number | null;
}

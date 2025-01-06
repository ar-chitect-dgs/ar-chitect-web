import { Point2D, Point3D } from './Point';

export interface SceneObject {
  inProjectId: number; // id in project
  objectId: string; // id in database
  name: string;
  color: string;
  url: string;
  position: Point3D;
  rotation: Point3D;
}

export interface Scene {
  corners: Point2D[];
  objectIds: number[];
  objects: { [id: number]: SceneObject };
  hoveredObjectId: number | null;
  activeObjectId: number | null;
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface SceneObject {
  id: number; // id in project
  objectId: string; // id in database
  name: string;
  color: string;
  url: string;
  position: Vector3D;
  rotation: Vector3D;
  active: boolean;
  hovered: boolean;
}

export interface Scene {
  objectIds: number[];
  objects: { [id: number]: SceneObject };
  selectedObjectId: number | null;
}

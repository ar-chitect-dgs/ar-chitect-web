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

export interface Object3D {
  objectId: string; // id in database
  color: string;
  position: Vector3D;
  rotation: Vector3D;
}

export interface Project {
  projectName: string;
  objects: Object3D[];
  corners: Vector3D[];
  isFirstTime: boolean;
  latitude: number;
  longitude: number;
  orientation: number;
  createdAt: number;
  modifiedAt: number;
  thumb: string;
  id?: string;
}

export interface Projects {
  [projectId: string]: Project;
}

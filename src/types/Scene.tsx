// position isn't a Vector3 to make Object serializable.
// see https://redux.js.org/faq/organizing-state#can-i-put-functions-promises-or-other-non-serializable-items-in-my-store-state for reference
export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface SceneObject {
  id: number; // id in project
  dbId: string; // id in database
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
}

export interface Projects {
  [projectId: string]: Project;
}

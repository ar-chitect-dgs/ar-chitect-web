import { Object3D } from './Object3D';
import { Vector3D } from './Scene';

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

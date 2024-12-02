import { Object3D } from './Object3D';
import { Point2D } from './Point';

export interface Project {
  projectName: string;
  objects: Object3D[];
  corners: Point2D[];
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

import { Object3D } from './Object3D';
import { Point2D } from './Point';

export interface Project {
  projectName: string;
  objects: Object3D[];
  corners: Point2D[];
  isFirstTime: boolean;
  modifiedAt: number;
  id?: string;
}

export interface Projects {
  [projectId: string]: Project;
}

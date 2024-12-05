import { Point3D, Point2D } from '../types/Point';

export interface ApiObject3D {
  id: string;
  color: string;
  position: Point3D;
  rotation: Point3D;
}

export interface ApiProject {
  projectName: string;
  objects: ApiObject3D[];
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

export interface ApiProjects {
  [projectId: string]: ApiProject;
}

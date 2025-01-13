import { Point3D, Point2D } from '../types/Point';

export interface ApiObject3D {
  id: string;
  color: string;
  name: string;
  position: Point3D;
  rotation: Point3D;
}

export interface ApiProject {
  projectName: string;
  objects: ApiObject3D[];
  corners: Point2D[];
  createdAt: number;
  modifiedAt: number;
  thumb: string;
  id?: string;
}

export interface ApiProjects {
  [projectId: string]: ApiProject;
}

export interface ApiModel {
  id: string;
  name: string;
  colorVariants: {
    [color: string]: {
      thumb: string;
      modelUrl: string;
      url: string;
    };
  };
}

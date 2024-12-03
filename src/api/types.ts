export interface ApiPoint3D {
  x: number;
  y: number;
  z: number;
}

export interface ApiPoint2D {
  x: number;
  y: number;
}

export interface ApiObject3D {
  id: string;
  color: string;
  position: ApiPoint3D;
  rotation: ApiPoint3D;
}

export interface ApiProject {
  projectName: string;
  objects: ApiObject3D[];
  corners: ApiPoint2D[];
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

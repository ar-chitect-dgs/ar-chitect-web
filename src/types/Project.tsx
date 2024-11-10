export interface Object3D {
  objectId: number;
  name: string;
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

export interface ProjectsData {
  projects: ProjectData[];
}

export interface ProjectData {
  projectId: string;
  projectName: string;
  objects: ObjectData[];
}

export interface ObjectData {
  objectId: number;
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}

export interface ModelData {
  name: string;
  colorVariants: Record<
    string,
    {
      thumb: string;
      url: string;
    }
  >;
}

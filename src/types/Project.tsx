export interface Project {
  projectId: string | undefined;
  projectName: string;
  createdAt: number;
  thumbnail?: string;
  isNewProject: boolean;
}

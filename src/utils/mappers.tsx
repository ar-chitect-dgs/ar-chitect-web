import { fetchGLBUrl } from '../api/projects';
import { ApiProject } from '../api/projects/types';
import { DEFAULT_WALL_COLOR, DEFAULT_FLOOR_COLOR } from '../redux/slices/editor';
import { Object3D } from '../types/Object3D';
import { Project } from '../types/Project';
import { ProjectScene } from '../types/ProjectScene';
import { Scene, SceneObject } from '../types/Scene';

export function mapProjectSceneToApiProject(
  scene: Scene,
  project: Project,
): Partial<ApiProject> {
  const objects: Object3D[] = scene.objectIds.map((id) => {
    const sceneObject = scene.objects[id];
    if (!sceneObject) {
      throw new Error(`Object with ID ${id} not found in scene.`);
    }
    return {
      id: sceneObject.objectId,
      color: sceneObject.color,
      name: sceneObject.name,
      position: sceneObject.position,
      rotation: sceneObject.rotation,
    };
  });

  const firstTimeFields = project.isNewProject
    ? {
      createdAt: project.createdAt,
    }
    : {};

  return {
    ...firstTimeFields,
    ...(project.thumbnail && { thumb: project.thumbnail }),
    projectName: project.projectName,
    wallColor: scene.wallColor ?? DEFAULT_WALL_COLOR,
    floorColor: scene.floorColor ?? DEFAULT_FLOOR_COLOR,
    corners: scene.corners,
    objects,
    modifiedAt: Date.now(),
  };
}

export async function mapApiProjectToProjectScene(
  apiProject: ApiProject,
  isTemplate = false,
): Promise<ProjectScene> {
  const objects: { [id: number]: SceneObject } = {};
  const objectIds: number[] = [];

  await Promise.all(
    apiProject.objects.map(async (obj, index) => {
      const url = await fetchGLBUrl(obj.id, obj.color);
      const sceneObject: SceneObject = {
        inProjectId: index,
        objectId: obj.id,
        name: obj.name,
        color: obj.color,
        url,
        position: obj.position,
        rotation: obj.rotation,
      };

      objects[index] = sceneObject;
      objectIds.push(index);
    }),
  );

  const scene: Scene = {
    corners: apiProject.corners,
    wallColor: apiProject.wallColor ?? DEFAULT_WALL_COLOR,
    floorColor: apiProject.floorColor ?? DEFAULT_FLOOR_COLOR,
    objectIds,
    objects,
    activeObjectId: null,
    hoveredObjectId: null,
  };

  const project: Project = {
    projectName: apiProject.projectName,
    projectId: isTemplate ? undefined : apiProject.id,
    thumbnail: apiProject.thumb,
    createdAt: apiProject.createdAt,
    isNewProject: isTemplate,
  };

  return { scene, project };
}

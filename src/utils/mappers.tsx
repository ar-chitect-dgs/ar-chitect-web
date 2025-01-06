import { fetchGLBUrl } from '../api/projectsApi';
import { ApiProject } from '../api/types';
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
    corners: scene.corners,
    objects,
    modifiedAt: Date.now(),
  };
}

export async function mapApiProjectToProjectScene(
  apiProject: ApiProject,
): Promise<ProjectScene> {
  const objects: { [id: number]: SceneObject } = {};
  const objectIds: number[] = [];

  await Promise.all(
    apiProject.objects.map(async (obj, index) => {
      const url = await fetchGLBUrl(obj.id, obj.color);
      const sceneObject: SceneObject = {
        inProjectId: index,
        objectId: obj.id,
        name: `Object-${index}`,
        color: obj.color,
        url,
        position: obj.position,
        rotation: obj.rotation,
        active: false,
        hovered: false,
      };

      objects[index] = sceneObject;
      objectIds.push(index);
    }),
  );

  const scene: Scene = {
    corners: apiProject.corners,
    objectIds,
    objects,
    activeObjectId: null,
    hoveredObjectId: null,
  };

  const project: Project = {
    projectName: apiProject.projectName,
    projectId: apiProject.id || '',
    thumbnail: apiProject.thumb,
    createdAt: apiProject.createdAt,
    isNewProject: false,
  };

  return { scene, project };
}

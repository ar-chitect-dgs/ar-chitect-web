import { fetchGLBUrl } from '../api/projectsApi';
import { ApiProject } from '../api/types';
import { Object3D } from '../types/Object3D';
import { Scene, SceneObject } from '../types/Scene';

export function mapSceneToApiProject(
  scene: Scene,
  projectName: string,
  corners: Point3D[],
  thumb: string,
  createdAt: number,
): ApiProject {
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

  return {
    projectName: scene.projectName,
    corners: scene.corners,
    objects,
    isFirstTime: true,
    latitude: 0,
    longitude: 0,
    orientation: 0,
    createdAt,
    modifiedAt: Date.now(),
    thumb,
  };
}

export async function mapApiProjectToScene(
  project: ApiProject,
): Promise<Scene> {
  const objects: { [id: number]: SceneObject } = {};
  const objectIds: number[] = [];

  await Promise.all(
    project.objects.map(async (obj, index) => {
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

  return {
    projectName: project.projectName,
    projectId: project.id || '',
    corners: project.corners,
    objectIds,
    objects,
    selectedObjectId: null,
  };
}

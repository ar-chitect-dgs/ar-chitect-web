import {
  Object3D,
  Project,
  Scene,
  SceneObject,
  Vector3D,
} from '../types/Scene';
import { fetchGLBUrl } from './firebaseUtils';

export function mapSceneToProject(
  scene: Scene,
  projectId: string,
  projectName: string,
  corners: Vector3D[],
): Project {
  const objects: Object3D[] = scene.objectIds.map((id) => {
    const sceneObject = scene.objects[id];
    if (!sceneObject) {
      throw new Error(`Object with ID ${id} not found in scene.`);
    }
    return {
      objectId: sceneObject.objectId,
      color: sceneObject.color,
      position: sceneObject.position,
      rotation: sceneObject.rotation,
    };
  });

  return {
    projectId,
    projectName,
    objects,
    corners,
    isFirstTime: true,
    latitude: 0,
    longitude: 0,
    orientation: 0,
  };
}

export async function mapProjectToScene(project: Project): Promise<Scene> {
  const objects: { [id: number]: SceneObject } = {};
  const objectIds: number[] = [];

  project.objects.forEach(async (obj, index) => {
    const url = await fetchGLBUrl(obj.objectId, obj.color);
    const sceneObject: SceneObject = {
      id: index,
      objectId: obj.objectId,
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
  });

  return {
    objectIds,
    objects,
  };
}

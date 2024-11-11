import { doc, getDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { Object3D, ProjectData, ProjectsData } from '../types/Project';

const MODELS_DIRECTORY = 'models/';

export const fetchProjectsData = async (
  userId: string,
): Promise<ProjectsData> => {
  const projectsDoc = await getDoc(doc(db, 'projects', userId));
  const projectsData = projectsDoc.data() as ProjectsData;
  return projectsData;
};

export const fetchGLBUrl = async (path: string): Promise<string> => {
  const reference = ref(storage, MODELS_DIRECTORY + path);
  const url = await getDownloadURL(reference);
  return url;
};

export async function fetchObjectsWithModelUrls(
  projectData: ProjectData,
): Promise<Object3D[]> {
  const results = await Promise.all(
    projectData.objects.map(async (object) => {
      const modelDoc = await getDoc(
        doc(db, 'models', object.objectId.toString()),
      );

      if (!modelDoc.exists()) {
        throw new Error(
          `Model with ID ${object.objectId} not found in Firestore`,
        );
      }

      const modelData = modelDoc.data();
      const colorData = modelData.color_variants[object.color];

      if (!colorData) {
        throw new Error(
          `Color ${object.color} not found for model ${object.objectId}`,
        );
      }

      const glbUrl = await fetchGLBUrl(colorData.url);

      return {
        objectId: object.objectId,
        name: modelData.name,
        position: object.position,
        rotation: object.rotation,
        url: glbUrl,
      };
    }),
  );

  return results;
}

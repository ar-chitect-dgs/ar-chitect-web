import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { Projects, Scene, Vector3D } from '../types/Scene';
import { mapProjectToScene, mapSceneToProject } from './mappers';

const MODELS_DIRECTORY = 'models/';

export const fetchProjectsData = async (userId: string): Promise<Projects> => {
  const projectsDoc = await getDoc(doc(db, 'projects', userId));
  const projectsData = projectsDoc.data() as Projects;
  return projectsData;
};

export const getProject = async (
  projectId: string,
  projects: Projects,
): Promise<Scene> => {
  const project = projects.projects.find((p) => p.projectId === projectId);

  if (!project) {
    throw new Error(`Project with ID ${projectId} not found.`);
  }

  const scene = await mapProjectToScene(project);
  return scene;
};

export const fetchGLBUrl = async (
  objectId: string,
  color: string,
): Promise<string> => {
  const modelDoc = await getDoc(doc(db, 'models2', objectId));

  if (!modelDoc.exists()) {
    throw new Error(`Model with ID ${objectId} not found in Firestore`);
  }
  const modelData = modelDoc.data();

  const colorData = modelData.color_variants[color];
  if (!colorData) {
    throw new Error(`Color ${color} not found for model ${objectId}`);
  }

  const reference = ref(storage, MODELS_DIRECTORY + colorData.url);
  const url = await getDownloadURL(reference);
  return url;
};

function generateRandomProjectId(): string {
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 8;
  let randomPart = '';
  for (let i = 0; i < length; i += 1) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomPart += charset[randomIndex];
  }

  const timestamp = Date.now().toString(36);

  return `${randomPart}-${timestamp}`;
}

export const saveProject = async (
  userId: string,
  scene: Scene,
  projectName: string,
  corners: Vector3D[],
): Promise<boolean> => {
  const projectId = generateRandomProjectId();
  const project = mapSceneToProject(scene, projectId, projectName, corners);
  const userProjectsRef = doc(db, 'projects', userId);

  const userProjectsDoc = await getDoc(userProjectsRef);

  if (userProjectsDoc.exists()) {
    const userProjects = userProjectsDoc.data()?.projects || [];
    userProjects.push(project);

    await updateDoc(userProjectsRef, { projects: userProjects });
  } else {
    await setDoc(userProjectsRef, { projects: [project] });
  }

  console.log(`Project "${projectName}" has been saved for user ${userId}.`);
  return true;
};

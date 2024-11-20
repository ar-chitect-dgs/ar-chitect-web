import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { Project, Projects, Scene, Vector3D } from '../types/Scene';
import { mapProjectToScene, mapSceneToProject } from './mappers';

const MODELS_DIRECTORY = 'models/';
export const fetchProjectsData = async (userId: string): Promise<Projects> => {
  const projectsRef = collection(db, 'projects', userId, 'projects');
  const querySnapshot = await getDocs(projectsRef);

  const projectsData: Projects = {};

  querySnapshot.docs.forEach((doc) => {
    const projectData = doc.data() as Project;
    projectsData[doc.id] = projectData;
  });

  return projectsData;
};

export const getProject = async (
  projectId: string,
  userId: string,
): Promise<Scene> => {
  // Pobieranie konkretnego projektu z kolekcji
  const projectRef = doc(db, 'projects', userId, 'projects', projectId);
  const projectDoc = await getDoc(projectRef);

  if (!projectDoc.exists()) {
    throw new Error(`Project with ID ${projectId} not found.`);
  }

  const project = projectDoc.data() as Project;
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
  const project = mapSceneToProject(scene, projectName, corners);

  const projectsRef = collection(db, 'projects', userId, 'projects');
  const projectRef = doc(projectsRef, projectId);

  await setDoc(projectRef, project);

  console.log(`Project "${projectName}" has been saved for user ${userId}.`);
  return true;
};

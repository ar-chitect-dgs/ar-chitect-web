import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
} from 'firebase/firestore';
import { ref, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import {
  Project, Projects, Scene, Vector3D,
} from '../types/Scene';
import { mapProjectToScene, mapSceneToProject } from './mappers';

const MODELS_DIRECTORY = 'models/';

export const fetchProjectsData = async (userId: string): Promise<Projects> => {
  const projectsRef = collection(db, 'users', userId, 'projects');
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
  const projectRef = doc(db, 'users', userId, 'projects', projectId);
  const projectDoc = await getDoc(projectRef);

  if (!projectDoc.exists()) {
    throw new Error(`Project with ID ${projectId} not found.`);
  }

  const project = projectDoc.data() as Project;
  const scene = await mapProjectToScene(project);
  return scene;
};

export const getAllProjects = async (userId: string): Promise<Project[]> => {
  const projectsRef = collection(db, 'users', userId, 'projects');
  const snapshot = await getDocs(projectsRef);

  const projects: Project[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as Project;
    projects.push({ ...data, id: doc.id });
  });
  console.log(projects);
  return projects;
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

export const saveProject = async (
  userId: string,
  scene: Scene,
  projectName: string,
  corners: Vector3D[],
): Promise<boolean> => {
  const project = mapSceneToProject(scene, projectName, corners);
  const projectsRef = collection(db, 'users', userId, 'projects');
  const projectRef = doc(projectsRef);

  await setDoc(projectRef, project);

  console.log(`Project "${projectName}" has been saved for user ${userId}.`);
  return true;
};

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { Point2D } from '../types/Point';
import {
  Scene,
} from '../types/Scene';
import { mapApiProjectToScene, mapSceneToApiProject } from '../utils/mappers';
import { normalizePoints } from '../utils/utils';
import { ApiProject, ApiProjects } from './types';

const MODELS_DIRECTORY = 'models/';

export const fetchProjectsData = async (userId: string): Promise<ApiProjects> => {
  const projectsRef = collection(db, 'users', userId, 'projects');
  const querySnapshot = await getDocs(projectsRef);

  const projectsData: ApiProjects = {};

  querySnapshot.docs.forEach((doc) => {
    const projectData = doc.data() as ApiProject;
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

  const project = projectDoc.data() as ApiProject;
  const scene = await mapApiProjectToScene(project);
  return scene;
};

export const fetchAllProjects = async (userId: string): Promise<ApiProject[]> => {
  const projectsRef = collection(db, 'users', userId, 'projects');
  const snapshot = await getDocs(projectsRef);

  const projects: ApiProject[] = [];
  snapshot.forEach((doc) => {
    const data = doc.data() as ApiProject;
    projects.push({ ...data, id: doc.id });
  });
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

export const createProject = async (
  userId: string,
  projectName: string,
  corners: Point2D[],
): Promise<[boolean, string]> => {
  try {
    const project = mapSceneToApiProject(
      {
        corners: normalizePoints(corners),
        objectIds: [],
        objects: {},
        selectedObjectId: null,
      },
      projectName,
    );
    const projectsRef = collection(db, 'users', userId, 'projects');
    const projectRef = doc(projectsRef);

    await setDoc(projectRef, project);

    return [true, projectRef.id];
  } catch (error) {
    console.error('Error creating project:', error);
    return [false, ''];
  }
};

export const saveProject = async (
  userId: string,
  scene: Scene,
  projectName: string,
): Promise<boolean> => {
  try {
    const project = mapSceneToApiProject(scene, projectName);
    const projectsRef = collection(db, 'users', userId, 'projects');
    const projectRef = doc(projectsRef);

    await setDoc(projectRef, project);

    return true;
  } catch (error) {
    console.error('Error saving project:', error);
    return false;
  }
};

export const fetchModelsList = async (): Promise<
  { id: string; name: string }[]
> => {
  const modelsRef = collection(db, 'models2');
  const querySnapshot = await getDocs(modelsRef);

  const models = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name,
  }));

  return models;
};

export const fetchModelColors = async (objectId: string): Promise<string[]> => {
  const modelRef = doc(db, 'models2', objectId);
  const modelDoc = await getDoc(modelRef);

  if (!modelDoc.exists()) {
    throw new Error(`Model with ID ${objectId} not found.`);
  }

  const modelData = modelDoc.data();
  const colorVariants = modelData.color_variants || {};

  return Object.keys(colorVariants);
};

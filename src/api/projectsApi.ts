import {
  collection, deleteDoc, doc, getDoc, getDocs, setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';
import { Scene } from '../types/Scene';
import { ApiModel, ApiProject, ApiProjects } from './types';
import { Project } from '../types/Project';
import { ProjectScene } from '../types/ProjectScene';
import {
  mapApiProjectToProjectScene,
  mapProjectSceneToApiProject,
} from '../utils/mappers';

const MODELS_DIRECTORY = 'models/';

export const fetchProjectsData = async (
  userId: string,
): Promise<ApiProjects> => {
  const projectsRef = collection(db, 'users', userId, 'projects');
  const querySnapshot = await getDocs(projectsRef);

  const projectsData: ApiProjects = {};

  querySnapshot.docs.forEach((doc) => {
    const projectData = doc.data() as ApiProject;
    projectsData[doc.id] = projectData;
  });

  return projectsData;
};

export const getProjectScene = async (
  projectId: string,
  userId: string,
): Promise<ProjectScene> => {
  const projectRef = doc(db, 'users', userId, 'projects', projectId);
  const projectDoc = await getDoc(projectRef);

  if (!projectDoc.exists()) {
    throw new Error(`Project with ID ${projectId} not found.`);
  }

  const project = projectDoc.data() as ApiProject;
  return mapApiProjectToProjectScene(project);
};

export const fetchAllProjects = async (
  userId: string,
): Promise<ApiProject[]> => {
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
  const modelDoc = await getDoc(doc(db, 'models', objectId));

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
export const saveProjectThumbnail = async (
  blob: Blob,
  id: string,
): Promise<string> => {
  const storageRef = ref(storage, `projectThumbnails/${id}.png`);
  const snapshot = await uploadBytes(storageRef, blob);
  const url = await getDownloadURL(snapshot.ref);
  return url;
};

export const saveProject = async (
  userId: string,
  scene: Scene,
  project: Project,
): Promise<string> => {
  const apiProject = mapProjectSceneToApiProject(scene, project);
  const projectsRef = collection(db, 'users', userId, 'projects');
  const projectRef = project.projectId
    ? doc(db, 'users', userId, 'projects', project.projectId)
    : doc(projectsRef);

  await setDoc(projectRef, apiProject, { merge: true });

  return projectRef.id;
};

export const deleteProject = async (userId: string, projectId?: string): Promise<void> => {
  if (!projectId) {
    throw new Error('Project ID is required to delete a project.');
  }

  const projectRef = doc(db, 'users', userId, 'projects', projectId);
  await deleteDoc(projectRef);
};

export const fetchModelsList = async (): Promise<
  ApiModel[]
> => {
  const modelsRef = collection(db, 'models');
  const querySnapshot = await getDocs(modelsRef);

  const models = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    colorVariants: doc.data().color_variants,
    name: doc.data().name,
    id: doc.id,
  }));

  return models as ApiModel[];
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

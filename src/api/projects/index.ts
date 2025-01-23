import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../../firebaseConfig';
import { Project } from '../../types/Project';
import { Scene } from '../../types/Scene';
import { mapProjectSceneToApiProject } from '../../utils/mappers';
import { ApiModel, ApiProject } from './types';

const MODELS_DIRECTORY = 'models';
const USERS_DIRECTORY = 'users';
const PROJECTS_DIRECTORY = 'projects';
const THUMBNAILS_DIRECTORY = 'thumbnails';
const TEMPLATES_DIRECTORY = 'templates';

export const fetchAllProjects = async (
  userId: string,
): Promise<ApiProject[]> => {
  const projectsRef = collection(
    db,
    USERS_DIRECTORY,
    userId,
    PROJECTS_DIRECTORY,
  );
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
  const modelDoc = await getDoc(doc(db, MODELS_DIRECTORY, objectId));

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
  const storageRef = ref(storage, `${THUMBNAILS_DIRECTORY}/${id}.png`);
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
  const projectsRef = collection(
    db,
    USERS_DIRECTORY,
    userId,
    PROJECTS_DIRECTORY,
  );
  const projectRef = project.projectId
    ? doc(db, 'users', userId, 'projects', project.projectId)
    : doc(projectsRef);

  await setDoc(projectRef, apiProject, { merge: true });

  return projectRef.id;
};

export const deleteProject = async (
  userId: string,
  projectId?: string,
): Promise<void> => {
  if (!projectId) {
    throw new Error('Project ID is required to delete a project.');
  }

  const projectRef = doc(
    db,
    USERS_DIRECTORY,
    userId,
    PROJECTS_DIRECTORY,
    projectId,
  );
  await deleteDoc(projectRef);
};

export const fetchModelsList = async (): Promise<ApiModel[]> => {
  const modelsRef = collection(db, MODELS_DIRECTORY);
  const querySnapshot = await getDocs(modelsRef);

  const models = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    colorVariants: doc.data().color_variants,
    name: doc.data().name,
    id: doc.id,
  }));

  return models as ApiModel[];
};

export const fetchAllTemplates = async (
  sectionNames: string[],
): Promise<{ sectionName: string; projects: ApiProject[] }[]> => {
  const templates: { sectionName: string; projects: ApiProject[] }[] = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const sectionName of sectionNames) {
    const projectsRef = collection(db, TEMPLATES_DIRECTORY, sectionName, PROJECTS_DIRECTORY);
    // eslint-disable-next-line no-await-in-loop
    const projectsSnapshot = await getDocs(projectsRef);

    const projects: ApiProject[] = [];
    projectsSnapshot.forEach((projectDoc) => {
      const data = projectDoc.data() as ApiProject;
      projects.push({ ...data, id: projectDoc.id });
    });

    templates.push({ sectionName, projects });
  }

  return templates;
};

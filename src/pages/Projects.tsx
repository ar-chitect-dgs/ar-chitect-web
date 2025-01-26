import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { useAuth } from '../auth/AuthProvider';
import ProjectTile from '../components/projectTile/ProjectTile';
import ScrollBar from '../components/scrollbar/ScrollBar';
import { ROUTES } from '../feature/navigation/routes';
import { setProject } from '../redux/slices/project';
import { setScene } from '../redux/slices/editor';
import { mapApiProjectToProjectScene } from '../utils/mappers';

import './styles/Projects.css';
import { fetchAllProjects, deleteProject } from '../api/projects';
import { ApiProject } from '../api/projects/types';
import NotificationPopup, { SnackBarState, initialSnackBarState, setOpenSnackBarState } from '../components/notificationPopup/NotificationPopup';

const Projects = (): JSX.Element => {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [snackBarState, setSnackBarState] = useState<SnackBarState>(initialSnackBarState);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const data = await fetchAllProjects(user.uid);
          setProjects(data);
        } catch (error) {
          setSnackBarState(
            setOpenSnackBarState(t('projects.fetchError'), 'error'),
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjects();
  }, [user, t]);

  let message = null;

  if (loading) {
    message = <div className="projects-message">{t('projects.loading')}</div>;
  } else if (projects.length === 0) {
    message = (
      <div className="projects-message">{t('projects.noProjects')}</div>
    );
  }

  const handleProjectClick = async (apiProject: ApiProject) => {
    try {
      const { project, scene } = await mapApiProjectToProjectScene(apiProject);
      dispatch(setScene(scene));
      dispatch(setProject(project));
      navigate(ROUTES.EDITOR);
    } catch (error) {
      console.error('Error loading project:', error);
      setSnackBarState(setOpenSnackBarState(t('projects.mapError'), 'error'));
    }
  };

  const handleProjectDelete = async (project: ApiProject) => {
    try {
      if (user) {
        await deleteProject(user.uid, project.id);
        setProjects((prevProjects) =>
          prevProjects.filter((p) => p.id !== project.id));
      }
    } catch (error) {
      setSnackBarState(
        setOpenSnackBarState(t('projects.deleteError'), 'error'),
      );
    }
  };

  return (
    <div className="projects-page">
      <NotificationPopup
        snackbar={snackBarState}
        setOpenSnackbar={(open: boolean) =>
          setSnackBarState((prev: SnackBarState) => ({
            ...prev,
            open,
          }))}
      />
      <h2>{t('projects.title')}</h2>
      {message}
      <ScrollBar className="scrollbar">
        <div className="projects-container">
          {projects.map((project) => (
            <ProjectTile
              key={project.id}
              project={project}
              onClick={() => handleProjectClick(project)}
              onDelete={() => handleProjectDelete(project)}
            />
          ))}
        </div>
      </ScrollBar>
    </div>
  );
};

export default Projects;

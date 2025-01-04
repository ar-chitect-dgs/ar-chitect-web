import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { deleteProject, fetchAllProjects } from '../api/projectsApi';
import { ApiProject } from '../api/types';
import { useAuth } from '../auth/AuthProvider';
import ProjectTile from '../components/projectTile/ProjectTile';
import ScrollBar from '../components/scrollbar/ScrollBar';
import { ROUTES } from '../feature/navigation/routes';
import { setScene } from '../redux/slices/scene';
import { mapApiProjectToProjectScene } from '../utils/mappers';
import { setProject } from '../redux/slices/project';
import './styles/Projects.css';

const Projects = (): JSX.Element => {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const data = await fetchAllProjects(user.uid);
          setProjects(data);
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProjects();
  }, [user]);

  let message = null;

  if (loading) {
    message = <div className="projects-message">Loading projects...</div>;
  } else if (projects.length === 0) {
    message = (
      <div className="projects-message">
        No projects found. You can create one in the editor!
      </div>
    );
  }

  const handleProjectClick = async (apiProject: ApiProject) => {
    console.log(`Navigating to project with ID: ${apiProject.id}`);

    try {
      const { project, scene } = await mapApiProjectToProjectScene(apiProject);
      dispatch(setScene(scene));
      dispatch(setProject(project));
      navigate(ROUTES.EDITOR);
    } catch (error) {
      console.error('Error mapping project to scene:', error);
    }
  };

  const handleProjectDelete = async (project: ApiProject) => {
    console.log(`Deleting project with ID: ${project.id}`);
    try {
      if (user) {
        await deleteProject(user.uid, project.id);
        setProjects((prevProjects) =>
          prevProjects.filter((p) => p.id !== project.id));
        console.log(`Project with ID ${project.id} deleted successfully.`);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <div className="projects-page">
      <h2>Your latest projects</h2>
      {message}
      <ScrollBar className="scrollbar">
        <div className="projects-container">
          {' '}
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

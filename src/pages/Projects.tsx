import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchAllProjects } from '../api/projectsApi';
import { useAuth } from '../auth/AuthProvider';
import './styles/Projects.css';
import ProjectTile from '../components/projectTile/ProjectTile';
import ScrollBar from '../components/scrollbar/ScrollBar';
import { ApiProject } from '../api/types';
import { mapApiProjectToScene } from '../utils/mappers';
import { set } from '../redux/slices/scene';
import { ROUTES } from '../feature/navigation/routes';
import { setProject } from '../redux/slices/project';

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

  const handleProjectClick = async (project: ApiProject) => {
    console.log(`Navigating to project with ID: ${project.id}`);

    try {
      const scene = await mapApiProjectToScene(project);
      dispatch(set(scene));
      dispatch(
        setProject({
          projectId: project.id,
          projectName: project.projectName,
          createdAt: project.createdAt,
        }),
      );
      navigate(ROUTES.EDITOR);
    } catch (error) {
      console.error('Error mapping project to scene:', error);
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
            />
          ))}
        </div>
      </ScrollBar>
    </div>
  );
};

export default Projects;

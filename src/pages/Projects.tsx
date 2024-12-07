import { useEffect, useState } from 'react';
import { fetchAllProjects } from '../api/projectsApi';
import { useAuth } from '../auth/AuthProvider';
import './styles/Projects.css';
import ProjectTile from '../components/projectTile/ProjectTile';
import ScrollBar from '../components/scrollbar/ScrollBar';
import { ApiProject } from '../api/types';

const Projects = (): JSX.Element => {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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
    message = <div className="projects-message">No projects found. You can create one in the editor!</div>;
  }

  const handleProjectClick = (project: ApiProject) => {
    console.log(`Navigating to project with ID: ${project.id}`);
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

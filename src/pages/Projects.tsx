import { useEffect, useState } from 'react';
import { getAllProjects } from '../utils/firebaseUtils';
import { useAuth } from '../hooks/useAuth';
import { Project } from '../types/Scene';
import './styles/Projects.css';
import ProjectTile from '../components/projectTile/ProjectTile';
import ScrollBar from '../components/scrollbar/ScrollBar';

const Projects = (): JSX.Element => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const data = await getAllProjects(user.uid);
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

  if (loading) {
    return <div className="projects-message">Loading projects...</div>;
  }

  if (projects.length === 0) {
    return <div className="projects-message">No projects found.</div>;
  }

  const handleProjectClick = (project: Project) => {
    console.log(`Navigating to project with ID: ${project.id}`);
  };

  return (
    <div className="projects-page">
      <h2>Your latest projects</h2>
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

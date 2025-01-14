import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { fetchAllProjects } from '../api/projectsApi';
import { ApiProject } from '../api/types';
import { useAuth } from '../auth/AuthProvider';
import { ROUTES } from '../feature/navigation/routes';
import { setScene } from '../redux/slices/scene';
import { mapApiProjectToProjectScene } from '../utils/mappers';
import { setProject } from '../redux/slices/project';
import './styles/Projects.css';
import TemplateTile from '../components/templateTile/TemplateTile';
import ScrollBar from '../components/scrollbar/ScrollBar';

interface ProjectSection {
  sectionName: string;
  projects: ApiProject[];
}

const Templates = (): JSX.Element => {
  const [sections, setSections] = useState<ProjectSection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const data = await fetchAllProjects(user.uid);
          // todo: templates!
          setSections([
            { sectionName: 'Kitchen', projects: data },
            { sectionName: 'Bathroom', projects: data.slice(1, 3) },
            { sectionName: 'Bedroom', projects: data.slice(2, 3) },
          ]);
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
    message = <div className="projects-message">Loading templates...</div>;
  } else if (sections.length === 0) {
    message = <div className="projects-message">No templates found.</div>;
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

  return (
    <div className="projects-page">
      {message}
      <div className="scrollbar-outside-container">
        <ScrollBar className="scrollbar">
          <div className="scrollbar-inside-container">
            {!loading
            && sections.map((section) => (
              <div key={section.sectionName} className="template-section">
                <h2 className="section-title">{section.sectionName}</h2>
                <Scrollbars
                  className="templates-scrollbar"
                  renderTrackHorizontal={(props) => (
                    <div {...props} className="scrollbar-track-horizontal" />
                  )}
                  renderThumbHorizontal={(props) => (
                    <div {...props} className="scrollbar-thumb-horizontal" />
                  )}
                >
                  <div className="templates-container">
                    {section.projects.map((project) => (
                      <TemplateTile
                        key={project.id}
                        project={project}
                        onClick={() => handleProjectClick(project)}
                      />
                    ))}
                  </div>
                </Scrollbars>
              </div>
            ))}
          </div>
        </ScrollBar>
      </div>
    </div>
  );
};

export default Templates;

import { useEffect, useState } from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchAllTemplates } from '../api/projects';
import { ApiProject } from '../api/projects/types';
import { useAuth } from '../auth/AuthProvider';
import ScrollBar from '../components/scrollbar/ScrollBar';
import TemplateTile from '../components/templateTile/TemplateTile';
import { ROUTES } from '../feature/navigation/routes';
import { setProject } from '../redux/slices/project';
import { setScene } from '../redux/slices/editor';
import { mapApiProjectToProjectScene } from '../utils/mappers';
import './styles/Projects.css';

const TEMPLATES_SECTIONS = {
  Kitchen: 'Kitchen',
  Bathroom: 'Bathroom',
  Bedroom: 'Bedroom / Living room',
};

interface ProjectSection {
  sectionName: string;
  projects: ApiProject[];
}

const Templates = (): JSX.Element => {
  const { t } = useTranslation();
  const [sections, setSections] = useState<ProjectSection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProjects = async () => {
      if (user) {
        try {
          const data = await fetchAllTemplates(Object.keys(TEMPLATES_SECTIONS));
          console.log(data);
          setSections(data);
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
    /* todo localize */
    message = <div className="projects-message">{t('templates.loadingTemplates')}</div>;
  } else if (sections.length === 0) {
    message = <div className="projects-message">{t('templates.noTemplates')}</div>;
  }

  const handleProjectClick = async (apiProject: ApiProject) => {
    console.log(`Navigating to project with ID: ${apiProject.id}`);

    try {
      const { project, scene } = await mapApiProjectToProjectScene(
        apiProject,
        true,
      );
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
                  <h2 className="section-title">
                    {
                      TEMPLATES_SECTIONS[
                        section.sectionName as keyof typeof TEMPLATES_SECTIONS
                      ]
                    }
                  </h2>
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

import { ApiProject } from '../../api/types';
import placeholder from '../../assets/placeholder_project.png';
import Card from '../card/Card';
import './TemplateTile.css';

interface TemplateTileProps {
  project: ApiProject;
  onClick: () => void;
}

const TemplateTile = ({ project, onClick }: TemplateTileProps): JSX.Element => (
  <Card className="project-card">
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      className="project-wrapper"
    >
      <img
        className="project-thumbnail"
        src={project.thumb || placeholder}
        alt={`${project.projectName} thumbnail`}
      />
      <div className="project-details">
        <div className="project-header">
          <span className="project-name">{project.projectName}</span>
        </div>
        <div className="project-objects">
          Consists of:
          {' '}
          {project.objects.map((obj) => obj.name ?? obj.id).join(', ')}
        </div>
      </div>
    </div>
  </Card>
);

export default TemplateTile;

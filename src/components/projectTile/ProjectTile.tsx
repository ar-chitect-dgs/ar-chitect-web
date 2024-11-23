import placeholder from '../../assets/placeholder_project.png';
import { Project } from '../../types/Scene';
import Card from '../card/Card';
import './ProjectTile.css';

interface ProjectTileProps {
  project: Project;
  onClick: () => void;
}

const ProjectTile = ({ project, onClick }: ProjectTileProps): JSX.Element => (
  <Card className="project-card">
    <div onClick={onClick} role="button" tabIndex={0} className="project-wrapper">
      <img
        className="project-thumbnail"
        src={project.thumb || placeholder}
        alt={`${project.projectName} thumbnail`}
      />
      <div className="project-details">
        <div className="project-header">
          <span className="project-name">{project.projectName}</span>
          <span className="project-created-at">
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
        </div>
        <span className="project-modified-at">
          Last edited:
          {' '}
          {new Date(project.modifiedAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  </Card>
);

export default ProjectTile;

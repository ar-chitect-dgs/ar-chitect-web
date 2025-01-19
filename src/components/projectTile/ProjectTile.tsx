import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import { ApiProject } from '../../api/types';
import placeholder from '../../assets/placeholder_project.png';
import Card from '../card/Card';
import './ProjectTile.css';
import { useState } from 'react';

interface ProjectTileProps {
  project: ApiProject;
  onClick: () => void;
  onDelete: () => void;
}

const ProjectTile = ({
  project,
  onClick,
  onDelete,
}: ProjectTileProps): JSX.Element => {
  const { t } = useTranslation();
  const [showDeleteIcon, setShowDeleteIcon] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleMouseEnter = () => setShowDeleteIcon(true);
  const handleMouseLeave = () => setShowDeleteIcon(false);

  const handleDelete = () => {
    onDelete();
    setOpenDialog(false);
  };

  return (
    <Card className="project-card">
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        className="project-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {showDeleteIcon && (
          <div className="delete-icon-wrapper">
            <IconButton
              className="delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                setOpenDialog(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </div>
        )}
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
            {t('projects.lastEdited')}
            {' '}
            {new Date(project.modifiedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t('projects.deleteTitle')}</DialogTitle>
        <DialogContent>
          {t('projects.deleteBody', { name: project.projectName })}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            {t('profile.cancel')}
          </Button>
          <Button onClick={handleDelete} color="error">
            {t('profile.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ProjectTile;

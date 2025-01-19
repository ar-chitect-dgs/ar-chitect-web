import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { useState } from 'react';
import { ApiProject } from '../../api/projects/types';
import placeholder from '../../assets/placeholder_project.png';
import Card from '../card/Card';
import './ProjectTile.css';

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
            Last edited:
            {' '}
            {new Date(project.modifiedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          {`Are you sure you want to delete the project
          ${project.projectName}? This action cannot be undone.`}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default ProjectTile;

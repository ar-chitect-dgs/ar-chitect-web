import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {
  fetchGLBUrl,
  fetchModelColors,
  fetchModelsList,
} from '../../api/projectsApi';
import { useAppDispatch } from '../../redux';
import { addModel } from '../../redux/slices/scene';
import NotificationPopup, {
  initialSnackBarState,
  setOpenSnackBarState,
  SnackBarState,
} from '../notificationPopup/NotificationPopup';
import TextButton from '../textButton/TextButton';
import './ModelsList.css';

interface modelItem {
  id: string;
  name: string;
}

const ModelsList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [modelsList, setModelsList] = useState<modelItem[]>([]);
  const [selectedModel, setSelectedModel] = useState<modelItem | null>(null);
  const [colors, setColors] = useState<string[]>([]);
  const [loadingColors, setLoadingColors] = useState(false);
  const [openColorDialog, setOpenColorDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackBarState>(initialSnackBarState);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const modelsListFetched = await fetchModelsList();
        setModelsList(modelsListFetched);
      } catch (error) {
        console.error('Error fetching models:', error);
      }
    };
    fetchModels();
  }, []);

  const handleAddModel = async (model: modelItem, color: string) => {
    try {
      const url = await fetchGLBUrl(model.id, color);
      dispatch(addModel(model.id, model.name, color, url));
      setSnackbar(
        setOpenSnackBarState(
          `Added ${model.name} with color ${color}`,
          'success',
        ),
      );
    } catch (error) {
      setSnackbar(setOpenSnackBarState('Error adding model', 'error'));
    } finally {
      setOpenColorDialog(false);
      setSelectedModel(null);
    }
  };

  const handleModelClick = async (model?: modelItem) => {
    if (!model) {
      return;
    }
    setLoadingColors(true);
    try {
      const fetchedColors = await fetchModelColors(model.id);
      setColors(fetchedColors);
      setSelectedModel(model);
      setOpenColorDialog(true);
    } catch (error) {
      setSnackbar(setOpenSnackBarState('Error fetching model colors', 'error'));
    } finally {
      setLoadingColors(false);
    }
  };

  return (
    <div className="models-list-container">
      <List>
        {modelsList.map((model) => (
          <ListItem
            component="button"
            key={model.id}
            onClick={() => handleModelClick(model)}
            className="list-item"
          >
            <ListItemText className="list-item-text" primary={model.name} />
          </ListItem>
        ))}
      </List>
      <Dialog open={openColorDialog} onClose={() => setOpenColorDialog(false)}>
        <DialogTitle className="dialog-title">Select a Color</DialogTitle>
        <DialogContent className="dialog-content">
          {loadingColors ? (
            <div className="color-loader">
              <CircularProgress />
            </div>
          ) : (
            <List>
              {colors.map((color) => (
                <ListItem
                  component="button"
                  key={color}
                  onClick={() => { if (selectedModel) handleAddModel(selectedModel, color); }}
                  className="list-item"
                >
                  <ListItemText className="list-item-text" primary={color} />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions className="dialog-actions">
          <TextButton onClick={() => setOpenColorDialog(false)}>
            Cancel
          </TextButton>
        </DialogActions>
      </Dialog>
      <NotificationPopup
        snackbar={snackbar}
        setOpenSnackbar={(open: boolean) =>
          setSnackbar((prev: SnackBarState) => ({
            ...prev,
            open,
          }))}
      />
    </div>
  );
};

export default ModelsList;

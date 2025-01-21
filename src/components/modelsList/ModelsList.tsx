import { useEffect, useState } from 'react';
import { fetchModelsList } from '../../api/projects';
import { ApiModel } from '../../api/projects/types';
import { useAppDispatch } from '../../redux';
import { addModel } from '../../redux/slices/scene';
import ModelTile, { SelectedModel } from '../modelTile/ModelTile';
import NotificationPopup, {
  initialSnackBarState,
  SnackBarState,
} from '../notificationPopup/NotificationPopup';
import './ModelsList.css';

const ModelsList = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [modelsList, setModelsList] = useState<ApiModel[]>([]);
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

  const handleAddModel = (model: SelectedModel) => {
    console.log('Adding model:', model);
    dispatch(addModel(model.id, model.name, model.color, model.url));
  };

  return (
    <div className="models-list-container">
      <div className="models-grid">
        {modelsList.map((model) => (
          <ModelTile
            key={model.id}
            model={model}
            onClick={handleAddModel}
          />
        ))}
      </div>
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

import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  changeInteractionState,
  Interaction,
  sceneSelector,
} from '../../redux/slices/editor';
import { useAppDispatch } from '../../redux';
import './EditStatePanel.css';

const EditStatePanel = (): JSX.Element => {
  const { interaction } = useSelector(sceneSelector);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleButtonClick = (mode: Interaction) => {
    dispatch(
      changeInteractionState(interaction === mode ? Interaction.Idle : mode),
    );
  };

  return (
    <div className="edit-state-panel-container">
      <button
        type="button"
        onClick={() => handleButtonClick(Interaction.Idle)}
        className={`edit-button ${interaction === Interaction.Idle ? 'active' : ''}`}
      >
        {t('editStatePanel.moving')}
      </button>
      <button
        type="button"
        onClick={() => handleButtonClick(Interaction.Copy)}
        className={`edit-button ${interaction === Interaction.Copy ? 'active' : ''}`}
      >
        {t('editStatePanel.copying')}
      </button>
      <button
        type="button"
        onClick={() => handleButtonClick(Interaction.Delete)}
        className={`edit-button ${interaction === Interaction.Delete ? 'active' : ''}`}
      >
        {t('editStatePanel.deleting')}
      </button>
    </div>
  );
};

export default EditStatePanel;

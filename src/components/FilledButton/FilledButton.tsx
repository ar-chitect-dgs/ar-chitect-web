import React, { ReactNode } from 'react';
import './FilledButton.css';
import Button from '../Button/Button';

type FilledButtonProps = {
  children?: ReactNode;
  isDisabled?: boolean;
  onClick?: () => void;
};

const FilledButton = ({
  children,
  isDisabled = false,
  onClick = () => {},
}: FilledButtonProps): JSX.Element => (
  <Button
    onClick={!isDisabled ? onClick : () => {}}
    className={`button ${isDisabled ? 'disabled' : ''}`}
    type="submit"
  >
    {children}
  </Button>
);

export default FilledButton;

import React, { ReactNode } from 'react';
import './FilledButton.css';
import Button from '../button/Button';

type FilledButtonProps = {
  children?: ReactNode;
  isDisabled?: boolean;
  className?: string;
  onClick?: () => void;
};

const FilledButton = ({
  children,
  isDisabled = false,
  className = '',
  onClick = () => {},
}: FilledButtonProps): JSX.Element => (
  <Button
    onClick={!isDisabled ? onClick : () => {}}
    className={`button ${className} ${isDisabled ? 'disabled' : ''}`}
    type="submit"
  >
    {children}
  </Button>
);

export default FilledButton;

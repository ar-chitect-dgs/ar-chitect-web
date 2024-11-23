import React, { ReactNode } from 'react';
import Button from '../button/Button';
import './TextButton.css';

interface TextButtonProps {
  children?: ReactNode;
  onClick?: () => void;
}

const TextButton = ({
  children,
  onClick = () => {},
}: TextButtonProps): JSX.Element => (
  <Button onClick={onClick} className="text-button">
    {children}
  </Button>
);

export default TextButton;

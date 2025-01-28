import { ReactNode } from 'react';
import Button from '../button/Button';
import './TextButton.css';

interface TextButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

const TextButton = ({
  children,
  className = '',
  onClick = () => {},
}: TextButtonProps): JSX.Element => (
  <Button onClick={onClick} className={`text-button ${className}`}>
    {children}
  </Button>
);

export default TextButton;

import { ReactNode } from 'react';
import Button from '../button/Button';
import './ToggleButton.css';

interface ToggleButtonProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  toggled?: boolean;
}

const ToggleButton = ({
  children,
  className = '',
  onClick = () => { },
  onKeyDown = () => { },
  toggled = false,
}: ToggleButtonProps): JSX.Element => (
  <Button
    onClick={onClick}
    onKeyDown={onKeyDown}
    className={`button ${className} ${toggled ? 'toggled' : ''}`}
  >
    {children}
  </Button>
);

export default ToggleButton;

/* eslint-disable react/button-has-type */
import { ReactNode } from 'react';

type ButtonProps = {
  onClick?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
};

const Button = ({
  children,
  onClick = () => {},
  onKeyDown = () => {},

  className = '',
  type = 'button',
}: ButtonProps): JSX.Element => (
  <button
    type={type}
    className={`${className} button`}
    onClick={onClick}
    onKeyDown={onKeyDown}
  >
    {children}
  </button>
);

export default Button;

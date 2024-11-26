/* eslint-disable react/button-has-type */
import { ReactNode } from 'react';

type ButtonProps = {
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  children?: ReactNode;
};

const Button = ({
  children,
  onClick = () => { },
  className = '',
  type = 'button',
}: ButtonProps): JSX.Element => (
  <button
    type={type}
    className={`${className} button`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;

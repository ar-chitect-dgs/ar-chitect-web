import React from 'react';
import './Card.css';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, className = '', style }) => (
  <div className={`custom-card ${className}`} style={style}>
    {children}
  </div>
);

export default Card;

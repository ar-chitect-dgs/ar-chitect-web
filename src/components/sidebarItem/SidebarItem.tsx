// SidebarItem.tsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './SidebarItem.css';

interface SidebarItemProps {
  name: string;
  path: string;
}

const SidebarItem = ({ name, path }: SidebarItemProps): JSX.Element => {
  const location = useLocation();

  const isSelected = location.pathname === path;

  return (
    <li className={`sidebarItem ${isSelected ? 'selected' : ''}`}>
      <Link to={path} className="sidebar-link">
        {`${name} ${isSelected ? ' >' : ''}`}
      </Link>
    </li>
  );
};

export default SidebarItem;

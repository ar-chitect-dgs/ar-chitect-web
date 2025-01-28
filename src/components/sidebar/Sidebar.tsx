import React from 'react';
import SidebarItem from '../sidebarItem/SidebarItem';
import './Sidebar.css';

interface SidebarProps {
  groups: { name: string; path: string; onClick?: () => void }[][];
  logo: string;
}

const Sidebar = ({ groups, logo }: SidebarProps): JSX.Element => (
  <div className="sidebar">
    <div className="logo-container">
      <img src={logo} alt="abc" className="app-logo" />
    </div>
    <div className="groups">
      {groups.map((group, groupIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={groupIndex} className="group">
          <hr className="group-separator" />
          <ul className="nav-list">
            {group.map((link) => (
              <SidebarItem
                key={link.path}
                name={link.name}
                path={link.path}
                onClick={link.onClick}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;

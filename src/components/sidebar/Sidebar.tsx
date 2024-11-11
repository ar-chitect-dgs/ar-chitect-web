import React from 'react';
import SidebarItem from '../sidebarItem/SidebarItem';
import './Sidebar.css';

interface SidebarProps {
  groups: { name: string; path: string }[][];
  logo: string;
}

const Sidebar = ({ groups, logo }: SidebarProps): JSX.Element => (
  <div className="sidebar">
    <div className="logoContainer">
      <img src={logo} alt="abc" className="appLogo" />
    </div>
    <div className="groups">
      {groups.map((group, groupIndex) => (
        // eslint-disable-next-line react/no-array-index-key
        <div key={groupIndex} className="group">
          <hr className="groupSeparator" />
          <ul className="navList">
            {group.map((link) => (
              <SidebarItem key={link.path} name={link.name} path={link.path} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;

import { Link, useLocation } from 'react-router-dom';
import './SidebarItem.css';

interface SidebarItemProps {
  name: string;
  path: string;
  onClick?: () => void;
}

const SidebarItem = ({ name, path, onClick }: SidebarItemProps): JSX.Element => {
  const location = useLocation();

  const isSelected = location.pathname === path;

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <li className={`sidebarItem ${isSelected ? 'selected' : ''}`}>
      <Link to={path} className="sidebar-link" onClick={handleClick}>
        {`${name} ${isSelected ? ' >' : ''}`}
      </Link>
    </li>
  );
};

export default SidebarItem;

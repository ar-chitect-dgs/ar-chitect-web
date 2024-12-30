import logo from '../../assets/logo.svg';
import { useAuth } from '../../auth/AuthProvider';
import Sidebar from '../../components/sidebar/Sidebar';
import { ROUTES } from './routes';
import { clearProject } from '../../redux/slices/project';
import { useAppDispatch } from '../../redux';
import { clearCreator } from '../../redux/slices/creator';
import { clearScene } from '../../redux/slices/scene';

const Navbar = (): JSX.Element => {
  const { isLoggedIn } = useAuth();
  const dispatch = useAppDispatch();

  const handleCreatorClick = () => {
    dispatch(clearCreator());
    dispatch(clearProject());
    dispatch(clearScene());
  };

  const handleEditorClick = () => {
    dispatch(clearProject());
    dispatch(clearScene());
  };

  const projectGroup = [
    { name: 'Your projects', path: ROUTES.PROJECTS },
    { name: 'Creator', path: ROUTES.CREATOR, onClick: handleCreatorClick },
    { name: 'Editor', path: ROUTES.EDITOR, onClick: handleEditorClick },
    { name: 'Templates', path: ROUTES.TEMPLATES },
  ];

  const infoGroup = [
    { name: 'About us', path: ROUTES.ABOUT },
    { name: 'ARchitect Mobile', path: ROUTES.MOBILE },
  ];

  const authGroup = [
    { name: 'Sign Up', path: ROUTES.SIGN_UP },
    { name: 'Log In', path: ROUTES.LOGIN },
  ];

  const profileGroup = [
    { name: 'Profile', path: ROUTES.PROFILE },
    { name: 'Settings', path: ROUTES.SETTINGS },
  ];

  const groups = [
    projectGroup,
    infoGroup,
    isLoggedIn ? profileGroup : authGroup,
  ];

  return <Sidebar groups={groups} logo={logo} />;
};

export default Navbar;

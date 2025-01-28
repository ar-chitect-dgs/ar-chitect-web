import { useTranslation } from 'react-i18next';
import logo from '../../assets/logo.svg';
import { useAuth } from '../../auth/AuthProvider';
import Sidebar from '../../components/sidebar/Sidebar';
import { ROUTES } from './routes';
import { useAppDispatch } from '../../redux';
import { clearCreator } from '../../redux/slices/creator';

const Navbar = (): JSX.Element => {
  const { isLoggedIn } = useAuth();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const handleCreatorClick = () => {
    dispatch(clearCreator());
  };

  const projectGroup = [
    { name: t('navbar.yourProjects'), path: ROUTES.PROJECTS },
    { name: t('navbar.creator'), path: ROUTES.CREATOR, onClick: handleCreatorClick },
    { name: t('navbar.templates'), path: ROUTES.TEMPLATES },
  ];

  const infoGroup = [
    { name: t('navbar.aboutUs'), path: ROUTES.ABOUT },
    { name: t('navbar.mobileApp'), path: ROUTES.MOBILE },
  ];

  const authGroup = [
    { name: t('navbar.signUp'), path: ROUTES.SIGN_UP },
    { name: t('navbar.logIn'), path: ROUTES.LOGIN },
  ];

  const profileGroup = [
    { name: t('navbar.profile'), path: ROUTES.PROFILE },
    { name: t('navbar.settings'), path: ROUTES.SETTINGS },
  ];

  const groups = [
    projectGroup,
    infoGroup,
    isLoggedIn ? profileGroup : authGroup,
  ];

  return <Sidebar groups={groups} logo={logo} />;
};

export default Navbar;

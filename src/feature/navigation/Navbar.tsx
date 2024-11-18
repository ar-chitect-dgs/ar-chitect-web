import React from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import logo from '../../assets/logo.svg';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from './routes';

const projectGroup = [
  { name: 'Your projects', path: ROUTES.PROJECTS },
  { name: 'Editor', path: ROUTES.EDITOR },
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

const Navbar = (): JSX.Element => {
  const { isLoggedIn } = useAuth();

  const groups = [
    projectGroup,
    infoGroup,
    isLoggedIn ? profileGroup : authGroup,
  ];

  return <Sidebar groups={groups} logo={logo} />;
};

export default Navbar;

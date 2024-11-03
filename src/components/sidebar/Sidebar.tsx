// Sidebar.tsx
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Divider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Sidebar.css';

const Sidebar = (): JSX.Element => {
  const location = useLocation();
  const user = useAuth();

  const isSelected = (path: string) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      {/* Logo section */}
      <Box className="logoContainer">
        <Typography
          variant="h6"
          component="div"
          sx={{ padding: '16px', textAlign: 'center' }}
        >
          App Logo
        </Typography>
      </Box>

      {/* Navigation links */}
      <List>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/projects"
            selected={isSelected('/projects')}
          >
            <ListItemText
              primary="Projects"
              sx={{ fontWeight: isSelected('/projects') ? 'bold' : 'normal' }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            to="/editor"
            selected={isSelected('/editor')}
          >
            <ListItemText
              primary="Editor"
              sx={{ fontWeight: isSelected('/editor') ? 'bold' : 'normal' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      {!user && (
        <Box sx={{ paddingTop: '16px' }}>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/signup"
              selected={isSelected('/signup')}
            >
              <ListItemText
                primary="Sign Up"
                sx={{ fontWeight: isSelected('/signup') ? 'bold' : 'normal' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/login"
              selected={isSelected('/login')}
            >
              <ListItemText
                primary="Log In"
                sx={{ fontWeight: isSelected('/login') ? 'bold' : 'normal' }}
              />
            </ListItemButton>
          </ListItem>
        </Box>
      )}
      {user && (
        <Box sx={{ paddingTop: '16px' }}>
          <ListItemButton component={Link} to="/profile">
            <ListItemText
              primary="Profile"
              sx={{ fontWeight: isSelected('/profile') ? 'bold' : 'normal' }}
            />
          </ListItemButton>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;

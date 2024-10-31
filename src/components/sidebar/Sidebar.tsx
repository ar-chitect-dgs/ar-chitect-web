import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = (): JSX.Element => {
  const location = useLocation();

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
          <ListItemButton component={Link} to="/signup">
            <ListItemText
              disableTypography
              primary="Sign Up"
              sx={{ fontWeight: isSelected('/signup') ? 'bold' : 'normal' }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/login">
            <ListItemText
              disableTypography
              primary="Log In"
              sx={{ fontWeight: isSelected('/login') ? 'bold' : 'normal' }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/projects">
            <ListItemText
              disableTypography
              primary="Projects"
              sx={{ fontWeight: isSelected('/projects') ? 'bold' : 'normal' }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/editor">
            <ListItemText
              disableTypography
              primary="Editor"
              sx={{ fontWeight: isSelected('/editor') ? 'bold' : 'normal' }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;

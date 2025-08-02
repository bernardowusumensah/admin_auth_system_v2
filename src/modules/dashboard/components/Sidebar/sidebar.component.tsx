import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@modules/hooks';
import toast from 'react-hot-toast';
import { sidebarStyles } from './sidebar.styles';
// Icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

export default function SidebarComponent() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
      console.error('Logout failed:', error);
    }
  };

  return (
    <Drawer
      sx={sidebarStyles.drawer}
      variant="permanent"
      anchor="left"
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Admin Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Users" />
        </ListItemButton>
      </List>
      <Divider />
      {user && (
        <div style={{ padding: '16px' }}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Welcome, {user.firstName}!
          </Typography>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            fullWidth
          >
            Logout
          </Button>
        </div>
      )}
    </Drawer>
  );
}

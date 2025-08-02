import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@modules/hooks';
import toast from 'react-hot-toast';
// Components
import SidebarComponent from '@modules/dashboard/components/Sidebar/sidebar.component';
// Styles
import { DashboardLayout, MainContent, StatsGrid } from './dashboard.styles';
import StatsCardComponent from '@modules/dashboard/components/StatsCard/stats-card.component';
// Icons
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';

export default function DashboardScreen() {
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
    <DashboardLayout>
      <SidebarComponent />
      <MainContent>
        {/* Top App Bar with Logout */}
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Welcome back, {user?.firstName || 'User'}!
            </Typography>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </Toolbar>
        </AppBar>

        {/* Dashboard Content */}
        <Box sx={{ p: 3 }}>
          <StatsGrid>
            <StatsCardComponent title="Users" value="1,024" icon={<PeopleIcon />} />
          </StatsGrid>
        </Box>
      </MainContent>
    </DashboardLayout>
  );
}

import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Grid, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth, useDashboard } from '@modules/hooks';
import toast from 'react-hot-toast';
// Components
import SidebarComponent from '@modules/dashboard/components/Sidebar/sidebar.component';
import StatsCardComponent from '@modules/dashboard/components/StatsCard/stats-card.component';
import RecentActivityComponent from '@modules/dashboard/components/RecentActivity/recent-activity.component';
import QuickActionsComponent from '@modules/dashboard/components/QuickActions/quick-actions.component';
// Styles
import { DashboardLayout, MainContent, StatsGrid } from './dashboard.styles';
// Icons
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import LogoutIcon from '@mui/icons-material/Logout';

export default function DashboardScreen() {
  const { logout, user } = useAuth();
  const { stats, activity, quickActions, loading, handleQuickAction } = useDashboard();
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

  // Prepare stats data for StatsCard components
  const dashboardStats = stats ? [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: <PeopleIcon />,
      color: 'primary' as const,
      trend: { value: stats.userGrowth, isPositive: stats.userGrowth > 0 },
      subtitle: 'Active accounts'
    },
    {
      title: 'System Health',
      value: `${stats.systemHealth}%`,
      icon: <SpeedIcon />,
      color: 'success' as const,
      trend: { value: 2.1, isPositive: true },
      subtitle: 'Uptime this month'
    },
    {
      title: 'Security Score',
      value: stats.securityScore,
      icon: <SecurityIcon />,
      color: 'warning' as const,
      subtitle: `Last audit: ${new Date(stats.lastAudit).toLocaleDateString()}`
    },
    {
      title: 'Performance',
      value: `${stats.performance}%`,
      icon: <TrendingUpIcon />,
      color: 'secondary' as const,
      trend: { value: 5.8, isPositive: true },
      subtitle: `Response time: ${stats.responseTime}ms`
    }
  ] : [];

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
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Dashboard Overview
          </Typography>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <StatsGrid>
                {dashboardStats.map((stat, index) => (
                  <StatsCardComponent
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                    trend={stat.trend}
                    subtitle={stat.subtitle}
                  />
                ))}
              </StatsGrid>

              {/* Additional Dashboard Content */}
              <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <RecentActivityComponent 
                      activities={activity} 
                      loading={loading}
                    />
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3 }}>
                    <QuickActionsComponent
                      actions={quickActions}
                      loading={loading}
                      onActionClick={handleQuickAction}
                    />
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </MainContent>
    </DashboardLayout>
  );
}

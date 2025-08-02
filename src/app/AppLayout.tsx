import { useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Box } from '@mui/material';
import type { RootState } from '@app/store';

export default function AppLayout() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated and trying to access protected routes
    if (!isAuthenticated && location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/') {
      navigate('/login');
    }
    // Redirect to dashboard if authenticated and on root path
    if (isAuthenticated && location.pathname === '/') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Don't center content for dashboard routes as they have their own layout
  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  if (isDashboardRoute) {
    return <Outlet />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f5f5'
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
}

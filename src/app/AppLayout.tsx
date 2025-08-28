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
    // Define public routes
    const publicRoutes = ['/login', '/signup'];
    const isPublicRoute = publicRoutes.includes(location.pathname);

    // Redirect to login if not authenticated and trying to access protected routes
    if (!isAuthenticated && !isPublicRoute) {
      navigate('/login', { replace: true });
    }
    // Redirect to dashboard if authenticated and on login/signup pages
    else if (isAuthenticated && isPublicRoute) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Define route types
  const isDashboardRoute = location.pathname.startsWith('/dashboard') || 
                           location.pathname.startsWith('/accounts') ||
                           location.pathname.startsWith('/service-health') ||
                           location.pathname.startsWith('/support-tickets');
  
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup';

  // For dashboard routes, render without any wrapper
  if (isDashboardRoute) {
    return <Outlet />;
  }

  // For auth routes, render without additional centering since AuthFormComponent handles its own centering
  if (isAuthRoute) {
    return <Outlet />;
  }

  // For other routes, use the centered layout
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

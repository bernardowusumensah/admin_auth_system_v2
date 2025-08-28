import { styled } from '@mui/material/styles';
import { Grid, Box } from '@mui/material';

export const DashboardLayout = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
});

export const MainContent = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const StatsGrid = styled(Grid)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(3),
  marginBottom: theme.spacing(3),
  [theme.breakpoints.down('md')]: {
    gridTemplateColumns: '1fr',
  },
}));

export const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  height: '100%',
  overflow: 'auto',
}));

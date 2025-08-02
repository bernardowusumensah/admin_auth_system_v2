import { styled } from '@mui/material/styles';
import { Grid } from '@mui/material';

export const DashboardLayout = styled('div')({
  display: 'flex',
  minHeight: '100vh',
});

export const MainContent = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

export const StatsGrid = styled(Grid)({
  flexGrow: 1,
});

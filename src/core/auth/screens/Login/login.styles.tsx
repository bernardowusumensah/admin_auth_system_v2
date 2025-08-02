import { styled } from '@mui/material/styles';
import { Box, Paper } from '@mui/material';

export const LoginContainer = styled(Box)({
  maxWidth: '400px',
  margin: '2rem auto',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export const LoginForm = styled(Paper)({
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
});

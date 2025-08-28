import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const FormWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100%',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

export const FormContainer = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  width: '100%',
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
  },
  '& .MuiButton-root': {
    marginTop: theme.spacing(1),
    height: 48,
    fontSize: '1rem',
    fontWeight: 600,
  },
}));

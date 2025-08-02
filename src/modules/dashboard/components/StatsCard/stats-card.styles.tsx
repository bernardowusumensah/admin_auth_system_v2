import { styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';

export const StatsCardContainer = styled(Card)({
  minWidth: 275,
  position: 'relative',
  padding: '16px',
});

export const StatsValue = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 'bold',
});

export const IconWrapper = styled('div')({
  position: 'absolute',
  top: '16px',
  right: '16px',
  fontSize: '2rem',
});

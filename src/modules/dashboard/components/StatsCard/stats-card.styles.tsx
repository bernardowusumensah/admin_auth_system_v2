import { styled } from '@mui/material/styles';
import { Card, Typography, Box } from '@mui/material';

interface ColorProps {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
}

export const StatsCardContainer = styled(Card, {
  shouldForwardProp: (prop) => prop !== 'color',
})<ColorProps>(({ theme, color = 'primary' }) => ({
  minWidth: 275,
  position: 'relative',
  padding: '16px',
  transition: 'all 0.3s ease-in-out',
  border: `1px solid ${theme.palette[color].light}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    borderColor: theme.palette[color].main,
  },
}));

export const StatsValue = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  lineHeight: 1.2,
}));

export const IconWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'color',
})<ColorProps>(({ theme, color = 'primary' }) => ({
  position: 'relative',
  fontSize: '2.5rem',
  color: theme.palette[color].main,
  opacity: 0.8,
  '& svg': {
    width: '2rem',
    height: '2rem',
  },
}));

export const TrendIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isPositive',
})<{ isPositive: boolean }>(({ theme, isPositive }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 8px',
  borderRadius: '12px',
  backgroundColor: isPositive ? theme.palette.success.light : theme.palette.error.light,
  color: isPositive ? theme.palette.success.dark : theme.palette.error.dark,
  fontSize: '0.875rem',
  fontWeight: 500,
  marginTop: '8px',
  '&::before': {
    content: '""',
    width: 0,
    height: 0,
    borderLeft: '4px solid transparent',
    borderRight: '4px solid transparent',
    borderBottom: isPositive ? '6px solid currentColor' : 'none',
    borderTop: isPositive ? 'none' : '6px solid currentColor',
    marginRight: '4px',
  },
}));

import type { ReactElement } from 'react';
import { CardContent, Typography, Box, Chip } from '@mui/material';
// Styles
import { StatsCardContainer, StatsValue, IconWrapper, TrendIndicator } from './stats-card.styles';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactElement;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  subtitle?: string;
}

export default function StatsCardComponent({ 
  title, 
  value, 
  icon, 
  trend,
  color = 'primary',
  subtitle 
}: StatsCardProps) {
  return (
    <StatsCardContainer color={color}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <StatsValue variant="h3" component="div">
              {value}
            </StatsValue>
            {subtitle && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                {subtitle}
              </Typography>
            )}
            {trend && (
              <TrendIndicator isPositive={trend.isPositive}>
                <Typography variant="body2" component="span">
                  {trend.isPositive ? '+' : ''}{trend.value}%
                </Typography>
              </TrendIndicator>
            )}
          </Box>
          <IconWrapper color={color}>
            {icon}
          </IconWrapper>
        </Box>
      </CardContent>
    </StatsCardContainer>
  );
}

import type { ReactElement } from 'react';
import { CardContent, Typography } from '@mui/material';
// Styles
import { StatsCardContainer, StatsValue, IconWrapper } from './stats-card.styles';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactElement;
}

export default function StatsCardComponent({ title, value, icon }: StatsCardProps) {
  return (
    <StatsCardContainer>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <StatsValue>{value}</StatsValue>
        <IconWrapper>{icon}</IconWrapper>
      </CardContent>
    </StatsCardContainer>
  );
}

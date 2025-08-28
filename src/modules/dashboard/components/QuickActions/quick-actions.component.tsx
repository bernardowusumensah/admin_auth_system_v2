import React from 'react';
import { 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Box,
  Skeleton
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon,
  HealthAndSafety as HealthIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import type { QuickAction } from '@modules/dashboard/services/dashboard.service';

interface QuickActionsProps {
  actions: QuickAction[];
  loading?: boolean;
  onActionClick: (actionId: string) => void;
}

const getActionIcon = (iconName: string) => {
  switch (iconName) {
    case 'person_add':
      return <PersonAddIcon />;
    case 'health_and_safety':
      return <HealthIcon />;
    case 'security':
      return <SecurityIcon />;
    case 'settings':
      return <SettingsIcon />;
    default:
      return <SettingsIcon />;
  }
};

export default function QuickActionsComponent({ 
  actions, 
  loading = false, 
  onActionClick 
}: QuickActionsProps) {
  if (loading) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="rectangular" height={40} sx={{ mb: 1 }} />
                  <Skeleton variant="text" width="60%" />
                  <Skeleton variant="text" width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (actions.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No quick actions available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Quick Actions
      </Typography>
      <Grid container spacing={2}>
        {actions.map((action) => (
          <Grid item xs={12} sm={6} md={4} key={action.id}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', p: 2 }}>
                <Box sx={{ mb: 2 }}>
                  {getActionIcon(action.icon)}
                </Box>
                <Typography variant="h6" gutterBottom>
                  {action.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  {action.description}
                </Typography>
                <Button
                  variant="contained"
                  color={action.color}
                  fullWidth
                  onClick={() => onActionClick(action.id)}
                  startIcon={<RefreshIcon />}
                >
                  Execute
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

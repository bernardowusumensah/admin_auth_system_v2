import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Typography, 
  Chip,
  Box,
  Skeleton
} from '@mui/material';
import { 
  Login as LoginIcon, 
  PersonAdd as SignupIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon 
} from '@mui/icons-material';
import type { RecentActivity } from '@modules/dashboard/services/dashboard.service';

interface RecentActivityProps {
  activities: RecentActivity[];
  loading?: boolean;
}

const getActivityIcon = (type: RecentActivity['type']) => {
  switch (type) {
    case 'login':
      return <LoginIcon color="primary" />;
    case 'signup':
      return <SignupIcon color="success" />;
    case 'update':
      return <EditIcon color="warning" />;
    case 'delete':
      return <DeleteIcon color="error" />;
    default:
      return <LoginIcon />;
  }
};

const getActivityColor = (type: RecentActivity['type']) => {
  switch (type) {
    case 'login':
      return 'primary';
    case 'signup':
      return 'success';
    case 'update':
      return 'warning';
    case 'delete':
      return 'error';
    default:
      return 'default';
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
  return date.toLocaleDateString();
};

export default function RecentActivityComponent({ activities, loading = false }: RecentActivityProps) {
  if (loading) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
        ))}
      </Box>
    );
  }

  if (activities.length === 0) {
    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Recent Activity
        </Typography>
        <Typography variant="body2" color="textSecondary">
          No recent activity to display.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      <List sx={{ p: 0 }}>
        {activities.slice(0, 5).map((activity) => (
          <ListItem key={activity.id} sx={{ px: 0, py: 1 }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              {getActivityIcon(activity.type)}
            </ListItemIcon>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" component="span">
                    {activity.description}
                  </Typography>
                  <Chip 
                    label={activity.type} 
                    size="small" 
                    color={getActivityColor(activity.type)}
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="textSecondary">
                    {activity.userName}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatTimestamp(activity.timestamp)}
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

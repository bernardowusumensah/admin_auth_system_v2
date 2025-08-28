import type { ReactNode } from 'react';
import { Box, Paper, Typography } from '@mui/material';
// Styles
import { FormContainer, FormWrapper } from './auth-form.styles';

interface AuthFormProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  error?: string;
}

export default function AuthFormComponent({ 
  children, 
  onSubmit, 
  title,
  subtitle,
  loading = false,
  error
}: AuthFormProps) {
  return (
    <FormWrapper>
      <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400 }}>
        {title && (
          <Typography variant="h4" component="h1" gutterBottom align="center">
            {title}
          </Typography>
        )}
        {subtitle && (
          <Typography variant="body1" color="textSecondary" gutterBottom align="center" sx={{ mb: 3 }}>
            {subtitle}
          </Typography>
        )}
        {error && (
          <Typography variant="body2" color="error" gutterBottom align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <FormContainer 
          component="form" 
          onSubmit={onSubmit}
          disabled={loading}
        >
          {children}
        </FormContainer>
      </Paper>
    </FormWrapper>
  );
}

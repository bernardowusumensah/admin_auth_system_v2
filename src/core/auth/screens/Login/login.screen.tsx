import { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@modules/hooks';
import AuthHeaderComponent from '@core/auth/components/AuthHeader/auth-header.component';
import toast from 'react-hot-toast';
// Styles
import { LoginContainer, LoginForm } from './login.styles';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      toast.success('Login successful! Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the auth hook
      toast.error('Login failed. Please check your credentials.');
      console.error('Login failed:', err);
    }
  };

  return (
    <div>
      <AuthHeaderComponent title="Admin Dashboard" />
      <LoginContainer>
        <LoginForm>
          <Box component="form" onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField 
              label="Email" 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              fullWidth
              margin="normal"
              required
            />
            <TextField 
              label="Password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/signup" underline="hover">
                  Sign up here
                </Link>
              </Typography>
            </Box>
          </Box>
        </LoginForm>
      </LoginContainer>
    </div>
  );
}

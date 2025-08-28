import { useState } from 'react';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@modules/hooks';
import AuthFormComponent from '@core/auth/components/AuthForm/auth-form.component';
import toast from 'react-hot-toast';

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
    <AuthFormComponent
      onSubmit={handleSubmit}
      title="Welcome Back"
      subtitle="Sign in to your admin account"
      loading={loading}
      error={error??''}
    >
      <TextField 
        label="Email" 
        type="email"
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        fullWidth
        required
        variant="outlined"
        size="medium"
      />
      <TextField 
        label="Password" 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        fullWidth
        required
        variant="outlined"
        size="medium"
      />
      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        disabled={loading}
        size="large"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Don't have an account?{' '}
          <Link component={RouterLink} to="/signup" underline="hover" color="primary">
            Sign up here
          </Link>
        </Typography>
      </Box>
    </AuthFormComponent>
  );
}

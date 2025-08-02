import { useState } from 'react';
import { TextField, Button, Alert, Box, Typography, Link } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@modules/hooks';
import AuthHeaderComponent from '@core/auth/components/AuthHeader/auth-header.component';
import toast from 'react-hot-toast';
// Styles
import { SignupContainer, SignupForm } from './signup.styles';

export default function SignupScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const { signup, error, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      });
      toast.success('Account created successfully! Welcome to the dashboard.');
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the auth hook
      toast.error('Signup failed. Please check your information.');
      console.error('Signup failed:', err);
    }
  };

  return (
    <div>
      <AuthHeaderComponent title="Admin Dashboard" />
      <SignupContainer>
        <SignupForm>
          <Box component="form" onSubmit={handleSubmit}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField 
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField 
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField 
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField 
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" fullWidth disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" underline="hover">
                  Login here
                </Link>
              </Typography>
            </Box>
          </Box>
        </SignupForm>
      </SignupContainer>
    </div>
  );
}

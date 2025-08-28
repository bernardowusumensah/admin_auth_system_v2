import { useState } from 'react';
import { TextField, Button, Box, Typography, Link, Grid } from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '@modules/hooks';
import AuthFormComponent from '@core/auth/components/AuthForm/auth-form.component';
import toast from 'react-hot-toast';

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
    <AuthFormComponent
      onSubmit={handleSubmit}
      title="Create Account"
      subtitle="Join the admin dashboard"
      loading={loading}
      error={error}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            size="medium"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField 
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            size="medium"
          />
        </Grid>
      </Grid>
      <TextField 
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        required
        variant="outlined"
        size="medium"
      />
      <TextField 
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
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
        {loading ? 'Creating Account...' : 'Create Account'}
      </Button>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="body2" color="textSecondary">
          Already have an account?{' '}
          <Link component={RouterLink} to="/login" underline="hover" color="primary">
            Sign in here
          </Link>
        </Typography>
      </Box>
    </AuthFormComponent>
  );
}

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Paper,
  Alert,
  CircularProgress,
  alpha,
  useTheme,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from '../../config';

// Netflix-inspired styled components
const NetflixTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 4,
    backgroundColor: alpha('#333', 0.7),
    '&.Mui-focused': {
      backgroundColor: alpha('#333', 0.9),
    },
    '&:hover': {
      backgroundColor: alpha('#333', 0.9),
    },
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: alpha('#fff', 0.1),
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
    },
  },
  '& .MuiInputLabel-root': {
    color: alpha('#fff', 0.7),
    '&.Mui-focused': {
      color: '#fff',
    },
  },
  '& .MuiInputBase-input': {
    color: '#fff',
    padding: '14px 16px',
  },
}));

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
  
//   const { login } = useAuth();
//   const navigate = useNavigate();
  
//   const { email, password } = formData;
  
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };
const login = async (userData) => {
  try {
    setError(null);
    const res = await axios.post(`${BASE_URL}/auth/login`, userData);

    localStorage.setItem('token', res.data.token);
    setAuthToken(res.data.token);
    setCurrentUser(res.data.user);
    setIsAuthenticated(true);

    return res.data;
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
    throw err;
  }
};
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  return (
    <Box
      sx={{
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url(/assets/cinema-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 2, sm: 4 },
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 8,
          }}
        >
          <Typography 
            component="h1" 
            variant="h3" 
            sx={{ 
              mb: 6, 
              color: theme.palette.primary.main, 
              fontWeight: 'bold',
              letterSpacing: '1px',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            ICYIZERE MANAGEMENT
          </Typography>

          <Paper 
            elevation={10} 
            sx={{
              p: { xs: 3, sm: 5 },
              width: '100%',
              maxWidth: 450,
              borderRadius: 2,
              backgroundColor: alpha('#0A0A0A', 0.9),
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha('#fff', 0.1)}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}
          >
            <Typography 
              component="h2" 
              variant="h4" 
              sx={{ 
                mb: 4, 
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Sign In
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  backgroundColor: alpha(theme.palette.error.main, 0.15),
                  color: theme.palette.error.light,
                  border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
                  '& .MuiAlert-icon': {
                    color: theme.palette.error.main,
                  },
                }}
              >
                {error}
              </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <NetflixTextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={handleChange}
                variant="outlined"
              />
              <NetflixTextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={handleChange}
                variant="outlined"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                        sx={{ color: alpha('#fff', 0.7) }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={rememberMe} 
                      onChange={handleRememberMeChange} 
                      sx={{
                        color: alpha('#fff', 0.7),
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: alpha('#fff', 0.7) }}>
                      Remember me
                    </Typography>
                  }
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: alpha('#fff', 0.7),
                    '&:hover': {
                      color: '#fff',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }
                  }}
                >
                  Need help?
                </Typography>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ 
                  mt: 4, 
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  borderRadius: 1,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
              
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.5) }}>
                  &copy; 2025 Icyizere Management System - All Rights Reserved
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;

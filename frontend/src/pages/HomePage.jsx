import React from 'react';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh', py: 8 }}>
      <Container maxWidth="md">
        {/* Hero Section */}
        <Box
          sx={{
            backgroundColor: '#ffffff',
            p: 5,
            borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >

        
          <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
            {isLoggedIn ? 'Welcome Back to SkillSwap 🙌' : 'Welcome to SkillSwap 🚀'}
          </Typography>
          <Typography variant="h6" color="textSecondary" mb={4}>
            {isLoggedIn
              ? 'Explore new skills, manage your swaps, and connect with learners like you!'
              : 'Where skills meet opportunity. Connect, learn, and grow by exchanging your expertise with others.'}
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center">
            {!isLoggedIn && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => navigate('/register')}
              >
                Join SkillSwap
              </Button>
            )}
            <Button
              variant="outlined"
              color="primary"
              size="large"
              onClick={() => navigate('/search')}
            >
              🔍 Search Skills
            </Button>
          </Stack>
        </Box>

        {/* Features Section */}
        <Box mt={10}>
          <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
            🌟 Why Choose SkillSwap?
          </Typography>
          <Box
            display="grid"
            gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr 1fr' }}
            gap={4}
            mt={4}
          >
            {[
              {
                title: '🔄 Swap Skills',
                text: 'Teach what you know, learn what you don’t. From coding to cooking, exchange value directly.',
              },
              {
                title: '🤝 Build Connections',
                text: 'Meet like-minded learners and experts across domains to grow together.',
              },
              {
                title: '🧠 Continuous Learning',
                text: 'Never stop growing. Expand your skillset through collaborative and practical learning.',
              },
            ].map((feature, index) => (
              <Box
                key={index}
                sx={{
                  backgroundColor: '#ffffff',
                  p: 3,
                  borderRadius: 3,
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography color="textSecondary">{feature.text}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Final CTA only if not logged in */}
        {!isLoggedIn && (
          <Box
            mt={12}
            textAlign="center"
            p={4}
            sx={{ backgroundColor: '#e3f2fd', borderRadius: 4 }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Ready to Discover Your Next Skill?
            </Typography>
            <Typography variant="body1" mb={3}>
              Sign up, create your profile, and find someone who wants what you offer.
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate('/register')}>
              Get Started
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default HomePage;

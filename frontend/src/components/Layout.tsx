import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Atech Training System
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Link component={RouterLink} to="/" color="inherit" underline="none">
              Trang chủ
            </Link>
            <Link component={RouterLink} to="/upload" color="inherit" underline="none">
              Tải lên
            </Link>
            <Link component={RouterLink} to="/search" color="inherit" underline="none">
              Tìm kiếm
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'primary.main', color: 'white' }}>
        <Container maxWidth="sm">
          <Typography variant="body1" align="center">
            © 2025 ATech Training System. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 
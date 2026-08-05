import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/giant.png';

const navItems = [
  { label: 'OVERVIEW', path: '/' },
  { label: 'SALES', path: '/sales' },
  { label: 'STOCK', path: '/stock' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('username');
  navigate('/login');
};


  return (
    <>
      {/* Top Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#000' }} elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Left Logo */}
          <Box display="flex" alignItems="center" gap={1}>
            <img src={logo} alt="Giant Logo" style={{ height: '60px' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
              GIANT
            </Typography>
          </Box>

          {/* Right Title & Hamburger */}
          <Box display="flex" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff', mr: 1 }}>
              BRISTOL
            </Typography>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Bottom Gray Bar */}
      <Box sx={{ backgroundColor: '#d3d3d3', py: 1 }}>
        <Container>
          <Box display="flex" justifyContent="center" gap={4} flexWrap="wrap">
            {navItems.map(({ label, path }) => (
              <Button
                key={label}
                component={Link}
                to={path}
                sx={{
                  fontWeight: 700,
                  color: location.pathname === path ? '#000' : 'text.primary',
                  borderBottom: location.pathname === path ? '2px solid #000' : 'none',
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default Navbar;

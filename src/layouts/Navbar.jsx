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
  MenuItem,
  Select,
  FormControl,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation, LOCATIONS } from '../slices/locationSlice';
import logo from '../assets/giant.png';

const navItems = [
  { label: 'OVERVIEW', path: '/' },
  { label: 'SALES', path: '/sales' },
  { label: 'STOCK', path: '/stock' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const selectedLocation = useSelector((state) => state.location.selected);

  const handleLocationChange = (event) => {
    const loc = LOCATIONS.find((l) => l.code === event.target.value);
    if (loc) dispatch(setLocation(loc));
  };

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

          {/* Right Location Selector & Hamburger */}
          <Box display="flex" alignItems="center">
            <FormControl size="small" sx={{ mr: 1 }}>
              <Select
                value={selectedLocation.code}
                onChange={handleLocationChange}
                sx={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.5)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#fff' },
                  '.MuiSvgIcon-root': { color: '#fff' },
                }}
              >
                {LOCATIONS.map((loc) => (
                  <MenuItem key={loc.code} value={loc.code}>
                    {loc.display}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

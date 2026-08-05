// components/Footer.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 4,
        py: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {year} THE BICYCLE CHAIN. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;

import React, { useEffect } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import EnhancedTable from './EnhancedTableCustom';
import { useDispatch, useSelector } from 'react-redux';
import { getOverview } from '../../slices/salesSlice';

const unitColumns = [
  { id: 'name', label: 'Category', numeric: false },
  { id: 'valueCurrentYear', label: 'Units', numeric: true },
  { id: 'valueDifference', label: 'Change', numeric: true, isCurrency: false },
  { id: 'valueDifferencePercentage', label: '% Change', numeric: true },
];

const marginColumns = [
  { id: 'name', label: 'Category', numeric: false },
  { id: 'valueCurrentYear', label: 'Margin %', numeric: true, isCurrency: false },
  { id: 'valueDifference', label: 'Change', numeric: true, isCurrency: false },
  { id: 'valueDifferencePercentage', label: '% Change', numeric: true, isCurrency: false },
];

// Custom category order
const categoryOrder = {
  'All Bikes': 1,
  'Electric Bikes': 2,
  'Parts & Accessories': 3,
  'Labour': 4,
};

const Home2 = () => {
  const dispatch = useDispatch();

  const {
    overviewData,
    loadingOverview: loading,
    overviewFilters: { startDate, endDate },
  } = useSelector((state) => state.sales);
  const selectedLocation = useSelector((state) => state.location.selected.code);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(getOverview({ DtFrom: startDate, DtTo: endDate }));
    }
  }, [dispatch, startDate, endDate, selectedLocation]);

  const unitsRows = overviewData
    ? Object.values(overviewData.units || {})
        .filter(item => item.name !== 'Grand Total' && item.name !== 'Sales Ex VAT')
        .sort((a, b) => (categoryOrder[a.name] || 99) - (categoryOrder[b.name] || 99))
    : [];

  const marginRows = overviewData
    ? Object.values(overviewData.margin || {})
        .filter(item => item.name !== 'Grand Total' && item.name !== 'Sales Ex VAT')
        .sort((a, b) => (categoryOrder[a.name] || 99) - (categoryOrder[b.name] || 99))
    : [];

  const unitsGrandTotal = overviewData?.units?.grandTotal;
  const marginGrandTotal = overviewData?.margin?.grandTotal;

  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 3,
        flexWrap: 'wrap',
      }}
    >
      {/* UNITS Table */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          flex: 1,
          minWidth: { xs: '100%', md: '48%' },
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: 'primary.main',
            fontSize: { xs: '1rem', sm: '1.25rem' },
          }}
        >
          UNITS
        </Typography>
        <EnhancedTable
          rows={unitsRows}
          columns={unitColumns}
          loading={loading}
          footerRow={unitsGrandTotal}
        />
      </Paper>

      {/* MARGIN Table */}
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: 3,
          flex: 1,
          minWidth: { xs: '100%', md: '48%' },
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: 'primary.main',
            fontSize: { xs: '1rem', sm: '1.25rem' },
          }}
        >
          MARGIN
        </Typography>
        <EnhancedTable
          rows={marginRows}
          columns={marginColumns}
          loading={loading}
          footerRow={marginGrandTotal}
        />
      </Paper>
    </Box>
  );
};

export default Home2;

import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import EnhancedTable from './EnhancedTableCustom';
import { useDispatch, useSelector } from 'react-redux';
import {
  getOverview,
  setOverviewFilters,
} from '../../slices/salesSlice'; // ✅ use setOverviewFilters

const columns = [
  { id: 'name', label: 'Category', numeric: false },
  { id: 'valueCurrentYear', label: 'Amount (£)', numeric: true },
  { id: 'valueDifference', label: 'Change', numeric: true },
  { id: 'valueDifferencePercentage', label: '% Change', numeric: true },
];

const categoryOrder = {
  'Sales Ex VAT': 1,
  'All Bikes': 2,
  'Electric Bikes': 3,
  'Parts & Accessories': 4,
  'Labour': 5,
};

const Home1 = () => {
  const dispatch = useDispatch();

  const {
    overviewFilters: { startDate, endDate },
    overviewData,
    loadingOverview: loading,
  } = useSelector((state) => state.sales);
  const selectedLocation = useSelector((state) => state.location.selected.code);

  useEffect(() => {
    if (startDate && endDate) {
      dispatch(getOverview({ DtFrom: startDate, DtTo: endDate }));
    }
  }, [dispatch, startDate, endDate, selectedLocation]);

  const handleDateChange = (key, value) => {
    if (value) {
      dispatch(setOverviewFilters({ [key]: value.format('YYYY-MM-DD') }));
    }
  };

  const salesRows = overviewData
    ? Object.values(overviewData.salesPerformance || {})
        .filter((item) => item.name !== 'Grand Total')
        .sort((a, b) => (categoryOrder[a.name] || 99) - (categoryOrder[b.name] || 99))
    : [];

  const grossRows = overviewData
    ? Object.values(overviewData.grossProfit || {})
        .filter((item) => item.name !== 'Grand Total')
        .map((item) => ({
          ...item,
          name: item.name === 'Sales Ex VAT' ? 'Gross Profit' : item.name,
        }))
        .sort((a, b) => {
          const orderMap = {
            'Gross Profit': 1,
            'All Bikes': 2,
            'Electric Bikes': 3,
            'Parts & Accessories': 4,
            'Labour': 5,
          };
          return (orderMap[a.name] || 99) - (orderMap[b.name] || 99);
        })
    : [];

  const salesGrandTotal = overviewData?.salesPerformance?.grandTotal;
  const grossGrandTotal = overviewData?.grossProfit?.grandTotal;

  return (
    <Box
      sx={{
        width: '100%',
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item>
            <DatePicker
              label="Start Date"
              value={dayjs(startDate)}
              onChange={(newValue) => handleDateChange('startDate', newValue)}
              format="DD-MM-YYYY"
              slotProps={{ textField: { size: 'small' } }}
            />
          </Grid>
          <Grid item>
            <DatePicker
              label="End Date"
              value={dayjs(endDate)}
              onChange={(newValue) => handleDateChange('endDate', newValue)}
              format="DD-MM-YYYY"
              slotProps={{ textField: { size: 'small' } }}
            />
          </Grid>
        </Grid>
      </LocalizationProvider>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
          flexWrap: 'wrap',
        }}
      >
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
            SALES PERFORMANCE
          </Typography>
          <EnhancedTable
            rows={salesRows}
            columns={columns}
            loading={loading}
            footerRow={salesGrandTotal}
          />
        </Paper>

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
            GROSS PROFIT
          </Typography>
          <EnhancedTable
            rows={grossRows}
            columns={columns}
            loading={loading}
            footerRow={grossGrandTotal}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default Home1;

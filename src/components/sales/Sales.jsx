/** @format */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Pagination,
  Typography,
  Grid,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { useSalesQuery } from '../../queries/salesQueries';
import { filterByMpn, sortRows } from '../../utils/dataFilters';
import { setSalesFilters } from '../../slices/salesSlice';

const Sales = () => {
  const dispatch = useDispatch();
  const {
    salesFilters: { startDate, endDate, mpn, rowsPerPage, page },
  } = useSelector((state) => state.sales);

  const DtFrom = startDate ? dayjs(startDate).format('YYYY-MM-DD') : '';
  const DtTo = endDate ? dayjs(endDate).format('YYYY-MM-DD') : '';
  const {
    data: queriedSalesData,
    isLoading: loading,
    isFetching,
    error,
  } = useSalesQuery({ DtFrom, DtTo });

  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const [mpnInput, setMpnInput] = useState(mpn || '');

  const updateFilter = useCallback(
    (key, value) => {
      dispatch(setSalesFilters({ [key]: value }));
    },
    [dispatch]
  );

  useEffect(() => {
    updateFilter('page', 1);
  }, [mpn, startDate, endDate, updateFilter]);

  // Debounce MPN input filter
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedMpn = mpnInput.trim();
      updateFilter('mpn', trimmedMpn);
    }, 400); // delay for debounce

    return () => clearTimeout(handler);
  }, [mpnInput, updateFilter]);

  const filteredSortedData = useMemo(() => {
    const data = filterByMpn(
      (queriedSalesData || []).filter((row) => {
        const rowDate = dayjs(row.date);
        return (
          (!startDate || rowDate.isAfter(dayjs(startDate).subtract(1, 'day'))) &&
          (!endDate || rowDate.isBefore(dayjs(endDate).add(1, 'day')))
        );
      }),
      mpn
    );

    return sortRows(data, sortConfig);
  }, [queriedSalesData, startDate, endDate, mpn, sortConfig]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredSortedData.slice(start, start + rowsPerPage);
  }, [filteredSortedData, page, rowsPerPage]);

  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredSortedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Data');
    XLSX.writeFile(workbook, 'sales_data.csv');
  };

  const canExport = !loading && !isFetching && !error && filteredSortedData.length > 0;

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <Box sx={{ width: '100%', px: { xs: 2, sm: 3, md: 4 }, py: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Sales Data
        </Typography>
        <Button variant="contained" onClick={exportToCSV} disabled={!canExport}>
          Export to CSV
        </Button>
      </Grid>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Filter Records
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start Date"
                value={dayjs(startDate)}
                onChange={(date) => updateFilter('startDate', date?.toISOString())}
                minDate={dayjs('2025-01-01')}
                maxDate={dayjs()}
                format="DD-MM-YYYY"
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={3}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End Date"
                value={dayjs(endDate)}
                onChange={(date) => updateFilter('endDate', date?.toISOString())}
                minDate={dayjs('2025-01-01')}
                maxDate={dayjs()}
                format="DD-MM-YYYY"
                slotProps={{ textField: { fullWidth: true, size: 'small' } }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="MPN Filter"
              value={mpnInput}
              onChange={(e) => setMpnInput(e.target.value)}
              fullWidth
              size="small"
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Results per page"
              value={rowsPerPage}
              onChange={(e) => updateFilter('rowsPerPage', +e.target.value)}
              fullWidth
              size="small"
              sx={{ minWidth: 150 }}
            >
              {[10, 25, 50].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box textAlign="center" py={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  {['date', 'mpn', 'productName', 'quantity', 'price'].map((field) => (
                    <TableCell key={field} sx={{ fontWeight: 600, color: '#1976d2' }}>
                      <TableSortLabel
                        active={sortConfig.key === field}
                        direction={
                          sortConfig.key === field ? sortConfig.direction : 'asc'
                        }
                        onClick={() => handleSort(field)}
                      >
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, index) => {
                    const priceColor =
                      row.price <= 100 || row.price >= 250 ? 'green' : 'inherit';
                    const isInvalidQuantity = !row.quantity || row.quantity === 0;
                    const isInvalidPrice = !row.price || row.price === 0;

                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {row.date
                            ? new Date(row.date).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })
                            : '-'}
                        </TableCell>
                        <TableCell>{row.mpn || '-'}</TableCell>
                        <TableCell>{row.productName || '-'}</TableCell>
                        <TableCell
                          sx={
                            isInvalidQuantity
                              ? { color: 'red', fontWeight: 600 }
                              : {}
                          }
                        >
                          {isInvalidQuantity ? 'Invalid' : row.quantity}
                        </TableCell>
                        <TableCell
                          sx={{
                            color: isInvalidPrice ? 'red' : priceColor,
                            fontWeight: 600,
                          }}
                        >
                          {isInvalidPrice
                            ? 'Invalid'
                            : `£ ${row.price?.toLocaleString()}`}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(filteredSortedData.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => updateFilter('page', value)}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Sales;

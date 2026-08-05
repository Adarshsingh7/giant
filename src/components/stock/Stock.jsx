/** @format */
import React, { useMemo, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  Pagination,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import * as XLSX from 'xlsx';
import { useDispatch, useSelector } from 'react-redux';
import { useStockQuery } from '../../queries/stockQueries';
import { filterByMpn, sortRows } from '../../utils/dataFilters';
import {
  setMpnFilter,
  setRowsPerPage,
  setPage,
} from '../../slices/stockSlice';

const Stock = () => {
  const dispatch = useDispatch();

  // Redux state
  const { mpnFilter, rowsPerPage, page } = useSelector((state) => state.stock);
  const {
    data: stockData = [],
    isLoading: loading,
    isFetching,
    isSuccess,
    error,
    refetch,
  } = useStockQuery();

  const [sortConfig, setSortConfig] = useState({ key: 'quantity', direction: 'asc' });

  // Filtered data
  const filteredData = useMemo(() => filterByMpn(stockData, mpnFilter), [stockData, mpnFilter]);

  // Sorted data
  const sortedData = useMemo(() => sortRows(filteredData, sortConfig), [filteredData, sortConfig]);

  // Paginated data
  const paginatedData = sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Sorting
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // CSV Export
  const exportToCSV = () => {
    const worksheet = XLSX.utils.json_to_sheet(sortedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Stock Data');
    XLSX.writeFile(workbook, 'stock_data.csv');
  };

  const canExport = !loading && !isFetching && !error && sortedData.length > 0;
  const canReload = isSuccess && !isFetching;

  return (
    <Box sx={{ px: { xs: 2, sm: 4 }, py: 4 }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          Stock Data
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Tooltip title="Reload stock data">
            <span>
              <IconButton
                aria-label="Reload stock data"
                onClick={() => refetch()}
                disabled={!canReload}
                color="primary"
              >
                <RefreshIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Button variant="contained" onClick={exportToCSV} disabled={!canExport}>
            Export to CSV
          </Button>
        </Box>
      </Grid>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Filter Records
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="MPN Filter"
              value={mpnFilter}
              onChange={(e) => dispatch(setMpnFilter(e.target.value))}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Results per page"
              value={rowsPerPage}
              onChange={(e) => dispatch(setRowsPerPage(Number(e.target.value)))}
              fullWidth
              size="small"
              sx={{ minWidth: 120 }}
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
        <Box display="flex" justifyContent="center" mt={5}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" textAlign="center">
          {error}
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} elevation={2}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {['mpn', 'quantity', 'location'].map((field) => (
                    <TableCell key={field}>
                      <TableSortLabel
                        active={sortConfig.key === field}
                        direction={sortConfig.key === field ? sortConfig.direction : 'asc'}
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
                    <TableCell colSpan={3} align="center">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.mpn}</TableCell>
                      <TableCell>{row.quantity}</TableCell>
                      <TableCell>{row.location}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box mt={3} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(sortedData.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => dispatch(setPage(value))}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default Stock;

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const EnhancedTable = ({ rows, columns, footerRow = null, loading = false }) => {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(null);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedRows = orderBy ? [...rows].sort(getComparator(order, orderBy)) : rows;

  const formatValue = (value, col) => {
    if (typeof value !== 'number') return value;

    const isPositive = value > 0;
    const isNegative = value < 0;

    // Format % Change
    if (col.id.toLowerCase().includes('percentage')) {
      return `${isPositive ? '+' : ''}${Math.abs(value).toFixed(2)}%`;
    }

    // Format Change
    if (col.id.toLowerCase().includes('difference')) {
      const formatted = `${isPositive ? '+' : isNegative ? '-' : ''}£${Math.abs(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
      return col.isCurrency === false ? formatted.replace('£', '') : formatted;
    }

    // Format Current Year (Units or Margin)
    if (col.id === 'valueCurrentYear') {
      const formatted = value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      // Show plain number for Units (no £)
      return col.label === 'Units' ? formatted : col.isCurrency === false ? formatted : `£${formatted}`;
    }

    return value;
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        width: '100%',
        overflowX: 'auto',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Table stickyHeader size="small" sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.id}
                align={col.numeric ? 'right' : 'left'}
                sortDirection={orderBy === col.id ? order : false}
                sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}
              >
                <TableSortLabel
                  active={orderBy === col.id}
                  direction={orderBy === col.id ? order : 'asc'}
                  onClick={(e) => handleRequestSort(e, col.id)}
                >
                  {col.label}
                  {orderBy === col.id && (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  )}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <CircularProgress size={32} />
                </Box>
              </TableCell>
            </TableRow>
          ) : sortedRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                No data available
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((row, index) => (
              <TableRow key={index} hover>
                {columns.map((col) => {
                  const value = row[col.id];
                  const isPositive = typeof value === 'number' && value > 0;
                  const isNegative = typeof value === 'number' && value < 0;

                  return (
                    <TableCell
                      key={col.id}
                      align={col.numeric ? 'right' : 'left'}
                      sx={{
                        color:
                          col.id !== 'name' && isPositive
                            ? 'green'
                            : col.id !== 'name' && isNegative
                            ? 'red'
                            : 'inherit',
                        fontWeight: col.id === 'name' ? 600 : 'normal',
                      }}
                    >
                      {formatValue(value, col)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}

          {/* Grand Total Footer Row */}
          {!loading && footerRow && (
            <TableRow sx={{ backgroundColor: '#fafafa' }}>
              {columns.map((col) => {
                const value = footerRow[col.id];
                const isPositive = typeof value === 'number' && value > 0;
                const isNegative = typeof value === 'number' && value < 0;

                return (
                  <TableCell
                    key={col.id}
                    align={col.numeric ? 'right' : 'left'}
                    sx={{
                      fontWeight: 'bold',
                      color:
                        col.id !== 'name' && isPositive
                          ? 'green'
                          : col.id !== 'name' && isNegative
                          ? 'red'
                          : 'primary.main',
                    }}
                  >
                    {formatValue(value, col)}
                  </TableCell>
                );
              })}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default EnhancedTable;

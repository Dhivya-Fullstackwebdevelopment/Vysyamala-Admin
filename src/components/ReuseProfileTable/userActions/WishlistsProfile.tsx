import React, { useEffect, useState } from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

import { Link } from 'react-router-dom';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

interface WishlistsProfileData {
  results: any[];
  count: number;
  message?: string;
}

const getWishlistsProfile = async (fromDate: string, toDate: string, page: number, rowsPerPage: number) => {
  const params = new URLSearchParams({
    from_date: fromDate,
    to_date: toDate,
    page: (page + 1).toString(),
    rowsPerPage: rowsPerPage.toString()
  });

  const url = `https://app.vysyamala.com/api/bookmarks/?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
};

const WishlistsProfile: React.FC = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('profile_from_id');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [data, setData] = useState<WishlistsProfileData>({
    results: [],
    count: 0,
  });
  const [search, setSearch] = useState<string>('');
  
  // States for actual filters (used in API calls)
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  
  // Local states for date inputs before submit
  const [localFromDate, setLocalFromDate] = useState<string>('');
  const [localToDate, setLocalToDate] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  // Toast states
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  // This effect runs only when pagination changes AFTER initial data load
  useEffect(() => {
    // Only fetch data if dates are already set (meaning submit was clicked before)
    if (fromDate && toDate) {
      fetchData();
    }
  }, [page, rowsPerPage]);

  const fetchData = async () => {
    // Validate dates before API call
    if (!fromDate || !toDate) {
      showToast("Please select both From Date and To Date", "warning");
      return;
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(fromDate) || !dateRegex.test(toDate)) {
      showToast("Invalid date format. Please use YYYY-MM-DD format", "error");
      return;
    }
    
    // Validate date range
    if (new Date(fromDate) > new Date(toDate)) {
      showToast("From Date cannot be after To Date", "warning");
      return;
    }
    
    setLoading(true);
    try {
      const response = await getWishlistsProfile(fromDate, toDate, page, rowsPerPage);
      setData(response);
      setTotalCount(response.count);
      
      // Check if there's a message from backend
      if (response.message) {
        showToast(response.message, "info");
      } else if (response.count === 0) {
        showToast("No data found for the selected date range", "info");
      }
    } catch (error: any) {
      console.error('Error fetching data:', error);
      
      // Handle 404 error
      if (error.response && error.response.status === 404) {
        showToast("API endpoint not found. Please check the server configuration.", "error");
      }
      // Handle 400 Bad Request error
      else if (error.response && error.response.status === 400) {
        let errorMsg = "Invalid request parameters";
        
        if (error.response.data) {
          if (typeof error.response.data === 'string') {
            errorMsg = error.response.data;
          } else if (error.response.data.message) {
            errorMsg = error.response.data.message;
          } else if (error.response.data.detail) {
            errorMsg = error.response.data.detail;
          } else if (error.response.data.error) {
            errorMsg = error.response.data.error;
          }
        }
        showToast(errorMsg, "error");
      }
      // Handle 500 Internal Server Error
      else if (error.response && error.response.status === 500) {
        showToast("Internal server error. Please try again later.", "error");
      }
      // Handle network errors
      else if (error.code === 'ERR_NETWORK') {
        showToast("Network error. Please check your internet connection.", "error");
      }
      // Handle other errors
      else if (error.message) {
        showToast(error.message, "error");
      } 
      else {
        showToast("An error occurred while fetching data", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // Toast functions
  const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleCloseToast = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setToastOpen(false);
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    
    // Sort locally without API call
    const sortedData = stableSort(
      data.results,
      getComparator(isAsc ? 'desc' : 'asc', property)
    );
    setData({ ...data, results: sortedData });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0); // Reset page to 0 when search term changes
    
    // Search locally without API call
    const filtered = data.results.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(event.target.value.toLowerCase())
      )
    );
    setData({ ...data, results: filtered });
    setTotalCount(filtered.length);
  };

  const handleLocalDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'fromDate') {
      setLocalFromDate(value);
    } else if (name === 'toDate') {
      setLocalToDate(value);
    }
  };

  const handleSubmit = () => {
    // Validate dates
    if (!localFromDate || !localToDate) {
      showToast("Please select both From Date and To Date", "warning");
      return;
    }
    
    if (new Date(localFromDate) > new Date(localToDate)) {
      showToast("From Date cannot be after To Date", "warning");
      return;
    }
    
    // Apply the locally selected dates to the actual filter state
    setFromDate(localFromDate);
    setToDate(localToDate);
    setPage(0); // Reset to first page when submitting new dates
    
    // Fetch data with the selected dates
    fetchData();
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns: Column[] = [
    {
      id: 'profile_from_id',
      label: 'Profile From ID',
      minWidth: 150,
      align: 'center',
    },
    { id: 'profile_from_name', label: 'Profile From Name', minWidth: 150 },
    { id: 'profile_from_mobile', label: 'Profile From Mobile', minWidth: 150 },
    { id: 'profile_from_gender', label: 'Profile From Gender', minWidth: 100 },
    { id: 'profile_from_city', label: 'Profile From City', minWidth: 150 },
    { id: 'profile_from_state', label: 'Profile From State', minWidth: 150 },
    { id: 'profile_to_id', label: 'Profile To ID', minWidth: 150 },
    { id: 'profile_to_name', label: 'Profile To Name', minWidth: 150 },
    { id: 'profile_to_mobile', label: 'Profile To Mobile', minWidth: 150 },
    { id: 'profile_to_gender', label: 'Profile To Gender', minWidth: 100 },
    { id: 'profile_to_city', label: 'Profile To City', minWidth: 150 },
    { id: 'profile_to_state', label: 'Profile To State', minWidth: 150 },
    { id: 'marked_datetime', label: 'Marked Date/Time', minWidth: 200 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];

  const descendingComparator = (a: any, b: any, orderBy: string) => {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
  };

  const getComparator = (order: 'asc' | 'desc', orderBy: string) => {
    return order === 'desc'
      ? (a: any, b: any) => descendingComparator(a, b, orderBy)
      : (a: any, b: any) => -descendingComparator(a, b, orderBy);
  };
  
  const stableSort = (array: any[], comparator: (a: any, b: any) => number) => {
    const stabilizedThis = array.map(
      (el, index) => [el, index] as [any, number],
    );
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  // Filter results based on search
  const filteredResults = stableSort(
    data.results.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase()),
      ),
    ),
    getComparator(order, orderBy),
  );

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-black">Wishlist Profiles <span className="text-lg font-normal">({totalCount})</span></h1>
      
      {/* Toast/Snackbar for messages */}
      <Snackbar 
        open={toastOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toastSeverity} 
          sx={{ width: '100%' }}
          variant="filled"
        >
          {toastMessage}
        </Alert>
      </Snackbar>
      
      <div className="w-full py-2 flex justify-between">
        <div className="w-full text-right flex justify-between">
          <div className="flex items-center space-x-2">
            <TextField
              label="From Date"
              type="date"
              name="fromDate"
              value={localFromDate}
              onChange={handleLocalDateChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: today // Restrict to today only
              }}
              required
            />
            <TextField
              label="To Date"
              type="date"
              name="toDate"
              value={localToDate}
              onChange={handleLocalDateChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: today // Restrict to today only
              }}
              required
            />

            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
          <TextField
            label="Search"
            variant="outlined"
            margin="normal"
            value={search}
            onChange={handleSearchChange}
            disabled={!fromDate || !toDate} // Disable search until dates are submitted
          />
        </div>
      </div>

      <Paper className="w-full">
        <TableContainer sx={{ border: '1px solid #E0E0E0' }} className="bg-white">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column, index) => (
                  <TableCell
                    sx={{
                      borderBottom: '1px solid #E0E0E0',
                      background: '#FFF9C9',
                      color: '#DC2635',
                      fontSize: '1rem',
                      fontWeight: 600,
                    }}
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    <TableSortLabel
                      className="!text-red-600 !text-base !text-md text-nowrap font-semibold"
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleRequestSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data.results.length === 0 && fromDate && toDate ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    {/* Message shown in toast */}
                  </TableCell>
                </TableRow>
              ) : data.results.length > 0 ? (
                filteredResults
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      sx={{ whiteSpace: 'nowrap' }}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align}>
                          {row[column.id]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    Select dates and click Submit to view data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {data.results.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={filteredResults.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Paper>
    </>
  );
};

export default WishlistsProfile;
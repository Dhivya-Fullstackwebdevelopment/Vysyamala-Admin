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
  Checkbox,
  FormControlLabel,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

interface ViewedProfilesData {
  results: any[];
  count: number;
  message?: string; // Add message field for backend errors
}

const getViewedProfiles = async (fromDate: string, toDate: string, page: number, rowsPerPage: number, mutualOnly: boolean) => {
  const params = new URLSearchParams({
    from_date: fromDate,
    to_date: toDate,
    page: (page + 1).toString(), // Convert to 1-based index
    limit: rowsPerPage.toString(), // Ensure correct API parameter
  });

  if (mutualOnly) {
    params.append('mutual_only', '1');
  }

  // const url = `https://app.vysyamala.com/api/viewed-profiles/?from_date=${fromDate}&to_date=${toDate}&page=${page + 1}&limit=${rowsPerPage}`;
  const url = `https://app.vysyamala.com/api/viewed-profiles/?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
};

const ViewedProfiles: React.FC = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('profile_from_id');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [goToPageInput, setGoToPageInput] = useState<string>('');
  const [totalCount, setTotalCount] = useState<number>(0);
  const [data, setData] = useState<ViewedProfilesData>({ results: [], count: 0 });

  const [search, setSearch] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false); // Changed to false initially

  // Toast state
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');

  // Use local state for date inputs before submitting
  const [localFromDate, setLocalFromDate] = useState<string>('');
  const [localToDate, setLocalToDate] = useState<string>('');
  const [mutualOnly, setMutualOnly] = useState<boolean>(false);
  const [localMutualOnly, setLocalMutualOnly] = useState<boolean>(false);
  const navigate = useNavigate();

  // Inside ViewedProfiles component
  const fetchData = async (fDate?: string, tDate?: string, isMutual?: boolean) => {
    // Use passed arguments OR fall back to existing state
    const effectiveFromDate = fDate || fromDate;
    const effectiveToDate = tDate || toDate;
    const effectiveMutual = isMutual !== undefined ? isMutual : mutualOnly;

    // Don't fetch if dates are not provided
    if (!effectiveFromDate || !effectiveToDate) {
      return;
    }

    setLoading(true);
    try {
      // Pass the "effective" values directly to the API helper
      const response = await getViewedProfiles(
        effectiveFromDate,
        effectiveToDate,
        page,
        rowsPerPage,
        effectiveMutual
      );

      setData(response);
      setTotalCount(response.count);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      showToast('An error occurred while fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPageInput, 10);
    const totalPages = Math.ceil(totalCount / rowsPerPage);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      setPage(pageNumber - 1);
      setGoToPageInput('');
    } else {
      showToast('Invalid page number', 'warning');
    }
  };
  // This useEffect runs only when pagination or search changes AFTER initial data load
  useEffect(() => {
    // Only fetch data if dates are already set (meaning submit was clicked before)
    if (fromDate && toDate) {
      fetchData();
    }
  }, [page, rowsPerPage]); // Removed fromDate and toDate from dependencies

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
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'fromDate') {
      setLocalFromDate(value);
    } else if (name === 'toDate') {
      setLocalToDate(value);
    }
  };

  const handleSubmit = () => {
    // Don't submit if dates are not selected
    if (!localFromDate || !localToDate) {
      showToast('Please select both From Date and To Date', 'warning');
      return;
    }

    // Apply the locally selected dates to the actual filter state
    setFromDate(localFromDate);
    setToDate(localToDate);
    setMutualOnly(localMutualOnly);
    setPage(0); // Reset to first page when submitting new dates

    // Fetch data with the selected dates
    fetchData(localFromDate, localToDate, localMutualOnly);
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

  const columns: Column[] = [
    {
      id: 'profile_viewer_profileId',
      label: 'Viewer Profile ID',
      minWidth: 150,
      align: 'center',
    },
    { id: 'profile_viewer_name', label: 'Viewer Name', minWidth: 150 },
    { id: 'profile_viewer_dob', label: 'Viewer Date of Birth', minWidth: 150 },
    { id: 'profile_viewer_city', label: 'Viewer City', minWidth: 150 },
    // { id: 'profile_viewer_mobile', label: 'Viewer Mobile', minWidth: 150 },
    { id: 'profile_viewer_gender', label: 'Viewer Gender', minWidth: 100 },
    { id: 'profile_viewer_planid', label: 'Viewer Plan ID', minWidth: 150 },
    {
      id: 'profile_viewer_created_by',
      label: 'Viewer Created By',
      minWidth: 150,
    },
    { id: 'profile_viewer_state', label: 'Viewer State', minWidth: 150 },
    {
      id: 'viewed_profile_profileId',
      label: 'Viewed Profile ID',
      minWidth: 150,
    },
    { id: 'viewed_profile_name', label: 'Viewed Name', minWidth: 150 },
    { id: 'viewed_profile_dob', label: 'Viewed Date of Birth', minWidth: 150 },
    { id: 'viewed_profile_city', label: 'Viewed City', minWidth: 150 },
    // { id: 'viewed_profile_mobile', label: 'Viewed Mobile', minWidth: 150 },
    { id: 'viewed_profile_gender', label: 'Viewed Gender', minWidth: 100 },
    { id: 'viewed_profile_planid', label: 'Viewed Plan ID', minWidth: 150 },
    {
      id: 'viewed_profile_created_by',
      label: 'Viewed Created By',
      minWidth: 150,
    },
    { id: 'viewed_profile_state', label: 'Viewed State', minWidth: 150 },
    { id: 'datetime', label: 'Viewed Date/Time', minWidth: 200 },
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
      <h1 className="text-2xl font-bold mb-4 text-black">Viewed Profiles <span className="text-lg font-normal">({totalCount})</span></h1>

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
        <div className="w-full flex text-right justify-between ">
          <div className="flex items-center space-x-2">
            <TextField
              label="From Date"
              type="date"
              name="fromDate"
              value={localFromDate}
              onChange={handleDateChange}
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
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: today // Restrict to today only
              }}
              required
            />
            {/* <FormControlLabel
              control={
                <Checkbox
                  checked={localMutualOnly}
                  onChange={(e) => setLocalMutualOnly(e.target.checked)}
                  color="primary"
                />
              }
              label="Viewed & Visitors Profiles"
            /> */}

            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
            <FormControlLabel
              control={
                <Checkbox
                  checked={localMutualOnly}
                  onChange={(e) => {
                    const newValue = e.target.checked;
                    setLocalMutualOnly(newValue);

                    // Only call API if dates are already selected
                    if (localFromDate && localToDate) {
                      setMutualOnly(newValue); // Sync the actual filter state
                      setPage(0);              // Reset to first page
                      fetchData(localFromDate, localToDate, newValue);
                    } else {
                      showToast('Please select dates first', 'warning');
                    }
                  }}
                  color="primary"
                />
              }
              label="Viewed & Visitors Profiles"
            />
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
        <TableContainer className="bg-white">
          <Table sx={{ border: '1px solid #E0E0E0' }} stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column, _index) => (
                  <TableCell
                    sx={{
                      borderBottom: '1px solid #E0E0E0', // Applying bottom border
                      // Apply border only for the first column

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
                // 1. Loading State
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : data.results.length === 0 ? (
                // 2. Empty State
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                    <Typography color="textSecondary">
                      {fromDate && toDate
                        ? "No records found for the selected criteria."
                        : "Please Select dates and click Submit to view data"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                // 3. Data Rows (Note: No .slice() here because the API already paginates)
                filteredResults.map((row, index) => (
                  <TableRow
                    key={index}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {columns.map((column) => {
                      let value = row[column.id];

                      // Format Date of Birth columns (profile_viewer_dob, viewed_profile_dob)
                      if (column.id.includes('dob') && value) {
                        value = value.includes('T') ? value.split('T')[0] : value;
                      }

                      // Format the Viewed Date/Time column
                      // if (column.id === 'datetime' && value) {
                      //   // Converts "2026-01-27T18:10:44+00:00" -> "2026-01-27"
                      //   value = value.includes('T') ? value.split('T')[0] : value;
                      // }

                      // 2. Format Viewed Date/Time (Target: 2026-01-28, 10:06 am)
                      if (column.id === 'datetime' && value) {
                        const dateObj = new Date(value);

                        // Extract YYYY-MM-DD
                        const datePart = dateObj.toISOString().split('T')[0];

                        // Extract Time in Indian format (10:06 am)
                        const timePart = dateObj.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        }).toLowerCase(); // ensure 'am/pm' is lowercase

                        value = `${datePart}, ${timePart}`;
                      }

                      // Format Status (if your API returns a number)
                      if (column.id === 'status' && value !== null) {
                        // Adjust these labels based on your actual status map
                        const statusMap: Record<string, string> = { "1": "Viewed", "0": "Hidden" };
                        value = statusMap[String(value)] || value;
                      }

                      // Special handling for Profile IDs to make them clickable (Optional)
                      const isProfileIdColumn = column.id === 'profile_viewer_profileId' || column.id === 'viewed_profile_profileId';

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{
                            whiteSpace: 'nowrap',
                            ...(isProfileIdColumn && {
                              color: 'blue',
                              cursor: 'pointer',
                              '&:hover': { textDecoration: 'underline' }
                            })
                          }}
                          onClick={isProfileIdColumn ? () => navigate(`/viewProfile?profileId=${value}`) : undefined}
                        >
                          {value !== null && value !== undefined && value !== "" ? value : "N/A"}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {data.results.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
            <Typography variant="body2">
              Page <strong>{page + 1}</strong> of <strong>{Math.ceil(totalCount / rowsPerPage)}</strong>
            </Typography>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '16px' }}>
                <Typography variant="body2">Go to page:</Typography>
                <TextField
                  size="small"
                  type="number"
                  value={goToPageInput}
                  onChange={(e) => setGoToPageInput(e.target.value)}
                  style={{ width: '80px' }}
                />
                <Button variant="contained" size="small" onClick={handleGoToPage} disabled={!goToPageInput}>
                  Go
                </Button>
              </div>

              <Button variant="outlined" size="small" onClick={() => setPage(0)} disabled={page === 0}>
                {'<<'}
              </Button>
              <Button variant="outlined" size="small" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                Prev
              </Button>

              {/* Dynamic Page Number Buttons */}
              {(() => {
                const totalPages = Math.ceil(totalCount / rowsPerPage);
                const currentPage = page + 1;
                const pages = [];

                pages.push(
                  <Button key={1} variant={currentPage === 1 ? "contained" : "outlined"} size="small" onClick={() => setPage(0)}>
                    1
                  </Button>
                );

                if (currentPage > 3) pages.push(<Typography key="el-s">...</Typography>);

                const start = Math.max(2, currentPage - 1);
                const end = Math.min(totalPages - 1, currentPage + 1);
                for (let i = start; i <= end; i++) {
                  pages.push(
                    <Button key={i} variant={currentPage === i ? "contained" : "outlined"} size="small" onClick={() => setPage(i - 1)}>
                      {i}
                    </Button>
                  );
                }

                if (currentPage < totalPages - 2) pages.push(<Typography key="el-e">...</Typography>);

                if (totalPages > 1) {
                  pages.push(
                    <Button key={totalPages} variant={currentPage === totalPages ? "contained" : "outlined"} size="small" onClick={() => setPage(totalPages - 1)}>
                      {totalPages}
                    </Button>
                  );
                }
                return pages;
              })()}

              <Button variant="outlined" size="small"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}>
                Next
              </Button>
              <Button variant="outlined" size="small"
                onClick={() => setPage(Math.ceil(totalCount / rowsPerPage) - 1)}
                disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}>
                {'>>'}
              </Button>
            </div>
          </div>
        )}
      </Paper>
    </>
  );
};

export default ViewedProfiles;
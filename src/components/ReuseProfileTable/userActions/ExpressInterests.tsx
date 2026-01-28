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
  Typography,
  Checkbox,
  FormControlLabel,
  Box,
  Snackbar,
  Alert,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@mui/material';
import axios from 'axios';
import {
  fetchStatePreferences,
  getExpressIntrest,
} from '../../../services/api';
import { Link } from 'react-router-dom';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

interface ExpressInterestData {
  results: any[];
  count: number;
}

const ExpressInterest: React.FC = () => {
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("profile_from_id");
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [data, setData] = useState<ExpressInterestData>({ results: [], count: 0 });
  const [search, setSearch] = useState<string>("");

  // States for actual filters (used in API calls)
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [selectedStates, setSelectedStates] = useState<number[]>([]);

  // Local states for date inputs before submit
  const [localFromDate, setLocalFromDate] = useState<string>("");
  const [localToDate, setLocalToDate] = useState<string>("");

  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Toast states
  const [toastOpen, setToastOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'warning' | 'error'>('info');


  // Load state preferences on mount
  useEffect(() => {
    const loadStates = async () => {
      try {
        const statesArray = await fetchStatePreferences();
        setStates(statesArray);
      } catch (error: any) {
        console.error("Error fetching states:", error);
        // Only show meaningful error messages
        if (error.response && error.response.status === 404) {
          showToast("States endpoint not found. Please check the configuration.", "error");
        } else if (error.message) {
          showToast(`Failed to load states: ${error.message}`, "error");
        }
      }
    };
    loadStates();
  }, []);

  // This effect runs only when pagination changes AFTER initial data load
  useEffect(() => {
    // Only fetch data if dates are already set (meaning submit was clicked before)
    if (fromDate && toDate) {
      fetchData();
    }
  }, [page, rowsPerPage, selectedStates]);

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

    // Validate page number
    if (page < 1) {
      showToast("Invalid page number", "error");
      return;
    }

    setLoading(true);
    try {
      // Don't pass empty states array to API
      const statesToSend = selectedStates.length > 0 ? selectedStates : [];

      const response = await getExpressIntrest(fromDate, toDate, statesToSend, page, rowsPerPage, statusFilter);
      setData(response);
      setTotalCount(response.count);

      // Check if there's no data
      if (response.count === 0) {
        showToast("No data found for the selected criteria", "info");
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);

      // Handle 404 error specifically
      if (error.response && error.response.status === 404) {
        showToast("API endpoint not found. Please check the server configuration.", "error");
      }
      // Handle 400 Bad Request error
      else if (error.response && error.response.status === 400) {
        let errorMsg = "Invalid request parameters";

        // Try to extract more specific error message from response
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
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);

    // Sort locally without API call
    const sortedData = stableSort(
      data.results,
      getComparator(isAsc ? "desc" : "asc", property)
    );
    setData({ ...data, results: sortedData });
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
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
    if (name === "fromDate") setLocalFromDate(value);
    if (name === "toDate") setLocalToDate(value);
  };

  const handleStateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const stateId = parseInt(event.target.value);
    setSelectedStates((prev) =>
      prev.includes(stateId) ? prev.filter((id) => id !== stateId) : [...prev, stateId]
    );
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
    setPage(1); // Reset to first page when submitting new dates

    // Fetch data with the selected dates
    fetchData();
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage + 1); // Adjust for API (1-based indexing)
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(1);
  };

  // Sorting functions for local sorting
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

  const columns: Column[] = [
    { id: "profile_from_id", label: "From Profile ID", minWidth: 100, align: "center" },
    { id: "profile_from_name", label: "From Name", minWidth: 150 },
    { id: "profile_from_mobile", label: "From Mobile No", minWidth: 150 },
    { id: "from_plan", label: "From Plan Name", minWidth: 150 },
    { id: "from_state", label: "From State", minWidth: 150 },
    { id: "profile_to_id", label: "To Profile ID", minWidth: 100 },
    { id: "profile_to_name", label: "To Name", minWidth: 150 },
    { id: "profile_to_mobile", label: "To Mobile No", minWidth: 150 },
    { id: "to_plan", label: "To Plan Name", minWidth: 150 },
    { id: "to_state", label: "To State", minWidth: 150 },
    { id: "to_express_message", label: "Message", minWidth: 200 },
    { id: "req_datetime", label: "Request Date", minWidth: 150 },
    { id: "response_datetime", label: "Response Date", minWidth: 150 },
    { id: "status", label: "Status", minWidth: 100 },
  ];

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  const [statusFilter, setStatusFilter] = useState<string>("");


  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-black">Express Interests <span className="text-lg font-normal">({totalCount})</span></h1>

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

      <Box className="w-full">
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
              <div className="flex flex-wrap p-2">
                {states.length > 0 ? (
                  states.map((state) => (
                    <FormControlLabel
                      key={state.State_Pref_id}
                      control={
                        <Checkbox
                          value={state.State_Pref_id}
                          checked={selectedStates.includes(state.State_Pref_id)}
                          onChange={handleStateChange}
                          color="primary"
                        />
                      }
                      label={state.State_name}
                    />
                  ))
                ) : (
                  <Typography>Loading states...</Typography>
                )}
                <FormControl
                  size="small"
                  sx={{
                    minWidth: 200,
                  }}
                >
                  <InputLabel id="status-filter-label">Status</InputLabel>
                  <Select
                    labelId="status-filter-label"
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{
                      height: 40,
                      backgroundColor: 'white',
                      '& .MuiSelect-select': {
                        textAlign: 'left', // 👈 Forces selected text to the left
                        display: 'flex',
                        alignItems: 'center',
                      },
                    }}
                  >
                    <MenuItem value="">Select Status</MenuItem>
                    <MenuItem value="0">Removed</MenuItem>
                    <MenuItem value="1">Request Sent</MenuItem>
                    <MenuItem value="2">Accepted</MenuItem>
                    <MenuItem value="3">Rejected</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="contained" onClick={handleSubmit}
                  sx={{
                    marginLeft: 3
                  }}
                >
                  Submit
                </Button>
              </div>
            </div>

            {/* Search */}
            <TextField
              label="Search"
              variant="outlined"
              value={search}
              onChange={handleSearchChange}
              disabled={!fromDate || !toDate}
              size="small"
            // sx={{
            //   minWidth: 200,
            //   '& .MuiInputBase-root': { height: 40, backgroundColor: 'white' }
            // }}
            />
            {/* </Box> */}

          </div>
        </div>

        <TableContainer
          sx={{ border: '1px solid #E0E0E0' }}
          className="bg-white"
        >
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
                  .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow key={index} hover>
                      {columns.map((column) => {
                        let value = row[column.id];

                        // 👈 Format dates for these specific columns
                        if ((column.id === 'req_datetime' || column.id === 'response_datetime') && value) {
                          // This takes "2026-01-26T07:26:35Z" and keeps only "2026-01-26"
                          value = value.split('T')[0];
                        }

                        return (
                          <TableCell
                            sx={{ whiteSpace: 'nowrap' }}
                            key={column.id}
                            align={column.align}
                          >
                            {value || "N/A"}
                          </TableCell>
                        );
                      })}
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
            rowsPerPageOptions={[2, 5, 10, 25, 50, 100]}
            component="div"
            count={filteredResults.length}
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        )}
      </Box>
    </>
  );
};

export default ExpressInterest;
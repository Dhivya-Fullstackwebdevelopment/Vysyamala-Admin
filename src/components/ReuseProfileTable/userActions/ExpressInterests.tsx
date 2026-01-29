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
import { Link, useNavigate } from 'react-router-dom';

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
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [goToPageInput, setGoToPageInput] = useState<string>('');
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
  const navigate = useNavigate();

  const stateAbbreviations: Record<string, string> = {
    "1": "AP",
    "2": "TN & PY",
    "3": "TG",
    "4": "KA",
    "5": "Kerala",
    "6": "OTH"
  };
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

  // Inside ExpressInterest component
  const fetchData = async (fDate?: string, tDate?: string, targetPage?: number) => {
    const effectiveFromDate = fDate || fromDate;
    const effectiveToDate = tDate || toDate;
    // Use targetPage if provided (like from handleSubmit), otherwise use current state
    const effectivePage = (targetPage !== undefined ? targetPage : page) + 1;

    if (!effectiveFromDate || !effectiveToDate) return;

    setLoading(true);
    try {
      const response = await getExpressIntrest(
        effectiveFromDate,
        effectiveToDate,
        selectedStates,
        effectivePage, // Always 1 on initial valid load
        rowsPerPage,
        statusFilter
      );

      setData(response);
      setTotalCount(response.count);
    } catch (error: any) {
      // showToast("An error occurred while fetching data", "error");
      const errorMsg = error.response?.data?.error || "An error occurred while fetching data";
      showToast(errorMsg, "error");
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
      showToast("Invalid page number", "warning");
    }
  };

  useEffect(() => {
    // Only fetch data if dates are already set (meaning submit was clicked before)
    if (fromDate && toDate) {
      fetchData();
    }
  }, [page, rowsPerPage]);

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
    fetchData(localFromDate, localToDate, 0);
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

  const statusLabels: Record<string, string> = {
    "0": "Removed",
    "1": "Request Sent",
    "2": "Accepted",
    "3": "Rejected"
  };

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
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, auto)', // Creates 3 columns
                  gap: '4px 16px', // Slightly increased horizontal gap for readability
                  justifyContent: 'start',
                  p: 1,
                  border: 'none', // 👈 Border removed
                  backgroundColor: 'transparent' // 👈 Background set to transparent
                }}
              >
                {states.length > 0 ? (
                  states.map((state) => (
                    <FormControlLabel
                      key={state.State_Pref_id}
                      sx={{
                        marginRight: 0,
                        '& .MuiFormControlLabel-label': {
                          fontSize: '0.85rem', // 👈 Increased from 0.75rem
                          fontWeight: 500,
                          marginLeft: '2px' // 👈 Added small space between box and text
                        }
                      }}
                      control={
                        <Checkbox
                          disableRipple
                          size="medium" // 👈 Changed from small to medium
                          value={state.State_Pref_id}
                          checked={selectedStates.includes(state.State_Pref_id)}
                          onChange={handleStateChange}
                          sx={{
                            p: 0.5,
                            '& .MuiSvgIcon-root': { fontSize: 20 } // 👈 Increased icon size from 18 to 20
                          }}
                        />
                      }
                      label={stateAbbreviations[String(state.State_Pref_id)] || state.State_name}
                    />
                  ))
                ) : (
                  <Typography variant="caption">Loading states...</Typography>
                )}
              </Box>
              <div className="flex flex-wrap p-2">

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
            // size="small"
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
                // Show loader while fetching
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ mt: 1 }}>Loading data...</Typography>
                  </TableCell>
                </TableRow>
              ) : data.results.length === 0 ? (
                // Show "No Data" if results are empty
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
                // Render the rows. Note: No .slice() here because API handles pagination.
                filteredResults.map((row, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    {columns.map((column) => {
                      let value = row[column.id];

                      // 1. Format Dates for specific columns
                      if ((column.id === 'req_datetime' || column.id === 'response_datetime') && value) {
                        // Converts "2026-01-26T07:26:35Z" -> "2026-01-26"
                        value = value.split('T')[0];
                      }

                      // 2. Map Status IDs to readable Labels
                      if (column.id === 'status') {
                        value = statusLabels[String(row[column.id])] || value;
                      }

                      // 3. Handle Profile ID linking (Optional UI enhancement)
                      if (column.id === 'profile_from_id' || column.id === 'profile_to_id') {
                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            sx={{
                              whiteSpace: 'nowrap',
                              color: 'blue',
                              cursor: 'pointer',
                              '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => navigate(`/viewProfile?profileId=${value}`)}
                          >
                            {value || "N/A"}
                          </TableCell>
                        );
                      }

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          sx={{ whiteSpace: 'nowrap' }}
                        >
                          {value || "N/A"}
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

              {/* Start/Prev Buttons */}
              <Button variant="outlined" size="small" onClick={() => setPage(0)} disabled={page === 0}>
                {'<<'}
              </Button>
              <Button variant="outlined" size="small" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                Prev
              </Button>

              {/* Dynamic Page Numbers */}
              {(() => {
                const totalPages = Math.ceil(totalCount / rowsPerPage);
                const currentPage = page + 1;
                const pages = [];

                // Page 1
                pages.push(
                  <Button key={1} variant={currentPage === 1 ? "contained" : "outlined"} size="small" onClick={() => setPage(0)}>
                    1
                  </Button>
                );

                if (currentPage > 3) pages.push(<Typography key="el-s">...</Typography>);

                // Middle Pages
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

                // Last Page
                if (totalPages > 1) {
                  pages.push(
                    <Button key={totalPages} variant={currentPage === totalPages ? "contained" : "outlined"} size="small" onClick={() => setPage(totalPages - 1)}>
                      {totalPages}
                    </Button>
                  );
                }
                return pages;
              })()}

              {/* Next/End Buttons */}
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
      </Box>
    </>
  );
};

export default ExpressInterest;
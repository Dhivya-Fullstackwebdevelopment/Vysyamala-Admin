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
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ import navigate hook
import { getMembershipPlans } from '../../../api/apiConfig';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

interface LoginLogsData {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}

const getLoginLogs = async (date: string, fromDate: string, toDate: string, page: number, rowsPerPage: number, planId?: string) => {
  const params = new URLSearchParams();

  // Only append if the value is actually present
  if (date) params.append('date', date);
  if (fromDate) params.append('from_date', fromDate);
  if (toDate) params.append('to_date', toDate);
  if (planId) params.append('plan', planId);

  params.append('page', (page + 1).toString());
  params.append('per_page', rowsPerPage.toString());

  const url = `https://app.vysyamala.com/api/login-logs/?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
};

const LoginProfiles: React.FC = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('ProfileId');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [data, setData] = useState<LoginLogsData>({
    count: 0,
    next: null,
    previous: null,
    results: [],
  });
  const [search, setSearch] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);
  const navigate = useNavigate(); // ✅ hook

  const [plans, setPlans] = useState<{ id: number; plan_name: string }[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [fromDateInput, setFromDateInput] = useState<string>('');
  const [toDateInput, setToDateInput] = useState<string>('');
  const [specificDateInput, setSpecificDateInput] = useState<string>('');
  const [planInput, setPlanInput] = useState<string>('');
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    specificDate: '',
    planId: ''
  });

  // Fetch Plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await getMembershipPlans();
        if (res.status) setPlans(res.plans);
      } catch (err) {
        console.error("Failed to fetch plans", err);
      }
    };
    fetchPlans();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, filters]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getLoginLogs(
        filters.specificDate,
        filters.fromDate,
        filters.toDate,
        page,
        rowsPerPage,
        filters.planId
      );
      setData(response);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'date') {
      setDate(value);
    } else if (name === 'fromDate') {
      setFromDate(value);
    } else if (name === 'toDate') {
      setToDate(value);
    }
  };

  // const handleSubmit = () => {
  //   setPage(0);
  //   fetchData();
  // };

  const handleSubmit = () => {
    setPage(0);
    setFilters({
      fromDate: fromDate,        // Use fromDate instead of fromDateInput
      toDate: toDate,            // Use toDate instead of toDateInput
      specificDate: specificDateInput,
      planId: selectedPlan
    });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const formatDateOnly = (dateTimeString: string) => {
    if (!dateTimeString) return '';
    return dateTimeString.split(' ')[0];
  };

  const columns: Column[] = [
    { id: 'ProfileId', label: 'Profile ID', minWidth: 100, align: 'left' },
    { id: 'Profile_name', label: 'Profile Name', minWidth: 150, align: 'left' },
    { id: 'EmailId', label: 'Email ID', minWidth: 200, align: 'left' },
    { id: 'Mobile_no', label: 'Mobile No', minWidth: 130, align: 'left' },
    { id: 'plan_name', label: 'Plan', minWidth: 130, align: 'left' },
    { id: 'status_name', label: 'Status', minWidth: 130, align: 'left' },
    { id: 'Last_login_date', label: 'Last Login Date', minWidth: 120, align: 'left' },
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
    const stabilizedThis = array.map((el, index) => [el, index] as [any, number]);
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

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-black">Login Profiles <span className="text-lg font-normal">({totalCount})</span></h1>
      <div className="w-full py-2 flex justify-between">
        <div className="w-full text-right flex justify-between">
          <div className="flex items-center space-x-2">
            <TextField
              label="Specific Date"
              type="date"
              name="date"
              value={specificDateInput}
              // onChange={handleDateChange}
              onChange={(e) => setSpecificDateInput(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="From Date"
              type="date"
              name="fromDate"
              value={fromDate}
              // onChange={handleDateChange} 
              onChange={(e) => setFromDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To Date"
              type="date"
              name="toDate"
              value={toDate}
              // onChange={handleDateChange}
              onChange={(e) => setToDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: new Date().toISOString().split('T')[0] // This disables future dates
              }}
            />
            <FormControl sx={{ minWidth: 200 }} size="medium">
              <InputLabel id="plan-select-label">Select Plan</InputLabel>
              <Select
                labelId="plan-select-label"
                value={selectedPlan}
                label="Select Plan"
                onChange={(e) => setSelectedPlan(e.target.value)}
                // onChange={(e) => setPlanInput(e.target.value)}
                sx={{
                  textAlign: 'left', // Ensures text aligns to the left as per your image
                  '.MuiSelect-select': {
                    paddingLeft: '14px', // Standard MUI padding for alignment
                  }
                }}
              >
                <MenuItem value=""><em>Select Plans</em></MenuItem>
                {plans.map((plan) => (
                  <MenuItem key={plan.id} value={plan.id.toString()}>
                    {plan.plan_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
          />
        </div>
      </div>

      <Paper className="w-full">
        <TableContainer sx={{ border: '1px solid #E0E0E0' }} className="bg-white">
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
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
              ) : filteredResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length} align="center">
                    No data found
                  </TableCell>
                </TableRow>
              ) : (
                filteredResults
                  .slice(0, rowsPerPage)
                  .map((row, index) => (
                    <TableRow
                      sx={{ whiteSpace: 'nowrap' }}
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      {columns.map((column) => {
                        const rawValue = row[column.id];
                        // Determine display value: format it if it's a date, otherwise check if it exists
                        let displayValue = column.id === 'Last_login_date'
                          ? formatDateOnly(rawValue)
                          : rawValue;

                        // Final check for empty/null values
                        if (displayValue === null || displayValue === undefined || displayValue === '') {
                          displayValue = 'N/A';
                        }

                        return (
                          <TableCell
                            key={column.id}
                            align={column.align}
                            onClick={column.id === 'ProfileId' ? () => navigate(`/viewProfile?profileId=${row.ProfileId}`) : undefined}
                            sx={column.id === 'ProfileId' ? { color: 'blue', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } } : {}}
                          >
                            {displayValue}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={data.count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </>
  );
};

export default LoginProfiles;

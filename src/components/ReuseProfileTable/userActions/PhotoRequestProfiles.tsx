import React, { useEffect, useState } from 'react';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from '@mui/material';
import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';
import { photoRequest } from '../../../services/api';
import { toast } from 'react-toastify';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

interface PhotoRequestProfilesData {
  results: any[];
  count: number;
}

const getPhotoRequestProfiles = async (fromDate: string, toDate: string, page: number) => {
  const params = new URLSearchParams({
    from_date: fromDate,
    to_date: toDate,
    page: (page + 1).toString()
  });

  const url = `${photoRequest}?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
};

const PhotoRequestProfiles: React.FC = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('profile_from_id');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [data, setData] = useState<PhotoRequestProfilesData>({
    results: [],
    count: 0,
  });
  const [goToPageInput, setGoToPageInput] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [localFromDate, setLocalFromDate] = useState<string>('');
  const [localToDate, setLocalToDate] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<number>(0);
  const navigate = useNavigate();
  // useEffect(() => {
  //   fetchData();
  // }, [fromDate, toDate, page]);

  const fetchData = async (fDate?: string, tDate?: string) => {
    const effectiveFromDate = fDate || fromDate;
    const effectiveToDate = tDate || toDate;

    // Do not call API if dates are missing
    if (!effectiveFromDate || !effectiveToDate) {
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      const response = await getPhotoRequestProfiles(effectiveFromDate, effectiveToDate, page);
      setData(response);
      setTotalCount(response.count);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (fromDate && toDate) {
      fetchData();
    }
  }, [page]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0); // Reset page to 0 when search term changes
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'fromDate') setLocalFromDate(value);
    else if (name === 'toDate') setLocalToDate(value);
  };

  const handleSubmit = () => {
    if (!localFromDate || !localToDate) {
      toast.error("Please select both From Date and To Date");
      return;
    }
    // Update established states
    setFromDate(localFromDate);
    setToDate(localToDate);
    setPage(0);

    // Call API immediately with local values (bypasses async state delay)
    fetchData(localFromDate, localToDate);
  };

  const handleGoToPage = () => {
    const pageNum = parseInt(goToPageInput, 10);
    const totalPages = Math.ceil(totalCount / rowsPerPage);
    if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
      setPage(pageNum - 1);
      setGoToPageInput('');
    } else {
      toast.warning("Invalid page number");
    }
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
      label: 'From Profile ID',
      minWidth: 150,
      align: 'center',
    },
    { id: 'profile_from_name', label: 'From Name', minWidth: 150 },
    { id: 'profile_from_mobile', label: 'From Mobile', minWidth: 150 },
    { id: 'profile_from_gender', label: 'From Gender', minWidth: 100 },
    { id: 'profile_from_city', label: 'From City', minWidth: 150 },
    { id: 'profile_from_state', label: 'From State', minWidth: 150 },
    { id: 'profile_from_plan', label: 'From Plan', minWidth: 150 },
    { id: 'profile_from_status', label: 'From Status', minWidth: 150 },
    { id: 'profile_to_id', label: 'To Profile ID', minWidth: 150 },
    { id: 'profile_to_name', label: 'To Name', minWidth: 150 },
    { id: 'profile_to_mobile', label: 'To Mobile', minWidth: 150 },
    { id: 'profile_to_gender', label: 'To Gender', minWidth: 100 },
    { id: 'profile_to_city', label: 'To City', minWidth: 150 },
    { id: 'profile_to_state', label: 'To State', minWidth: 150 },
    { id: 'profile_to_plan', label: 'To Plan', minWidth: 150 },
    { id: 'profile_to_status', label: 'To Status', minWidth: 150 },
    { id: 'req_datetime', label: 'Request Date/Time', minWidth: 200 },
    { id: 'response_datetime', label: 'Response Date/Time', minWidth: 200 },
    { id: 'response_message', label: 'Response Message', minWidth: 200 },
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

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-black">Photo Request Profiles <span className="text-lg font-normal">({totalCount})</span></h1>
      <div className="w-full py-2 flex justify-between">
        <div className="w-full flex text-right justify-between">
          <div className="flex items-center space-x-2">
            <TextField
              label="From Date"
              type="date"
              name="fromDate"
              value={localFromDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To Date"
              type="date"
              name="toDate"
              value={localToDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: new Date().toISOString().split('T')[0] // This disables future dates
              }}
            />

            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
          <div>
            <TextField
              label="Search"
              variant="outlined"
              margin="normal"
              value={search}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
      <Paper className="w-full">
        <TableContainer className="bg-white">
          <Table sx={{ border: '1px solid #E0E0E0' }} stickyHeader>
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
                {/* <TableCell className="!text-red-600 !text-base !text-nowrap !font-semibold">
                  Actions
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={columns.length} align="center"><CircularProgress /></TableCell></TableRow>
              ) : !hasSearched ? (
                <TableRow><TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>Please Select dates and click Submit to view data</TableCell></TableRow>
              ) : data.results.map((row, index) => (
                <TableRow key={index} hover>
                  {columns.map((col) => {
                    let val = row[col.id];
                    // if (col.id === 'req_datetime' && val) val = val.split('T')[0];
                    if (col.id === 'req_datetime' && val) {
                      const dateObj = new Date(val);

                      // Extract YYYY-MM-DD
                      const datePart = dateObj.toISOString().split('T')[0];

                      // Extract Time in Indian format (10:06 am)
                      const timePart = dateObj.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      }).toLowerCase(); // ensure 'am/pm' is lowercase

                      val = `${datePart}, ${timePart}`;
                    }
                    if (col.id === 'response_datetime' && val) {
                      const dateObj = new Date(val);

                      // Extract YYYY-MM-DD
                      const datePart = dateObj.toISOString().split('T')[0];

                      // Extract Time in Indian format (10:06 am)
                      const timePart = dateObj.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      }).toLowerCase(); // ensure 'am/pm' is lowercase

                      val = `${datePart}, ${timePart}`;
                    }
                    const isId = col.id.includes('_id');
                    return (
                      <TableCell
                        key={col.id}
                        sx={{ color: isId ? 'blue' : 'inherit', cursor: isId ? 'pointer' : 'default' }}
                        onClick={isId ? () => navigate(`/viewProfile?profileId=${val}`) : undefined}
                      >
                        {val || "N/A"}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {data.results.length > 0 && (
          <div className="flex items-center justify-between p-4">
            <Typography variant="body2">Page {page + 1} of {Math.ceil(totalCount / rowsPerPage)}</Typography>
            <div className="flex items-center gap-2">
              <Typography variant="body2">Go to Page:</Typography>
              <TextField size="small" type="number" value={goToPageInput} onChange={(e) => setGoToPageInput(e.target.value)} style={{ width: '70px' }} />
              <Button variant="contained" size="small" onClick={handleGoToPage}>Go</Button>
              <Button variant="outlined" size="small" onClick={() => setPage(0)} disabled={page === 0}>{'<<'}</Button>
              <Button variant="outlined" size="small" onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>Prev</Button>

              {(() => {
                const total = Math.ceil(totalCount / rowsPerPage);
                const curr = page + 1;
                const btns = [];
                for (let i = Math.max(1, curr - 1); i <= Math.min(total, curr + 1); i++) {
                  btns.push(
                    <Button key={i} variant={curr === i ? "contained" : "outlined"} size="small" onClick={() => setPage(i - 1)}>{i}</Button>
                  );
                }
                return btns;
              })()}

              <Button variant="outlined" size="small" onClick={() => setPage(page + 1)} disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}>Next</Button>
              <Button variant="outlined" size="small" onClick={() => setPage(Math.ceil(totalCount / rowsPerPage) - 1)} disabled={page >= Math.ceil(totalCount / rowsPerPage) - 1}>{'>>'}</Button>
            </div>
          </div>
        )}
      </Paper>
    </>
  );
};

export default PhotoRequestProfiles;

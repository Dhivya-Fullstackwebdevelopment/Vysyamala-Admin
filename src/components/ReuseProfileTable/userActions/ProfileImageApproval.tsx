import React, { useEffect, useState } from 'react';
import {
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
  Box,
  Chip,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { profileImgApproval } from '../../../services/api';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  format?: (value: any, row?: any) => any;
}

interface ProfileImageApprovalData {
  results: any[];
  count: number;
}

interface ProfileImage {
  image_url: string;
  image_approved: boolean;
  is_deleted: boolean;
}

interface ProfileData {
  profile_id: string;
  Profile_name: string;
  Profile_mobile_no: string;
  Profile_dob: string;
  profile_gender: string;
  Profile_email: string;
  profile_whats_app_no: string | null;
  images: ProfileImage[];
}

const getProfileImageApproval = async (page: number, rowsPerPage: number, fromDate?: string, toDate?: string, search?: string) => {
  const params = new URLSearchParams({
    page: (page + 1).toString(), // API is 1-indexed
    page_size: rowsPerPage.toString(),
  });

  // Only append if values exist
  if (fromDate) params.append("from_date", fromDate);
  if (toDate) params.append("to_date", toDate);
  if (search) params.append("search", search);

  const url = `${profileImgApproval}?${params.toString()}`;
  const response = await axios.get(url);
  return response.data;
};

const ProfileImageApproval: React.FC = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('profile_id');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [data, setData] = useState<ProfileImageApprovalData>({ results: [], count: 0, });
  const [search, setSearch] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [fromDateInput, setFromDateInput] = useState<string>('');
  const [toDateInput, setToDateInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const [hoveredProfileId, setHoveredProfileId] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [goToPageInput, setGoToPageInput] = useState('');

  const handleGoToPage = () => {
    const num = parseInt(goToPageInput);
    if (!isNaN(num)) {
      const last = Math.ceil(data.count / rowsPerPage) - 1;
      const newPage = Math.max(0, Math.min(num - 1, last));
      setPage(newPage);
    }
    setGoToPageInput('');
  };


  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, fromDate, toDate, search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getProfileImageApproval(page, rowsPerPage, fromDate, toDate, search);

      // Check if the response contains results
      if (response && response.results) {
        setData(response);
        setTotalCount(response.count);
      } else {
        // If the API returns {"message": "No images found."} or similar
        setData({ results: [], count: 0 });
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData({ results: [], count: 0 });
      setTotalCount(0);
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
    setPage(0); // Reset page to 0 when search term changes
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === 'fromDate') {
      setFromDate(value);
    } else if (name === 'toDate') {
      setToDate(value);
    }
  };

  const handleSubmit = () => {
    setFromDate(fromDateInput);
    setToDate(toDateInput);
    setPage(0); // Reset to first page

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

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY
  // };

  const formatDate = (dateString: string) => {
    // 1. Handle missing, null, or undefined data
    if (!dateString) return 'N/A';

    const date = new Date(dateString);

    // 2. Check if the date is valid
    if (isNaN(date.getTime())) return 'N/A';

    // 3. Extract only the YYYY-MM-DD part
    // This takes "2026-01-26T07:50:18..." and returns "2026-01-26"
    return date.toISOString().split('T')[0];
  };

  const columns: Column[] = [
    {
      id: 'profile_id',
      label: 'Profile ID',
      minWidth: 120,
      align: 'left',
      format: (value: string, row: ProfileData) => (
        <span
          style={{
            color: 'blue',
            textDecoration: hoveredProfileId === value ? 'underline' : 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={() => setHoveredProfileId(value)}
          onMouseLeave={() => setHoveredProfileId(null)}
          onClick={() => navigate(`/UploadApprovalProfileImg?profileId=${value}`)}
        >
          {value}
        </span>
      )
    },
    {
      id: 'Profile_name',
      label: 'Profile Name',
      minWidth: 100,
      align: 'left'
    },
    // {
    //   id: 'Profile_mobile_no',
    //   label: 'Mobile No',
    //   minWidth: 130,
    //   align: 'left'
    // },
    {
      id: 'Profile_dob',
      label: 'Date of Birth',
      minWidth: 120,
      align: 'left',
      format: (value: string) => formatDate(value)
    },
    {
      id: 'profile_gender',
      label: 'Gender',
      minWidth: 100,
      align: 'left',
      format: (value: string) => value.charAt(0).toUpperCase() + value.slice(1)
    },
    {
      id: 'Profile_email',
      label: 'Email',
      minWidth: 200,
      align: 'left'
    },

    {
      id: 'profile_plan',
      label: 'Plan',
      minWidth: 200,
      align: 'left'
    },

    {
      id: 'profile_status',
      label: 'Status',
      minWidth: 200,
      align: 'left'
    },

    {
      id: 'latest_uploaded_at',
      label: 'Photo Update Date',
      minWidth: 200,
      align: 'left',
      format: (value: string) => formatDate(value)
    },

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
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    ),
    getComparator(order, orderBy)
  );


  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-black">Profile Image Approval <span className="text-lg font-normal">({totalCount})</span></h1>
      <Box className="w-full">
        <div className="w-full p-2 flex justify-between">
          <div className="w-full text-right px-2">
            <TextField
              label="Search"
              variant="outlined"
              margin="normal"
              value={search}
              onChange={handleSearchChange}
              className="mb-2"
            />
            <div className="flex items-center space-x-2">
              <TextField
                label="From Date"
                type="date"
                name="fromDate"
                value={fromDateInput}
                onChange={(e) => setFromDateInput(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                inputProps={{
                  max: new Date().toISOString().split('T')[0] // This disables future dates
                }}
              />
              <TextField
                label="To Date"
                type="date"
                name="toDate"
                value={toDateInput}
                onChange={(e) => setToDateInput(e.target.value)}
                InputLabelProps={{ shrink: true }}
                size="small"
                inputProps={{
                  max: new Date().toISOString().split('T')[0] // This disables future dates
                }}
              />

              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </div>
        </div>

        <TableContainer sx={{ border: '1px solid #E0E0E0', maxHeight: 600 }} >
          <Table stickyHeader>
            <TableHead >
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth, backgroundColor: '#FFF9C9' }}
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
              ) : data.results.length > 0 ? (
                data.results.map((row: ProfileData, index: number) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.profile_id || index}>
                    {columns.map((column) => {
                      const value = row[column.id as keyof ProfileData];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format
                            ? column.format(value, row)
                            : (value || 'N/A')
                          }
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                /* This section handles the "No records found" case */
                <TableRow>
                  <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                    <Typography variant="h6" color="textSecondary">
                      No Profiles found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={filteredResults.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>

          {/* Page indicator */}
          <span>
            Page <strong>{page + 1}</strong> of <strong>{Math.ceil(data.count / rowsPerPage)}</strong>
          </span>

          {/* Pagination controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography variant="body2">Go to page:</Typography>
            {/* Go to page */}
            <TextField
              size="small"
              type="number"
              value={goToPageInput}
              onChange={(e) => setGoToPageInput(e.target.value)}
              inputProps={{ min: 1, max: Math.ceil(data.count / rowsPerPage) }}
              style={{ width: '80px' }}
            />
            <Button variant="contained" size="small" onClick={handleGoToPage}>
              Go
            </Button>

            {/* First */}
            <Button
              variant="outlined"
              size="small"
              disabled={page === 0}
              onClick={() => setPage(0)}
            >
              {'<<'}
            </Button>

            {/* Prev */}
            <Button
              variant="outlined"
              size="small"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </Button>

            {/* Page numbers */}
            {(() => {
              const totalPages = Math.ceil(data.count / rowsPerPage);
              const currentPage = page + 1;
              const pages = [];

              pages.push(
                <Button key={1}
                  variant={currentPage === 1 ? 'contained' : 'outlined'}
                  size="small"
                  onClick={() => setPage(0)}
                >
                  1
                </Button>
              );

              if (currentPage > 3) pages.push(<span key="dots1">...</span>);

              const start = Math.max(2, currentPage - 1);
              const end = Math.min(totalPages - 1, currentPage + 1);

              for (let i = start; i <= end; i++) {
                pages.push(
                  <Button key={i}
                    variant={currentPage === i ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setPage(i - 1)}
                  >
                    {i}
                  </Button>
                );
              }

              if (currentPage < totalPages - 2) pages.push(<span key="dots2">...</span>);

              if (totalPages > 1)
                pages.push(
                  <Button key={totalPages}
                    variant={currentPage === totalPages ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setPage(totalPages - 1)}
                  >
                    {totalPages}
                  </Button>
                );

              return pages;
            })()}

            {/* Next */}
            <Button
              variant="outlined"
              size="small"
              disabled={page >= Math.ceil(data.count / rowsPerPage) - 1}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>

            {/* Last */}
            <Button
              variant="outlined"
              size="small"
              disabled={page >= Math.ceil(data.count / rowsPerPage) - 1}
              onClick={() => setPage(Math.ceil(data.count / rowsPerPage) - 1)}
            >
              {'>>'}
            </Button>
          </div>
        </div>
      </Box>
    </>
  );
};

export default ProfileImageApproval;
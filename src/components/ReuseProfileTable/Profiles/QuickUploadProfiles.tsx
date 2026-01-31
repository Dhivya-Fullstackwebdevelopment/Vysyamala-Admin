import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  Checkbox,
  Typography,
  Box,
} from '@mui/material';
import axios from 'axios';
import { API_URL, quickUpload } from '../../../services/api';
import { GrEdit } from 'react-icons/gr';
import { MdDeleteOutline } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa';
// Function to fetch data from the API
export const getQuickUploadProfiles = async (
  search: string,
  orderBy: string,
  order: 'asc' | 'desc',
  rowsPerPage: number,
  page: number,
) => {
  const params = new URLSearchParams({
    page_size: rowsPerPage.toString(),
    page: page.toString(),
  });

  if (search) {
    params.append('search', search);
  }

  const url = `${quickUpload}?${params.toString()}`;
  const response = await axios.get(url);
  return response;
};

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
  padding?: string;
  display?: string;
  height?: string;
}

const columns: Column[] = [
  { id: 'ProfileId', label: 'Profile ID', minWidth: 100, align: 'center' },
  { id: 'DateOfJoin', label: 'Date of Registration', minWidth: 100, align: 'left' },
  { id: 'Profile_name', label: 'Profile Name', minWidth: 100 },
  { id: 'Profile_for', label: 'Created By', minWidth: 100, align: 'center' },
  { id: 'Gender', label: 'Gender', minWidth: 100, align: 'left' },
  { id: 'Mobile_no', label: 'Mobile No', minWidth: 100 },
  {
    id: 'Profile_marital_status',
    label: 'Marital Status',
    minWidth: 100,
  },
  {
    id: 'Profile_idproof',
    label: 'Profile Idproof',
    minWidth: 100,
    align: 'left',
  },
  {
    id: 'horoscope_file',
    label: 'Horoscope File',
    minWidth: 100,
    align: 'left',
  },
  {
    id: 'profile_image',
    label: 'Profile Photo',
    minWidth: 100,
    align: 'left',
  },
  // { id: 'plan_name', label: 'Mode', minWidth: 100, align: 'left' },
  // { id: 'status', label: 'Profile Status', minWidth: 100, align: 'left' },
];


const QuickUploadProfiles: React.FC = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('ProfileId');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [data, setData] = useState<{ results: any[]; count: number }>({
    results: [],
    count: 0,
  });
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]); // To track selected profile IDs
  console.log(selectedRows);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, order, orderBy, search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getQuickUploadProfiles(
        search.trim(),
        orderBy,
        order,
        rowsPerPage,
        page + 1,
      );
      setData(response.data);
      setTotalCount(response.data.count);
      console.log(response.data);
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
    setPage(0); // Reset page to 0 when search term changes
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

  const handleDelete = async (ContentId: number) => {
    if (!ContentId) {
      console.error('Error: Missing ID for the row to delete');
      return;
    }

    const confirmed = window.confirm(
      'Are you sure you want to delete this item?',
    );
    const adminUserID = sessionStorage.getItem('id') || localStorage.getItem('id');
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/logindetails/${ContentId}/`, {
        data: {
          admin_user_id: adminUserID,  // <-- RAW JSON body
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      fetchData(); // Refresh the data after deletion
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedRows(data.results.map((row) => row.ProfileId)); // Select all profile IDs
    } else {
      setSelectedRows([]); // Deselect all
    }
  };

  const handleRowSelect = (profileId: number) => {
    setSelectedRows(
      (prevSelected) =>
        prevSelected.includes(profileId)
          ? prevSelected.filter((id) => id !== profileId) // Deselect if already selected
          : [...prevSelected, profileId], // Select if not selected
    );
  };

  const generateShortProfilePDF = async (profileData: number[]) => {
    try {
      const response = await axios.post(
        'https://app.vysyamala.com/api/generate_short_profile_pdf/',
        {
          profile_id: profileData.join(','),
        },
        {
          responseType: 'blob', // Important for handling binary data
        },
      );

      // Create a URL for the PDF blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'profile.pdf'); // Specify the file name

      // Append to the body
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up and remove the link
    } catch (error) {
      console.error('Error downloading the PDF:', error);
    } finally {
      setSelectedRows([]);
      setSelectAll(false);
    }
  };

  const renderCellContent = (columnId: string, value: any, row: any) => {
    switch (columnId) {
      case 'ProfileId':
        return (
          <Typography
            onClick={() => navigate(`/viewProfile?profileId=${row.ProfileId}`)}
            variant="body2"
            sx={{
              color: 'blue',
              cursor: 'pointer',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {value}
          </Typography>
        );
      case 'DateOfJoin':
        // Format the date (show only YYYY-MM-DD)
        return value ? value.split(' ')[0] : 'N/A';

      case 'Profile_idproof':
      case 'horoscope_file':
      case 'profile_image':   // ✅ ADD THIS
        return value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'black',
              textDecoration: 'underline',
              cursor: 'pointer',
            }}
          >
            {columnId === 'Profile_idproof'
              ? 'Profile IDproof'
              : columnId === 'horoscope_file'
                ? 'Horoscope File'
                : 'Profile Photo'}
          </a>
        ) : (
          'N/A'
        );

      default:
        return value;
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl text-black font-bold mb-4">Quick Upload <span className="text-lg font-normal">({totalCount})</span></h1>
      <div>
        <Button
          onClick={() => generateShortProfilePDF(selectedRows)}
          variant="contained"
          color="primary"
          disabled={selectedRows.length === 0}
        >
          Download Short Profile
        </Button>
      </div>
      <div className="w-full text-right ">
        <TextField
          size="medium"
          label="Search"
          variant="outlined"
          margin="normal"
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      <Paper className="w-full">
        <TableContainer className="bg-white">
          <Table sx={{ border: '1px solid #E0E0E0' }} stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    background: '#FFF9C9',
                    borderBottom: '1px solid #E0E0E0',
                  }}
                  padding="checkbox"
                >
                  <Checkbox
                    color="primary"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </TableCell>

                {columns.map((column) => (
                  <TableCell
                    sx={{
                      backgroundColor: '#FFF9C9',
                      borderBottom: '1px solid #E0E0E0',
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
                <TableCell
                  sx={{
                    display: 'flex',
                    borderBottom: '1px solid #E0E0E0',
                    padding: '20px',
                    justifyContent: 'center',
                    backgroundColor: '#FFF9C9',
                  }}
                  className="!text-red-600 !text-base !text-nowrap !font-semibold"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 2} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                data.results.map((row) => (
                  <TableRow
                    key={row.ProfileId}
                    selected={selectedRows.includes(row.ProfileId)}
                    hover
                    role="checkbox"
                    tabIndex={-1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={selectedRows.includes(row.ProfileId)}
                        onChange={() => handleRowSelect(row.ProfileId)}
                      />
                    </TableCell>

                    {columns.map((column) => (
                      <TableCell
                        sx={{ whiteSpace: 'nowrap' }}
                        key={column.id}
                        align="left"
                      >
                        {renderCellContent(column.id, row[column.id], row)}
                      </TableCell>
                    ))}

                    <TableCell sx={{ padding: '10px', textAlign: 'center' }}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        gap={1}
                      >
                        {/* <Button
                          onClick={() =>
                            navigate(`/viewProfile?profileId=${row.ProfileId}`)
                          }
                        >
                          <FaRegEye />
                        </Button> */}
                        {/* <Button
                          onClick={() =>
                            navigate(`/editProfile?profileId=${row.ProfileId}`)
                          }
                        >
                          <GrEdit />
                        </Button> */}
                        <Button onClick={() => handleDelete(row.ContentId)}>
                          <MdDeleteOutline
                            style={{
                              height: '17px',
                              width: '25px',
                              color: '#ff3333',
                            }}
                          />
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[1, 2, 10, 25, 100]}
          component="div"
          count={data.count}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default QuickUploadProfiles;

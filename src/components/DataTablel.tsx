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
  Typography,
  Checkbox,
} from '@mui/material';
import axios from 'axios';
import { API_URL, baseUrl } from '../services/api';
import { GrEdit } from 'react-icons/gr';
import { MdDeleteOutline } from 'react-icons/md';
// Function to fetch data from the API
export const getDataTable = async (
  search: string,
  orderBy: string,
  order: 'asc' | 'desc',
  rowsPerPage: number,
  page: number,
  // Accept page_name as a parameter
) => {
  // Construct the URL with query parameters
  const params = new URLSearchParams({
    page_size: rowsPerPage.toString(),
    page: page.toString(),
    page_name:'0'
    // Pass the page_name parameter
  });

  if (search) {
    params.append('search', search);
  }

  const url = `${baseUrl}?${params.toString()}`;
  const response = await axios.get(url);
  return response;
};

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const columns: Column[] = [
  { id: 'ProfileId', label: 'Profile ID' },
  { id: 'Profile_name', label: 'Name' },

  { id: 'Profile_dob', label: 'Date of Birth' },
  { id: 'Profile_city', label: 'City' },
  { id: 'state_name', label: 'State' },
  { id: 'MaritalStatus', label: 'Marital' },
  { id: 'Mobile_no', label: 'Mobile' },
  { id: 'Profile_whatsapp', label: 'WhatsApp' },
  { id: 'Gender', label: 'Gender' },
  { id: 'Profile_alternate_mobile', label: 'Alternate Mobile' },

  { id: 'DateOfJoin', label: 'Date Of Join' },
  { id: 'birthstar_name', label: 'BirthStar' },
  { id: 'EmailId', label: 'Email' },
  { id: 'highest_education', label: 'Education Details' },
  { id: 'family_status', label: 'Family Status' },
  { id: 'anual_income', label: 'Annual Income' },
  { id: 'Last_login_date', label: 'Last Act Date' },

  { id: 'Profile_for', label: 'Profile For' },

  { id: 'profession', label: 'Profession' },

  { id: 'complexion_desc', label: 'Complexion' },
  { id: 'years', label: 'Years' },
  { id: 'country_name', label: 'Country' },
];
const DataTable: React.FC = () => {
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
  const adminUserId = sessionStorage.getItem('id') || localStorage.getItem('id');
  // Here you can define a value for page_name
  // Change this to the desired page name value

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, order, orderBy, search]);

  const [goToPageInput, setGoToPageInput] = useState<string>('');

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPageInput, 10);
    if (!isNaN(pageNumber)) {
      const lastPage = Math.ceil(data.count / rowsPerPage) - 1;
      const newPage = Math.max(0, Math.min(pageNumber - 1, lastPage));
      setPage(newPage);
      setGoToPageInput('');
    }
  };
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getDataTable(
        search,
        orderBy,
        order,
        rowsPerPage,
        page + 1,
      ); // Pass pageNameValue
      setData(response.data);
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
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/logindetails/${ContentId}/`, {
        data: {
          admin_user_id: adminUserId,  // <-- RAW JSON body
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
  const navigate = useNavigate();
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
  return (
    <div>
      <h1 className="text-2xl text-black font-bold mb-4">
        New Registered Profiles <span className="text-lg font-normal">({data.count})</span>
      </h1>

      <div>
        <div className="">
          <Button
            onClick={() => generateShortProfilePDF(selectedRows)}
            variant="contained"
            color="primary"
          >
            Download Short Profile
          </Button>
        </div>
        <div className=" w-full text-right ">
          <TextField
            size="medium"
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
            <TableHead sx={{ backgroundColor: '#FBED73' }}>
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
                      border: 'none',

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
                    backgroundColor: '#FFF9C9',
                    display: 'flex',
                    justifyContent: 'center',
                    border: 'none',
                    color: '#ee3448',

                    borderBottom: '1px solid #E0E0E0',
                  }}
                  className=" !text-base !text-nowrap !font-semibold"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                data.results.map((row, index) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell
                      sx={{
                        whiteSpace: 'nowrap',

                        backgroundColor: selectedRows.includes(row.ProfileId)
                          ? '#E3EEFA'
                          : 'transparent',
                      }}
                      padding="checkbox"
                    >
                      <Checkbox
                        color="primary"
                        checked={selectedRows.includes(row.ProfileId)}
                        onChange={() => handleRowSelect(row.ProfileId)} // Wrap in an arrow function
                      />
                    </TableCell>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap',
                            padding: '10px',
                            backgroundColor: selectedRows.includes(
                              row.ProfileId,
                            )
                              ? '#E3EEFA'
                              : 'transparent',
                          }}
                          key={column.id}
                          align={column.align}
                        >
                          {column.id === 'ProfileId' ? (
                            <Typography
                              onClick={() =>
                                navigate(
                                  `/viewProfile?profileId=${row.ProfileId}`,
                                )
                              }
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
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell sx={{ display: 'flex' }}>
                      <Button
                        component={Link}
                        to={`/admin/edit/${row.ContentId}`}
                      >
                        <GrEdit />
                      </Button>
                      <Button onClick={() => handleDelete(row.ContentId)}>
                        <MdDeleteOutline
                          style={{
                            height: '17px',
                            width: '25px',
                            color: '#ff3333',
                          }}
                        />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

        </TableContainer>

       <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
          <Typography variant="body2">
            Page <strong>{page + 1}</strong> of <strong>{Math.ceil(data.count / rowsPerPage)}</strong>
          </Typography>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Go To Page Input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Typography variant="body2">Go to page:</Typography>
              <TextField
                size="small"
                type="number"
                value={goToPageInput}
                onChange={(e) => setGoToPageInput(e.target.value)}
                style={{ width: '70px' }}
              />
              <Button variant="contained" size="small" onClick={handleGoToPage} disabled={!goToPageInput}>Go</Button>
            </div>

            {/* Navigation Buttons */}
            <Button variant="outlined" size="small" onClick={() => setPage(0)} disabled={page === 0}>{'<<'}</Button>
            <Button variant="outlined" size="small" onClick={() => setPage(prev => Math.max(0, prev - 1))} disabled={page === 0}>Prev</Button>

            {/* Dynamic Page Numbers */}
            {(() => {
              const totalPages = Math.ceil(data.count / rowsPerPage);
              const currentPage = page + 1;
              const pages = [];

              for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                  pages.push(
                    <Button
                      key={i}
                      variant={currentPage === i ? "contained" : "outlined"}
                      size="small"
                      onClick={() => setPage(i - 1)}
                    >
                      {i}
                    </Button>
                  );
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                  pages.push(<Typography key={`dots-${i}`}>...</Typography>);
                }
              }
              return pages;
            })()}

            <Button variant="outlined" size="small" onClick={() => setPage(prev => prev + 1)} disabled={page >= Math.ceil(data.count / rowsPerPage) - 1}>Next</Button>
            <Button variant="outlined" size="small" onClick={() => setPage(Math.ceil(data.count / rowsPerPage) - 1)} disabled={page >= Math.ceil(data.count / rowsPerPage) - 1}>{'>>'}</Button>
          </div>
        </div>
      </Paper>

    </div>
  );
};

export default DataTable;

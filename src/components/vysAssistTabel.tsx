// import axios from 'axios';
// import { vysAssistApi } from '../services/api';
// import { useEffect, useState } from 'react';
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
// import { Box, TablePagination, TextField, Typography } from '@mui/material';
// interface ProfileRequest {
//   profile_from_id: string;
//   profile_from_name: string;
//   profile_from_mobile: string;
//   profile_to_id: string;
//   profile_to_name: string;
//   profile_to_mobile: string;
//   to_message: string;
//   req_datetime: string;
//   response_datetime: string;
//   status: number;
// }

// const VysAssist = () => {
//   const [data, setData] = useState<ProfileRequest[]>([]);
//   const [page, setPage] = useState<number>(0);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(10);
//   const [search, setSearch] = useState<string>('');
//   const handleChangePage = (_event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };
//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearch(event.target.value);
//     setPage(0); // Reset page to 0 when search term changes
//   };

//   const fetchProfileVysAssist = async () => {
//     try {
//       const response = await axios.get(`${vysAssistApi}`);
//       setData(response.data.results);
//       console.log('Data:', response.data);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };
//   useEffect(() => {
//     fetchProfileVysAssist();
//   }, []);

//   const Tableheadings = [
//     'Profile From ID',
//     'Profile From Name',
//     'Profile From Mobile',
//     'Profile To ID',
//     'Profile To Name',
//     'Profile To Mobile',
//     'To Mobile Message',
//     'Request Date&Time',
//     'Response Date&Time',
//   ];
//   return (
//     <Box>
//       <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4 }}>
//         VysAssist
//       </Typography>
//       <div className="w-full text-right ">
//         <TextField
//           size="small"
//           label="Search"
//           variant="outlined"
//           margin="normal"
//           value={search}
//           onChange={handleSearchChange}
//         />
//       </div>
//       <TableContainer component={Paper}>
//         <Table aria-label="simple table">
//           <TableHead>
//             <TableRow sx={{ backgroundColor: '#ED1E24' }}>
//               {Tableheadings.map((heading, index) => (
//                 <TableCell
//                   key={index}
//                   sx={{
//                     color: 'white',
//                     fontWeight: 'bold',
//                     whiteSpace: 'nowrap',
//                   }}
//                   align="left"
//                 >
//                   {heading}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>

//             {data.map((row: ProfileRequest) => (
//               <TableRow
//                 key={row.profile_from_id}
//                 sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
//               >
//                 <TableCell component="th" scope="row">
//                   {row.profile_from_id}
//                 </TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">
//                   {row.profile_from_name}
//                 </TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">
//                   {row.profile_from_mobile}
//                 </TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">
//                   {row.profile_to_id}
//                 </TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">
//                   {row.profile_to_name}
//                 </TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">
//                   {row.profile_to_mobile}
//                 </TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">
//                   {row.to_message}
//                 </TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">
//                   {row.req_datetime}
//                 </TableCell>
//                 <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">
//                   {row.response_datetime}
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         // count={filteredResults.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Box>
//   );
// };

// export default VysAssist;




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
  CircularProgress,
  Link,
} from '@mui/material';
import axios from 'axios';
import VysAssistPopup from '../components/VysAssistPopup';
import { useNavigate } from 'react-router-dom';

interface Column {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

const VysAssist: React.FC = () => {
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [orderBy, setOrderBy] = useState<string>('profile_from_id');
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVysassistId, setSelectedVysassistId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        'https://app.vysyamala.com/api/profile-vys-assist/',
      );
      setData(response.data.results); // Assuming response.data contains an array of results
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVysassistClick = (id: string) => {
    setSelectedVysassistId(id);
  };

  const handleClosePopup = () => {
    setSelectedVysassistId(null);
  };



  const columns: Column[] = [
    {
      id: 'profile_vysasst_id',
      label: 'Vysassist Id',
      minWidth: 100,
      align: 'center',
    },
    {
      id: 'profile_from_id',
      label: 'From Profile ID',
      minWidth: 100,
      align: 'center',
    },
    { id: 'profile_from_name', label: 'From Name', minWidth: 150 },
    { id: 'profile_from_mobile', label: 'From Mobile', minWidth: 150 },
    { id: 'profile_to_id', label: 'To Profile ID', minWidth: 100 },
    { id: 'profile_to_name', label: 'To Name', minWidth: 150 },
    { id: 'profile_to_mobile', label: 'To Mobile', minWidth: 150 },
    { id: 'to_express_message', label: 'Message', minWidth: 200 },
    { id: 'req_datetime', label: 'Request Date', minWidth: 150 },
    { id: 'response_datetime', label: 'Response Date', minWidth: 150 },
    { id: 'status', label: 'Status', minWidth: 100 },
  ];


  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-black">Vys Assist</h1>
      <div className="w-full p-2 flex justify-between">
        <TextField
          label="Search"
          variant="outlined"
          margin="normal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Paper className="w-full">
        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer sx={{ border: '1px solid #E0E0E0' }} className="bg-white">
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((columns) => (
                    <TableCell key={columns.id} align={columns.align} sx={{ background: '#FFF9C9', color: '#DC2635', fontWeight: 600 }}>{columns.label}</TableCell>
                  ))}
                </TableRow>

              </TableHead>
              <TableBody>
                {/* {data
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => ( */}
                {/* {data
  .filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.toLowerCase())
    )
  )
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  .map((row, index) => ( */}
                {data
                  .filter((row) =>
                    row.profile_vysasst_id.toString().toLowerCase().includes(search.toLowerCase()) ||
                    Object.values(row).some((value) =>
                      value?.toString().toLowerCase().includes(search.toLowerCase())
                    )
                  ) // Filters based on search input
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => (
                    <TableRow hover key={index}>
                      <TableCell>
                        <Link
                          component="button"
                          onClick={() => handleVysassistClick(row.profile_vysasst_id)}
                          sx={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                          {row.profile_vysasst_id}
                        </Link>
                      </TableCell>
                      {/* <TableCell>{row.profile_from_id}</TableCell> */}
                      <TableCell
                        onClick={() =>
                          navigate(
                            `/viewProfile?profileId=${row.profile_from_id}`,
                          )
                        }
                        sx={{
                          color: 'blue',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {row.profile_from_id}
                      </TableCell>
                      <TableCell>{row.profile_from_name}</TableCell>
                      <TableCell>{row.profile_from_mobile}</TableCell>
                      {/* <TableCell>{row.profile_to_id}</TableCell> */}
                      <TableCell
                        onClick={() =>
                          navigate(
                            `/viewProfile?profileId=${row.profile_to_id}`,
                          )
                        }
                        sx={{
                          color: 'blue',
                          cursor: 'pointer',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {row.profile_to_id}
                      </TableCell>
                      <TableCell>{row.profile_to_name}</TableCell>
                      <TableCell>{row.profile_to_mobile}</TableCell>
                      <TableCell>{row.to_message}</TableCell>
                      {/* <TableCell>{row.req_datetime}</TableCell> */}
                      <TableCell>
                        {row.req_datetime
                          ? String(row.req_datetime).split(/[T ]/)[0] // removes time
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        {row.response_datetime
                          ? String(row.response_datetime).split(/[T ]/)[0] // removes time
                          : "N/A"}
                      </TableCell>
                      <TableCell>{row.status}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Popup Component */}
      {selectedVysassistId && (
        <VysAssistPopup vysassistId={selectedVysassistId} onClose={handleClosePopup} />
      )}
    </>
  );
};

export default VysAssist;




// import React, { useEffect, useState } from 'react';
// import {
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TablePagination,
//   TableSortLabel,
//   TextField,
//   CircularProgress,
//   Link,
// } from '@mui/material';
// import axios from 'axios';

// interface Column {
//   id: string;
//   label: string;
//   minWidth?: number;
//   align?: 'right' | 'left' | 'center';
// }

// interface VysAssistData {
//   results: any[];
//   count: number;
// }

// const VysAssist: React.FC = () => {
//   const [order, setOrder] = useState<'asc' | 'desc'>('asc');
//   const [orderBy, setOrderBy] = useState<string>('profile_from_id');
//   const [page, setPage] = useState<number>(0);
//   const [rowsPerPage, setRowsPerPage] = useState<number>(10);
//   const [data, setData] = useState<VysAssistData>({ results: [], count: 0 });
//   const [search, setSearch] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         'https://app.vysyamala.com/api/profile-vys-assist/',
//       );
//       setData(response.data); // Assuming response.data contains the structure { results: [], count: 0 }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRequestSort = (property: string) => {
//     const isAsc = orderBy === property && order === 'asc';
//     setOrder(isAsc ? 'desc' : 'asc');
//     setOrderBy(property);
//   };

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearch(event.target.value);
//     setPage(0); // Reset page to 0 when search term changes
//   };

//   const handleChangePage = (_event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   const columns: Column[] = [
//     {
//       id: 'profile_vysasst_id',
//       label: 'Vysassist Id',
//       minWidth: 100,
//       align: 'center',
//     },
//     {
//       id: 'profile_from_id',
//       label: 'From Profile ID',
//       minWidth: 100,
//       align: 'center',
//     },
//     { id: 'profile_from_name', label: 'From Name', minWidth: 150 },
//     { id: 'profile_from_mobile', label: 'From Mobile', minWidth: 150 },
//     { id: 'profile_to_id', label: 'To Profile ID', minWidth: 100 },
//     { id: 'profile_to_name', label: 'To Name', minWidth: 150 },
//     { id: 'profile_to_mobile', label: 'To Mobile', minWidth: 150 },
//     { id: 'to_express_message', label: 'Message', minWidth: 200 },
//     { id: 'req_datetime', label: 'Request Date', minWidth: 150 },
//     { id: 'response_datetime', label: 'Response Date', minWidth: 150 },
//     { id: 'status', label: 'Status', minWidth: 100 },
//   ];

//   const descendingComparator = (a: any, b: any, orderBy: string) => {
//     if (b[orderBy] < a[orderBy]) return -1;
//     if (b[orderBy] > a[orderBy]) return 1;
//     return 0;
//   };

//   const getComparator = (order: 'asc' | 'desc', orderBy: string) => {
//     return order === 'desc'
//       ? (a: any, b: any) => descendingComparator(a, b, orderBy)
//       : (a: any, b: any) => -descendingComparator(a, b, orderBy);
//   };

//   const stableSort = (array: any[], comparator: (a: any, b: any) => number) => {
//     const stabilizedThis = array.map(
//       (el, index) => [el, index] as [any, number],
//     );
//     stabilizedThis.sort((a, b) => {
//       const order = comparator(a[0], b[0]);
//       if (order !== 0) return order;
//       return a[1] - b[1];
//     });
//     return stabilizedThis.map((el) => el[0]);
//   };

//   // Filter and sort data based on search term and order
//   const filteredResults = stableSort(
//     data.results.filter((row) =>
//       Object.values(row).some((value) =>
//         String(value).toLowerCase().includes(search.toLowerCase()),
//       ),
//     ),
//     getComparator(order, orderBy),
//   );

//   return (
//     <>
//       <h1 className="text-2xl font-bold mb-4 text-black
// ">Vys Assist</h1>
//       <div className="w-full p-2 flex justify-between">
//         <div className="w-full text-right px-2">
//           <TextField
//             label="Search"
//             variant="outlined"
//             margin="normal"
//             value={search}
//             onChange={handleSearchChange}
//           />
//         </div>
//       </div>

//       <Paper className="w-full">
//         {loading ? (
//           <CircularProgress />
//         ) : (
//           <TableContainer
//             sx={{ border: '1px solid #E0E0E0' }}
//             className="bg-white"
//           >
//             <Table stickyHeader>
//               <TableHead>
//                 <TableRow>
//                   {columns.map((column, index) => (
//                     <TableCell
//                       sx={{
//                         borderBottom: '1px solid #E0E0E0', // Applying bottom border
//                         // Apply border only for the first column

//                         background: '#FFF9C9',

//                         color: '#DC2635',
//                         fontSize: '1rem',
//                         fontWeight: 600,
//                       }}
//                       key={column.id}
//                       align={column.align}
//                       style={{ minWidth: column.minWidth }}
//                     >
//                       <TableSortLabel
//                         className="!text-red-600 !text-base !text-md text-nowrap font-semibold"
//                         active={orderBy === column.id}
//                         direction={orderBy === column.id ? order : 'asc'}
//                         onClick={() => handleRequestSort(column.id)}
//                       >
//                         {column.label}
//                       </TableSortLabel>
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {filteredResults
//                   .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//                   .map((row, index) => (
//                     <TableRow hover key={index}>
//                       {columns.map((column) => {
//                         const value = row[column.id];
//                         return (
//                           <TableCell
//                             sx={{ whiteSpace: 'nowrap' }}
//                             key={column.id}
//                             align={column.align}
//                           >
//                             {value}
//                           </TableCell>
//                         );
//                       })}
//                     </TableRow>
//                   ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         )}

//         <TablePagination
//           component="div"
//           count={filteredResults.length}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//       </Paper>
//     </>
//   );
// };

// export default VysAssist;

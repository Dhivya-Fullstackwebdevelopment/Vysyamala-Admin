import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { MdDeleteOutline } from 'react-icons/md';
import { GrEdit } from 'react-icons/gr';
import { FaRegEye } from 'react-icons/fa';

// --- 1. Updated API endpoint ---
const RENEWAL_API_URL = 'https://app.vysyamala.com/api/renewal-profiles/';
const API_URL = 'https://app.vysyamala.com/api'; // Base API for delete

// --- 2. Updated data fetching function ---
export const getRenewalProfiles = async (
    search: string,
    orderBy: string,
    order: 'asc' | 'desc',
    rowsPerPage: number,
    page: number,
    fromDate?: string,  // Add fromDate parameter
    toDate?: string     // Add toDate parameter

) => {
    const params = new URLSearchParams({
        page_size: rowsPerPage.toString(),
        page: page.toString(),
    });

    if (search) {
        params.append('search', search);
    }
    // Add date parameters if they exist
    if (fromDate) {
        params.append('from_date', fromDate);
    }
    if (toDate) {
        params.append('to_date', toDate);
    }
    // Add sorting parameters if needed by the API
    // params.append('ordering', `${order === 'desc' ? '-' : ''}${orderBy}`);

    const url = `${RENEWAL_API_URL}?${params.toString()}`;
    const response = await axios.get(url);
    return response;
};

// --- 3. Updated Column interface and definitions to match the new API response ---
interface Column {
    id: keyof RenewalProfile; // Use keys from the data interface for type safety
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
}

// Interface for a single profile from the renewal API
interface RenewalProfile {
    ContentId: number;
    ProfileId: string;
    Profile_name: string;
    Gender: string;
    Mobile_no: string;
    Profile_whatsapp: string;
    Profile_alternate_mobile: string;
    EmailId: string;
    Profile_dob: string;
    DateOfJoin: string;
    birthstar_name: string;
    MaritalStatus: string;
    complexion_desc: string;
    country_name: string;
    Profile_for: string;
    highest_education: string;
    profession: string;
    anual_income: string;
    years: number;
    city_name: string;
    state_name: string;
    district_name: string;
    membership_startdate?: string;
    membership_enddate?: string;
    family_status: string;
    status: string;
    plan_name: string;
    Last_login_date: string;
    degree: string;
}


const columns: Column[] = [
    { id: 'ProfileId', label: 'Profile ID', minWidth: 120 },
    { id: 'Profile_name', label: 'Name', minWidth: 170 },
    { id: 'years', label: 'Age', minWidth: 80 },
    { id: 'degree', label: 'Degree', minWidth: 260 },
    { id: 'family_status', label: 'Family Status', minWidth: 190 },
    // { id: 'DateOfJoin', label: 'Date of Joining', minWidth: 150 },
    { id: 'DateOfJoin', label: 'Date of Registration', minWidth: 150 },
    { id: 'membership_enddate', label: 'End Date', minWidth: 180 },
    { id: 'state_name', label: 'State', minWidth: 120 },
    { id: 'city_name', label: 'City', minWidth: 120 },
    { id: 'Mobile_no', label: 'Mobile No', minWidth: 150 },
    { id: 'status', label: 'Profile Status', minWidth: 150 },
    { id: 'plan_name', label: 'Membership Plan', minWidth: 150 },
    { id: 'Last_login_date', label: 'Last Login Date', minWidth: 150 },

    // { id: 'Gender', label: 'Gender', minWidth: 100 },
    // { id: 'Profile_whatsapp', label: 'WhatsApp', minWidth: 150 },
    // { id: 'EmailId', label: 'Email', minWidth: 200 },
    // { id: 'Profile_alternate_mobile', label: 'Alternate Mobile', minWidth: 200 },
    // { id: 'Profile_dob', label: 'DOB', minWidth: 120 },
    // { id: 'birthstar_name', label: 'Birth Star', minWidth: 130 },
    // { id: 'MaritalStatus', label: 'Marital Status', minWidth: 150 },
    // { id: 'complexion_desc', label: 'Complexion', minWidth: 130 },
    // { id: 'country_name', label: 'Country', minWidth: 120 },
    // { id: 'district_name', label: 'District', minWidth: 120 },
    // { id: 'Profile_for', label: 'Profile For', minWidth: 120 },
    // { id: 'highest_education', label: 'Education', minWidth: 180 },
    // { id: 'profession', label: 'Profession', minWidth: 150 },
    // { id: 'anual_income', label: 'Annual Income', minWidth: 180 },
    // { id: 'years', label: 'Years', minWidth: 180 },
    // { id: 'membership_startdate', label: 'Membership Start Date', minWidth: 180 },
];


const RenewalProfiles: React.FC = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<keyof RenewalProfile>('ProfileId');
    const [page, setPage] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState<number>(10);
    const [data, setData] = useState<{ results: RenewalProfile[]; count: number }>({
        results: [],
        count: 0,
    });
    const [goToPageInput, setGoToPageInput] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    // const [selectAll, setSelectAll] = useState<boolean>(false);
    const [, setSelectAll] = useState<boolean>(false);
    const [selectedRows, setSelectedRows] = useState<string[]>([]); // Store ProfileId (string)
    const [totalCount, setTotalCount] = useState<number>(0);
    // Add state for date filters
    const [fromDate, setFromDate] = useState<string>('');
    const [toDate, setToDate] = useState<string>('');

    useEffect(() => {
        fetchData();
    }, [page, rowsPerPage, order, orderBy, search]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // --- 4. Call the new data fetching function ---
            const response = await getRenewalProfiles(
                search.trim(),
                orderBy,
                order,
                rowsPerPage,
                page + 1,
                fromDate,  // Pass fromDate
                toDate     // Pass toDate
            );
            setData(response.data);
            setTotalCount(response.data.count);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Add handlers for date changes
    const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFromDate(event.target.value);
    };

    const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setToDate(event.target.value);
    };

    const handleDateFilterSubmit = () => {
        setPage(0); // Reset to first page when applying new filters
        fetchData();
    };

    const handleRequestSort = (property: keyof RenewalProfile) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(0);
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

    const handleDelete = async (contentId: number) => {
        if (!contentId) {
            console.error('Error: Missing ID for the row to delete');
            return;
        }

        const confirmed = window.confirm(
            'Are you sure you want to delete this profile?',
        );
        if (!confirmed) return;

        try {
            // Assuming the delete endpoint uses the ContentId
            await axios.delete(`${API_URL}/logindetails/${contentId}/`);
            fetchData(); // Refresh the data after deletion
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;
        setSelectAll(checked);
        if (checked) {
            setSelectedRows(data.results.map((row) => row.ProfileId));
        } else {
            setSelectedRows([]);
        }
    };

    const handleRowSelect = (profileId: string) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(profileId)
                ? prevSelected.filter((id) => id !== profileId)
                : [...prevSelected, profileId],
        );
    };

    const generateShortProfilePDF = async (profileIds: string[]) => {
        try {
            const response = await axios.post(
                'https://app.vysyamala.com/api/generate_short_profile_pdf/',
                {
                    profile_id: profileIds.join(','),
                },
                {
                    responseType: 'blob',
                },
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'profiles.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove(); // Clean up the link element
        } catch (error) {
            console.error('Error downloading the PDF:', error);
        } finally {
            setSelectedRows([]);
            setSelectAll(false);
        }
    };

    // --- 5. Simplified renderCellContent function ---
    const renderCellContent = (columnId: keyof RenewalProfile, value: any, row: RenewalProfile) => {

        if (columnId === 'membership_startdate' || columnId === 'membership_enddate' || columnId === 'Last_login_date') {
            // Extract just the date part from the datetime string
            return value ? value.split(' ')[0] : 'N/A';
        }

        if (columnId === 'ProfileId') {
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
        }

        return value ?? 'N/A'; // Return 'N/A' for null or undefined values
    };

    const handleGoToPage = () => {
        const p = Number(goToPageInput);
        const totalPages = Math.ceil(totalCount / rowsPerPage);
        if (p > 0 && p <= totalPages) {
            setPage(p - 1);
            setGoToPageInput('');
        } else {
            alert('Invalid page number');
        }
    };

    const renderCustomPagination = () => {
        const totalPages = Math.ceil(data.count / rowsPerPage);
        const currentPage = page + 1;

        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
                {/* Left side - Page indicator */}
                <Typography variant="body2">
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </Typography>

                {/* Right side - Pagination controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '16px' }}>
                        <Typography variant="body2">Go to page:</Typography>
                        <TextField
                            size="small"
                            type="number"
                            value={goToPageInput}
                            onChange={(e) => setGoToPageInput(e.target.value)}
                            inputProps={{
                                min: 1,
                                max: totalPages,
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleGoToPage();
                            }}
                            style={{ width: '80px' }}
                        />
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleGoToPage}
                            disabled={!goToPageInput}
                        >
                            Go
                        </Button>
                    </div>

                    {/* First Page button */}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setPage(0)}
                        disabled={page === 0}
                        sx={{ minWidth: '32px' }}
                    >
                        {'<<'}
                    </Button>

                    {/* Previous button */}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                    >
                        Prev
                    </Button>

                    {/* Page numbers with ellipsis logic */}
                    {(() => {
                        const pages = [];

                        // 1. Always show the first page
                        pages.push(
                            <Button
                                key={1}
                                variant={currentPage === 1 ? "contained" : "outlined"}
                                size="small"
                                onClick={() => setPage(0)}
                                sx={{ minWidth: '32px' }}
                            >
                                1
                            </Button>
                        );

                        // 2. Show start ellipsis if needed
                        if (currentPage > 3) {
                            pages.push(<Typography key="ellipsis-start" sx={{ px: 1 }}>...</Typography>);
                        }

                        // 3. Show pages around the current page
                        const start = Math.max(2, currentPage - 1);
                        const end = Math.min(totalPages - 1, currentPage + 1);

                        for (let i = start; i <= end; i++) {
                            pages.push(
                                <Button
                                    key={i}
                                    variant={currentPage === i ? "contained" : "outlined"}
                                    size="small"
                                    onClick={() => setPage(i - 1)}
                                    sx={{ minWidth: '32px' }}
                                >
                                    {i}
                                </Button>
                            );
                        }

                        // 4. Show end ellipsis if needed
                        if (currentPage < totalPages - 2) {
                            pages.push(<Typography key="ellipsis-end" sx={{ px: 1 }}>...</Typography>);
                        }

                        // 5. Always show the last page if there's more than one page
                        if (totalPages > 1) {
                            pages.push(
                                <Button
                                    key={totalPages}
                                    variant={currentPage === totalPages ? "contained" : "outlined"}
                                    size="small"
                                    onClick={() => setPage(totalPages - 1)}
                                    sx={{ minWidth: '32px' }}
                                >
                                    {totalPages}
                                </Button>
                            );
                        }

                        return pages;
                    })()}

                    {/* Next button */}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1}
                    >
                        Next
                    </Button>

                    {/* Last Page button */}
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setPage(Math.max(0, totalPages - 1))}
                        disabled={page >= totalPages - 1}
                        sx={{ minWidth: '32px' }}
                    >
                        {'>>'}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl text-black font-bold mb-4">Renewal Profiles <span className="text-lg font-normal">({totalCount})</span></h1>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <div className="w-full p-2 flex justify-between">
                    <div className="w-full text-right px-2">

                        <div className="flex items-center space-x-2">
                            <TextField
                                label="From Date"
                                type="date"
                                name="fromDate"
                                value={fromDate}
                                onChange={handleFromDateChange}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            />
                            <TextField
                                label="To Date"
                                type="date"
                                name="toDate"
                                value={toDate}
                                onChange={handleToDateChange}
                                InputLabelProps={{ shrink: true }}
                                size="small"
                            // inputProps={{
                            //     max: new Date().toISOString().split('T')[0] // This disables future dates
                            // }}
                            />

                            <Button variant="contained"
                                onClick={handleDateFilterSubmit}
                            >
                                Submit
                            </Button>
                            <Button
                                onClick={() => generateShortProfilePDF(selectedRows)}
                                variant="contained"
                                color="primary"
                                disabled={selectedRows.length === 0}
                            >
                                Download Short Profile(s)
                            </Button>
                        </div>
                    </div>
                </div>

                <TextField
                    size="medium"
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={handleSearchChange}
                    sx={{ width: '300px' }}
                />
            </Box>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 640, backgroundColor: 'white' }}>
                    <Table sx={{ border: '1px solid #E0E0E0' }} stickyHeader aria-label="renewal profiles table">
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox" sx={{ backgroundColor: '#FFF9C9' }}>
                                    <Checkbox
                                        color="primary"
                                        indeterminate={selectedRows.length > 0 && selectedRows.length < data.results.length}
                                        checked={data.results.length > 0 && selectedRows.length === data.results.length}
                                        onChange={handleSelectAll}
                                    />
                                </TableCell>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                        sx={{ backgroundColor: '#FFF9C9', borderBottom: '1px solid #E0E0E0' }}
                                    >
                                        <TableSortLabel
                                            className="!text-red-600 !text-base !font-semibold"
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={() => handleRequestSort(column.id)}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                                <TableCell
                                    align="center"
                                    className="!text-red-600 !text-base !font-semibold"
                                    sx={{ backgroundColor: '#FFF9C9', borderBottom: '1px solid #E0E0E0' }}
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
                                data.results.map((row) => {
                                    const isItemSelected = selectedRows.includes(row.ProfileId);
                                    return (
                                        <TableRow
                                            key={row.ProfileId}
                                            selected={isItemSelected}
                                            hover
                                            role="checkbox"
                                            tabIndex={-1}
                                            onClick={() => handleRowSelect(row.ProfileId)}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    color="primary"
                                                    checked={isItemSelected}
                                                />
                                            </TableCell>
                                            {columns.map((column) => (
                                                <TableCell key={column.id} align={column.align}>
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
                                                    <Button
                                                        onClick={() =>
                                                            navigate(`/viewProfile?profileId=${row.ProfileId}`)
                                                        }
                                                    >
                                                        <FaRegEye />
                                                    </Button>
                                                    <Button
                                                        onClick={() =>
                                                            navigate(`/editProfile?profileId=${row.ProfileId}`)
                                                        }
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
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {Math.ceil(data.count / rowsPerPage) > 0 && renderCustomPagination()}
            </Paper>
        </div>
    );
};

export default RenewalProfiles;

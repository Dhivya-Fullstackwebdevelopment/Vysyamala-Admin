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
    Snackbar,
    Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { apiAxios } from '../../../api/apiUrl';

const clickToCallApi = '/api/click-to-call';

interface Column {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'left' | 'right' | 'center';
}

interface ClickToCallResponse {
    results: any[];
    count: number;
}

const getClickToCallProfiles = async (
    fromDate: string,
    toDate: string,
    page: number,
    limit: number,
    profileId?: string
) => {
    const params = new URLSearchParams();
    params.append('page', (page + 1).toString());
    params.append('page_size', limit.toString());

    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    if (profileId) params.append('profile_id', profileId);

    const res = await apiAxios.get(`${clickToCallApi}?${params.toString()}`);
    return res.data;
};

const ClickToCallProfiles: React.FC = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState<number>(0);
    const [rowsPerPage] = useState<number>(10);
    const [totalCount, setTotalCount] = useState(0);
    const [data, setData] = useState<ClickToCallResponse>({ results: [], count: 0 });
    const [loading, setLoading] = useState(false);

    // Filter States
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [profileId, setProfileId] = useState('');

    // Trigger State to force API call on every submit click
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Input States
    const [localFromDate, setLocalFromDate] = useState('');
    const [localToDate, setLocalToDate] = useState('');
    const [localProfileId, setLocalProfileId] = useState('');
    const [search, setSearch] = useState('');
    const [goToPageInput, setGoToPageInput] = useState('');

    const [order, setOrder] = useState<'asc' | 'desc'>('asc');
    const [orderBy, setOrderBy] = useState<string>('click_to_call_datetime');
    const [isDownloading, setIsDownloading] = useState<boolean>(false);

    const columns: Column[] = [
        { id: 'profile_from_id', label: 'From Profile ID', minWidth: 150, align: 'center' },
        { id: 'profile_from_name', label: 'From Name', minWidth: 150 },
        { id: 'profile_from_plan', label: 'From Plan', minWidth: 120 },
        { id: 'profile_from_status', label: 'From Status', minWidth: 120 },
        { id: 'profile_from_state', label: 'From State', minWidth: 150 },
        { id: 'profile_from_city', label: 'From City', minWidth: 150 },
        { id: 'profile_to_id', label: 'To Profile ID', minWidth: 150 },
        { id: 'profile_to_name', label: 'To Name', minWidth: 150 },
        { id: 'profile_to_plan', label: 'To Plan', minWidth: 120 },
        { id: 'profile_to_status', label: 'To Status', minWidth: 120 },
        { id: 'profile_to_state', label: 'To State', minWidth: 150 },
        { id: 'profile_to_city', label: 'To City', minWidth: 150 },
        { id: 'click_to_call_datetime', label: 'Click To Call Date/Time', minWidth: 300 },
    ];

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getClickToCallProfiles(fromDate, toDate, page, rowsPerPage, profileId);
            setData(res);
            setTotalCount(res.count);
        } catch {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    // Dependencies now include refreshTrigger
    useEffect(() => {
        fetchData();
    }, [page, fromDate, toDate, profileId, refreshTrigger]);

    const handleSubmit = () => {
        // if (!localFromDate || !localToDate) {
        //     toast.error('Please select both From Date and To Date');
        //     return;
        // }

        if (new Date(localFromDate) > new Date(localToDate)) {
            toast.error('From Date cannot be after To Date');
            return;
        }

        setPage(0);
        setFromDate(localFromDate);
        setToDate(localToDate);
        setProfileId(localProfileId);

        // Increments the counter to ensure the useEffect runs even if dates are identical
        setRefreshTrigger(prev => prev + 1);
    };

    const handleDownloadExcel = async () => {
        setIsDownloading(true);

        try {
            const params = new URLSearchParams();
            params.append('export', 'xlsx');

            // Use the filter states (not local input states) to match visible table data
            if (fromDate) params.append('from_date', fromDate);
            if (toDate) params.append('to_date', toDate);
            if (profileId) params.append('profile_id', profileId);

            const response = await apiAxios.get(clickToCallApi, {
                params,
                responseType: 'blob', // Critical for binary files like Excel
            });

            // Create a Blob from the response data
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            // Trigger browser download
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;

            // Dynamic filename logic
            const dateTag = fromDate && toDate ? `_${fromDate}_to_${toDate}` : '';
            link.download = `Click_To_Call_Profiles${dateTag}.xlsx`;

            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.remove();
            window.URL.revokeObjectURL(url);
            // toast.success("Download started successfully");
        } catch (error) {
            console.error('Error downloading Excel:', error);
            toast.error("Failed to download Excel file");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleRequestSort = (id: string) => {
        const isAsc = orderBy === id && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
    };

    const filteredResults = [...data.results]
        .filter((row) =>
            Object.values(row).some((v) =>
                String(v).toLowerCase().includes(search.toLowerCase())
            )
        )
        .sort((a, b) => {
            const x = a[orderBy];
            const y = b[orderBy];
            if (x < y) return order === 'asc' ? -1 : 1;
            if (x > y) return order === 'asc' ? 1 : -1;
            return 0;
        });

    const handleGoToPage = () => {
        const p = Number(goToPageInput);
        const totalPages = Math.ceil(totalCount / rowsPerPage);
        if (p > 0 && p <= totalPages) {
            setPage(p - 1);
            setGoToPageInput('');
        } else {
            toast.warn('Invalid page number');
        }
    };

    // Updated render function with ellipsis logic
    const renderCustomPagination = () => {
        const totalPages = Math.ceil(totalCount / rowsPerPage);
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
                            inputProps={{ min: 1, max: totalPages }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') handleGoToPage();
                            }}
                            style={{ width: '80px' }}
                        />
                        <Button variant="contained" size="small" onClick={handleGoToPage} disabled={!goToPageInput}>
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

                        // Always show the first page
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

                        // Show start ellipsis if current page is far from the start
                        if (currentPage > 3) {
                            pages.push(<Typography key="ellipsis-start" sx={{ px: 1 }}>...</Typography>);
                        }

                        // Middle Pages (around current)
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

                        // Show end ellipsis if current page is far from the end
                        if (currentPage < totalPages - 2) {
                            pages.push(<Typography key="ellipsis-end" sx={{ px: 1 }}>...</Typography>);
                        }

                        // Always show the last page if more than 1 page exists
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
        <>
            <h1 className="text-2xl font-bold mb-4 text-black">
                Click To Call Profiles <span className="text-lg font-normal">({totalCount})</span>
            </h1>

            <div className="w-full py-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <TextField
                        label="From Date"
                        type="date"
                        value={localFromDate}
                        onChange={(e) => setLocalFromDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="To Date"
                        type="date"
                        value={localToDate}
                        onChange={(e) => setLocalToDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Profile ID"
                        placeholder="Search ID"
                        value={localProfileId}
                        onChange={(e) => setLocalProfileId(e.target.value)}
                    />
                    <Button variant="contained" onClick={handleSubmit} sx={{ height: '36px' }}>
                        Submit
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ ml: 2 }}
                        onClick={handleDownloadExcel}
                        disabled={isDownloading || data.results.length === 0}
                    >
                        {isDownloading ? 'Downloading…' : 'Download Excel'}
                    </Button>
                </div>

                <TextField
                    label="Search"
                    variant="outlined"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <Paper className="w-full">
                <TableContainer sx={{ border: '1px solid #E0E0E0' }}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                {columns.map((col) => (
                                    <TableCell
                                        key={col.id}
                                        align={col.align}
                                        sx={{ background: '#FFF9C9', color: '#DC2635', fontWeight: 600 }}
                                    >
                                        <TableSortLabel
                                            active={orderBy === col.id}
                                            direction={orderBy === col.id ? order : 'asc'}
                                            onClick={() => handleRequestSort(col.id)}
                                            className="!text-red-600"
                                        >
                                            {col.label}
                                        </TableSortLabel>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                                        <CircularProgress />
                                    </TableCell>
                                </TableRow>
                            ) : filteredResults.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                                        No records found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredResults.map((row, idx) => (
                                    <TableRow key={idx} hover>
                                        {columns.map((col) => {
                                            let value = row[col.id];

                                            // --- DATE FORMATTING LOGIC ---
                                            if (col.id === 'click_to_call_datetime' && value) {
                                                const dateObj = new Date(value);
                                                const datePart = dateObj.toISOString().split('T')[0];
                                                const timePart = dateObj.toLocaleTimeString('en-IN', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true,
                                                }).toLowerCase();
                                                value = `${datePart}, ${timePart}`;
                                            }
                                            const isProfileId = col.id.includes('profile_id') || col.id.includes('_id');
                                            return (
                                                <TableCell
                                                    key={col.id}
                                                    align={col.align}
                                                    sx={isProfileId ? { color: 'blue', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } } : {}}
                                                    onClick={isProfileId ? () => navigate(`/viewProfile?profileId=${value}`) : undefined}
                                                >
                                                    {(value || 'N/A')}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                {Math.ceil(data.count / rowsPerPage) > 0 && renderCustomPagination()}
            </Paper>
        </>
    );
};

export default ClickToCallProfiles;
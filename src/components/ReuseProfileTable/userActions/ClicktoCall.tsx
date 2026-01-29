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
                    <Button variant="contained" onClick={handleSubmit} sx={{ height: '55px' }}>
                        Submit
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

                {totalCount > 0 && (
                    <div className="flex items-center justify-between p-4 border-t bg-white">
                        <Typography variant="body2">Page <strong>{page + 1}</strong> of <strong>{Math.ceil(totalCount / rowsPerPage)}</strong></Typography>
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
                                    btns.push(<Button key={i} variant={curr === i ? "contained" : "outlined"} size="small" onClick={() => setPage(i - 1)}>{i}</Button>);
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

export default ClickToCallProfiles;
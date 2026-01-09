import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { apiAxios } from '../../api/apiUrl';
import '../../index.css';

// --- Styles & Constants ---
const DASHBOARD_CONTAINER = "bg-white rounded-xl border border-[#E3E6EE] p-7 shadow-sm mb-8";
const BTN_DARK = "bg-[#0A1735] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#1f2d50] transition shadow-sm border-none cursor-pointer disabled:opacity-70";
const BTN_OUTLINE = "bg-white border border-gray-300 text-[#0A1735] px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-50 transition shadow-sm cursor-pointer";

interface ProfileOwner {
    id: string;
    username: string;
}

const DeleteDashboard: React.FC = () => {
    // --- State Management ---
    const [apiData, setApiData] = useState<any>(null);
    const [originalTableData, setOriginalTableData] = useState<any[]>([]); // To keep master list for searching
    const [filteredTableData, setFilteredTableData] = useState<any[]>([]); // Data actually displayed in table
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [profileOwners, setProfileOwners] = useState<ProfileOwner[]>([]);

    const tableRef = useRef<HTMLDivElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const RoleID = localStorage.getItem('role_id') || sessionStorage.getItem('role_id');
    const SuperAdminID = localStorage.getItem('id') || sessionStorage.getItem('id');

    const [scrollSource, setScrollSource] = useState<'card' | 'filter' | null>(null);
    const [applyFilters, setApplyFilters] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false); // 👈 New state for download

    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
        owner: SuperAdminID || "",
        profileId: '',
        countFilter: '',
        hidden: '',
        pending: '',
        searchQuery: "",
    });

    // --- Fetch Staff/Owners ---
    const fetchProfileOwners = useCallback(async () => {
        try {
            const response = await apiAxios.get('api/users/');
            setProfileOwners(Array.isArray(response.data) ? response.data : []);
        } catch (e) {
            console.error("Error fetching staff:", e);
        }
    }, []);

    // --- Main Fetch Function ---
    const fetchDashboardData = useCallback(async (currentFilters = filters) => {
        // Abort previous request if it exists
        if (abortControllerRef.current) abortControllerRef.current.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setTableLoading(true);

        try {
            const params: any = {};
            if (currentFilters.fromDate) params.from_date = currentFilters.fromDate;
            if (currentFilters.toDate) params.to_date = currentFilters.toDate;
            if (currentFilters.owner) params.owner = currentFilters.owner;
            if (currentFilters.profileId) params.profile_id = currentFilters.profileId;
            if (currentFilters.countFilter) params.countFilter = currentFilters.countFilter;
            if (currentFilters.hidden) params.hidden = currentFilters.hidden;
            if (currentFilters.pending) params.pending = currentFilters.pending;

            const response = await apiAxios.get('api/delete-report/', {
                params,
                signal: controller.signal
            });

            if (response.data.status) {
                setApiData(response.data);
                setOriginalTableData(response.data.data || []);
                setFilteredTableData(response.data.data || []);
            }
        } catch (error: any) {
            if (error.name !== 'CanceledError') {
                console.error("Fetch Error:", error);
            }
        } finally {
            if (abortControllerRef.current === controller) {
                setLoading(false);
                setTableLoading(false);
                setApplyFilters(false);
            }
        }
    }, [filters]);

    const handleDownloadReport = async () => {
        setIsDownloading(true);
        try {
            const params = new URLSearchParams();
            if (filters.fromDate) params.append('from_date', filters.fromDate);
            if (filters.toDate) params.append('to_date', filters.toDate);
            if (filters.profileId) params.append('profile_id', filters.profileId);
            if (filters.countFilter) params.append('countFilter', filters.countFilter);
            if (filters.hidden) params.append('hidden', filters.hidden);
            if (filters.pending) params.append('pending', filters.pending);

            // const ownerId = (RoleID === "7") ? filters.owner : (SuperAdminID || "");
            // if (ownerId) params.append("owner", ownerId);
            if (filters.owner) params.append("owner", filters.owner);

            // 🔑 IMPORTANT: Add export flag
            params.append('export', 'excel');

            const response = await apiAxios.get('api/delete-report/', {
                params: Object.fromEntries(params.entries()),
                responseType: 'blob', // 👈 Required for file downloads
            });

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute(
                'download',
                `Delete_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
            );

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Excel download failed:", error);
            alert("Failed to download report.");
        } finally {
            setIsDownloading(false);
        }
    };
    // 1. Initial Load
    useEffect(() => {
        // if (RoleID === "7")
        fetchProfileOwners();
        fetchDashboardData();
    }, []);

    // 2. Client-side Search Logic
    useEffect(() => {
        if (!filters.searchQuery) {
            setFilteredTableData(originalTableData);
            return;
        }
        const search = filters.searchQuery.toLowerCase();
        const filtered = originalTableData.filter(item =>
            item.ProfileId?.toString().toLowerCase().includes(search) ||
            item.Profile_name?.toLowerCase().includes(search)
        );
        setFilteredTableData(filtered);
    }, [filters.searchQuery, originalTableData]);

    // 3. Filter Application and Scroll Logic
    useEffect(() => {
        if (applyFilters) {
            if (scrollSource === 'card' && tableRef.current) {
                tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            fetchDashboardData();
        }
    }, [applyFilters, scrollSource, fetchDashboardData]);

    // --- Handlers ---
    // const handleCardClick = (
    //     filterValue: string,
    //     isTn?: boolean,
    //     isOth?: boolean,
    //     isHidden?: boolean,
    //     isPending?: boolean
    // ) => {
    //     let finalCountFilter = filterValue;
    //     if (isTn) finalCountFilter = `${filterValue}_tn`;
    //     if (isOth) finalCountFilter = `${filterValue}_tn_oth`;

    //     const updatedFilters = {
    //         ...filters,
    //         countFilter: (filterValue === "hidden_main" || filterValue === "pending_main")
    //             ? ""
    //             : (filters.countFilter === finalCountFilter ? "" : finalCountFilter),
    //         hidden: isHidden ? "1" : "",
    //         pending: isPending ? "1" : "",
    //         searchQuery: ""
    //     };

    //     setFilters(updatedFilters);
    //     setScrollSource('card');
    //     setApplyFilters(true);
    // };
    // const handleCardClick = (
    //     filterValue: string,
    //     isTn?: boolean,
    //     isOth?: boolean,
    //     isHidden?: boolean,
    //     isPending?: boolean
    // ) => {
    //     let finalCountFilter = filterValue;
    //     if (isTn) finalCountFilter = `${filterValue}_tn`;
    //     if (isOth) finalCountFilter = `${filterValue}_tn_oth`;

    //     // Logic for Pending/Hidden: 
    //     // If it's the "Main" card (pending_main or hidden_main), we clear countFilter 
    //     // so the API doesn't get confused, and just send the flag.
    //     const isMainFlagOnly = filterValue === "hidden_main" || filterValue === "pending_main";

    //     const updatedFilters = {
    //         ...filters,
    //         // Set countFilter only if it's NOT a main flag-only click
    //         countFilter: isMainFlagOnly ? "" : finalCountFilter,
    //         // Set the binary flags
    //         hidden: isHidden ? "1" : "",
    //         pending: isPending ? "1" : "",
    //         searchQuery: ""
    //     };

    //     setFilters(updatedFilters);
    //     setScrollSource('card');
    //     setApplyFilters(true);
    // };


    const handleCardClick = (
        filterValue: string,
        isTn?: boolean,
        isOth?: boolean,
        isHidden?: boolean,
        isPending?: boolean
    ) => {
        let finalCountFilter = filterValue;
        if (isTn) finalCountFilter = `${filterValue}_tn`;
        if (isOth) finalCountFilter = `${filterValue}_tn_oth`;

        // 1. Determine if this is a "Main" click (Flag only) 
        // or a "Current Month" click (Flag + Filter)
        const isMainFlag = filterValue === "hidden_main" || filterValue === "pending_main";

        const updatedFilters = {
            ...filters,
            // If Main, clear countFilter. If Current Month, set it.
            countFilter: isMainFlag ? "" : finalCountFilter,
            // Always set the flags if they are passed as true
            hidden: isHidden ? "1" : "",
            pending: isPending ? "1" : "",
            searchQuery: ""
        };

        setFilters(updatedFilters);
        setScrollSource('card');
        setApplyFilters(true);
    };

    const handleApplyFilters = () => {
        setLoading(true); // Show full spinner on filter click as per requirement
        setScrollSource('filter');
        setApplyFilters(true);
    };

    const resetFilters = () => {
        const defaultFilters = {
            fromDate: '',
            toDate: '',
            // owner: RoleID === "7" ? "" : (SuperAdminID || ""),
            owner: "",
            profileId: '',
            countFilter: '',
            hidden: '',
            pending: '',
            searchQuery: ""
        };
        setFilters(defaultFilters);
        setLoading(true);
        fetchDashboardData(defaultFilters);
    };

    // --- Components ---
    const KPICard = ({ label, value, colorClass, kpiKey, subTn, subNonTn, isHidden, isPending }: any) => {
        const isActive = filters.countFilter === kpiKey ||
            filters.countFilter === `${kpiKey}_tn` ||
            filters.countFilter === `${kpiKey}_tn_oth`;

        return (
            <motion.div
                whileHover={{ y: -3 }}
                onClick={() => handleCardClick(kpiKey, false, false, isHidden, isPending)}
                className={`${colorClass} p-5 rounded-2xl min-h-[120px] border transition-all shadow-sm flex flex-col justify-center cursor-pointer 
            ${isActive ? 'border-4 border-black/30 shadow-md scale-[1.02]' : 'border-[#E3E6EE]'}`}
            >
                <h6 className="text-[10px] font-bold mb-1 tracking-wider uppercase opacity-80 text-start">{label}</h6>
                <div className="flex items-baseline gap-2">
                    <h2 className="text-3xl text-start font-bold">{value}</h2>
                    {subTn !== undefined && (
                        <div className="flex text-sm font-bold text-gray-500 items-center gap-1">
                            <span className="mx-1">-</span>
                            <span
                                className={`hover:text-black transition-all px-1 ${filters.countFilter === `${kpiKey}_tn` ? 'text-black underline underline-offset-4' : ''}`}
                                onClick={(e) => { e.stopPropagation(); handleCardClick(kpiKey, true, false); }}
                            >
                                {subTn}
                            </span>
                            <span className="opacity-40">/</span>
                            <span
                                className={`hover:text-black transition-all px-1 ${filters.countFilter === `${kpiKey}_tn_oth` ? 'text-black underline underline-offset-4' : ''}`}
                                onClick={(e) => { e.stopPropagation(); handleCardClick(kpiKey, false, true); }}
                            >
                                {subNonTn}
                            </span>
                        </div>
                    )}
                </div>
                <p className="text-[9px] opacity-60 text-start mt-1">click to view profiles</p>
            </motion.div>
        );
    };

    const KPICards = ({ label, value, colorClass, kpiKey, onClick }: any) => {
        // Determine if card is active based on either countFilter OR flags
        const isActive = filters.countFilter === kpiKey ||
            (kpiKey === "hidden_current_month" && filters.hidden === "1") ||
            (kpiKey === "pending_current_month" && filters.pending === "1");

        return (
            <motion.div
                whileHover={{ y: -3 }}
                onClick={onClick} // This handles the "Main Card" click
                className={`${colorClass} p-5 rounded-2xl min-h-[120px] border transition-all shadow-sm flex flex-col justify-center cursor-pointer 
            ${isActive ? 'border-4 border-black/30 shadow-md scale-[1.02]' : 'border-[#E3E6EE]'}`}
            >
                <h6 className="text-[10px] font-bold mb-1 tracking-wider uppercase opacity-80 text-start">{label}</h6>
                <div className="flex items-baseline gap-2">
                    <div className="text-3xl text-start font-bold">{value}</div>
                </div>
                <p className="text-[9px] opacity-60 text-start mt-1">click to view profiles</p>
            </motion.div>
        );
    };

    const FullWidthLoadingSpinner = () => (
        <Box
            className="container-fluid mx-auto px-4 sm:px-6 lg:px-8"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                py: 12, // Increased padding for visibility
                width: '100%',
                backgroundColor: '#fff', // White background
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
                mb: 4, // margin bottom to separate from the table
            }}
        >
            <CircularProgress color="primary" size={40} />
            <Typography variant="h6" sx={{ mt: 3, color: '#0A1735', fontWeight: 600 }}>
                Loading...
            </Typography>
        </Box>
    );

    const LoadingSpinner = () => (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                py: 8,
                minHeight: '200px',
                width: '100%',
            }}
        >
            <CircularProgress color="primary" size={30} />
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                Loading Dashboard Data...
            </Typography>
        </Box>
    );

    if (loading && !apiData) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-[#F5F7FB] font-inter text-black p-4 md:p-8">
            <header className="flex flex-wrap justify-between items-start mb-6 gap-4">
                <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1">Delete Dashboard</h2>
                </div>
                <div className="flex gap-3">
                    <button
                        className={`${BTN_DARK} flex items-center gap-2`}
                        onClick={handleDownloadReport}
                        disabled={isDownloading}
                    >
                        {isDownloading ? (
                            <>
                                <CircularProgress size={16} color="inherit" />
                                <span>Downloading...</span>
                            </>
                        ) : (
                            "Download Report"
                        )}
                    </button>
                </div>
            </header>

            {/* --- Filters --- */}
            <section className={DASHBOARD_CONTAINER}>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">From Date</label>
                        <input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">To Date</label>
                        <input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    {/* {RoleID === "7" && ( */}
                    <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Owner</label>
                        <select value={filters.owner} onChange={(e) => setFilters({ ...filters, owner: e.target.value })} className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm bg-white">
                            <option value="">Select Owner</option>
                            {profileOwners.map(o => <option key={o.id} value={o.id}>{o.username}</option>)}
                        </select>
                    </div>
                    {/* )} */}
                    <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Profile ID</label>
                        <input type="text" value={filters.profileId} onChange={(e) => setFilters({ ...filters, profileId: e.target.value })} className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm" />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={resetFilters} className={BTN_OUTLINE}>Reset</button>
                    <button onClick={handleApplyFilters} className={BTN_DARK}>Apply Filters</button>
                </div>
            </section>

            {/* {loading && !apiData ? ( */}
            {loading ? (
                <FullWidthLoadingSpinner />
            ) : (
                <>
                    <div className="space-y-6">
                        <div className={DASHBOARD_CONTAINER}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <KPICard label="Total Delete" value={apiData?.overall_count || 0} colorClass="bg-slate-50" kpiKey="" />
                                <KPICard
                                    label="TN / Others"
                                    value={
                                        <div className="flex gap-2">
                                            <span
                                                className={` cursor-pointer hover:underline ${filters.countFilter === 'tn' ? 'text-black underline' : ''}`}
                                                onClick={(e) => { e.stopPropagation(); handleCardClick('tn'); }}
                                            >
                                                {apiData?.state_counts?.tn || 0}
                                            </span>
                                            <span className="opacity-30">/</span>
                                            <span
                                                className={` cursor-pointer hover:underline ${filters.countFilter === 'non_tn' ? 'text-black underline' : ''}`}
                                                onClick={(e) => { e.stopPropagation(); handleCardClick('non_tn'); }}
                                            >
                                                {apiData?.state_counts?.non_tn || 0}
                                            </span>
                                        </div>
                                    }
                                    colorClass="bg-red-50"
                                    kpiKey="tn_group"
                                />
                                <KPICard label="Premium - TN/OTH" value={apiData?.plan_counts?.premium?.total || 0} subTn={apiData?.plan_counts?.premium?.tn} subNonTn={apiData?.plan_counts?.premium?.non_tn} colorClass="bg-emerald-50" kpiKey="premium" />
                                <KPICard label="Free - TN/OTH" value={apiData?.plan_counts?.free?.total || 0} subTn={apiData?.plan_counts?.free?.tn} subNonTn={apiData?.plan_counts?.free?.non_tn} colorClass="bg-sky-50" kpiKey="free" />
                                <KPICard label="Offer - TN/OTH" value={apiData?.plan_counts?.offer?.total || 0} subTn={apiData?.plan_counts?.offer?.tn} subNonTn={apiData?.plan_counts?.offer?.non_tn} colorClass="bg-pink-50" kpiKey="offer" />
                                <KPICard label="Prospect - TN/OTH" value={apiData?.plan_counts?.prospect?.total || 0} subTn={apiData?.plan_counts?.prospect?.tn} subNonTn={apiData?.plan_counts?.prospect?.non_tn} colorClass="bg-rose-50" kpiKey="propect" />
                                <KPICard label="Current Month Delete" value={apiData?.current_month_deletions || 0} colorClass="bg-orange-50" kpiKey="current_month_deletions" />
                                <KPICard label="Duplicate" value={apiData?.status_counts?.duplicate || 0} colorClass="bg-indigo-50" kpiKey="duplicate" />
                                <KPICard label="Fake" value={apiData?.status_counts?.fake || 0} colorClass="bg-rose-50" kpiKey="fake" />
                                <KPICard label="Got married - Marriage settled" value={apiData?.status_counts?.marriage || 0} colorClass="bg-teal-50" kpiKey="marriage" />
                                <KPICard label="Others" value={apiData?.status_counts?.others || 0} colorClass="bg-indigo-50" kpiKey="others" />
                                <KPICards
                                    label="Hidden / Current Month Hidden"
                                    colorClass="bg-purple-50"
                                    kpiKey="hidden_current_month"
                                    onClick={() => handleCardClick("hidden_main", false, false, true, false)}
                                    value={
                                        <div className="flex gap-1">
                                            {/* Total Hidden Span */}
                                            <span
                                                className={`hover:underline ${filters.hidden === "1" && !filters.countFilter ? 'underline decoration-2 underline-offset-4 font-black' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCardClick("hidden_main", false, false, true, false);
                                                }}
                                            >
                                                {apiData?.other_status_counts?.hidden || 0}
                                            </span>

                                            <span className="opacity-30">/</span>

                                            {/* Current Month Hidden Span */}
                                            <span
                                                className={`hover:underline ${filters.countFilter === "hidden_current_month" ? 'underline decoration-2 underline-offset-4 font-black' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCardClick("hidden_current_month", false, false, true, false);
                                                }}
                                            >
                                                {apiData?.other_status_counts?.hidden_current_month || 0}
                                            </span>
                                        </div>
                                    }
                                />

                                <KPICards
                                    label="Pending / Current Month Pending"
                                    colorClass="bg-teal-50"
                                    kpiKey="pending_current_month"
                                    onClick={() => handleCardClick("pending_main", false, false, false, true)}
                                    value={
                                        <div className="flex gap-1">
                                            {/* Total Pending Span */}
                                            <span
                                                className={`hover:underline ${filters.pending === "1" && !filters.countFilter ? 'underline decoration-2 underline-offset-4 font-black' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCardClick("pending_main", false, false, false, true);
                                                }}
                                            >
                                                {apiData?.other_status_counts?.pending || 0}
                                            </span>

                                            <span className="opacity-30">/</span>

                                            {/* Current Month Pending Span */}
                                            <span
                                                className={`hover:underline ${filters.countFilter === "pending_current_month" ? 'underline decoration-2 underline-offset-4 font-black' : ''}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCardClick("pending_current_month", false, false, false, true);
                                                }}
                                            >
                                                {apiData?.other_status_counts?.pending_current_month || 0}
                                            </span>
                                        </div>
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Table Section --- */}
                    <section ref={tableRef} className="bg-white rounded-xl border border-[#e6ecf2] shadow-md p-6 mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h5 className="text-lg font-semibold text-[#0A1735]">📋 List View ({filteredTableData.length})</h5>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search Profile ID / Name"
                                    value={filters.searchQuery}
                                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                                    className="w-[250px] h-10 px-4 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-gray-500 transition"
                                />
                                <button
                                    onClick={() => setFilters({ ...filters, searchQuery: "" })}
                                    className="h-10 px-4 rounded-full bg-white border border-gray-300 text-sm font-semibold hover:bg-gray-50 transition"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                            <table className="min-w-full border-separate border-spacing-0 table-auto">
                                <thead className="sticky top-0 z-20 bg-gray-50">
                                    <tr>
                                        {["Profile ID", "Name", "City", "State", "Mode", "Delete Date", "Creation Date", "Owner"].map((col, idx) => (
                                            <th key={col} className={`sticky px-3 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] whitespace-nowrap ${idx === 0 ? 'rounded-tl-xl' : ''}`}>
                                                {col}
                                            </th>
                                        ))}
                                        <th className="sticky px-3 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] whitespace-nowrap">
                                            {filters.hidden === "1"
                                                ? "Secondary Hidden Status"
                                                : filters.pending === "1"
                                                    ? "Secondary Pending Status"
                                                    : "Secondary Delete Status"}
                                        </th>
                                        <th className="sticky px-3 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] whitespace-nowrap">
                                            {filters.hidden === "1"
                                                ? "Secondary Hidden Status Comments"
                                                : filters.pending === "1"
                                                    ? "Secondary Pending Status Comments"
                                                    : "Secondary Delete Status Comments"}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableLoading ? (
                                        <tr>
                                            <td colSpan={9} className="py-20 text-center">
                                                <CircularProgress size={30} />
                                                <p className="mt-2 text-sm text-gray-500">Loading Profiles...</p>
                                            </td>
                                        </tr>
                                    ) : filteredTableData.length > 0 ? (
                                        filteredTableData.map((item: any) => (
                                            <tr key={item.ProfileId} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 py-3 text-sm font-bold text-blue-600 border border-[#e5ebf1]">
                                                    <a href={`/viewProfile?profileId=${item.ProfileId}`} target="_blank" rel="noreferrer" className="hover:underline">
                                                        {item.ProfileId}
                                                    </a>
                                                </td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] font-medium">{item.Profile_name || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{item.Profile_city || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{item.state || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{item.plan_name || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">
                                                    {item.dh_date_time ? new Date(item.dh_date_time.replace("T", " ")).toLocaleDateString('en-CA') : "N/A"}
                                                </td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">
                                                    {item.DateOfJoin ? new Date(item.DateOfJoin.replace("T", " ")).toLocaleDateString('en-CA') : "N/A"}
                                                </td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{item.owner_name || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{item.sub_status_name || 'N/A'}</td>
                                                {/* <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{item.delete_others || 'N/A'}</td> */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] italic text-gray-700">
                                                    {filters.hidden === "1"
                                                        ? (item.hide_others || 'N/A')
                                                        : filters.pending === "1"
                                                            ? (item.pending_others || 'N/A')
                                                            : (item.delete_others || 'N/A')}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={9} className="text-center py-10 font-semibold text-gray-400">No records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
};

export default DeleteDashboard;
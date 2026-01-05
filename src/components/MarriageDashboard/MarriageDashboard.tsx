import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { apiAxios } from '../../api/apiUrl'; // Ensure this path is correct
import '../../index.css';
import { MdToggleOff, MdToggleOn } from 'react-icons/md';

// --- Styles & Constants ---
const DASHBOARD_CONTAINER = "bg-white rounded-xl border border-[#E3E6EE] p-7 shadow-sm mb-8";
const HEADER_TEXT = "text-base font-semibold text-[#0A1735] mb-4 flex items-center gap-2";
const BTN_DARK = "bg-[#0A1735] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#1f2d50] transition shadow-sm border-none cursor-pointer";
const BTN_OUTLINE = "bg-white border border-gray-300 text-[#0A1735] px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-50 transition shadow-sm cursor-pointer";

interface ProfileOwner {
    id: string;
    username: string;
}

interface MarriageProfile {
    ProfileId: string | number;
    dh_date_time?: string;
    Profile_name?: string;
    age?: number;
    plan_name?: string;
    state?: string;
    Profile_city?: string;
    owner_name?: string;
    marriagedate?: string;
    engagementdate?: string;
    groombridevysysaid?: string;
    settledthru?: string;
    marriagephotodetails?: string;
    engagementphotodetails?: string;
    marriageinvitationdetails?: string;
    last_call_date?: string;
    last_call_comments?: string;
    next_call_date?: string;
}

const MarriageDashboard: React.FC = () => {
    // --- State Management ---
    const [loading, setLoading] = useState(false);
    const [tableLoading, setTableLoading] = useState(false);
    const [profileOwners, setProfileOwners] = useState<ProfileOwner[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [scrollSource, setScrollSource] = useState<'card' | 'filter' | null>(null);
    const [applyFilters, setApplyFilters] = useState(false);
    const [originalTableData, setOriginalTableData] = useState<MarriageProfile[]>([]);
    const RoleID = localStorage.getItem('role_id') || sessionStorage.getItem('role_id');
    const SuperAdminID = localStorage.getItem('id') || sessionStorage.getItem('id');
    const tableRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const [filters, setFilters] = useState({
        particulars: "",
        fromDate: "",
        toDate: "",
        owner: SuperAdminID || "",
        profileId: "",
        searchQuery: "",
        countFilter: "",
        genderFilter: "",
        order_by: "asc",
    });

    const [triggerFetch, setTriggerFetch] = useState(true);

    // --- Fetch Staff/Owners ---
    const fetchProfileOwners = useCallback(async () => {
        try {
            const response = await apiAxios.get('api/users/');
            setProfileOwners(Array.isArray(response.data) ? response.data : []);
        } catch (e) {
            console.error("Error fetching staff:", e);
        }
    }, []);

    // --- Fetch Main Dashboard Data ---
    const fetchDashboardData = useCallback(async (currentFilters = filters) => {
        // 1. Abort existing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // 2. Create new controller
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // 3. FORCE LOADING STATES IMMEDIATELY
        setTableLoading(true);
        setTableData([]); // Clear previous records to prevent "ghosting"

        const params = new URLSearchParams();
        if (currentFilters.particulars) params.append('particular_id', currentFilters.particulars);
        if (currentFilters.fromDate) params.append('from_date', currentFilters.fromDate);
        if (currentFilters.toDate) params.append('to_date', currentFilters.toDate);
        if (currentFilters.profileId) params.append('profile_id', currentFilters.profileId);
        if (currentFilters.countFilter) params.append('countFilter', currentFilters.countFilter);
        if (currentFilters.genderFilter) params.append('genderFilter', currentFilters.genderFilter);
        if (currentFilters.order_by) params.append('order_by', currentFilters.order_by);

        const ownerId = (RoleID === "7") ? currentFilters.owner : (SuperAdminID || "");
        if (ownerId) params.append("owner", ownerId);

        try {
            const response = await apiAxios.get('api/marriage-report/', {
                params: Object.fromEntries(params.entries()),
                signal: controller.signal
            });
            if (response.data.status) {
                setOriginalTableData(response.data.data);
                setTableData(response.data.data);
                setStats(response.data);
            }
        } catch (e: any) {
            // If aborted, we exit quietly because the NEXT call has already set its own loading state
            if (e.name === 'CanceledError' || e.name === 'AbortError' || e.code === "ERR_CANCELED") {
                return;
            }
            console.error("Fetch error:", e);
        } finally {
            if (abortControllerRef.current === controller) {
                setTableLoading(false);
                setLoading(false);
                setApplyFilters(false);
            }
        }
    }, [filters, RoleID, SuperAdminID]);

    const handleDownloadReport = async () => {
        setIsDownloading(true);

        try {
            const params = new URLSearchParams();

            // Same params as fetchDashboardData
            if (filters.fromDate) params.append('from_date', filters.fromDate);
            if (filters.toDate) params.append('to_date', filters.toDate);
            if (filters.countFilter) params.append('countFilter', filters.countFilter);

            if (filters.genderFilter) params.append('genderFilter', filters.genderFilter);
            if (filters.order_by) params.append('order_by', filters.order_by);

            const ownerId = (RoleID === "7") ? filters.owner : (SuperAdminID || "");
            if (ownerId) params.append("owner", ownerId);

            // 🔑 IMPORTANT: export flag
            params.append('export', 'excel');

            const response = await apiAxios.get('api/marriage-report/', {
                params: Object.fromEntries(params.entries()),
                responseType: 'blob',
            });

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute(
                'download',
                `Marriage_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
            );

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error("Prospect Excel download failed:", error);
            alert("Failed to download the report. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    useEffect(() => {
        if (applyFilters) {
            if (scrollSource === 'card' && tableRef.current) {
                tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            // This will now use the latest state if triggered by "Apply Filters" button
            fetchDashboardData();
        }
    }, [applyFilters, scrollSource, fetchDashboardData]);

    // 3. Initial Load

    useEffect(() => {
        setLoading(true);       // This triggers the FullWidthLoadingSpinner
        setTableLoading(true);
        fetchDashboardData();
    }, []);


    const handleCardClick = (key: string) => {
        setTableLoading(true);

        // If key is empty string (Total Profiles), we want to set countFilter to ""
        // Otherwise, use the key provided. 
        // We toggle it off (reset to "") if the user clicks the already active filter.
        const newFilterValue = filters.countFilter === key ? "" : key;

        const updatedFilters = {
            ...filters,
            countFilter: newFilterValue,
            searchQuery: "",
            genderFilter: "",
            order_by: "desc", // Keep your default sort
        };

        setFilters(updatedFilters);

        if (tableRef.current) {
            tableRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // Trigger fetch with the explicit updated object
        fetchDashboardData(updatedFilters);
    };

    const handleReset = () => {
        // Show loading on both sections
        setLoading(true);
        setTableLoading(true);

        setFilters({
            particulars: "",
            fromDate: "",
            toDate: "",
            profileId: "",
            owner: RoleID === "7" ? "" : (SuperAdminID || ""),
            searchQuery: "",
            countFilter: "",
            genderFilter: "",
            order_by: "desc",
        });

        setScrollSource('filter');
        setApplyFilters(true);
    };

    const handleApplyFilters = () => {
        setLoading(true);
        setTableLoading(true);
        setScrollSource('filter');
        setApplyFilters(true);
    };


    useEffect(() => {
        if (applyFilters) {
            // If it was a card click, scroll first, then fetch
            if (scrollSource === 'card' && tableRef.current) {
                tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Small delay to let the scroll animation start before the heavy API call
                setTimeout(() => {
                    fetchDashboardData();
                }, 100);
            } else {
                // Filter/Reset click: just fetch
                fetchDashboardData();
            }
        }
    }, [applyFilters, scrollSource, fetchDashboardData]);

    useEffect(() => {
        if (tableLoading) return; // Don't filter while the API is fetching new data

        if (!filters.searchQuery || filters.searchQuery.trim() === '') {
            setTableData(originalTableData);
            return;
        }

        const searchTerm = filters.searchQuery.toLowerCase().trim();
        const filtered = originalTableData.filter((profile) => {
            const profileId = (profile.ProfileId || '').toString().toLowerCase();
            const profileName = (profile.Profile_name || '').toString().toLowerCase();
            return profileId.includes(searchTerm) || profileName.includes(searchTerm);
        });

        setTableData(filtered);
    }, [filters.searchQuery, originalTableData, tableLoading]);

    useEffect(() => {
        if (RoleID === "7") {
            fetchProfileOwners();
        }
    }, [RoleID, fetchProfileOwners]);

    // --- Helper for Mapping KPI Data ---
    const getVal = (path: string, defaultValue: any = 0) => {
        return path.split('.').reduce((o, i) => (o ? o[i] : defaultValue), stats);
    };

    const KPICard = ({ label, value, colorClass, kpiKey, subTn, subNonTn }: any) => {
        // 1. Determine active states
        const isTnActive = filters.countFilter === `${kpiKey}_tn`;
        const isOthActive = filters.countFilter === `${kpiKey}_tn_oth`;

        // 2. Main highlight logic: 
        // Card is highlighted if the exact kpiKey is active OR one of its sub-counts is active
        const isAnyActiveInCard = filters.countFilter === kpiKey || isTnActive || isOthActive;

        return (
            <motion.div
                whileHover={{ y: -3 }}
                // We pass the kpiKey (which is "" for Total Profiles)
                onClick={() => handleCardClick(kpiKey)}
                className={`${colorClass} p-5 rounded-2xl min-h-[120px] border transition-all shadow-sm flex flex-col justify-center cursor-pointer 
            ${isAnyActiveInCard ? 'border-4 border-black/30 shadow-md scale-[1.02]' : 'border-[#E3E6EE]'}`}
            >
                <h6 className="text-[10px] font-bold mb-1 tracking-wider uppercase opacity-80 text-start">{label}</h6>
                <div className="flex items-baseline gap-2">
                    {/* 3. Removed underline from h2 as requested */}
                    <h2 className={`text-3xl text-start font-bold`}>
                        {value}
                    </h2>

                    {subTn !== undefined && (
                        <div className="flex text-sm font-bold text-gray-500 items-center gap-1">
                            <span className="mx-1">-</span>
                            <span
                                onClick={(e) => {
                                    e.stopPropagation(); // Don't trigger the main card click
                                    handleCardClick(`${kpiKey}_tn`);
                                }}
                                className={`hover:text-black transition-all px-1 ${isTnActive ? 'text-black underline underline-offset-4 decoration-2' : ''}`}
                            >
                                {subTn}
                            </span>
                            <span className="opacity-40">/</span>
                            <span
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick(`${kpiKey}_tn_oth`);
                                }}
                                className={`hover:text-black transition-all px-1 ${isOthActive ? 'text-black underline underline-offset-4 decoration-2' : ''}`}
                            >
                                {subNonTn}
                            </span>
                        </div>
                    )}
                </div>
                <p className="text-[9px] opacity-60 text-start mt-1">
                    {isAnyActiveInCard ? "Currently Filtering" : "Click to view profiles"}
                </p>
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


    if (loading && !stats) {
        return <LoadingSpinner />;
    }

    return (
        <div className="min-h-screen bg-[#F5F7FB] font-inter text-black p-4 md:p-8">
            {/* <header className="flex flex-wrap justify-between items-start mb-6 gap-4">
                <h2 className="text-2xl font-bold text-[#0A1735]">Marriage Dashboard</h2>
            </header> */}
            <header className="flex flex-wrap justify-between items-start mb-6 gap-4">
                <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1">Marriage Dashboard</h2>
                    {/* <p className="text-gray-500 m-0 text-base">Overview of registration profiles, engagement and staff performance.</p> */}
                </div>
                <div className="flex gap-3">
                    <button
                        className={`${BTN_DARK} flex items-center gap-2 disabled:opacity-70`}
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
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Particulars</label>
                        <select
                            value={filters.particulars}
                            onChange={(e) => setFilters({ ...filters, particulars: e.target.value })}
                            className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm bg-white outline-none"
                        >
                            <option value="">Select Particulars</option>
                            <option value="1">Delete Date</option>
                        </select>
                    </div>
                    <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">From Date</label>
                        <input type="date" value={filters.fromDate} onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">To Date</label>
                        <input type="date" value={filters.toDate} onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm" />
                    </div>
                    {RoleID === "7" && (
                        <div className="text-start">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Owner</label>
                            <select value={filters.owner} onChange={(e) => setFilters({ ...filters, owner: e.target.value })} className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm bg-white">
                                <option value="">Select Owner</option>
                                {profileOwners.map(o => <option key={o.id} value={o.id}>{o.username}</option>)}
                            </select>
                        </div>
                    )}
                    <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Profile ID</label>
                        <input type="text" value={filters.profileId} onChange={(e) => setFilters({ ...filters, profileId: e.target.value })} className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm" />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={handleReset} className={BTN_OUTLINE}>Reset</button>
                    <button onClick={handleApplyFilters} className={BTN_DARK}>Apply Filters</button>
                </div>
            </section>

            {/* --- KPI Sections --- */}
            {loading ? (
                <section className="mt-4">
                    <FullWidthLoadingSpinner />
                </section>
            ) : (
                <>
                    <div className="space-y-6">
                        {/* Section 1: Overall Summary */}
                        <div className={DASHBOARD_CONTAINER}>
                            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <KPICard label="Total" value={getVal('total_profiles')} colorClass="bg-slate-50 border border-slate-200" kpiKey="total" />
                        <KPICard label="Premium - TN/OTH" value={getVal('plan_counts.premium.total')} subTn={getVal('plan_counts.premium.tn')} subNonTn={getVal('plan_counts.premium.non-tn')} colorClass="bg-emerald-50 border border-emerald-200" kpiKey="premium" />
                        <KPICard label="Free + Offer - TN/OTH" value={getVal('plan_counts.free_offer.total')} subTn={getVal('plan_counts.free_offer.tn')} subNonTn={getVal('plan_counts.free_offer.non-tn')} colorClass="bg-sky-50 border border-sky-200 " kpiKey="free" />
                        <KPICard label="Prospect - TN/OTH" value={getVal('plan_counts.propect.total')} subTn={getVal('plan_counts.propect.tn')} subNonTn={getVal('plan_counts.propect.non-tn')} colorClass="bg-rose-50 border border-rose-200" kpiKey="prospect" />
                    </div> */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <KPICard
                                    label="Total Profiles"
                                    value={getVal('total_profiles')}
                                    colorClass="bg-slate-50"
                                    kpiKey=""
                                />
                                <KPICard
                                    label="Premium - TN/OTH"
                                    value={getVal('plan_counts.premium.total')}
                                    subTn={getVal('plan_counts.premium.tn')}
                                    subNonTn={getVal('plan_counts.premium.non-tn')}
                                    colorClass="bg-emerald-50"
                                    kpiKey="premium"
                                />
                                <KPICard
                                    label="Free + Offer - TN/OTH"
                                    value={getVal('plan_counts.free_offer.total')}
                                    subTn={getVal('plan_counts.free_offer.tn')}
                                    subNonTn={getVal('plan_counts.free_offer.non-tn')}
                                    colorClass="bg-sky-50"
                                    kpiKey="free"
                                />
                                <KPICard
                                    label="Prospect - TN/OTH"
                                    value={getVal('plan_counts.propect.total')}
                                    subTn={getVal('plan_counts.propect.tn')}
                                    subNonTn={getVal('plan_counts.propect.non-tn')}
                                    colorClass="bg-rose-50"
                                    kpiKey="propect"
                                />
                            </div>

                            {/* ... Work Stats ... */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-6">
                                <KPICard label="Today’s Work" value={getVal('work_counts.today_work')} colorClass="bg-green-50" kpiKey="today_work" />
                                <KPICard label="Pending Work" value={getVal('work_counts.pending_work')} colorClass="bg-orange-50" kpiKey="pending_work" />
                                <KPICard label="Today’s Action" value={getVal('task_counts.today_task')} colorClass="bg-indigo-50" kpiKey="today_task" />
                                <KPICard label="Pending Action" value={getVal('task_counts.pending_task')} colorClass="bg-rose-50" kpiKey="pending_task" />
                                <KPICard label="Assigned Work" value={getVal('assigned_to_me')} colorClass="bg-teal-50" kpiKey="assigned_to_me" />
                            </div>
                        </div>
                        {/* <div className={DASHBOARD_CONTAINER}>
                    <h3 className={HEADER_TEXT}> Premium - Settlement Type</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <KPICard label="Thru Vysyamala" value="12" colorClass="bg-[#F0FDF4]" />
                        <KPICard label="Others" value="6" colorClass="bg-[#F0FDF4]" />
                        <KPICard label="Both IDS" value="8" colorClass="bg-[#F0FDF4]" />
                        <KPICard label="Single ID" value="5" colorClass="bg-[#F0FDF4]" />
                    </div>
                </div> */}

                        {/* 📝 REGISTRATION DASHBOARD */}
                        {/* <div className={DASHBOARD_CONTAINER}>
                    <h3 className={HEADER_TEXT}>Total - FOP(Free + Offer + Prospect)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <KPICard label="Thru Vysyamala" value="12" colorClass="bg-[#F1F7FF]" />
                        <KPICard label="Others" value="6" colorClass="bg-[#F1F7FF]" />
                        <KPICard label="Both IDS" value="8" colorClass="bg-[#F1F7FF]" />
                        <KPICard label="Single ID" value="5" colorClass="bg-[#F1F7FF]" />
                    </div>
                </div> */}

                        {/* <div className={DASHBOARD_CONTAINER}>
                    <h3 className={HEADER_TEXT}>Status</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <KPICard label="Upcoming Marriage" value="14" colorClass="bg-orange-50" />
                        <KPICard label="Present Month Marriage" value="9" colorClass="bg-orange-50" />
                    </div>
                </div> */}

                        {/* <div className={DASHBOARD_CONTAINER}>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

                        <KPICard
                            label="M.Date Not Entered"
                            value="5"
                            colorClass="bg-purple-50 border-purple-200"
                        />

                        <KPICard
                            label="E.Date Not Entered"
                            value="2"
                            colorClass="bg-red-50 border-red-200"
                        />

                        <KPICard
                            label="M.Photo / E.Photo Not Received"
                            value="4"
                            colorClass="bg-[#F5F3FF]"
                        />

                        <KPICard
                            label="Card Accepted / Rejected"
                            value="1"
                            colorClass="bg-blue-50 border-blue-200"
                        />

                        <KPICard
                            label="Instagram Interested"
                            value="3"
                            colorClass="bg-pink-50 border-pink-200"
                        />

                        <KPICard
                            label="Today’s Work"
                            value={getVal('work_counts.today_work')}
                            colorClass="bg-green-50 border-green-200"
                        />

                        <KPICard
                            label="Pending Work"
                            value={getVal('work_counts.pending_work')}
                            colorClass="bg-orange-50 border-orange-200"
                        />

                        <KPICard
                            label="Today’s Action"
                            value={getVal('task_counts.today_task')}
                            colorClass="bg-indigo-50 border-indigo-200"
                        />

                        <KPICard
                            label="Pending Action"
                            value={getVal('task_counts.pending_task')}
                            colorClass="bg-rose-50 border-rose-200"
                        />

                        <KPICard
                            label="Assigned Work"
                            value={getVal('assigned_to_me')}
                            colorClass="bg-teal-50 border-teal-200"
                        />
                    </div>
                </div> */}
                    </div>

                    {/* --- Table Section --- */}
                    {/* 📋 TABLE SECTION */}
                    <section ref={tableRef} className="bg-white rounded-xl border border-[#e6ecf2] shadow-md p-6 mt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h5 className="text-lg font-semibold text-[#0A1735]">📋 List View ({tableData.length})</h5>
                            <div className="flex flex-wrap items-center gap-3">
                                <select
                                    className="h-10 px-4 rounded-full border border-gray-300 text-sm focus:outline-none bg-white cursor-pointer"
                                    value={filters.genderFilter}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFilters(prev => ({ ...prev, genderFilter: val }));
                                        setApplyFilters(true); // Trigger auto-reload on change
                                    }}
                                >
                                    <option value="">All</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>

                                {/* Sort Toggle (ASC/DESC) */}
                                <button
                                    onClick={() => {
                                        const nextOrder = filters.order_by === "asc" ? "desc" : "asc";
                                        const newFilters = { ...filters, order_by: nextOrder };
                                        setFilters(newFilters);
                                        fetchDashboardData(newFilters);
                                    }}
                                    className={`h-10 px-4 rounded-full border transition flex items-center gap-3 text-sm font-semibold shadow-sm ${filters.order_by === "asc"
                                        ? "bg-white border-gray-300 text-gray-700"
                                        : "bg-[#0A1735] border-[#0A1735] text-white"
                                        }`}
                                >
                                    <span>Sort Deleted Date</span>
                                    {filters.order_by === "desc" ? (
                                        <MdToggleOff size={28} className="text-gray-400" />
                                    ) : (
                                        <MdToggleOn size={28} className="text-blue-400" />
                                    )}
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search Profile ID / Name"
                                    value={filters.searchQuery}
                                    onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                                    className="w-[250px] h-10 px-4 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-gray-500 transition"
                                />
                                <button
                                    onClick={() => {
                                        setFilters({ ...filters, searchQuery: "" });
                                        setScrollSource('filter');
                                        setApplyFilters(true);  // 👈 reload table after clearing
                                    }}
                                    className="h-10 px-4 rounded-full bg-white border border-gray-300 text-sm font-semibold hover:bg-gray-50 transition">Clear</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                            <table className="min-w-full border-separate border-spacing-0 table-auto">
                                <thead className="sticky top-0 z-20">
                                    <tr className="bg-gray-50">
                                        {[
                                            "Profile ID", "Deleted Date", "Name", "Age", "Mode", "State", "City", "Owner",
                                            "Marriage Date", "Engagement Date", "Groom/Bride ID",
                                            // "Groom/Bride Name",
                                            // "Groom/Bride City",
                                            //  "Groom/Bride Father Name", 
                                            "Marriage Settled Thru",
                                            "Marriage Photo", "Engagement Photo", "Marriage Invitation",
                                            // "Marriage Location",
                                            // "Marriage Comments", 
                                            // "Admin Marriage Comments", 
                                            "LCD (Last Call Date)",
                                            "Last Call Comments", "NCD (Next Call Date)"
                                        ].map((col, index) => (
                                            <th
                                                key={col}
                                                className={`sticky px-3 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0 whitespace-nowrap 
                                ${index === 0 ? 'rounded-tl-xl' : ''}`}
                                            >
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableLoading ? (
                                        <tr>
                                            <td colSpan={24} className="py-20 text-center">
                                                <CircularProgress size={30} />
                                                <p className="mt-2 text-sm text-gray-500">Loading Marriage Profiles...</p>
                                            </td>
                                        </tr>
                                    ) : tableData.length > 0 ? (
                                        tableData.map((row) => (
                                            <tr key={row.ProfileId} className="hover:bg-gray-50 transition-colors">
                                                {/* Profile ID */}
                                                <th className="px-3 py-3 text-sm font-bold text-blue-600 border border-[#e5ebf1] whitespace-nowrap left-0 bg-white z-10 group-hover:bg-gray-50">
                                                    <a href={`/viewProfile?profileId=${row.ProfileId}`} target="_blank" rel="noreferrer" className="hover:underline">
                                                        {row.ProfileId}
                                                    </a>
                                                </th>
                                                {/* Deleted Date (dh_date_time) */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">
                                                    {row.dh_date_time ? new Date(row.dh_date_time.replace("T", " ")).toLocaleDateString('en-CA') : 'N/A'}
                                                </td>
                                                {/* Name */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap font-medium">{row.Profile_name}</td>
                                                {/* Age */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap text-center">{row.age}</td>
                                                {/* Mode (Plan Name) */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.plan_name || 'N/A'}</td>
                                                {/* State */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.state || 'N/A'}</td>
                                                {/* City */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.Profile_city || 'N/A'}</td>
                                                {/* Owner */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.owner_name || 'N/A'}</td>
                                                {/* Marriage Date */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.marriagedate || 'N/A'}</td>
                                                {/* Engagement Date */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.engagementdate || 'N/A'}</td>
                                                {/* Groom/Bride ID */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap font-mono">{row.groombridevysysaid || 'N/A'}</td>
                                                {/* Groom/Bride Name */}
                                                {/* <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">N/A</td> */}
                                                {/* Groom/Bride City */}
                                                {/* <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">N/A</td> */}
                                                {/* Groom/Bride Father Name */}
                                                {/* <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">N/A</td> */}
                                                {/* Marriage Settled Thru */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.settledthru || 'N/A'}</td>
                                                {/* Marriage Photo */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] text-center">{row.marriagephotodetails || 'N/A'}</td>
                                                {/* Engagement Photo */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] text-center">{row.engagementphotodetails || 'N/A'}</td>
                                                {/* Marriage Invitation */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] text-center">{row.marriageinvitationdetails || 'N/A'}</td>
                                                {/* Marriage Location */}
                                                {/* <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">N/A</td> */}
                                                {/* Marriage Comments */}
                                                {/* <td className="px-3 py-3 text-sm border border-[#e5ebf1] min-w-[200px] italic text-gray-500">N/A</td> */}
                                                {/* Admin Marriage Comments */}
                                                {/* <td className="px-3 py-3 text-sm border border-[#e5ebf1] min-w-[200px]">N/A</td> */}
                                                {/* LCD (Last Call Date) */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">
                                                    {row.last_call_date ? new Date(row.last_call_date).toLocaleDateString('en-CA') : 'N/A'}
                                                </td>
                                                {/* Last Call Comments */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] min-w-[200px]">{row.last_call_comments || 'N/A'}</td>
                                                {/* NCD (Next Call Date) */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">
                                                    {row.next_call_date ? new Date(row.next_call_date).toLocaleDateString('en-CA') : 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={24} className="text-center py-10 font-semibold text-gray-400">
                                                No matching records found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
        </div >
    );
};

export default MarriageDashboard;
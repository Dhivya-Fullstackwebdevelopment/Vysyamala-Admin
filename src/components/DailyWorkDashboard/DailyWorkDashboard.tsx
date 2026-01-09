import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Box,
    CircularProgress,
    Typography,
    Divider
} from '@mui/material';
import { motion } from 'framer-motion';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { ProfileOwner } from '../RegistrationDashboard/RegistrationDashboard';
import { apiAxios } from '../../api/apiUrl';
import '../../index.css';

// --- Styles & Constants ---
const DASHBOARD_CONTAINER = "bg-white rounded-xl border border-[#E3E6EE] p-7 shadow-sm mb-8";
const HEADER_TEXT = "text-base font-semibold text-[#0A1735] mb-4 flex items-center gap-2";
const BTN_DARK = "bg-[#0A1735] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#1f2d50] transition shadow-sm border-none cursor-pointer";
const BTN_OUTLINE = "bg-white border border-gray-300 text-[#0A1735] px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-50 transition shadow-sm cursor-pointer";

const DailyWorkDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [profileOwners, setProfileOwners] = useState<ProfileOwner[]>([]);
    const [ownersLoading, setOwnersLoading] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState("");
    const [stats, setStats] = useState<any>(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const tableRef = useRef<HTMLDivElement>(null);
    const SuperAdminID = localStorage.getItem('id') || sessionStorage.getItem('id');
    const RoleID = localStorage.getItem('role_id') || sessionStorage.getItem('role_id');
    const abortControllerRef = useRef<AbortController | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [originalTableData, setOriginalTableData] = useState<any[]>([]);

    // Filter States
    const [filters, setFilters] = useState({
        staff: SuperAdminID || "",
        countFilter: ""
    });

    const fetchProfileOwners = useCallback(async () => {
        setOwnersLoading(true);
        try {
            const response = await apiAxios.get('api/users/');
            // Dynamic check based on your provided logic
            setProfileOwners(Array.isArray(response.data) ? response.data : []);
        } catch (e) {
            console.error("Error fetching staff:", e);
        } finally {
            setOwnersLoading(false);
        }
    }, []);

    const fetchDashboardData = useCallback(async (currentFilters = filters) => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // 2. Create new controller
        const controller = new AbortController();
        abortControllerRef.current = controller;

        // If staff changes, we usually want to show the full loader. 
        // If only countFilter changes, we only show table loading.
        setTableLoading(true);

        try {
            const params = new URLSearchParams();
            if (currentFilters.staff) params.append('owner', filters.staff);
            if (currentFilters.countFilter) params.append('countFilter', filters.countFilter);

            const response = await apiAxios.get(`api/daily-work-report/`, {
                params: Object.fromEntries(params.entries()),
                signal: controller.signal
            });
            if (response.data.status) {
                setStats(response.data.counts_by_type);
                setTableData(response.data.data);
                setOriginalTableData(response.data.data);
            }
        } catch (e) {
            console.error("Error fetching dashboard report:", e);
        } finally {
            if (abortControllerRef.current === controller) {
                setTableLoading(false);
                setLoading(false);
            }
        }
    }, [RoleID, SuperAdminID, filters]);

    const handleDownloadReport = async (currentFilters = filters) => {
        setIsDownloading(true);

        try {
            const params = new URLSearchParams();
            if (currentFilters.staff) params.append('owner', filters.staff);
            if (currentFilters.countFilter) params.append('countFilter', filters.countFilter);
            // 🔑 IMPORTANT: export flag
            params.append('export', 'excel');

            const response = await apiAxios.get('api/daily-work-report/', {
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
                `Daily_Work_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
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
        if (tableLoading) return;

        if (!searchQuery.trim()) {
            setTableData(originalTableData);
            return;
        }

        const term = searchQuery.toLowerCase();

        const filtered = originalTableData.filter((row) => {
            return (
                row.ProfileId?.toString().toLowerCase().includes(term) ||
                row.Profile_name?.toLowerCase().includes(term)
            );
        });

        setTableData(filtered);
    }, [searchQuery, originalTableData, tableLoading]);


    useEffect(() => {
        // if (RoleID === "7") 
            fetchProfileOwners();
    }, [RoleID, fetchProfileOwners]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // Handle Staff Change
    const handleStaffChange = (staffId: string) => {
        setLoading(true); // Show main loader for cards too when switching staff
        setFilters({
            staff: staffId,
            countFilter: "" // Reset table filter when staff changes
        });
    };

    // Handle Card Click
    const handleCardClick = (key: string) => {
        setTableLoading(true);
        setSearchQuery("");

        const updatedFilter =
            filters.countFilter === key ? "" : key; // 👈 toggle logic

        const updatedFilters = {
            ...filters,
            countFilter: updatedFilter,
        };

        setFilters(updatedFilters);

        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // fetchDashboardData(updatedFilters);
    };


    const KPICard = ({
        label,
        value,
        colorClass,
        filterKey,
        clickable = true,
    }: {
        label: string;
        value: string | number;
        colorClass: string;
        filterKey?: string;
        clickable?: boolean;
    }) => (
        <motion.div
            whileHover={clickable ? { y: -5 } : undefined}
            onClick={clickable && filterKey ? () => handleCardClick(filterKey) : undefined}
            className={`
            ${colorClass}
            p-5 rounded-2xl min-h-[120px] border flex flex-col justify-center transition shadow-sm
            ${clickable ? 'cursor-pointer hover:shadow-md' : 'cursor-default'}
            ${clickable && filters.countFilter === filterKey
                    ? 'border-4 border-black/40 shadow-lg'
                    : 'border-[#E3E6EE]'
                }
        `}
        >
            <h6 className="text-[10px] font-bold mb-1 tracking-wider uppercase opacity-80 text-start">
                {label}
            </h6>
            <h2 className="text-3xl text-start font-bold mb-1">
                {value || 0}
            </h2>
        </motion.div>
    );

    const RenderDashboardSection = ({ title, data, color, icon, prefix }: any) => (
        <div className={DASHBOARD_CONTAINER}>
            <h3 className={HEADER_TEXT}>{icon} {title} Dashboard</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                <KPICard label="Todays Work" value={data?.todays_work} colorClass={color} filterKey={`${prefix}_today_work`} />
                <KPICard label="Pending Work" value={data?.pending_work} colorClass={color} filterKey={`${prefix}_pending_work`} />
                <KPICard label="Todays Action" value={data?.todays_action} colorClass={color} filterKey={`${prefix}_today_task`} />
                <KPICard label="Pending Action" value={data?.pending_action} colorClass={color} filterKey={`${prefix}_pending_task`} />
                {/* <KPICard label="Assigned" value={data?.assigned_work} colorClass={color} filterKey={`${prefix}_assigned_to_me`} /> */}
            </div>
        </div>
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


    if (loading && !stats) {
        return <LoadingSpinner />;
    }
    return (
        <div className="min-h-screen bg-[#F5F7FB] font-inter text-black p-4 md:p-8">

            {/* --- Header Section --- */}
            <header className="flex flex-wrap justify-between items-start mb-6 gap-4">
                <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1 text-[#0A1735]">Daily Work Dashboard</h2>
                </div>
            </header>

            {/* --- Filters Section (NON-STICKY) --- */}
            {/* {RoleID === "7" && ( */}
                <section className="mb-8"> {/* Removed sticky top-0 z-30 */}
                    <div className="bg-white rounded-xl border border-[#E3E6EE] p-7 shadow-sm flex flex-wrap gap-4 items-end">
                        <div className="text-start">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Staff</label>
                            <div className="relative">
                                <select
                                    className="w-[330px] h-12 px-3 pr-10 border border-gray-300 rounded-lg text-sm cursor-pointer appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-black disabled:bg-gray-100"
                                    value={filters.staff}
                                    onChange={(e) => handleStaffChange(e.target.value)}
                                    disabled={ownersLoading}
                                >
                                    {/* <option value="">{ownersLoading ? "Loading Staff..." : "Select staff"}</option> */}
                                    {profileOwners.map(owner => (
                                        <option key={owner.id} value={owner.id}>{owner.username}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                    {ownersLoading ?
                                        <CircularProgress size={20} sx={{ mr: 1 }} /> :
                                        <RiArrowDropDownLine size={30} className="text-gray-500" />
                                    }
                                </div>
                            </div>
                        </div>
                        {/* <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">From Date</label>
                        <input type="date" className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">To Date</label>
                        <input type="date" className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                    </div> */}
                        {/* <div className="flex gap-3 h-12">
                        <button className={BTN_OUTLINE}>Reset</button>
                        <button className={BTN_DARK}>Apply Filters</button>
                    </div> */}
                    </div>
                </section>
            {/* )} */}

            {/* 📊 PERFORMANCE HEADER */}
            {/* <div className={DASHBOARD_CONTAINER}>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold text-lg text-[#0A1735]">Today’s Performance</h2>
                    <span className="text-[#129f46] font-bold text-xl">72%</span>
                </div>
                <div className="w-full bg-[#F1F5F9] rounded-full h-3 overflow-hidden">
                    <div className="bg-[#129f46] h-3 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 italic">
                    (Completed Work + Completed Actions) ÷ Total Assigned × 100
                </p>
            </div> */}
            {loading ? (
                <section className="mt-4"><FullWidthLoadingSpinner /></section>
            ) : (
                <>
                    <div className="space-y-8">
                        {/* 🔢 OVERALL SUMMARY WITH INSTRUCTIONAL NOTE */}
                        <div className={DASHBOARD_CONTAINER}>
                            <h3 className={HEADER_TEXT}>Overall Today Summary</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                                <KPICard label="Total Call Work" value={stats?.all?.todays_work} colorClass="bg-white" clickable={false} />
                                <KPICard label="Total Pending Work" value={stats?.all?.pending_work} colorClass="bg-white" clickable={false} />
                                <KPICard label="Total Action Work" value={stats?.all?.todays_action} colorClass="bg-white" clickable={false} />
                                <KPICard label="Total Pending Action" value={stats?.all?.pending_action} colorClass="bg-white" clickable={false} />
                                {/* <KPICard label="Total Assigned Work" value="44" colorClass="bg-white" />
                        <KPICard label="Total Other Assigned Work" value="7" colorClass="bg-white" /> */}
                            </div>
                            {/* Added the requested line below */}
                            {/* <p className="text-[11px] text-gray-400 mt-3">
                        Click any total KPI → Shows ALL dashboard records together
                    </p> */}
                            <RenderDashboardSection title="Renewal" data={stats?.renewal} color="bg-[#F1F7FF]" icon="🔁" prefix="renewal" />
                            <RenderDashboardSection title="Registration" data={stats?.registration} color="bg-[#F0FDF4]" icon="📝" prefix="reg" />
                            <RenderDashboardSection title="Prospect" data={stats?.prospect} color="bg-[#FFF7ED]" icon="🔎" prefix="pros" />
                            <RenderDashboardSection title="Premium" data={stats?.premium} color="bg-[#F5F3FF]" icon="💎" prefix="pre" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                                <KPICard
                                    label="Today's Birthday"
                                    value={stats?.all?.today_birthday}
                                    colorClass="bg-[#FFF1F2]" // Pinkish
                                    filterKey="today_birthday"
                                />
                                <KPICard
                                    label="Yesterday Login"
                                    value={stats?.all?.yesterday_login}
                                    colorClass="bg-[#F0FDFA]" // Teal/Mint
                                    filterKey="yesterday_login"
                                />
                                <KPICard
                                    label="Payment Failed"
                                    value={stats?.all?.payment_failed}
                                    colorClass="bg-[#FEF2F2]" // Reddish
                                    filterKey="payment_failed"
                                />
                            </div>
                        </div>

                        {/* 🔁 RENEWAL DASHBOARD */}
                        {/* <div className={DASHBOARD_CONTAINER}>
                    <h3 className={HEADER_TEXT}>🔁 Renewal Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <KPICard label="Ren-TW" value="12" colorClass="bg-[#F1F7FF]" />
                        <KPICard label="Ren-PW" value="6" colorClass="bg-[#F1F7FF]" />
                        <KPICard label="Ren-TA" value="8" colorClass="bg-[#F1F7FF]" />
                        <KPICard label="Ren-PA" value="5" colorClass="bg-[#F1F7FF]" />
                        <KPICard label="Ren-AW" value="9" colorClass="bg-[#F1F7FF]" />
                    </div>
                 </div> */}

                        {/* 📝 REGISTRATION DASHBOARD */}
                        {/* <div className={DASHBOARD_CONTAINER}>
                    <h3 className={HEADER_TEXT}>📝 Registration Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <KPICard label="Reg-TW" value="10" colorClass="bg-[#F0FDF4]" />
                        <KPICard label="Reg-PW" value="4" colorClass="bg-[#F0FDF4]" />
                        <KPICard label="Reg-TA" value="7" colorClass="bg-[#F0FDF4]" />
                        <KPICard label="Reg-PA" value="3" colorClass="bg-[#F0FDF4]" />
                        <KPICard label="Reg-AW" value="6" colorClass="bg-[#F0FDF4]" />
                    </div>
                 </div> */}

                        {/* 🔎 PROSPECT DASHBOARD */}
                        {/* <div className={DASHBOARD_CONTAINER}>
                    <h3 className={HEADER_TEXT}>🔎 Prospect Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <KPICard label="Pro-TW" value="14" colorClass="bg-orange-50" />
                        <KPICard label="Pro-PW" value="9" colorClass="bg-orange-50" />
                        <KPICard label="Pro-TA" value="11" colorClass="bg-orange-50" />
                        <KPICard label="Pro-PA" value="6" colorClass="bg-orange-50" />
                        <KPICard label="Pro-AW" value="8" colorClass="bg-orange-50" />
                    </div>
                 </div> */}

                        {/* 💎 PREMIUM DASHBOARD */}
                        {/* <div className={DASHBOARD_CONTAINER}>
                    <h3 className={HEADER_TEXT}>💎 Premium Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <KPICard label="Pre-TW" value="5" colorClass="bg-purple-50" />
                        <KPICard label="Pre-PW" value="2" colorClass="bg-purple-50" />
                        <KPICard label="Pre-TA" value="4" colorClass="bg-purple-50" />
                        <KPICard label="Pre-PA" value="1" colorClass="bg-purple-50" />
                        <KPICard label="Pre-AW" value="3" colorClass="bg-purple-50" />
                    </div>
                 </div> */}

                        {/* 🗑 DELETE DASHBOARD */}
                        {/* <div className={DASHBOARD_CONTAINER}>
                    <h3 className="text-base font-semibold text-[#ef4444] mb-4 flex items-center gap-2">🗑 Delete Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <KPICard label="Today Deleted" value="3" colorClass="bg-[#FFECEC]" />
                        <KPICard label="Pending Deleted" value="5" colorClass="bg-[#FFECEC]" />
                    </div>
                 </div> */}

                        {/* 💍 MARRIAGE SETTLED DASHBOARD */}
                        {/* <div className={DASHBOARD_CONTAINER}>
                    <h3 className="text-base font-semibold text-[#db2777] mb-4 flex items-center gap-2">💍 Marriage Settled Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <KPICard label="Today Settled" value="2" colorClass="bg-[#FFF1F2]" />                         <KPICard label="Pending Follow-ups" value="4" colorClass="bg-[#FFF1F2]" />
                        <KPICard label="Assigned Cases" value="6" colorClass="bg-[#FFF1F2]" />
                    </div>
                 </div> */}
                    </div>


                    {/* 📋 TABLE SECTION */}
                    <section ref={tableRef} className="bg-white rounded-xl border border-[#e6ecf2] shadow-md p-6 mt-8">
                        <div className="flex flex-wrap justify-between items-center mb-6">
                            <h5 className="text-lg font-semibold text-[#0A1735] flex items-center gap-2">
                                📋 All Work List ({tableData.length || stats?.filtered_count || 0})
                            </h5>
                            <div className="flex gap-2 ml-100">
                                <input
                                    type="text"
                                    placeholder="Search Profile ID / Name"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-[250px] h-10 px-4 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-gray-500"
                                />
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="h-10 px-4 rounded-full bg-white border border-gray-300 text-sm font-semibold hover:bg-gray-50"
                                >
                                    Clear
                                </button>
                            </div>
                            <button
                                onClick={() => handleDownloadReport()}
                                disabled={isDownloading}
                                className={`
        border border-[#b3b5b7]
        text-sm font-semibold px-4 py-1.5 rounded-lg
        transition shadow-sm
        flex items-center gap-2
        ${isDownloading
                                        ? 'bg-gray-200 cursor-not-allowed text-gray-500'
                                        : 'hover:bg-[#dfe0e1]'
                                    }
    `}
                            >
                                {isDownloading ? (
                                    <>
                                        <CircularProgress size={16} />
                                        Exporting...
                                    </>
                                ) : (
                                    'Export'
                                )}
                            </button>

                        </div>

                        <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                            <table className="min-w-full border-separate border-spacing-0 table-auto">
                                <thead className="sticky top-0 z-20 bg-gray-50">
                                    <tr>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Profile ID</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Name</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">DOJ</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Plan Name</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Owner</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Dashboard Type</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">NCD</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Last Login Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableLoading ? (
                                        <tr><td colSpan={7} className="text-center py-10"><CircularProgress size={30} /></td></tr>
                                    ) : tableData.length > 0 ? (
                                        tableData.map((row) => (
                                            <tr key={row.ProfileId} className="hover:bg-gray-50">
                                                <td className="px-3 py-3 text-sm font-bold text-blue-600 border border-[#e5ebf1] whitespace-nowrap">
                                                    <a href={`/viewProfile?profileId=${row.ProfileId}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {row.ProfileId}
                                                    </a>
                                                </td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.Profile_name}</td>
                                                {/* <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{row.DateOfJoin || 'N/A'}</td> */}
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap"> {row.DateOfJoin
                                                    ? new Date(row.DateOfJoin.replace("T", " ")).toLocaleDateString('en-CA')
                                                    : "N/A"}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{row.plan_name || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{row.owner_name || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{row.dashboard_type || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap"> {row.next_call_date
                                                    ? new Date(row.next_call_date.replace("T", " ")).toLocaleDateString('en-CA')
                                                    : "N/A"}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap"> {row.Last_login_date
                                                    ? new Date(row.Last_login_date.replace("T", " ")).toLocaleDateString('en-CA')
                                                    : "N/A"}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan={7} className="text-center py-10 text-gray-500 font-medium">No records found</td></tr>
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

export default DailyWorkDashboard;
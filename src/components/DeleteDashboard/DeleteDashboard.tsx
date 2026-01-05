import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [profileOwners, setProfileOwners] = useState<ProfileOwner[]>([]);
    const tableRef = useRef<HTMLDivElement>(null);

    const RoleID = localStorage.getItem('role_id') || sessionStorage.getItem('role_id');
    const SuperAdminID = localStorage.getItem('id') || sessionStorage.getItem('id');

    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
        owner: SuperAdminID || "",
        profileId: '',
        countFilter: '',
        hidden: '',
        pending: ''
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
        setTableLoading(true);
        try {
            const params = new URLSearchParams();
            if (currentFilters.fromDate) params.append('from_date', currentFilters.fromDate);
            if (currentFilters.toDate) params.append('to_date', currentFilters.toDate);
            if (currentFilters.owner) params.append('owner', currentFilters.owner);
            if (currentFilters.profileId) params.append('profile_id', currentFilters.profileId);
            if (currentFilters.countFilter) params.append('countFilter', currentFilters.countFilter);
            if (currentFilters.hidden) params.append('hidden', currentFilters.hidden);
            if (currentFilters.pending) params.append('pending', currentFilters.pending);

            // Using your endpoint
            const response = await fetch(`https://app.vysyamala.com/api/delete-report/?${params.toString()}`);
            const result = await response.json();

            if (result.status) {
                setApiData(result);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
            setTableLoading(false);
        }
    }, [filters]);

    // Initial Load
    useEffect(() => {
        if (RoleID === "7") fetchProfileOwners();
        fetchDashboardData();
    }, []);

    // --- Handlers ---
    const handleCardClick = (
        filterValue: string,
        isTn?: boolean,
        isOth?: boolean,
        isHidden?: boolean,
        isPending?: boolean
    ) => {
        let finalCountFilter = filterValue;

        // Logic for TN / OTH suffixes
        if (isTn) finalCountFilter = `${filterValue}_tn`;
        if (isOth) finalCountFilter = `${filterValue}_tn_oth`;

        // Special logic for Hidden/Pending Current Month
        // If it's a "hidden" card click, we use 'hidden_current_month' as countFilter
        // If it's "pending", we use 'pending_current_month' AND set the 'pending=1' param

        const updatedFilters = {
            ...filters,
            countFilter: filters.countFilter === finalCountFilter ? "" : finalCountFilter,
            hidden: isHidden ? "1" : "",
            pending: isPending ? "1" : ""
        };

        setFilters(updatedFilters);

        if (tableRef.current) {
            tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        fetchDashboardData(updatedFilters);
    };

    const resetFilters = () => {
        const defaultFilters = {
            fromDate: '',
            toDate: '',
            owner: RoleID === "7" ? "" : (SuperAdminID || ""),
            profileId: '',
            countFilter: '',
            hidden: '',
            pending: ''
        };
        setFilters(defaultFilters);
        setLoading(true);
        fetchDashboardData(defaultFilters);
    };

    // --- Components ---
    const KPICard = ({ label, value, colorClass, kpiKey, subTn, subNonTn, isHidden, isPending }: any) => {
        // Check if this card or its sub-filters are active
        const isActive = filters.countFilter === kpiKey ||
            filters.countFilter === `${kpiKey}_tn` ||
            filters.countFilter === `${kpiKey}_tn_oth`;

        return (
            <motion.div
                whileHover={{ y: -3 }}
                // Main card click (Overall count)
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
                                className={`hover:text-black transition-all px-1 ${filters.countFilter === `${kpiKey}_tn` ? 'text-black underline' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick(kpiKey, true, false); // Trigger _tn
                                }}
                            >
                                {subTn}
                            </span>
                            <span className="opacity-40">/</span>
                            <span
                                className={`hover:text-black transition-all px-1 ${filters.countFilter === `${kpiKey}_tn_oth` ? 'text-black underline' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCardClick(kpiKey, false, true); // Trigger _tn_oth
                                }}
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

    const FullWidthLoadingSpinner = () => (
        <Box className="w-full flex flex-col justify-center items-center py-12 bg-white rounded-xl shadow-sm border border-[#E3E6EE] mb-8">
            <CircularProgress color="primary" size={40} />
            <Typography variant="h6" sx={{ mt: 3, color: '#0A1735', fontWeight: 600 }}>Loading Dashboard Data...</Typography>
        </Box>
    );

    return (
        <div className="min-h-screen bg-[#F5F7FB] font-inter text-black p-4 md:p-8">
            <header className="flex flex-wrap justify-between items-start mb-6 gap-4">
                <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1">Delete Dashboard</h2>
                </div>
                <div className="flex gap-3">
                    <button className={BTN_DARK}>Download Report</button>
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
                    <button onClick={resetFilters} className={BTN_OUTLINE}>Reset</button>
                    <button onClick={() => fetchDashboardData()} className={BTN_DARK}>Apply Filters</button>
                </div>
            </section>

            {loading ? (
                <FullWidthLoadingSpinner />
            ) : (
                <>
                    <div className="space-y-6">
                        <div className={DASHBOARD_CONTAINER}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <KPICard label="Total Delete" value={apiData?.overall_count || 0} colorClass="bg-slate-50" kpiKey="" />
                                {/* <KPICard
                                    label="TN / Others"
                                    value={`${apiData?.state_counts?.tn || 0} / ${apiData?.state_counts?.non_tn || 0}`}
                                    colorClass="bg-red-50"
                                    kpiKey="tn"
                                /> */}
                                <KPICard
                                    label="TN / Others"
                                    // We pass a custom value display
                                    value={
                                        <div className="flex gap-2">
                                            <span
                                                className={` cursor-pointer ${filters.countFilter === 'tn' ? 'text-black underline' : ''}`}
                                                onClick={(e: React.MouseEvent) => {
                                                    e.stopPropagation();
                                                    handleCardClick('tn');
                                                }}
                                            >
                                                {apiData?.state_counts?.tn || 0}
                                            </span>
                                            <span className="opacity-30">/</span>
                                            <span
                                                className={` cursor-pointer ${filters.countFilter === 'non_tn' ? 'text-black underline' : ''}`}
                                                onClick={(e: React.MouseEvent) => {
                                                    e.stopPropagation();
                                                    handleCardClick('non_tn');
                                                }}
                                            >
                                                {apiData?.state_counts?.non_tn || 0}
                                            </span>
                                        </div>
                                    }
                                    colorClass="bg-red-50"
                                    kpiKey="tn" // Neutral key so the parent click doesn't conflict
                                />
                                <KPICard
                                    label="Premium - TN/OTH"
                                    value={apiData?.plan_counts?.premium?.total || 0}
                                    subTn={apiData?.plan_counts?.premium?.tn}
                                    subNonTn={apiData?.plan_counts?.premium?.non_tn}
                                    colorClass="bg-emerald-50"
                                    kpiKey="premium"
                                />
                                <KPICard
                                    label="Free - TN/OTH"
                                    value={apiData?.plan_counts?.free?.total || 0}
                                    subTn={apiData?.plan_counts?.free?.tn}
                                    subNonTn={apiData?.plan_counts?.free?.non_tn}
                                    colorClass="bg-sky-50"
                                    kpiKey="free"
                                />
                                <KPICard
                                    label="Offer - TN/OTH"
                                    value={apiData?.plan_counts?.offer?.total || 0}
                                    subTn={apiData?.plan_counts?.offer?.tn}
                                    subNonTn={apiData?.plan_counts?.offer?.non_tn}
                                    colorClass="bg-pink-50"
                                    kpiKey="offer"
                                />
                                <KPICard
                                    label="Prospect - TN/OTH"
                                    value={apiData?.plan_counts?.prospect?.total || 0}
                                    subTn={apiData?.plan_counts?.prospect?.tn}
                                    subNonTn={apiData?.plan_counts?.prospect?.non_tn}
                                    colorClass="bg-rose-50"
                                    kpiKey="propect"
                                />
                                <KPICard label="Current Month Delete" value={apiData?.current_month_deletions || 0} colorClass="bg-orange-50" kpiKey="current_month_deletions" />
                                <KPICard label="Duplicate" value={apiData?.status_counts?.duplicate || 0} colorClass="bg-indigo-50" kpiKey="duplicate" />
                                <KPICard label="Fake" value={apiData?.status_counts?.fake || 0} colorClass="bg-rose-50" kpiKey="fake" />
                                <KPICard label="Marriage Settled" value={apiData?.status_counts?.marriage || 0} colorClass="bg-teal-50" kpiKey="marriage" />
                                <KPICard
                                    label="Others"
                                    value={apiData?.status_counts?.others || 0}
                                    colorClass="bg-indigo-50"
                                    kpiKey="others"
                                />
                                <KPICard
                                    label="Hidden / Current Month Hidden"
                                    value={`${apiData?.other_status_counts?.hidden || 0} / ${apiData?.other_status_counts?.hidden_current_month || 0}`}
                                    colorClass="bg-purple-50"
                                    kpiKey="hidden_current_month"
                                    isHidden={true}
                                />
                                <KPICard
                                    label="Pending / Current Month Pending"
                                    value={`${apiData?.other_status_counts?.pending || 0} / ${apiData?.other_status_counts?.pending_current_month || 0}`}
                                    colorClass="bg-teal-50"
                                    kpiKey="pending_current_month"
                                    isPending={true}
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Table Section --- */}
                    <section ref={tableRef} className="bg-white rounded-xl border border-[#e6ecf2] shadow-md p-6 mt-8">
                        <div className="flex justify-between items-center mb-6">
                            <h5 className="text-lg font-semibold text-[#0A1735]">📋 List View ({apiData?.data?.length || 0})</h5>
                        </div>

                        <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                            <table className="min-w-full border-separate border-spacing-0 table-auto">
                                <thead className="sticky top-0 z-20 bg-gray-50">
                                    <tr>
                                        {["Profile ID", "Name", "City", "State", "Mode", "Delete Date", "Creation Date", "Owner", "Secondary Delete Status",
                                            "Secondary Delete Others Comments",].map((col, idx) => (
                                                <th key={col} className={`sticky px-3 py-3 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] whitespace-nowrap ${idx === 0 ? 'rounded-tl-xl' : ''}`}>
                                                    {col}
                                                </th>
                                            ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableLoading ? (
                                        <tr>
                                            <td colSpan={9} className="py-20 text-center">
                                                <CircularProgress size={30} />
                                                <p className="mt-2 text-sm text-gray-500">Updating List...</p>
                                            </td>
                                        </tr>
                                    ) : apiData?.data?.length > 0 ? (
                                        apiData.data.map((item: any) => (
                                            <tr key={item.ProfileId} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-3 py-3 text-sm font-bold text-blue-600 border border-[#e5ebf1]">{item.ProfileId}</td>
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
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${item.sub_status_id === 21 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {item.sub_status_name || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">static</td>
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
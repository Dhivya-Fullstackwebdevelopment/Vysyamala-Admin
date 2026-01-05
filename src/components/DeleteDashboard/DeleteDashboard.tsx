import React, { useState, useEffect, useCallback } from 'react';
import {
    CircularProgress,
    Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import { RiArrowDropDownLine } from 'react-icons/ri';
import '../../index.css';
import { apiAxios } from '../../api/apiUrl';
import { ProfileOwner } from '../RegistrationDashboard/RegistrationDashboard';

// --- Styles & Constants ---
const DASHBOARD_CONTAINER = "bg-white rounded-xl border border-[#E3E6EE] p-7 shadow-sm mb-8";
const BTN_DARK = "bg-[#0A1735] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#1f2d50] transition shadow-sm border-none cursor-pointer disabled:bg-gray-400";
const BTN_OUTLINE = "bg-white border border-gray-300 text-[#0A1735] px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-50 transition shadow-sm cursor-pointer";

const DeleteDashboard: React.FC = () => {
    // --- State Management ---
    const [apiData, setApiData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [profileOwners, setProfileOwners] = useState<ProfileOwner[]>([]);
    const RoleID = localStorage.getItem('role_id') || sessionStorage.getItem('role_id');
    const SuperAdminID = localStorage.getItem('id') || sessionStorage.getItem('id');
    const [filters, setFilters] = useState({
        fromDate: '',
        toDate: '',
        owner: SuperAdminID || "",
        profileId: '',
        countFilter: '',
        hidden: '',      // For hidden=1
        pending: ''      // For pending=1
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

    useEffect(() => {
        if (RoleID === "7") {
            fetchProfileOwners();
        }
    }, [RoleID, fetchProfileOwners]);


    // --- API Fetch Function ---
    const fetchDashboardData = useCallback(async (currentFilters = filters) => {
        setLoading(true);
        try {
            // Constructing URL with query params if filters exist
            const queryParams = new URLSearchParams();
            if (currentFilters.fromDate) queryParams.append('from_date', currentFilters.fromDate);
            if (currentFilters.toDate) queryParams.append('to_date', currentFilters.toDate);
            if (currentFilters.owner) queryParams.append('owner', currentFilters.owner);
            if (currentFilters.profileId) queryParams.append('profile_id', currentFilters.profileId);
            if (currentFilters.countFilter) queryParams.append('countFilter', currentFilters.countFilter);
            if (currentFilters.hidden) queryParams.append('hidden', currentFilters.hidden);
            if (currentFilters.pending) queryParams.append('pending', currentFilters.pending);

            const response = await fetch(`https://app.vysyamala.com/api/delete-report/?${queryParams.toString()}`);
            const result = await response.json();

            if (result.status) {
                setApiData(result);
            }
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    // Initial Load
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleCardClick = (filterValue: string, isHidden?: boolean, isPending?: boolean) => {
        const updatedFilters = {
            ...filters,
            // If the same filter is clicked again, clear it; otherwise, set it
            countFilter: filters.countFilter === filterValue ? "" : filterValue,
            hidden: isHidden ? "1" : "",
            pending: isPending ? "1" : ""
        };
        setFilters(updatedFilters);
        fetchDashboardData(updatedFilters);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const resetFilters = () => {
        const defaultFilters = { fromDate: '', toDate: '', owner: SuperAdminID || "", profileId: '', countFilter: '', hidden: '', pending: '' };
        setFilters(defaultFilters);
        // Re-fetch after state clears
        setTimeout(fetchDashboardData, 100);
    };

    const KPICard = ({ label, value, colorClass, onClick, tnValue, nonTnValue, categoryKey }: any) => (
        <motion.div
            whileHover={{ y: -5 }}
            className={`${colorClass} p-5 rounded-2xl min-h-[140px] border flex flex-col justify-center transition shadow-sm border-[#E3E6EE]`}
        >
            <h6 className="text-[10px] font-bold mb-1 tracking-wider uppercase opacity-80 text-start">{label}</h6>

            {/* If we have sub-values (TN/OTH), we style them specifically */}
            {tnValue !== undefined ? (
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold cursor-pointer hover:underline" onClick={() => onClick(categoryKey)}>
                        {value}
                    </h2>
                    <div className="flex gap-2 text-sm font-semibold">
                        <span
                            className="bg-white/50 px-2 py-1 rounded cursor-pointer hover:bg-white"
                            onClick={() => onClick(categoryKey, false, false, 'tn')}
                        >
                            {tnValue}
                        </span>
                        <span
                            className="bg-white/50 px-2 py-1 rounded cursor-pointer hover:bg-white"
                            onClick={() => onClick(categoryKey, false, false, 'non_tn')}
                        >
                            {nonTnValue}
                        </span>
                    </div>
                </div>
            ) : (
                <h2 className="text-2xl text-start font-bold mb-1 cursor-pointer" onClick={() => onClick(categoryKey)}>
                    {value}
                </h2>
            )}
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#F5F7FB] font-inter text-black p-4 md:p-8">

            {/* --- Header Section --- */}
            <header className="flex flex-wrap justify-between items-start mb-6 gap-4">
                <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1 text-[#0A1735]">Delete Dashboard</h2>
                </div>
                <div className="flex gap-3">
                    <button className={BTN_DARK}>Download Report</button>
                </div>
            </header>

            {/* --- Filters Section --- */}
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
                    {/* <button className={BTN_OUTLINE}>Reset</button>
                    <button className={BTN_DARK}>Apply Filters</button> */}
                    <button onClick={resetFilters} className={BTN_OUTLINE}>Reset</button>
                    <button onClick={() => fetchDashboardData()} className={BTN_DARK}>Apply Filters</button>
                </div>
            </section>

            {loading ? (
                <div className="flex justify-center py-20"><CircularProgress /></div>
            ) : (
                <>
                    <div className="space-y-8 ">
                        <div className={DASHBOARD_CONTAINER}>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                <KPICard
                                    label="Total Delete"
                                    value={apiData?.overall_count || 0}
                                    colorClass="bg-purple-50 border-purple-200"
                                    onClick={() => handleCardClick("")} // No filter
                                />

                                <KPICard
                                    label="TN / Others"
                                    value={`${apiData?.state_counts?.tn} / ${apiData?.state_counts?.non_tn}`}
                                    colorClass="bg-red-50 border-red-200"
                                    onTotalClick={() => handleCardClick("tn_others_total")}
                                    onTnClick={() => handleCardClick("tn")}
                                    onOthersClick={() => handleCardClick("non_tn")}
                                />

                                <KPICard
                                    label="Premium - TN/OTH"
                                    value={apiData?.plan_counts?.premium?.total}
                                    tnValue={apiData?.plan_counts?.premium?.tn}
                                    nonTnValue={apiData?.plan_counts?.premium?.non_tn}
                                    categoryKey="premium"
                                    colorClass="bg-[#F5F3FF] border-purple-200"
                                    onClick={handleCardClick}
                                />

                                <KPICard
                                    label="Free - TN/OTH"
                                    value={apiData?.plan_counts?.free?.total}
                                    tnValue={apiData?.plan_counts?.free?.tn}
                                    nonTnValue={apiData?.plan_counts?.free?.non_tn}
                                    categoryKey="free"
                                    colorClass="bg-blue-50 border-blue-200"
                                    onClick={handleCardClick}
                                />

                                {/* Offer Card */}
                                <KPICard
                                    label="Offer - TN/OTH"
                                    value={apiData?.plan_counts?.offer?.total}
                                    tnValue={apiData?.plan_counts?.offer?.tn}
                                    nonTnValue={apiData?.plan_counts?.offer?.non_tn}
                                    categoryKey="offer"
                                    colorClass="bg-pink-50 border-pink-200"
                                    onClick={handleCardClick}
                                />

                                {/* Prospect Card */}
                                <KPICard
                                    label="Prospect - TN/OTH"
                                    value={apiData?.plan_counts?.prospect?.total}
                                    tnValue={apiData?.plan_counts?.prospect?.tn}
                                    nonTnValue={apiData?.plan_counts?.prospect?.non_tn}
                                    categoryKey="prospect"
                                    colorClass="bg-green-50 border-green-200"
                                    onClick={handleCardClick}
                                />

                                <KPICard
                                    label="Current Month Delete"
                                    value={apiData?.current_month_deletions || 0}
                                    colorClass="bg-orange-50 border-orange-200"
                                    onClick={() => handleCardClick("current_month_deletions")}
                                />

                                <KPICard
                                    label="Duplicate"
                                    value={apiData?.status_counts?.duplicate || 0}
                                    colorClass="bg-indigo-50 border-indigo-200"
                                    onClick={() => handleCardClick("duplicate")}
                                />

                                <KPICard
                                    label="Fake"
                                    value={apiData?.status_counts?.fake || 0}
                                    colorClass="bg-rose-50 border-rose-200"
                                    onClick={() => handleCardClick("fake")}
                                />

                                <KPICard
                                    label="Got married - Marriage settled"
                                    value={apiData?.status_counts?.marriage || 0}
                                    colorClass="bg-teal-50 border-teal-200"
                                    onClick={() => handleCardClick("marriage")}
                                />

                                <KPICard
                                    label="Others"
                                    value={apiData?.status_counts?.others || 0}
                                    colorClass="bg-indigo-50 border-indigo-200"
                                    onClick={() => handleCardClick("others")}
                                />

                                <KPICard
                                    label="Hidden /Current Month Hidden"
                                    value={`${apiData?.other_status_counts?.hidden || 0} / ${apiData?.other_status_counts?.hidden_current_month || 0}`}
                                    colorClass="bg-rose-50 border-rose-200"
                                    onClick={() => handleCardClick("hidden_current_month", true, false)} // Pass hidden=1
                                />

                                <KPICard
                                    label="Pending /Current month Pending"
                                    value={`${apiData?.other_status_counts?.pending || 0} / ${apiData?.other_status_counts?.pending_current_month || 0}`}
                                    colorClass="bg-teal-50 border-teal-200"
                                    onClick={() => handleCardClick("pending_current_month", false, true)} // Pass pending=1
                                />
                            </div>
                        </div>
                    </div>

                    {/* --- Table Section --- */}
                    <section className="bg-white rounded-xl border border-[#e6ecf2] shadow-md p-6 mt-8">
                        <h5 className="text-lg font-semibold text-[#0A1735] mb-6">📋 List View ({apiData?.data?.length || 0})</h5>
                        <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                            <table className="min-w-full border-separate border-spacing-0 table-auto">
                                <thead className="sticky top-0 z-20 bg-gray-50">
                                    <tr>
                                        {["Profile ID", "Name", "City", "State",
                                            "Mode",
                                            "Delete Date",
                                            "Creation Date",
                                            "Owner",
                                            "Secondary Delete Status",
                                            "Secondary Delete Others Comments",
                                        ].map((col) => (
                                            <th key={col} className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1] whitespace-nowrap">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {apiData?.data?.map((item: any) => (
                                        <tr key={item.ProfileId} className="hover:bg-gray-50">
                                            <td className="px-3 py-3 text-sm font-bold text-blue-600 border border-[#e5ebf1]">{item.ProfileId}</td>
                                            <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{item.Profile_name || 'N/A'}</td>
                                            <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{item.Profile_city || 'N/A'}</td>
                                            <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{item.state || 'N/A'}</td>
                                            <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{item.plan_name || 'N/A'}</td>
                                            <td className="px-3 py-3 text-sm border border-[#e5ebf1]">
                                                {item.dh_date_time
                                                    ? new Date(item.dh_date_time.replace("T", " ")).toLocaleDateString('en-CA')
                                                    : "N/A"}
                                            </td>
                                            <td className="px-3 py-3 text-sm border border-[#e5ebf1]">
                                                {item.DateOfJoin
                                                    ? new Date(item.DateOfJoin.replace("T", " ")).toLocaleDateString('en-CA')
                                                    : "N/A"}
                                            </td>
                                            <td className="px-3 py-3 text-sm border border-[#e5ebf1]">{item.owner_name || 'N/A'}</td>
                                            <td className="px-3 py-3 text-sm border border-[#e5ebf1]">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.sub_status_id === 21 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                    {item.sub_status_name || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-sm border border-[#e5ebf1]">comments</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )
            }
        </div >
    );
};
export default DeleteDashboard;
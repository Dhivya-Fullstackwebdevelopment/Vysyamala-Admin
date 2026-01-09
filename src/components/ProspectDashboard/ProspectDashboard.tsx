import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Grid,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion } from 'framer-motion';
import { apiAxios } from '../../api/apiUrl';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { CARD_COLOR_CLASSES, Plan, ProfileOwner } from '../RegistrationDashboard/RegistrationDashboard';
import { ActionLog, CallLog, ProfileActionCount } from '../RenewalDashboard/RenewalDahboardPage';
import '../../index.css';

// --- Types & Interfaces ---
interface ProspectProfile {
    id: string;
    ProfileId: string;
    Profile_name: string;
    DOR: string;
    name: string;
    age: number;
    familyStatus: string;
    education: string;
    income: string;
    city: string;
    mode: string;
    owner: string;
    fromDate: string;
    toDate: string;
    lastLogin: string;
    idleDays: number;
    status: string;
    // Stats for Customer Log
    viewed: number;
    visitors: number;
    bookmark: number;
    expSent: number;
    expRec: number;
    // Logs for Call Log
    lcd: string;
    lcdComments: string;
    callStatus: string;
    ncd: string;
    lad: string;
    lap: string;
    lapComments: string;
    nad: string;
    last_call_id: string;
    last_action_id: string;
}

// --- Configuration ---
const KPI_CONFIG = [
    { label: "TOTAL PROFILE", key: "" },
    { label: "PROSPECT - TN/OTH", key: "prospect", split: true },
    { label: "FREE - TN/OTH", key: "free", split: true },
    { label: "OFFER - TN/OTH", key: "offer", split: true },
    { label: "BASIC - TN/OTH", key: "basic", split: true },
    { label: "AGE > 35", key: "age_above_30" },
    { label: "AGE < 35", key: "age_under_30" },
    { label: "NO HORO", key: "no_horo" },
    { label: "NO PHOTO", key: "no_photo" },
    { label: "NO ID", key: "no_id" },
    { label: "TODAY'S BIRTHDAY", key: "today_birthday", color: "bg-white" },
    { label: "CURRENT LOGIN", key: "today_login" },
    { label: "YESTERDAY'S LOGIN", key: "yesterday_login" },
    { label: "CURRENT MONTH REGISTRATION", key: "current_month_registration" },
    { label: "PAYMENT FAILURE", key: "payment_failed" },
    { label: "PAYMENT SUCCESS", key: "payment_success" },
    { label: "HOT", key: "Hot" },
    { label: "WARM", key: "Warm" },
    { label: "COLD", key: "Cold" },
    { label: "NOT INTERESTED", key: "not_interested" },
    { label: "VALIDATION > 3 MONTHS", key: "90" },
    { label: "> 20 EXPRESS INTEREST", key: "express_interest_20" },
    { label: "TODAY FOLLOW UP", key: "today_work" },
    { label: "PENDING FOLLOW UP", key: "pending_work" },
    { label: "TODAY ACTION", key: "today_task" },
    { label: "PENDING ACTION", key: "pending_task" },
    { label: "ASSIGNED TO ME", key: "assigned_to_me" },
];

export const getProspectCardColor = (label: string) => {
    const map: Record<string, string> = {
        "TOTAL PROFILE": "primary",

        "PROSPECT - TN/OTH": "info",
        "FREE - TN/OTH": "muted",
        "OFFER - TN/OTH": "warning",
        "BASIC - TN/OTH": "success",

        "AGE > 35": "info",
        "AGE < 35": "info",

        "NO PHOTO": "danger",
        "NO HORO": "danger",
        "NO ID": "danger",

        "TODAY'S BIRTHDAY": "birthday",

        "CURRENT LOGIN": "info",
        "YESTERDAY'S LOGIN": "muted",

        "CURRENT MONTH REGISTRATION": "primary",

        "PAYMENT SUCCESS": "success",
        "PAYMENT FAILURE": "danger",

        "HOT": "hot",
        "WARM": "warm",
        "COLD": "cold",
        "NOT INTERESTED": "danger",

        "VALIDATION > 3 MONTHS": "warning",
        "> 20 EXPRESS INTEREST": "info",

        "TODAY FOLLOW UP": "warning",
        "PENDING FOLLOW UP": "warning",

        "TODAY ACTION": "warning",
        "PENDING ACTION": "warning",
        "ASSIGNED TO ME": "info",
    };

    const key = map[label] || "primary";
    return CARD_COLOR_CLASSES[key];
};

// const WORK_CARDS = [
//     { label: "Today's Work", sub: "Total tasks to be completed today.", key: "today_work" },
//     { label: "Pending Work", sub: "Carry-forward items not completed.", key: "pending_work" },
//     { label: "Today's Action", sub: "Immediate actions required.", key: "today_action" },
//     { label: "Missing Docs", sub: "No Horo / Photo / ID.", key: "missing_docs" },
// ];

const ProspectDashboard: React.FC = () => {
    // --- State ---
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<'call' | 'customer' | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<ProspectProfile | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [tableData, setTableData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const SuperAdminID = localStorage.getItem('id') || sessionStorage.getItem('id');
    const RoleID = localStorage.getItem('role_id') || sessionStorage.getItem('role_id');
    const [tableLoading, setTableLoading] = React.useState(false);
    const [applyFilters, setApplyFilters] = useState(false);
    const [originalTableData, setOriginalTableData] = useState<ProspectProfile[]>([]);
    const [scrollSource, setScrollSource] = useState<'card' | 'filter' | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const [profileOwners, setProfileOwners] = useState<ProfileOwner[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [ownersLoading, setOwnersLoading] = useState(false);
    const [plansLoading, setPlansLoading] = useState(false);
    const [logLoading, setLogLoading] = React.useState<boolean>(false);
    const [callLog, setCallLog] = useState<CallLog | null>(null);
    const [actionLog, setActionLog] = useState<ActionLog | null>(null);
    const [actionCount, setActionCount] = useState<ProfileActionCount | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        staff: SuperAdminID || "",
        plan: "",
        minAge: "",
        maxAge: "",
        searchQuery: "", // search
        countFilter: "",
    });

    const btnDark = "bg-[#0A1735] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#1f2d50] transition shadow-sm border-none cursor-pointer";
    const btnOutline = "bg-white border border-gray-300 text-[#0A1735] px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-50 transition shadow-sm cursor-pointer";

    const getStatusPillClass = (status: string | null) => {
        switch (status?.toLowerCase().split(' ')[0]) {
            case 'hot':
                return "bg-[#ffe4e4] text-[#d70000]";
            case 'warm':
                return "bg-[#FFF6E4] text-[#ff8c00]";
            case 'cold':
                return "bg-[#F7F7F7] text-[#6b7280]";
            case 'not': // "Not interested"
                return "bg-[#FFECEC] text-[#ef4444]";
            case 'completed':
                return "bg-[#d1f7e3] text-[#129f46]";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    type KpiValue =
        | number
        | { total: number; tn: number; non_tn: number };

    const getKpiValue = (label: string) => {
        if (!stats) return { total: 0, tn: 0, non_tn: 0 };
        switch (label) {
            case "TOTAL PROFILE": return stats.total_profiles;
            case "PROSPECT - TN/OTH":
                return {
                    total: stats.plan_counts?.prospect || 0,
                    tn: stats.plan_counts?.prospect_tn || 0,
                    non_tn: stats.plan_counts?.prospect_non_tn || 0,
                };

            case "FREE - TN/OTH":
                return {
                    total: stats.plan_counts?.free || 0,
                    tn: stats.plan_counts?.free_tn || 0,
                    non_tn: stats.plan_counts?.free_non_tn || 0,
                };

            case "OFFER - TN/OTH":
                return {
                    total: stats.plan_counts?.offer || 0,
                    tn: stats.plan_counts?.offer_tn || 0,
                    non_tn: stats.plan_counts?.offer_non_tn || 0,
                };

            case "BASIC - TN/OTH":
                return {
                    total: stats.plan_counts?.basic || 0,
                    tn: stats.plan_counts?.basic_tn || 0,
                    non_tn: stats.plan_counts?.basic_non_tn || 0,
                };
            case "AGE > 35": return stats.age_above_30; // mapping based on your JSON
            case "AGE < 35": return stats.age_under_30;
            case "NO HORO": return stats.no_horo;
            case "NO PHOTO": return stats.no_photo;
            case "NO ID": return stats.no_id;
            case "TODAY'S BIRTHDAY": return stats.today_birthday;
            case "CURRENT LOGIN": return stats.today_login;
            case "YESTERDAY'S LOGIN": return stats.yesterday_login;
            case "CURRENT MONTH REGISTRATION": return stats.cur_month_registrations;
            case "PAYMENT SUCCESS": return stats.payment_counts?.success;
            case "PAYMENT FAILURE": return stats.payment_counts?.failed;
            case "HOT": return stats.interest?.hot;
            case "WARM": return stats.interest?.warm;
            case "COLD": return stats.interest?.cold;
            case "NOT INTERESTED": return stats.interest?.not_interested;

            case "VALIDATION > 3 MONTHS": return stats?.idle_90_count;
            case "> 20 EXPRESS INTEREST": return stats.express_interest?.above_20;

            // case "ASSIGNED ACTION/CALL": return stats.interest?.cold;
            case "TODAY FOLLOW UP": return stats.work_counts?.today_work;
            case "PENDING FOLLOW UP": return stats.work_counts?.pending_work;
            case "TODAY ACTION": return stats.task_counts?.today_task;
            case "PENDING ACTION": return stats.task_counts?.pending_task;
            case "ASSIGNED TO ME": return stats.assigned_to_me;
            default: return 0;
        }
    };

    const fetchProfileOwners = useCallback(async () => {
        setOwnersLoading(true);
        try {
            const response = await apiAxios.get('api/users/');
            // Adjust "response.data" based on your actual API structure
            setProfileOwners(Array.isArray(response.data) ? response.data : []);
        } catch (e) {
            console.error("Error fetching staff:", e);
        } finally {
            setOwnersLoading(false);
        }
    }, []);

    const fetchPlans = useCallback(async () => {
        setPlansLoading(true);
        try {
            const res = await apiAxios.get("api/get-plans/");
            if (res.data.status) {
                setPlans(res.data.plans);
            }
        } catch (e) {
            console.error("Error fetching plans:", e);
        } finally {
            setPlansLoading(false);
        }
    }, []);

    // --- Load Data on Mount ---
    useEffect(() => {
        // if (RoleID === "7") {
        fetchProfileOwners();
        // }
        fetchPlans();
    }, [RoleID, fetchProfileOwners, fetchPlans]);

    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

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
        if (currentFilters.fromDate) params.append('from_date', currentFilters.fromDate);
        if (currentFilters.toDate) params.append('to_date', currentFilters.toDate);
        if (currentFilters.minAge) params.append('age_from', currentFilters.minAge);
        if (currentFilters.maxAge) params.append('age_to', currentFilters.maxAge);
        if (currentFilters.plan) params.append('plan_id', currentFilters.plan);
        if (currentFilters.countFilter) params.append('countFilter', currentFilters.countFilter);

        // const ownerId = (RoleID === "7") ? currentFilters.staff : (SuperAdminID || "");
        // if (ownerId) params.append("owner", ownerId);

        if (currentFilters.staff) params.append("owner", currentFilters.staff);
        try {
            const response = await apiAxios.get('api/prospect-report/', {
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
            /* 4. IMPORTANT: Only stop loading if THIS specific request 
               is still the active one. If abortControllerRef.current has changed, 
               it means a newer request is running and we should stay in loading state.
            */
            if (abortControllerRef.current === controller) {
                setTableLoading(false);
                setLoading(false);
                setApplyFilters(false);
            }
        }
    }, [RoleID, SuperAdminID, filters]);

    // useEffect(() => {
    //     if (applyFilters) {
    //         fetchDashboardData();
    //     }
    // }, [applyFilters, fetchDashboardData]);

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

    // const handleCardClick = (key: string) => {
    //     setTableLoading(true);
    //     // 1. Update filters with the clicked card's key
    //     // 2. Clear search so the table isn't empty due to previous search terms
    //     setFilters(prev => {
    //         const isSameFilter = prev.countFilter === key;
    //         return {
    //             ...prev,
    //             countFilter: isSameFilter ? "" : key,
    //             searchQuery: "" // clear search when card is clicked
    //         };
    //     });
    //     setScrollSource('card');
    //     setApplyFilters(true); // Triggers the useEffect that calls fetchDashboardData
    // };

    const handleCardClick = (key: string) => {
        setTableLoading(true);

        // 1. Determine the new filter state immediately
        const updatedFilters = {
            ...filters,
            countFilter: filters.countFilter === key ? "" : key,
            searchQuery: ""
        };
        console.log("updatedFilters", updatedFilters)
        // 2. Update the state for the UI/Inputs
        setFilters(updatedFilters);
        // setScrollSource('card');
        if (tableRef.current) {
            tableRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        // 3. Trigger the fetch IMMEDIATELY with the new values
        // Don't wait for applyFilters useEffect
        fetchDashboardData(updatedFilters);
    };

    const handleReset = () => {
        // Show loading on both sections
        setLoading(true);
        setTableLoading(true);

        setFilters({
            fromDate: "",
            toDate: "",
            // staff: RoleID === "7" ? "" : (SuperAdminID || ""),
            staff: "",
            plan: "",
            minAge: "",
            maxAge: "",
            searchQuery: "",
            countFilter: "",
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

    const handleDownloadReport = async () => {
        setIsDownloading(true);

        try {
            const params = new URLSearchParams();

            // Same params as fetchDashboardData
            if (filters.fromDate) params.append('from_date', filters.fromDate);
            if (filters.toDate) params.append('to_date', filters.toDate);
            if (filters.minAge) params.append('age_from', filters.minAge);
            if (filters.maxAge) params.append('age_to', filters.maxAge);
            if (filters.plan) params.append('plan_id', filters.plan);
            if (filters.countFilter) params.append('countFilter', filters.countFilter);

            // const ownerId = (RoleID === "7") ? filters.staff : (SuperAdminID || "");
            // if (ownerId) params.append("owner", ownerId);
            if (filters.staff) params.append("owner", filters.staff);
            // 🔑 IMPORTANT: export flag
            params.append('export', 'excel');

            const response = await apiAxios.get('api/prospect-report/', {
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
                `Prospect_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
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

    const handleOpenModal = async (profile: ProspectProfile, type: "call" | "customer") => {
        setLogLoading(true);

        // Reset previous stored values 👇 IMPORTANT
        setCallLog(null);
        setActionLog(null);
        setActionCount(null);

        setSelectedProfile(profile);
        setModalType(type);
        setOpenModal(true);

        try {
            if (type === 'call' && profile.last_call_id) {
                const res = await apiAxios.get(`api/call-log-details/${profile.last_call_id}/`);
                setCallLog(res.data.call_logs?.[0] as CallLog);
            }

            if (type === 'call' && profile.last_action_id) {
                const res = await apiAxios.get(`api/action-log-details/${profile.last_action_id}/`);
                setActionLog(res.data.action_logs?.[0] as ActionLog);
            }

            if (type === 'customer' && profile.ProfileId) {
                const response = await apiAxios.get(`api/get_profile_action_count/${profile.ProfileId}/`);
                setActionCount(response.data as ProfileActionCount);
            }

        } finally {
            setLogLoading(false);
        }
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProfile(null);
        setModalType(null);
    };

    const yesNo = (value: number | null | undefined) =>
        value === 1 ? "Yes" : value === 0 ? "No" : "N/A";

    const CallLogPopup = ({ profile }: { profile: ProspectProfile }) => {
        // Style definitions to match the UI in the image
        const labelStyle = {
            fontSize: '0.85rem',
            color: '#4A5568',
            fontWeight: 500,
            width: '160px' // Ensures labels align vertically
        };

        const valueStyle = {
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#0A1735'
        };

        const statusPill = {
            px: 1.5,
            py: 0.2,
            borderRadius: '12px',
            fontSize: '0.75rem',
            fontWeight: 700,
            display: 'inline-block'
        };

        const call = callLog;
        const action = actionLog;


        return (
            <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2" sx={{ color: "#64748b", mb: 3, fontWeight: 600 }}>
                    Call Logs & Service Details
                </Typography>

                <Grid container spacing={4}>

                    {/* LEFT COLUMN - Call Logs */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>LCD</Typography>
                                <Typography sx={valueStyle}>
                                    {call?.call_date
                                        ? new Date(call.call_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                                        : "N/A"}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>LCD Comments</Typography>
                                <Typography sx={valueStyle}>{call?.comments || "N/A"}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>Call Status</Typography>
                                <Box
                                    className={getStatusPillClass(call?.call_status_name || null)}
                                    sx={statusPill}
                                >{call?.call_status_name || "N/A"}</Box>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>NCD</Typography>
                                <Typography sx={valueStyle}>
                                    {call?.next_call_date
                                        ? new Date(call.next_call_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                                        : "N/A"}
                                </Typography>
                            </Box>

                            {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>Idle Days</Typography>
                                <Typography sx={valueStyle}>{profile.idle_days ?? 0}</Typography>
                            </Box> */}
                        </Box>
                    </Grid>

                    {/* RIGHT COLUMN - Action Logs */}
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>LAD</Typography>
                                <Typography sx={valueStyle}>
                                    {action?.action_date
                                        ? new Date(action.action_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                                        : "N/A"}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>LAP</Typography>
                                <Typography sx={valueStyle}>{action?.action_point_name || "N/A"}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>LAP Comments</Typography>
                                <Typography sx={valueStyle}>{action?.comments || "N/A"}</Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>NAD</Typography>
                                <Typography sx={valueStyle}>
                                    {action?.next_action_date
                                        ? new Date(action.next_action_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                                        : "N/A"}
                                </Typography>
                            </Box>

                            {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>Renewal Date</Typography>
                                <Typography sx={valueStyle}>
                                    {profile.membership_enddate
                                        ? new Date(profile.membership_enddate).toLocaleDateString("en-GB").replace(/\//g, "-")
                                        : "N/A"}
                                </Typography>
                            </Box> */}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        );

    };

    const CustomerLogPopup = ({ profile }: { profile: ProspectProfile }) => (
        <Box sx={{ py: 1 }}>
            <Grid container spacing={2}>
                {[
                    { label: 'Profiles Viewed', val: actionCount?.viewed_count ?? 0 },
                    { label: 'Profile Visitors', val: actionCount?.visited_count ?? 0 },
                    { label: 'Bookmarks', val: actionCount?.bookmarked ?? 0 },
                    { label: 'Exp. Int Sent', val: actionCount?.interest_sent ?? 0 },
                    { label: 'Interest Received', val: actionCount?.interest_received ?? 0 },
                    // { label: 'Accepted', val: actionCount?.interest_accepted ?? 0 },
                    // { label: 'Rejected', val: actionCount?.interest_rejected ?? 0 },
                    // { label: 'Bookmark Received', val: actionCount?.bookmark_received ?? 0 },
                    // { label: 'Photo Req Sent', val: actionCount?.photo_request_sent ?? 0 },
                    // { label: 'Photo Req Received', val: actionCount?.photo_request_received ?? 0 },
                ].map((stat, i) => (
                    <Grid item xs={6} md={2.4} key={i}>
                        <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#F1F7FF', borderRadius: '12px', border: '1px solid #E3E6EE' }}>
                            <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#475569', mb: 1 }}>{stat.label}</Typography>
                            <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A1735' }}>{stat.val}</Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
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

            {/* --- Header Section --- */}
            <header className="flex flex-wrap justify-between items-start mb-6 gap-4">
                <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1">Prospect Dashboard</h2>
                    {/* <p className="text-gray-500 m-0 text-base">Overview of registration profiles, engagement and staff performance.</p> */}
                </div>
                <div className="flex gap-3">
                    <button
                        className={`${btnDark} flex items-center gap-2 disabled:opacity-70`}
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

            {/* --- Filters Section --- */}
            <section className="mb-8">
                <div className="bg-white rounded-xl border border-[#E3E6EE] p-7 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-start">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">From Date</label>
                            <input
                                type="date"
                                value={filters.fromDate}
                                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                                className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div className="text-start">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">To Date</label>
                            <input
                                type="date"
                                value={filters.toDate}
                                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                                className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        {/* {RoleID === "7" && ( */}
                        <div className="text-start">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Staff</label>
                            <div className="relative">
                                <select
                                    className="w-full h-12 px-3 pr-10 border border-gray-300 rounded-lg text-sm cursor-pointer appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-black"
                                    value={filters.staff}
                                    onChange={(e) => handleFilterChange('staff', e.target.value)}
                                >
                                    <option value="">Select Staff</option>
                                    {profileOwners.map(owner => (
                                        <option key={owner.id} value={owner.id}>{owner.username}</option>
                                    ))}
                                </select>

                                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                    <RiArrowDropDownLine size={30} className="text-gray-500" />
                                </div>
                            </div>
                        </div>
                        {/* )} */}
                        {/* <div className="text-start">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Plan</label>
                            <div className="relative">
                                <select
                                    className="w-full h-12 px-3 pr-10 border border-gray-300 rounded-lg text-sm cursor-pointer appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={filters.plan}
                                    onChange={(e) => handleFilterChange('plan', e.target.value)}
                                >
                                    <option value="">Select Plan</option>
                                    {plans.map(plan => (
                                        <option key={plan.id} value={plan.id}>{plan.plan_name}</option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                    <RiArrowDropDownLine size={30} className="text-gray-500" />
                                </div>
                            </div>
                        </div> */}
                        <div className="col-span-1">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Age Range</label>
                            <div className="flex gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minAge}
                                    onChange={(e) => setFilters({ ...filters, minAge: e.target.value })}
                                    className="w-1/2 h-12 px-3 border border-gray-300 rounded-lg text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxAge}
                                    onChange={(e) => setFilters({ ...filters, maxAge: e.target.value })}
                                    className="w-1/2 h-12 px-3 border border-gray-300 rounded-lg text-sm"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button className={btnOutline} onClick={handleReset}>Reset</button>
                        <button className={btnDark} onClick={handleApplyFilters}>Apply Filters</button>
                    </div>
                </div>
            </section>

            {/* --- KPI Grid --- */}
            {loading ? (
                <section className="mt-4">
                    <FullWidthLoadingSpinner />
                </section>
            ) : (
                <>
                    <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                        {/* {KPI_CONFIG.map((kpi, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                onClick={() => handleCardClick(kpi.key)} // Pass the key here
                                className={`${getProspectCardColor(kpi.label)} p-5 rounded-2xl min-h-[140px] border border-[#E3E6EE] flex flex-col justify-center cursor-pointer transition shadow-sm ${filters.countFilter === kpi.key ? 'border-4 border-black/50 shadow-lg' : 'border-[#E3E6EE]'}`}
                            >
                                <h6 className="text-[10px] font-bold mb-1 tracking-wider uppercase opacity-80 text-start">{kpi.label}</h6>
                                <h2 className="text-3xl text-start font-bold mb-1">
                                    {loading ? <CircularProgress size={20} /> : getKpiValue(kpi.label)}
                                </h2>
                                <p className="text-[10px] opacity-70 text-start">Click to view profiles</p>
                            </motion.div>
                        ))} */}
                        {KPI_CONFIG.map((kpi, i) => {
                            const data = getKpiValue(kpi.label);
                            const isSplit = kpi.split;

                            const isCardActive =
                                filters.countFilter === kpi.key ||
                                filters.countFilter === `${kpi.key}_tn` ||
                                filters.countFilter === `${kpi.key}_non_tn`;
                            const isTnActive = filters.countFilter === `${kpi.key}_tn`;
                            const isNonTnActive = filters.countFilter === `${kpi.key}_non_tn`;


                            return (
                                <motion.div
                                    key={i}
                                    onClick={() => handleCardClick(kpi.key)}
                                    className={`${getProspectCardColor(kpi.label)} p-5 rounded-2xl border cursor-pointer min-w-[220px]
  ${isCardActive ? 'border-4 border-black/40 shadow-lg' : 'border-[#E3E6EE]'}`}

                                >
                                    <h6 className="text-[10px] font-bold uppercase">{kpi.label}</h6>

                                    <div className="flex items-center gap-2">
                                        {/* TOTAL */}
                                        <h2 className="text-3xl font-bold">
                                            {typeof data === "number" ? data : data.total}
                                        </h2>

                                        {/* TN / OTH */}
                                        {isSplit && typeof data === "object" && (
                                            <div className="flex gap-2 text-sm font-semibold text-gray-500 mb-2">
                                                <p>-</p>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCardClick(`${kpi.key}_tn`);
                                                    }}
                                                    className={isTnActive ? "underline font-bold text-black" : ""}
                                                >

                                                    {data.tn}
                                                </span>
                                                /
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleCardClick(`${kpi.key}_non_tn`);
                                                    }}
                                                    className={isNonTnActive ? "underline font-bold text-black" : ""}
                                                >
                                                    {data.non_tn}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-[10px] opacity-70">Click to view profiles</p>
                                </motion.div>
                            );
                        })}

                    </section>

                    {/* --- Work Stats Section --- */}
                    {/* <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {WORK_CARDS.map((card, i) => (
                    <div key={i} className="bg-white rounded-xl p-6 border border-[#e6ecf2] shadow-sm flex flex-col justify-between h-full transition hover:-translate-y-1 cursor-pointer">
                        <div className="text-start">
                            <h5 className="text-base font-semibold text-gray-900 mb-1">{card.label}</h5>
                            <p className="text-xs text-gray-500 mb-4">{card.sub}</p>
                        </div>
                        <div className="text-3xl font-bold text-[#000c28] text-start">0</div>
                    </div>
                ))}
            </section> */}

                    {/* --- Profile Detail Table --- */}
                    <section className="bg-white rounded-xl border border-[#e6ecf2] shadow-md p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h5 className="text-lg font-semibold m-0">Prospect Profile Detail ({tableData.length || stats?.filtered_count || 0})</h5>
                            <div className="flex gap-2">
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

                        <div ref={tableRef} className="overflow-x-auto overflow-y-auto max-h-[500px]">
                            <table className="min-w-full border-separate border-spacing-0 table-auto">
                                <thead className="sticky top-0 z-20">
                                    <tr className="bg-gray-50">
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0 rounded-tl-xl">Profile ID</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">DOR</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Name</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Age</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Family Status</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Education Details</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Annual Income</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">City</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">State</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Mode</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Owner</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Photo</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Horo</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">ID</th>
                                        {/* <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Viewed</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Visitors</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Bookmark</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Express Interest</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Express Sent</th> */}
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Last Login</th>
                                        {/* <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">LCD</th> */}
                                        {/* <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Comments</th> */}
                                        {/* <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Next Call Date</th> */}
                                        {/* <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Last Action Date</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Last Action Particulars</th> */}
                                        {/* <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Next Action Date</th> */}
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Call Logs (+)</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0 rounded-tr-xl">Customer Log (+)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableLoading ? (
                                        <tr><td colSpan={15} className="text-center py-10"><CircularProgress /></td></tr>
                                    ) : tableData.length > 0 ? (
                                        tableData.map((profile: any) => (
                                            <tr key={profile.ProfileId} className="hover:bg-gray-50">
                                                <td className="px-3 py-3 text-sm font-bold text-blue-600 border border-[#e5ebf1] whitespace-nowrap">
                                                    <a href={`/viewProfile?profileId=${profile.ProfileId}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                        {profile.ProfileId}
                                                    </a>
                                                </td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap"> {profile.DateOfJoin
                                                    ? new Date(profile.DateOfJoin.replace("T", " ")).toLocaleDateString('en-CA')
                                                    : "N/A"}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{profile.Profile_name || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{profile.age || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{profile.family_status_name || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{profile.other_degree || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{profile.income || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{profile.Profile_city || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{profile.state || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{profile.plan_name || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{profile.owner_name || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap text-center">{yesNo(profile.has_photo)}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap text-center">{yesNo(profile.has_horo)}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap text-center">{yesNo(profile.has_idproof)}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap"> {profile.Last_login_date
                                                    ? new Date(profile.Last_login_date.replace("T", " ")).toLocaleDateString('en-CA')
                                                    : "N/A"}</td>
                                                {/* Call Logs Button */}
                                                <td className="px-3 py-3 whitespace-nowrap text-sm border border-[#e5ebf1]">
                                                    {(profile.last_call_id || profile.last_action_id) ? (
                                                        <button
                                                            className="text-[#1d4ed8] font-semibold hover:underline cursor-pointer"
                                                            onClick={() => handleOpenModal(profile, 'call')}
                                                        >
                                                            View
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400 cursor-not-allowed"> No call logs</span>
                                                    )}
                                                </td>

                                                {/* Customer Log Button */}
                                                <td className="px-3 py-3 whitespace-nowrap text-sm border border-[#e5ebf1]">
                                                    <button
                                                        className="text-[#1d4ed8] font-semibold hover:underline cursor-pointer"
                                                        onClick={() => handleOpenModal(profile, 'customer')}
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={15} className="text-center py-8 text-black font-semibold text-sm border border-[#e5ebf1]">
                                                No Prospect Profiles found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </>
            )}
            {/* --- Modal Popups --- */}
            <Dialog
                open={openModal}
                onClose={handleCloseModal}
                maxWidth="md"
                fullWidth
                PaperProps={{ sx: { borderRadius: '20px', p: 1 } }}
            >
                <DialogTitle sx={{ m: 0, p: 3, textAlign: 'center', fontWeight: 800, color: '#0A1735' }}>
                    {modalType === 'call' ? 'Call & Service Logs' : 'Customer Activity Log'}
                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1 }}>
                        Profile ID: {selectedProfile?.ProfileId || 'N/A'}
                    </Typography>
                    <IconButton onClick={handleCloseModal} sx={{ position: 'absolute', right: 12, top: 12, bgcolor: '#F1F5F9' }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Divider />
                <DialogContent sx={{ p: 3 }}>
                    {logLoading ? (
                        <Box sx={{ textAlign: "center", py: 6 }}>
                            <CircularProgress size={32} />
                            <Typography sx={{ mt: 2, fontSize: "0.9rem", color: "#475569" }}>
                                Loading...
                            </Typography>
                        </Box>
                    ) : (
                        selectedProfile &&
                        (modalType === "call" ? (
                            <CallLogPopup profile={selectedProfile} />
                        ) : (
                            <CustomerLogPopup profile={selectedProfile} />
                        ))
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProspectDashboard;
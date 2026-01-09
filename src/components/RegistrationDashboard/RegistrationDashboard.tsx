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
import { ActionLog, CallLog, ProfileActionCount } from '../RenewalDashboard/RenewalDahboardPage';
import '../../index.css';

// --- Types & Interfaces ---
interface RegistrationProfile {
    ProfileId: string;
    Profile_name: string;
    Profile_dob: string;
    Gender: string;
    Profile_city: string;
    state: string | null;
    owner_name: string | null;
    plan_name: string;
    status_name: string;
    call_status: string | null;
    DateOfJoin: string;
    Last_login_date: string | null;
    next_call_date: string | null;
    has_photo: number;
    has_horo: number;
    family_status_name: string | null;
    degree_name: string | null;
    other_degree: string | null;
    income: string | null;
    age: number;
    last_action_id: string;
    last_call_id: string;
}

export interface ProfileOwner {
    id: string;
    username: string; // or name, adjust based on your API response
}

export interface Plan {
    id: string;
    plan_name: string; // adjust based on your API response
}

// // --- Configuration ---
const KPI_CONFIG = [
    { label: "TOTAL REGISTRATION", key: "", color: "bg-white" },
    { label: "APPROVED", key: "approved", color: "bg-white" },
    { label: "UNAPPROVED", key: "unapproved", color: "bg-white" },
    { label: "NON LOGGED IN", key: "non_login", color: "bg-white" },
    { label: "PREMIUM", key: "premium", color: "bg-white" },
    { label: "ONLINE APPROVED - TN/OTH", key: "online_approved", color: "bg-white" },
    { label: "ADMIN APPROVED - TN/OTH", key: "admin_approved", color: "bg-white" },
    { label: "ONLINE UNAPPROVED - TN/OTH", key: "online_unapproved", color: "bg-white" },
    { label: "ADMIN UNAPPROVED - TN/OTH", key: "admin_unapproved", color: "bg-white" },
    { label: "TODAY'S LOGIN", key: "today_login", color: "bg-white" },
    { label: "TODAY'S WORK", key: "today_work", color: "bg-white" },
    { label: "PENDING WORK", key: "pending_work", color: "bg-white" },
    { label: "TODAY'S ACTION", key: "today_task", color: "bg-white" },
    { label: "PENDING ACTION", key: "pending_task", color: "bg-white" },
    { label: "NO PHOTO", key: "no_photo", color: "bg-white" },
    { label: "NO HORO", key: "no_horo", color: "bg-white" },
    { label: "NO ID", key: "no_id", color: "bg-white" },
    { label: "HOT", key: "hot", color: "bg-white" },
    { label: "WARM", key: "warm", color: "bg-white" },
    { label: "COLD", key: "cold", color: "bg-white" },
    { label: "NOT INTERESTED", key: "not_interested", color: "bg-white" },
    { label: "TODAY'S BIRTHDAY", key: "today_birthday", color: "bg-white" },
];

export const CARD_COLOR_CLASSES: Record<string, string> = {
    primary: "bg-[#EAF2FF]",        // Total / default
    success: "bg-[#E6F7F1]",        // Approved / Premium
    danger: "bg-[#FFECEC]",         // Unapproved / No Photo / No ID
    warning: "bg-[#FFF6E5]",        // Pending / Work
    info: "bg-[#EEF4FF]",           // Login / Activity
    muted: "bg-[#F7F7F7]",          // Cold / Non-login
    hot: "bg-[#FFE4E4]",            // HOT
    warm: "bg-[#FFF6E4]",           // WARM
    cold: "bg-[#F7F7F7]",           // COLD
    birthday: "bg-[#FFF0F5]",       // Birthday
    admin: "bg-[#0A1735] text-white", // Admin Approved
};

export const getRegistrationCardColor = (label: string) => {
    const map: Record<string, string> = {
        "TOTAL REGISTRATION": "primary",

        "APPROVED": "success",
        "UNAPPROVED": "danger",

        "NON LOGGED IN": "muted",

        "PREMIUM": "success",

        "ONLINE APPROVED - TN/OTH": "info",
        "ADMIN APPROVED - TN/OTH": "info",

        "ONLINE UNAPPROVED - TN/OTH": "warning",
        "ADMIN UNAPPROVED - TN/OTH": "danger",

        "TODAY'S LOGIN": "admin",

        "TODAY'S WORK": "warning",
        "PENDING WORK": "warning",

        "TODAY'S ACTION": "warning",
        "PENDING ACTION": "warning",

        "NO PHOTO": "danger",
        "NO HORO": "danger",
        "NO ID": "danger",

        "HOT": "hot",
        "WARM": "warm",
        "COLD": "cold",
        "NOT INTERESTED": "danger",

        "TODAY'S BIRTHDAY": "birthday",
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

const RegistrationDashboard: React.FC = () => {
    // --- State ---
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<'call' | 'customer' | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<RegistrationProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [profileOwners, setProfileOwners] = useState<ProfileOwner[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [ownersLoading, setOwnersLoading] = useState(false);
    const [plansLoading, setPlansLoading] = useState(false);
    const [tableData, setTableData] = useState<RegistrationProfile[]>([]);
    const [stats, setStats] = useState<any>(null);
    const RoleID = localStorage.getItem('role_id') || sessionStorage.getItem('role_id');
    const SuperAdminID = localStorage.getItem('id') || sessionStorage.getItem('id');
    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        staff: SuperAdminID || "", // owner
        plan: "", // plan_id
        minAge: "", // age_from
        maxAge: "", // age_to
        searchQuery: "", // search
        countFilter: "",
    });
    const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null);
    const [applyFilters, setApplyFilters] = useState(false);
    const tableRef = useRef<HTMLDivElement>(null);
    const [scrollSource, setScrollSource] = useState<'card' | 'filter' | null>(null);
    const [tableLoading, setTableLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [originalTableData, setOriginalTableData] = useState<RegistrationProfile[]>([]);
    const [logLoading, setLogLoading] = React.useState<boolean>(false);
    const [callLog, setCallLog] = useState<CallLog | null>(null);
    const [actionLog, setActionLog] = useState<ActionLog | null>(null);
    const [actionCount, setActionCount] = useState<ProfileActionCount | null>(null);

    // --- Styles ---
    const btnDark = "bg-[#0A1735] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#1f2d50] transition shadow-sm border-none cursor-pointer";
    const btnOutline = "bg-white border border-gray-300 text-[#0A1735] px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-50 transition shadow-sm cursor-pointer";

    type KpiResult = number | { total: number; tn: number; kat: number };
    const getKpiData = (stats: any, label: string): KpiResult => {
        // 2. Consistent return for null/empty stats
        if (!stats) return { total: 0, tn: 0, kat: 0 };
        switch (label) {
            case "TOTAL REGISTRATION": return stats.total_registration || 0;
            case "APPROVED": return stats.approved || 0;
            case "UNAPPROVED": return stats.unapproved || 0;
            case "NON LOGGED IN": return stats.non_logged_in || 0;
            case "PREMIUM": return stats.premium || 0;
            // case "ONLINE APPROVED - TN/KAT": return stats.online?.total_approved || 0;
            // case "ADMIN APPROVED - TN/KAT": return stats.admin?.total_approved || 0;
            // case "ONLINE UNAPPROVED - TN/KAT": return stats.online?.total_unapproved || 0;
            // case "ADMIN UNAPPROVED - TN/KAT": return stats.admin?.total_unapproved || 0;
            case "ONLINE APPROVED - TN/OTH":
                return {
                    total: stats.online?.total_approved || 0,
                    tn: stats.online?.approved?.TN || 0,
                    kat: stats.online?.approved?.KAT || 0
                };
            case "ADMIN APPROVED - TN/OTH":
                return {
                    total: stats.admin?.total_approved || 0,
                    tn: stats.admin?.approved?.TN || 0,
                    kat: stats.admin?.approved?.KAT || 0
                };
            case "ONLINE UNAPPROVED - TN/OTH":
                return {
                    total: stats.online?.total_unapproved || 0,
                    tn: stats.online?.unapproved?.TN || 0,
                    kat: stats.online?.unapproved?.KAT || 0
                };
            case "ADMIN UNAPPROVED - TN/OTH":
                return {
                    total: stats.admin?.total_unapproved || 0,
                    tn: stats.admin?.unapproved?.TN || 0,
                    kat: stats.admin?.unapproved?.KAT || 0
                };
            case "TODAY'S LOGIN": return stats.today_login || 0;
            case "TODAY'S WORK": return stats.work_counts?.today_work || 0;
            case "PENDING WORK": return stats.work_counts?.pending_work || 0;
            case "TODAY'S ACTION": return stats.task_counts?.today_task || 0;
            case "PENDING ACTION": return stats.task_counts?.pending_task || 0;
            case "NO PHOTO": return stats.no_photo || 0;
            case "NO HORO": return stats.no_horo || 0;
            case "NO ID": return stats.no_id || 0;
            case "HOT": return stats.interest?.hot || 0;
            case "WARM": return stats.interest?.warm || 0;
            case "COLD": return stats.interest?.cold || 0;
            case "NOT INTERESTED": return stats.interest?.not_interested || 0;
            case "TODAY'S BIRTHDAY": return stats.today_birthday || 0;
            default: return { total: 0, tn: 0, kat: 0 };
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

    // --- Form Handlers ---
    const handleFilterChange = (field: string, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    // const handleCardClick = (key: string) => {
    //     // Show loading on table immediately
    //     setTableLoading(true);

    //     setFilters(prev => ({ ...prev, countFilter: key }));
    //     setScrollSource('card'); // Mark that we need to scroll
    //     setApplyFilters(true);
    // };

    const handleCardClick = (key: string) => {
        setTableLoading(true);
        // Clear the search query so the new category isn't hidden by an old search
        // setFilters(prev => ({ ...prev, countFilter: key, searchQuery: "" }));
        setFilters(prev => {
            const isSameFilter = prev.countFilter === key;
            return {
                ...prev,
                countFilter: isSameFilter ? "" : key,
                searchQuery: "" // clear search when card is clicked
            };
        });
        setScrollSource('card');
        setApplyFilters(true);
    };

    const handleReset = () => {
        // Show loading on both sections
        setLoading(true);
        setTableLoading(true);

        setFilters({
            fromDate: "",
            toDate: "",
            //staff: RoleID === "7" ? "" : (SuperAdminID || ""),
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


    // 1. Update the Fetch function to be called only when applyFilters is true
    const fetchDashboardData = useCallback(async () => {
        setTableLoading(true);
        const params = new URLSearchParams();

        // Map your local state to API parameters
        if (filters.fromDate) params.append('from_date', filters.fromDate);
        if (filters.toDate) params.append('to_date', filters.toDate);
        if (filters.minAge) params.append('age_from', filters.minAge);
        if (filters.maxAge) params.append('age_to', filters.maxAge);
        if (filters.plan) params.append('plan_id', filters.plan);
        //if (filters.searchQuery) params.append('search', filters.searchQuery);
        if (filters.countFilter) params.append('countFilter', filters.countFilter);
        // Logic for Owner
        // const ownerId = (RoleID === "7") ? filters.staff : (SuperAdminID || "");
        if (filters.staff) params.append("owner", filters.staff);

        try {
            const response = await apiAxios.get('api/registration-report/', {
                params: Object.fromEntries(params.entries())
            });

            if (response.data.status) {
                setOriginalTableData(response.data.data);
                setTableData(response.data.data);
                setStats(response.data);
            }
        } catch (e) {
            console.error("Error:", e);
        } finally {
            setLoading(false);
            setTableLoading(false); // Stop the spinner
            setApplyFilters(false);
            setScrollSource(null);
        }
    }, [filters, RoleID, SuperAdminID]); // These are fine as dependencies because the useEffect handles the "when"

    // 2. Control the trigger
    useEffect(() => {
        if (applyFilters) {
            fetchDashboardData();
        }
    }, [applyFilters, fetchDashboardData]);

    // 3. Initial Load

    useEffect(() => {
        setLoading(true);       // This triggers the FullWidthLoadingSpinner
        setTableLoading(true);
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (applyFilters) {
            // If it was a card click, scroll first, then fetch
            if (scrollSource === 'card' && tableRef.current) {
                tableRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Small delay to let the scroll animation start before the heavy API call
                setTimeout(() => {
                    fetchDashboardData();
                }, 400);
            } else {
                // Filter/Reset click: just fetch
                fetchDashboardData();
            }
        }
    }, [applyFilters, scrollSource, fetchDashboardData]);



    // Frontend search - searches both Profile ID and Profile Name
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
    }, [filters.searchQuery, originalTableData, tableLoading]); // Added tableLoading dependency

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

    const handleDownloadReport = async () => {
        setIsDownloading(true);
        try {
            const params = new URLSearchParams();

            // Map current filters to params (matching your fetchDashboardData logic)
            if (filters.fromDate) params.append('from_date', filters.fromDate);
            if (filters.toDate) params.append('to_date', filters.toDate);
            if (filters.minAge) params.append('age_from', filters.minAge);
            if (filters.maxAge) params.append('age_to', filters.maxAge);
            if (filters.plan) params.append('plan_id', filters.plan);
            //if (filters.searchQuery) params.append('search', filters.searchQuery);
            if (filters.countFilter) params.append('countFilter', filters.countFilter);

            // const ownerId = (RoleID === "7") ? filters.staff : (SuperAdminID || "");
            // if (ownerId) params.append("owner", ownerId);
            if (filters.staff) params.append("owner", filters.staff);
            // Add the export flag required by your backend
            params.append('export', 'excel');

            const response = await apiAxios.get(`api/registration-report/`, {
                params: Object.fromEntries(params.entries()),
                responseType: 'blob',
            });

            // Create download link
            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', `Registration_Report_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(downloadUrl);

        } catch (e) {
            console.error("Excel download failed:", e);
            alert("Failed to download the report. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };


    const handleOpenModal = async (profile: RegistrationProfile, type: "call" | "customer") => {
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

    const CallLogPopup = ({ profile }: { profile: RegistrationProfile }) => {
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

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>Call Particulars</Typography>
                                <Typography sx={valueStyle}>{call?.particulars_name || "N/A"}</Typography>
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

    const CustomerLogPopup = ({ profile }: { profile: RegistrationProfile }) => (
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
                    <h2 className="text-2xl font-bold mb-1">Registration Dashboard</h2>
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
                                {/* Icon positioned to the right */}
                                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                    <RiArrowDropDownLine size={30} className="text-gray-500" />
                                </div>
                            </div>
                        </div>
                        {/* )} */}
                        <div className="text-start">
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
                        </div>
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
                        <button
                            className={btnOutline}
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <button className={btnDark} onClick={handleApplyFilters}>Apply Filters</button>
                    </div>
                </div>
            </section>
            {loading ? (
                <section className="mt-4">
                    <FullWidthLoadingSpinner />
                </section>
            ) : (
                <>
                    {/* --- KPI Grid --- */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
                        {KPI_CONFIG.map((kpi, i) => {
                            const data = getKpiData(stats, kpi.label);
                            const isLocationCard = kpi.label.includes("TN/OTH");

                            // Check if the current filter belongs to THIS card
                            // This will be true if countFilter is 'online_approved' OR 'online_approved_tn' etc.
                            const isActiveCard = filters.countFilter.startsWith(kpi.key) && kpi.key !== "";

                            // Specific checks for sub-items
                            const isTnActive = filters.countFilter === `${kpi.key}_tn`;
                            const isKatActive = filters.countFilter === `${kpi.key}_kat`;
                            const isTotalActive = filters.countFilter === kpi.key;

                            return (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -2 }}
                                    onClick={() => handleCardClick(kpi.key)}
                                    //                     className={`${kpi.color} p-5 rounded-2xl min-h-[140px] border transition shadow-sm relative cursor-pointer
                                    //     ${isActiveCard ? 'border-4 border-black/50 shadow-lg' : 'border-[#E3E6EE]'}
                                    // `}
                                    className={`${getRegistrationCardColor(kpi.label)} p-5 rounded-2xl min-h-[140px] border border-[#E3E6EE] flex flex-col justify-center cursor-pointer transition-all shadow-sm hover:shadow-md ${filters.countFilter === kpi.key ? 'border-4 border-black/40 shadow-lg' : ''}`}
                                >
                                    <h6 className="text-[10px] font-bold mb-1 tracking-wider uppercase opacity-80 text-start">
                                        {kpi.label}
                                    </h6>
                                    <div className="flex items-baseline gap-2">
                                        {/* Main Total Number - Underlined if specifically selected */}
                                        <h2 className={`text-3xl text-start font-bold mb-1 transition-all
                        ${isTotalActive ? 'decoration-gray-600' : ''}
                    `}>
                                            {loading ? <CircularProgress size={16} /> : typeof data === 'number' ? data : data.total}
                                        </h2>

                                        {/* Dynamic Sub-counts for TN/KAT */}
                                        {isLocationCard && !loading && typeof data === 'object' && (
                                            <div className="flex gap-2 text-sm font-semibold text-gray-500">
                                                <p>-</p>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent parent card click
                                                        handleCardClick(`${kpi.key}_tn`);
                                                    }}
                                                    className={`hover:text-black transition-all ${isTnActive ? 'underline decoration-2 underline-offset-4 text-black font-bold' : ''}`}
                                                >
                                                    {data.tn}
                                                </span>
                                                <span className="text-[10px] opacity-40">/</span>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent parent card click
                                                        handleCardClick(`${kpi.key}_kat`);
                                                    }}
                                                    className={`hover:text-black transition-all ${isKatActive ? 'underline decoration-2 underline-offset-4 text-black font-bold' : ''}`}
                                                >
                                                    {data.kat}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-[10px] opacity-70 text-start mt-1">
                                        {isActiveCard ? "Currently filtering" : "Click to view profiles"}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

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
                    <section ref={tableRef} className="bg-white rounded-xl border border-[#e6ecf2] shadow-md p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h5 className="text-lg font-semibold m-0">Registration Profile Detail ({tableData.length || stats?.filtered_count || 0})</h5>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search Profile ID / Name"
                                    value={filters.searchQuery}
                                    // onChange={(e) => {
                                    //     const val = e.target.value;
                                    //     setFilters({ ...filters, searchQuery: val });
                                    //     if (searchTimer) clearTimeout(searchTimer);
                                    //     setSearchTimer(setTimeout(() => setApplyFilters(true), 1500));
                                    // }}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setFilters({ ...filters, searchQuery: val });
                                        // REMOVED: Timer logic - filtering happens instantly via useEffect
                                    }}
                                    className="w-[250px] h-10 px-4 rounded-full border border-gray-300 text-sm focus:outline-none focus:border-gray-500 transition"
                                />
                                <button
                                    onClick={() => {
                                        setFilters({ ...filters, searchQuery: "" });
                                        // REMOVED: setApplyFilters(true) - useEffect handles it
                                    }}
                                    className="h-10 px-4 rounded-full bg-white border border-gray-300 text-sm font-semibold hover:bg-gray-50 transition">Clear</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {/* This inner div enables vertical scrolling while keeping headers potentially visible if you add 'sticky' later */}
                            <div className="max-h-[500px] overflow-y-auto">

                                <table className="min-w-full border-separate border-spacing-0 table-auto">
                                    <thead className="sticky top-0 z-20">
                                        <tr className="bg-gray-50">
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0 rounded-tl-xl">
                                                Profile ID
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                Name
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                Age
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                DOR
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                Family Status
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                Education Details
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                Annual Income
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                City
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                State
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                Mode
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                Owner
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                Mode Last Login
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                Profile Status
                                            </th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                Call Status
                                            </th>
                                            {/* <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">
                                                Call Comments
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0 rounded-tr-xl">
                                                Next Call Date
                                            </th> */}
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Call Logs (+)</th>
                                            <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0 rounded-tr-xl">Customer Log (+)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tableLoading ? (
                                            <tr>
                                                <td colSpan={16} className="py-20">
                                                    <div className="flex flex-col items-center justify-center">
                                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1d4ed8] mb-4"></div>
                                                        <p className="text-sm text-gray-600 font-medium">Loading Registration Profiles...</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : tableData.length > 0 ? (
                                            tableData.map((row) => (
                                                <tr key={row.ProfileId} className="hover:bg-gray-50">
                                                    <td className="px-3 py-3 text-sm font-bold text-blue-600 border border-[#e5ebf1] whitespace-nowrap">
                                                        <a href={`/viewProfile?profileId=${row.ProfileId}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                                            {row.ProfileId}
                                                        </a>
                                                    </td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.Profile_name}</td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.age}</td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">
                                                        {/* {row.DateOfJoin
                                                            ? new Date(row.DateOfJoin).toISOString().split('T')[0]
                                                            : 'N/A'} */}

                                                        {row.DateOfJoin
                                                            ? new Date(row.DateOfJoin.replace("T", " ")).toLocaleDateString('en-CA')
                                                            : "N/A"}
                                                    </td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.family_status_name || 'N/A'}</td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.degree_name || row.other_degree || 'N/A'}</td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.income || 'N/A'}</td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.Profile_city || 'N/A'}</td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.state || 'N/A'}</td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.plan_name || 'N/A'}</td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.owner_name || 'N/A'}</td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">
                                                        {/* {row.Last_login_date
                                                            ? new Date(row.Last_login_date).toISOString().split('T')[0]
                                                            : 'N/A'} */}
                                                        {row.Last_login_date
                                                            ? new Date(row.Last_login_date.replace("T", " ")).toLocaleDateString('en-CA')
                                                            : "N/A"}
                                                    </td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.status_name}</td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">
                                                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusPillClass(row.call_status || 'COLD')}`}>
                                                            {row.call_status || 'N/A'}
                                                        </span>
                                                    </td>
                                                    {/* <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">N/A</td>
                                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.next_call_date || 'N/A'}</td> */}
                                                    {/* Call Logs Button */}
                                                    <td className="px-3 py-3 whitespace-nowrap text-sm border border-[#e5ebf1]">
                                                        {(row.last_call_id || row.last_action_id) ? (
                                                            <button
                                                                className="text-[#1d4ed8] font-semibold hover:underline cursor-pointer"
                                                                onClick={() => handleOpenModal(row, 'call')}
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
                                                            onClick={() => handleOpenModal(row, 'customer')}
                                                        >
                                                            View
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={16} className="text-center py-8 text-black font-semibold text-sm border border-[#e5ebf1]">
                                                    No Profiles found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                    <Dialog
                        open={openModal}
                        onClose={handleCloseModal}
                        maxWidth="md"
                        fullWidth
                        PaperProps={{
                            sx: { borderRadius: '20px', p: 1, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }
                        }}
                    >
                        <DialogTitle
                            sx={{
                                m: 0,
                                p: 3,
                                textAlign: 'center',
                                fontWeight: 800,
                                color: '#0A1735',
                            }}
                        >
                            {modalType === 'call' ? 'Call & Service Logs' : 'Customer Log'}

                            <Typography variant="caption" sx={{ color: '#64748b', display: 'block', mt: 1 }}>
                                Profile ID: {selectedProfile?.ProfileId || 'N/A'}
                            </Typography>
                            <IconButton
                                onClick={handleCloseModal}
                                sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    bgcolor: '#F1F5F9',
                                    '&:hover': { bgcolor: '#E2E8F0' }
                                }}
                            >
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
                </>
            )
            }
        </div >
    );
};

export default RegistrationDashboard;
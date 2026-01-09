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
import { apiAxios } from '../../../../api/apiUrl';
import { CARD_COLOR_CLASSES } from '../../../RegistrationDashboard/RegistrationDashboard';
import { ActionLog, CallLog, ProfileActionCount } from '../../../RenewalDashboard/RenewalDahboardPage';

// --- Types & Interfaces ---
interface PremiumProfile {
    ProfileId: string;
    Profile_name: string;
    age: number;
    plan_name: string;
    membership_startdate: string;
    membership_enddate: string;
    has_photo: number;
    has_horo: number;
    Profile_idproof: string;
    owner_name: string;
    has_idproof: number;
    Last_login_date: string;
    call_status: string | null;
    last_call_date: string | null;
    // Activity counts for Modal
    yesterday_vys_assist: number;
    yesterday_express_sent: number;
    yesterday_express_received: number;
    yesterday_bookmark: number;
    last_action_id: string;
    last_call_id: string;

}

const KPI_CONFIG = [
    { label: "TOTAL PREMIUM", key: "", color: "bg-white" },

    // Plan specific cards with Call/Action counts
    { label: "Gold | Call >60 days | Action >60days", key: "plan_gold ", color: "bg-white", subKeys: true },
    { label: "PLATINUM | CALL >45 DAYS | ACTION > 45 DAYS", key: "plan_platinum", color: "bg-white", subKeys: true },
    { label: "PLATINUM PRIVATE | CALL >45 DAYS | ACTION > 45 DAYS", key: "plan_platinum_private", color: "bg-white", subKeys: true },
    { label: "VYSYAMALA DELIGHT | CALL >45 DAYS | ACTION > 45 DAYS", key: "plan_vys_delight", color: "bg-white", subKeys: true },

    { label: "FEMALE", key: "female", color: "bg-white" },
    { label: "MALE", key: "male", color: "bg-white" },
    { label: "AGE > 30", key: "age_above_30", color: "bg-white" },
    { label: "AGE < 30", key: "age_under_30", color: "bg-white" },

    // Location Card
    { label: "TN | OTH", key: "tn", color: "bg-white", type: "location" },

    { label: "FIRST 3M PROFILE", key: "first_three_month", color: "bg-white" },
    { label: "LAST 4M PROFILE", key: "last_four_month", color: "bg-white" },

    { label: "TODAY'S LOGIN", key: "today_login", color: "bg-white" },
    { label: "YESTERDAY'S LOGIN", key: "yesterday_login", color: "bg-white" },
    { label: "TODAY'S BIRTHDAY", key: "today_birthday", color: "bg-white" },

    { label: "NO HORO", key: "no_horo", color: "bg-white" },
    { label: "NO PHOTO", key: "no_photo", color: "bg-white" },
    { label: "NO ID", key: "no_id", color: "bg-white" },

    { label: "CURRENT MONTH PREMIUM", key: "cur_month_registrations", color: "bg-white" },

    // Work Counts
    { label: "TODAY'S CALL", key: "today_work", color: "bg-white" },
    { label: "PENDING CALL", key: "pending_work", color: "bg-white" },
    { label: "TODAY'S ACTION", key: "today_task", color: "bg-white" },
    { label: "PENDING ACTION", key: "pending_task", color: "bg-white" },

    // Yesterday's Activity
    { label: "YESTERDAY'S VYSASSIST", key: "yesterday_vys_assist", color: "bg-white" },
    { label: "YESTERDAY'S EXPRESS INT SENT", key: "yesterday_express_sent", color: "bg-white" },
    { label: "YESTERDAY'S EXPRESS INT RECEIVED", key: "yesterday_express_received", color: "bg-white" },
    { label: "YESTERDAY'S BOOKMARK", key: "yesterday_bookmark", color: "bg-white" },
];

export const getPremiumCardColor = (label: string) => {
    const map: Record<string, string> = {
        // ===================== TOTAL =====================
        "TOTAL PREMIUM": "primary",

        // ===================== PLAN BASED =====================
        "Gold | Call >60 days | Action >60days": "warning",
        "PLATINUM | CALL >45 DAYS | ACTION > 45 DAYS": "info",
        "PLATINUM PRIVATE | CALL >45 DAYS | ACTION > 45 DAYS": "success",
        "VYSYAMALA DELIGHT | CALL >45 DAYS | ACTION > 45 DAYS": "purple",

        // ===================== GENDER =====================
        "FEMALE": "pink",
        "MALE": "info",

        // ===================== AGE =====================
        "AGE > 30": "info",
        "AGE < 30": "info",

        // ===================== LOCATION =====================
        "TN | OTH": "muted",

        // ===================== PROFILE AGE =====================
        "FIRST 3M PROFILE": "success",
        "LAST 4M PROFILE": "warning",

        // ===================== LOGIN =====================
        "TODAY'S LOGIN": "success",
        "YESTERDAY'S LOGIN": "muted",

        // ===================== BIRTHDAY =====================
        "TODAY'S BIRTHDAY": "birthday",

        // ===================== MISSING DATA =====================
        "NO HORO": "danger",
        "NO PHOTO": "danger",
        "NO ID": "danger",

        // ===================== PREMIUM =====================
        "CURRENT MONTH PREMIUM": "primary",

        // ===================== WORK / TASK =====================
        "TODAY'S CALL": "warning",
        "PENDING CALL": "danger",
        "TODAY'S ACTION": "warning",
        "PENDING ACTION": "danger",

        // ===================== YESTERDAY ACTIVITY =====================
        "YESTERDAY'S VYSASSIST": "info",
        "YESTERDAY'S EXPRESS INT SENT": "success",
        "YESTERDAY'S EXPRESS INT RECEIVED": "info",
        "YESTERDAY'S BOOKMARK": "muted",
    };

    const key = map[label] || "primary";
    return CARD_COLOR_CLASSES[key];
};


const PremiumDashboard: React.FC = () => {
    // --- State ---
    const [openModal, setOpenModal] = useState(false);
    const [modalType, setModalType] = useState<'call' | 'customer' | null>(null);
    const [selectedProfile, setSelectedProfile] = useState<PremiumProfile | null>(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [tableData, setTableData] = useState<PremiumProfile[]>([]);
    const [tableLoading, setTableLoading] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);
    const SuperAdminID = localStorage.getItem('id') || sessionStorage.getItem('id');
    const RoleID = localStorage.getItem('role_id') || sessionStorage.getItem('role_id');
    const [filters, setFilters] = useState({
        fromDate: "",
        toDate: "",
        staff: SuperAdminID || "",
        plan: "",
        minAge: "",
        maxAge: "",
        searchQuery: "", // search
        countFilter: "",
        genderFilter: "",
    });
    const [profileOwners, setProfileOwners] = useState<any[]>([]);
    const [plans, setPlans] = useState<any[]>([]);
    const [scrollSource, setScrollSource] = useState<'card' | 'filter' | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);
    const [applyFilters, setApplyFilters] = useState(false);
    const [originalTableData, setOriginalTableData] = useState<PremiumProfile[]>([]);
    const [activeKpiKey, setActiveKpiKey] = useState<string>("");
    const [activeSubType, setActiveSubType] = useState<"call" | "action" | null>(null);
    const [logLoading, setLogLoading] = React.useState<boolean>(false);
    const [callLog, setCallLog] = useState<CallLog | null>(null);
    const [actionLog, setActionLog] = useState<ActionLog | null>(null);
    const [actionCount, setActionCount] = useState<ProfileActionCount | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // --- Styles ---
    const btnDark = "bg-[#0A1735] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#1f2d50] transition shadow-sm border-none cursor-pointer";
    const btnOutline = "bg-white border border-gray-300 text-[#0A1735] px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-50 transition shadow-sm cursor-pointer";

    // Updated type to handle Plan stats (Total/Call/Action) and Location (TN/Non-TN)
    type KpiResult = number | string | { total: number; call: number; action: number } | { tn: number; nonTn: number };

    const getKpiData = (stats: any, label: string): KpiResult => {
        if (!stats) return 0;

        switch (label) {
            case "TOTAL PREMIUM":
                return stats.total_profiles || 0;

            case "Gold | Call >60 days | Action >60days":
                return stats.plan_counts?.gold ?? { total: 0, call: 0, action: 0 };

            case "PLATINUM | CALL >45 DAYS | ACTION > 45 DAYS":
                return stats.plan_counts?.platinum ?? { total: 0, call: 0, action: 0 };

            case "PLATINUM PRIVATE | CALL >45 DAYS | ACTION > 45 DAYS":
                return stats.plan_counts?.platinum_private ?? { total: 0, call: 0, action: 0 };

            case "VYSYAMALA DELIGHT | CALL >45 DAYS | ACTION > 45 DAYS":
                return stats.plan_counts?.vysyamala_delight ?? { total: 0, call: 0, action: 0 };


            case "FEMALE": return stats.female || 0;
            case "MALE": return stats.male_count || 0;
            case "AGE > 30": return stats.age_above_30 || 0;
            case "AGE < 30": return stats.age_under_30 || 0;

            case "TN | OTH":
                return {
                    tn: stats.state_count?.tn || 0,
                    nonTn: stats.state_count?.['non-tn'] || 0
                };

            case "FIRST 3M PROFILE": return stats.fisrt_three_month || 0;
            case "LAST 4M PROFILE": return stats.last_four_month || 0;
            case "TODAY'S LOGIN": return stats.today_login || 0;
            case "YESTERDAY'S LOGIN": return stats.yesterday_login || 0;
            case "TODAY'S BIRTHDAY": return stats.today_birthday || 0;

            case "NO HORO": return stats.no_horo || 0;
            case "NO PHOTO": return stats.no_photo || 0;
            case "NO ID": return stats.no_id || 0;

            case "CURRENT MONTH PREMIUM": return stats.cur_month_registrations || 0;

            case "TODAY'S CALL": return stats.work_counts?.today_work || 0;
            case "PENDING CALL": return stats.work_counts?.pending_work || 0;
            case "TODAY'S ACTION": return stats.task_counts?.today_task || 0;
            case "PENDING ACTION": return stats.task_counts?.pending_task || 0;

            // Activity Mappings
            case "YESTERDAY'S VYSASSIST": return stats.yesterday_activity?.vys_assist || 0;
            case "YESTERDAY'S EXPRESS INT SENT": return stats.yesterday_activity?.express_interest_sent || 0;
            case "YESTERDAY'S EXPRESS INT RECEIVED": return stats.yesterday_activity?.express_interest_received || 0;
            case "YESTERDAY'S BOOKMARK": return stats.yesterday_activity?.bookmark || 0;

            default: return 0;
        }
    };

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

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [usersRes, plansRes] = await Promise.all([
                    apiAxios.get('api/users/'),
                    apiAxios.get('api/get-plans/')
                ]);
                setProfileOwners(usersRes.data);
                setPlans(plansRes.data.plans);
            } catch (e) {
                console.error("Metadata fetch failed", e);
            }
        };
        fetchMetadata();
    }, []);

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
        if (currentFilters.genderFilter) {
            params.append("genderFilter", currentFilters.genderFilter);
        }

        // const ownerId = (RoleID === "7") ? currentFilters.staff : (SuperAdminID || "");
        // if (ownerId) params.append("owner", ownerId);
        if (currentFilters.staff) params.append("owner", currentFilters.staff);

        try {
            const response = await apiAxios.get('api/premium-report/', {
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
            if (filters.genderFilter) {
                params.append("genderFilter", filters.genderFilter);
            }

            // const ownerId = (RoleID === "7") ? filters.staff : (SuperAdminID || "");
            // if (ownerId) params.append("owner", ownerId);
            if (filters.staff) params.append("owner", filters.staff);

            // 🔑 IMPORTANT: export flag
            params.append('export', 'excel');

            const response = await apiAxios.get('api/premium-report/', {
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
                `Premium_Report_${new Date().toISOString().slice(0, 10)}.xlsx`
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

        const updatedFilters = { ...filters, searchQuery: "" };

        // ================= TOGGLE OFF =================
        const isSameGender =
            (key === "male" || key === "female") &&
            filters.genderFilter === key;

        const isSameNormalKpi =
            !key.endsWith("_call") &&
            !key.endsWith("_action") &&
            key === filters.countFilter;

        const isSameCall =
            key.endsWith("_call") &&
            filters.countFilter === key;

        const isSameAction =
            key.endsWith("_action") &&
            filters.countFilter === key;

        // 👉 If same card clicked again → RESET everything
        if (isSameGender || isSameNormalKpi || isSameCall || isSameAction) {
            setFilters({
                ...updatedFilters,
                countFilter: "",
                genderFilter: "",
            });

            setActiveKpiKey("");
            setActiveSubType(null);

            fetchDashboardData({
                ...updatedFilters,
                countFilter: "",
                genderFilter: "",
            });

            return;
        }

        // ================= APPLY NEW SELECTION =================

        // -------- GENDER --------
        if (key === "male" || key === "female") {
            updatedFilters.genderFilter = key;
            updatedFilters.countFilter = "";

            setActiveKpiKey("");
            setActiveSubType(null);
        }

        // -------- CALL --------
        else if (key.endsWith("_call")) {
            const baseKey = key.replace("_call", "");

            updatedFilters.countFilter = key;
            updatedFilters.genderFilter = "";

            setActiveKpiKey(baseKey);
            setActiveSubType("call");
        }

        // -------- ACTION --------
        else if (key.endsWith("_action")) {
            const baseKey = key.replace("_action", "");

            updatedFilters.countFilter = key;
            updatedFilters.genderFilter = "";

            setActiveKpiKey(baseKey);
            setActiveSubType("action");
        }

        // -------- NORMAL KPI --------
        else {
            updatedFilters.countFilter = key;
            updatedFilters.genderFilter = "";

            setActiveKpiKey(key);
            setActiveSubType(null);
        }

        setFilters(updatedFilters);
        tableRef.current?.scrollIntoView({ behavior: "smooth" });
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
            genderFilter: "",
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

    const getPlanPrefix = (label: string) => {
        if (label.includes("Gold")) return "gold";
        if (label.includes("PLATINUM PRIVATE")) return "platinum_private";
        if (label.includes("PLATINUM")) return "platinum";
        if (label.includes("VYSYAMALA")) return "vysd";
        return "";
    };

    const renderKpiValue = (data: any, kpi: any) => {
        if (typeof data === 'number') return data;

        if (typeof data === "object" && "total" in data) {
            const prefix = getPlanPrefix(kpi.label);

            return (
                <div className="flex items-baseline gap-2">
                    <span className="font-bold">{data.total}</span>
                    <span className="text-sm text-gray-500 flex gap-1">
                        |
                        <span
                            className={`cursor-pointer ${activeKpiKey === prefix && activeSubType === "call"
                                ? "underline font-bold text-black"
                                : "hover:underline"
                                }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(`${prefix}_call`);
                            }}
                        >
                            {data.call}
                        </span>
                        |
                        <span
                            className={`cursor-pointer ${activeKpiKey === prefix && activeSubType === "action"
                                ? "underline font-bold text-black"
                                : "hover:underline"
                                }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCardClick(`${prefix}_action`);
                            }}
                        >
                            {data.action}
                        </span>
                    </span>
                </div>
            );
        }

        // Handle Location Object {tn, nonTn}
        if (typeof data === 'object' && 'tn' in data) {
            return (
                <div className="flex items-baseline gap-2 font-bold text-black">
                    <span
                        className="cursor-pointer hover:underline"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick('tn');
                        }}
                    >
                        {data.tn}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span
                        className="cursor-pointer hover:underline"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick('non_tn');
                        }}
                    >
                        {data.nonTn}
                    </span>
                </div>
            );
        }
        return "0";
    };


    // --- Handlers ---
    const handleOpenModal = async (profile: PremiumProfile, type: "call" | "customer") => {
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



    const CallLogPopup = ({ profile }: { profile: PremiumProfile }) => {
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
                                <Typography sx={labelStyle}>Call Particulars</Typography>
                                <Typography sx={valueStyle}>{call?.particulars_name || "N/A"}</Typography>
                            </Box> */}

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

                            {/* <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>LAP Comments</Typography>
                                <Typography sx={valueStyle}>{action?.comments || "N/A"}</Typography>
                            </Box> */}

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>NAD</Typography>
                                <Typography sx={valueStyle}>
                                    {action?.next_action_date
                                        ? new Date(action.next_action_date).toLocaleDateString("en-GB").replace(/\//g, "-")
                                        : "N/A"}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Typography sx={labelStyle}>NAP</Typography>
                                <Typography sx={valueStyle}>
                                    {action?.next_action_name || "N/A"}
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

    const yesNo = (value: number | null | undefined) =>
        value === 1 ? "Yes" : value === 0 ? "No" : "N/A";

    const CustomerLogPopup = ({ profile }: { profile: PremiumProfile }) => (
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
                    <h2 className="text-2xl font-bold mb-1">Premium Dashboard</h2>
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
                            <select
                                value={filters.staff}
                                onChange={(e) => setFilters({ ...filters, staff: e.target.value })}
                                className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm bg-white"
                            >
                                <option value="">Select Staff</option>
                                {profileOwners.map(owner => (
                                    <option key={owner.id} value={owner.id}>{owner.username}</option>
                                ))}
                            </select>
                        </div>
                        {/* )} */}
                        <div className="text-start">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Plan</label>
                            <select
                                value={filters.plan}
                                onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
                                className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm bg-white"
                            >
                                <option value="">Select Plan</option>
                                {plans.map(p => (
                                    <option key={p.id} value={p.id}>{p.plan_name}</option>
                                ))}
                            </select>
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
                        <button onClick={handleReset} className={btnOutline}>Reset</button>
                        <button onClick={handleApplyFilters} className={btnDark}>Apply Filters</button>
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
                        {KPI_CONFIG.map((kpi, i) => {
                            const data = getKpiData(stats, kpi.label);
                            // const isActive =
                            //     // ✅ Gender cards → ONLY highlight themselves
                            //     (kpi.key === "male" && filters.genderFilter === "male") ||
                            //     (kpi.key === "female" && filters.genderFilter === "female") ||

                            //     // ✅ Plan cards → Gold / Platinum / PP / Vysyamala
                            //     (kpi.subKeys && activeKpiKey === getPlanPrefix(kpi.label)) ||

                            //     // ✅ Normal KPI (EXCLUDE TOTAL PREMIUM)
                            //     (
                            //         kpi.key !== "" &&
                            //         !kpi.subKeys &&
                            //         filters.countFilter === kpi.key
                            //     ) ||

                            //     // ✅ TN | OTH
                            //     (kpi.key === "tn" && ["tn", "non_tn"].includes(filters.countFilter));

                            // const isActive =
                            //     // ✅ Gender cards
                            //     (kpi.key === "male" && filters.genderFilter === "male") ||
                            //     (kpi.key === "female" && filters.genderFilter === "female") ||

                            //     // ✅ FIXED: Plan cards (Matches the base key OR any sub-key like _call/_action)
                            //     (kpi.subKeys && (
                            //         filters.countFilter === kpi.key ||
                            //         (filters.countFilter && filters.countFilter.startsWith(getPlanPrefix(kpi.label)))
                            //     )) ||

                            //     // ✅ Normal KPI (EXCLUDE TOTAL PREMIUM)
                            //     (
                            //         kpi.key !== "" &&
                            //         !kpi.subKeys &&
                            //         filters.countFilter === kpi.key
                            //     ) ||

                            //     // ✅ TN | OTH
                            //     (kpi.key === "tn" && ["tn", "non_tn"].includes(filters.countFilter));


                            const isActive =
                                // ✅ Gender cards
                                (kpi.key === "male" && filters.genderFilter === "male") ||
                                (kpi.key === "female" && filters.genderFilter === "female") ||

                                // ✅ FIXED: Plan card matching with specific prefix boundary
                                (kpi.subKeys && (
                                    filters.countFilter === kpi.key ||
                                    (
                                        filters.countFilter &&
                                        // Check if the current filter starts with the exact prefix followed by an underscore
                                        filters.countFilter.startsWith(getPlanPrefix(kpi.label) + "_") &&
                                        // Additional safety: ensure we aren't matching 'platinum' when the filter is 'platinum_private'
                                        (getPlanPrefix(kpi.label) === "platinum" ? !filters.countFilter.includes("platinum_private") : true)
                                    )
                                )) ||

                                // ✅ Normal KPI (EXCLUDE TOTAL PREMIUM)
                                (
                                    kpi.key !== "" &&
                                    !kpi.subKeys &&
                                    filters.countFilter === kpi.key
                                ) ||

                                // ✅ TN | OTH
                                (kpi.key === "tn" && ["tn", "non_tn"].includes(filters.countFilter));

                            return (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -5 }}
                                    onClick={() => handleCardClick(kpi.key)}
                                    className={`${getPremiumCardColor(kpi.label)} p-5 rounded-2xl min-h-[140px] border flex flex-col justify-center cursor-pointer transition shadow-sm ${isActive ? 'ring-4 ring-black/20 border-black' : 'border-[#E3E6EE]'}`}
                                >
                                    <h6 className="text-[10px] font-bold mb-1 tracking-wider uppercase opacity-80 text-start">{kpi.label}</h6>
                                    <h2 className="text-3xl text-start font-bold mb-1">
                                        {/* {tableLoading && activeKpiKey === kpi.key ? (
                                            <CircularProgress size={20} />
                                        ) : (
                                            renderKpiValue(data, kpi)
                                        )} */}
                                        {renderKpiValue(data, kpi)}

                                    </h2>
                                    <p className="text-[10px] opacity-70 text-start">
                                        {isActive ? "Viewing these profiles" : "Click to view profiles"}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </section>

                    <section ref={tableRef} className="bg-white rounded-xl border border-[#e6ecf2] shadow-md p-6">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h5 className="text-lg font-semibold m-0">Premium Profile Detail ({tableData.length || stats?.filtered_count || 0})</h5>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Search Profile ID / Name"
                                    value={filters.searchQuery}
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
                                        setScrollSource('filter');
                                        setApplyFilters(true);  // 👈 reload table after clearing
                                    }}
                                    className="h-10 px-4 rounded-full bg-white border border-gray-300 text-sm font-semibold hover:bg-gray-50 transition">Clear</button>
                            </div>
                        </div>

                        <div className="overflow-x-auto max-h-[500px]">
                            <table className="min-w-full border-separate border-spacing-0 table-auto">
                                <thead className="sticky top-0 z-20">
                                    <tr className="bg-gray-50">
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0 rounded-tl-xl">Profile ID</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Name</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Age</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Plan</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Plan Start Date</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Plan End Date</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Photo</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Horo</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">ID</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Owner</th>
                                        <th className="sticky px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border border-[#e5ebf1] border-b-0">Last Login</th>
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
                                                    <p className="text-sm text-gray-600 font-medium">Loading Premium Profiles...</p>
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
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.plan_name || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.membership_startdate || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.membership_enddate || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap text-center">{yesNo(row.has_photo)}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap text-center">{yesNo(row.has_horo)}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap text-center">{yesNo(row.has_idproof)}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">{row.owner_name || 'N/A'}</td>
                                                <td className="px-3 py-3 text-sm border border-[#e5ebf1] whitespace-nowrap">
                                                    {/* {row.Last_login_date
                                                            ? new Date(row.Last_login_date).toISOString().split('T')[0]
                                                            : 'N/A'} */}
                                                    {row.Last_login_date
                                                        ? new Date(row.Last_login_date.replace("T", " ")).toLocaleDateString('en-CA')
                                                        : "N/A"}
                                                </td>
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
        </div >
    );
};

export default PremiumDashboard;
import React, { useEffect, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import Select from "react-select";
import { NotifyError } from "../../common/Toast/ToastMessage";
import { getProfileHolder, getCallManageMasters, getUsers, getMembershipPlans } from "../../api/apiConfig"; // ✅ owner dropdown API
import { apiAxios } from "../../api/apiUrl";
import { getStatus } from "../../action";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

// ✅ Owner Interface
interface ProfileHolder {
    owner_id: number;
    owner_description: string;
}

interface CallManagementSearchFiltersProps {
    onFilterSubmit: (filters: any) => void;
    loading: boolean;
}

interface UserOption {
    id: number;
    username: string;
    email: string;
}

export interface StatusOption {
    status_code: number;
    status_name: string;
}

const CallManagementSearchFilters = ({
    onFilterSubmit,
    loading,
}: CallManagementSearchFiltersProps) => {
    // ✅ Common
    const [profileOrMobile, setProfileOrMobile] = useState("");

    // ✅ Call Section
    const [callFromDate, setCallFromDate] = useState("");
    const [callToDate, setCallToDate] = useState("");

    const [nextCallFromDate, setNextCallFromDate] = useState("");
    const [nextCallToDate, setNextCallToDate] = useState("");

    const [lcdFromDate, setLcdFromDate] = useState("");
    const [lcdToDate, setLcdToDate] = useState("");

    const [lastCallDate, setLastCallDate] = useState("");

    const [callType, setCallType] = useState<any[]>([]);
    const [callStatus, setCallStatus] = useState<any[]>([]);
    const [particulars, setParticulars] = useState<any[]>([]);
    const [callComments, setCallComments] = useState<string>("");


    // ✅ Action Section
    const [actionFromDate, setActionFromDate] = useState("");
    const [actionToDate, setActionToDate] = useState("");

    const [nextActionFromDate, setNextActionFromDate] = useState("");
    const [nextActionToDate, setNextActionToDate] = useState("");

    const [ladFromDate, setLadFromDate] = useState("");
    const [ladToDate, setLadToDate] = useState("");

    const [actionPoints, setActionPoints] = useState<any[]>([]);
    const [actionPointOptions, setActionPointOptions] = useState<any[]>([]);

    const [nextActionComments, setNextActionComments] = useState<string>("");
    const [actionComments, setActionComments] = useState<string>("");


    // ✅ Assign Section
    const [assignFrom, setAssignFrom] = useState("");
    const [assignTo, setAssignTo] = useState("");

    const [assignDateFrom, setAssignDateFrom] = useState("");
    const [assignDateTo, setAssignDateTo] = useState("");

    const [assignBy, setAssignBy] = useState("");
    const [assignToOwner, setAssignToOwner] = useState("");
    const [assignComments, setAssignComments] = useState<string>("");

    // ✅ Common Date Range (Call/Action/Assign)
    const [commonFromDate, setCommonFromDate] = useState("");
    const [commonToDate, setCommonToDate] = useState("");

    // ✅ Profile mapping fields (auto fill when profile id is given)
    const [mappedOwnerName, setMappedOwnerName] = useState("");
    const [mappedStatus, setMappedStatus] = useState("");
    const [mappedMode, setMappedMode] = useState("");

    // ✅ Owner dropdown options
    const [ownerOptions, setOwnerOptions] = useState<ProfileHolder[]>([]);
    const [callTypeOptions, setCallTypeOptions] = useState<any[]>([]);
    const [callStatusOptions, setCallStatusOptions] = useState<any[]>([]);
    const [particularsOptions, setParticularsOptions] = useState<any[]>([]);
    // ✅ Common fields
    const [commonOwnerId, setCommonOwnerId] = useState("");
    const [commonStatus, setCommonStatus] = useState("");
    const [commonMode, setCommonMode] = useState("");
    const [userList, setUserList] = useState<UserOption[]>([]);
    const [userLoading, setUserLoading] = useState(false);
    const [statusOptions, setStatusOptions] = useState<any[]>([]);
    const [planOptions, setPlanOptions] = useState<any[]>([]);
    const [isCallOpen, setIsCallOpen] = useState(true);
    const [isActionOpen, setIsActionOpen] = useState(true);
    const [isAssignOpen, setIsAssignOpen] = useState(true);
    const [latestCallDateFrom, setLatestCallDateFrom] = useState("");
    const [latestCallDateTo, setLatestCallDateTo] = useState("");
    const [latestActionDateFrom, setLatestActionDateFrom] = useState("");
    const [latestActionDateTo, setLatestActionDateTo] = useState("");

    const userOptions = userList.map((u) => ({
        value: u.id.toString(),      // ✅ send id
        label: u.username,           // ✅ show username
    }));

    useEffect(() => {
        const loadMasters = async () => {
            try {
                const data = await getCallManageMasters();

                // Map Call Types
                if (data.call_types) {
                    setCallTypeOptions(
                        data.call_types.map((item: any) => ({
                            value: item.id.toString(), // Ensure ID is string for Select
                            label: item.call_type,
                        }))
                    );
                }

                // Map Call Status
                if (data.call_status) {
                    setCallStatusOptions(
                        data.call_status.map((item: any) => ({
                            value: item.id.toString(),
                            label: item.status,
                        }))
                    );
                }

                // Map Particulars
                if (data.particulars) {
                    setParticularsOptions(
                        data.particulars.map((item: any) => ({
                            value: item.id.toString(),
                            label: item.particulars,
                        }))
                    );
                }
                // ✅ Map Action Points
                if (data.action_points) {
                    setActionPointOptions(
                        data.action_points.map((item: any) => ({
                            value: item.id.toString(),
                            label: item.action_point,
                        }))
                    );
                }

            } catch (error: any) {
                NotifyError("Failed to load master data");
            }
        };

        const loadOwners = async () => {
            try {
                const data = await getProfileHolder();
                setOwnerOptions(Object.values(data || {}));
            } catch (error: any) {
                NotifyError(error.message);
            }
        };

        loadMasters();
        loadOwners();
    }, []);

    const fetchUsers = async () => {
        setUserLoading(true);
        try {
            const data = await getUsers();
            setUserList(data || []);
        } catch (error: any) {
            console.error("Failed to fetch user data:", error);
            NotifyError("Failed to load users");
        } finally {
            setUserLoading(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const loadStatus = async () => {
            try {
                const data = await getStatus();

                setStatusOptions(
                    data.map((s) => ({
                        value: s.status_code.toString(), // ✅ send id
                        label: s.status_name,            // ✅ show name
                    }))
                );
            } catch (error: any) {
                NotifyError("Failed to load status master");
            }
        };

        loadStatus();
    }, []);

    useEffect(() => {
        const loadPlans = async () => {
            try {
                const res = await getMembershipPlans(); // { status: true, plans: [...] }

                setPlanOptions(
                    (res?.plans || []).map((p: any) => ({
                        value: p.id.toString(),     // ✅ pass id
                        label: p.plan_name,         // ✅ show plan name
                    }))
                );
            } catch (error: any) {
                NotifyError("Failed to load membership plans");
            }
        };

        loadPlans();
    }, []);

    // ✅ If profile id given -> map profile details (you can call API here)
    useEffect(() => {
        const isProfileId = profileOrMobile?.startsWith("P"); // example logic
        if (!isProfileId || !profileOrMobile) {
            setMappedOwnerName("");
            setMappedStatus("");
            setMappedMode("");
            return;
        }

        // ✅ You can call profile details API here:
        // fetchProfileDetails(profileOrMobile).then(...)
        // For now demo values:
        setMappedOwnerName("Auto Owner");
        setMappedStatus("approved");
        setMappedMode("premium");
    }, [profileOrMobile]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const input = profileOrMobile.trim();

        // 1) Logic for "At least one of the main fields must be selected"
        // We check only: Profile/Mobile, Owner, Status, and Mode
        // const isMainFilterSelected =
        //     input !== "" ||
        //     commonOwnerId !== "" ||
        //     commonStatus !== "" ||
        //     commonMode !== "";

        // if (!isMainFilterSelected) {
        //     NotifyError("Please select at least one filter (Profile ID/Mobile, Owner, Status, or Mode) before searching");
        //     return;
        // }

        const isAnyFilterSelected =
            profileOrMobile.trim() !== "" ||
            commonOwnerId !== "" ||
            commonStatus !== "" ||
            commonMode !== "" ||

            // ✅ CALL FILTERS
            callFromDate !== "" ||
            callToDate !== "" ||
            nextCallFromDate !== "" ||
            nextCallToDate !== "" ||
            latestCallDateFrom !== "" ||
            latestCallDateTo !== "" ||
            callType.length > 0 ||
            callStatus.length > 0 ||
            particulars.length > 0 ||
            callComments.trim() !== "" ||

            // ✅ ACTION FILTERS
            actionFromDate !== "" ||
            actionToDate !== "" ||
            nextActionFromDate !== "" ||
            nextActionToDate !== "" ||
            latestActionDateFrom !== "" ||
            latestActionDateTo !== "" ||
            actionPoints.length > 0 ||
            nextActionComments.trim() !== "" ||
            actionComments.trim() !== "" ||

            // ✅ ASSIGN FILTERS
            assignDateFrom !== "" ||
            assignDateTo !== "" ||
            assignBy !== "" ||
            assignToOwner !== "" ||
            assignComments.trim() !== "";

        if (!isAnyFilterSelected) {
            NotifyError("Please select at least one filter (Profile ID/Mobile, Owner, Status, or Mode) before searching");
            return;
        }


        // 2) Validation for Profile ID / Mobile Number if provided
        if (input) {
            const isProfileId = /^[A-Za-z]/.test(input); // starts with letter

            if (isProfileId) {
                const upper = input.toUpperCase();
                const validPrefix = upper.startsWith("VF") || upper.startsWith("VM");

                if (!validPrefix) {
                    NotifyError("Profile ID must start with VF or VM");
                    return;
                }
            } else {
                // Mobile number validation
                if (!/^\d+$/.test(input)) {
                    NotifyError("Mobile number must contain only digits");
                    return;
                }
                if (input.length < 5) {
                    NotifyError("Mobile number must be at least 5 digits");
                    return;
                }
            }
        }

        const filters = {
            profileOrMobile,

            // ✅ COMMON MASTER
            commonOwnerId,
            commonStatus,
            commonMode,
            commonFromDate,
            commonToDate,

            // ✅ CALL
            callFromDate,
            callToDate,
            nextCallFromDate,
            nextCallToDate,
            callType: callType.map((x) => Number(x.value)),
            callStatus: callStatus.map((x) => Number(x.value)),
            particulars: particulars.map((x) => Number(x.value)),
            callComments,

            // ✅ ACTION
            actionFromDate,
            actionToDate,
            nextActionFromDate,
            nextActionToDate,
            actionPoints: actionPoints.map((x) => Number(x.value)),
            nextActionComments,
            actionComments,

            // ✅ ASSIGN
            assignDateFrom,
            assignDateTo,
            assignBy,
            assignToOwner,
            assignComments,

            latest_call_date_from: latestCallDateFrom,
            latest_call_date_to: latestCallDateTo,
            latest_action_date_from: latestActionDateFrom,
            latest_action_date_to: latestActionDateTo,
        };

        onFilterSubmit(filters);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="container mx-auto p-4 bg-gray-50 rounded-lg shadow-sm"
        >
            <div className="flex justify-between items-center mb-8 pb-4">
                <h1 className="text-3xl font-bold text-black">
                    Call Management Search
                </h1>

                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ minWidth: "180px", height: "45px", fontWeight: "bold" }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Search Profiles"}
                </Button>
            </div>

            {/* ✅ Basic */}
            {/* ✅ Basic */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col">
                    <FilterInput
                        label="Profile ID / Mobile Number"
                        value={profileOrMobile}
                        onChange={setProfileOrMobile}
                    />
                    <p className="text-xs text-gray-600 mt-1">
                        Note: Profile ID must start with <b>VF</b> or <b>VM</b>.
                        Mobile number must be minimum <b>5 digits</b>.
                    </p>
                </div>

                <FilterSelect
                    label="Owner Name"
                    value={commonOwnerId}
                    onChange={setCommonOwnerId}
                    options={[
                        { value: "", label: "Select Owner" },
                        ...userOptions,
                    ]}
                />


                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">Status</label>
                    <select
                        className="border p-2 rounded border-black"
                        value={commonStatus}
                        onChange={(e) => setCommonStatus(e.target.value)}
                    >
                        <option value="">Select Status</option>
                        {statusOptions.map((s: any) => (
                            <option key={s.value} value={s.value}>
                                {s.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">Mode</label>
                    <select
                        className="border p-2 rounded border-black"
                        value={commonMode}
                        onChange={(e) => setCommonMode(e.target.value)}
                    >
                        <option value="">Select Mode</option>
                        {planOptions.map((p: any) => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* <FilterInput
                    label="From Date"
                    type="date"
                    value={commonFromDate}
                    onChange={setCommonFromDate}
                />

                <FilterInput
                    label="To Date"
                    type="date"
                    value={commonToDate}
                    onChange={setCommonToDate}
                /> */}
            </div>

            {/* ✅ CALL SECTION */}
            <div className="mt-8 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={() => setIsCallOpen(!isCallOpen)}
                >
                    <h2 className="text-xl font-bold text-black ">Call Search</h2>

                    <span className="text-2xl font-bold">
                        {/* {isCallOpen ? "˄" : "˅"} */}
                        {isCallOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                </div>

                {isCallOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        <FilterInput label="Call From Date" type="date" value={callFromDate} onChange={setCallFromDate} />
                        <FilterInput label="Call To Date" type="date" value={callToDate} onChange={setCallToDate} />

                        <FilterInput label="Next Call From Date" type="date" value={nextCallFromDate} onChange={setNextCallFromDate} />
                        <FilterInput label="Next Call To Date" type="date" value={nextCallToDate} onChange={setNextCallToDate} />

                        <FilterInput label="LCD From Date" type="date" value={latestCallDateFrom} onChange={setLatestCallDateFrom} />
                        <FilterInput label="LCD To Date" type="date" value={latestCallDateTo} onChange={setLatestCallDateTo} />

                        <div className="flex flex-col">
                            <label className="font-semibold mb-1 text-black">Call Type</label>
                            <Select
                                isMulti
                                options={callTypeOptions}
                                value={callType}
                                onChange={(val) => setCallType([...val])}
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: "black",
                                        "&:hover": { borderColor: "black" },
                                    }),
                                }}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-semibold mb-1 text-black">Call Status</label>
                            <Select
                                isMulti
                                options={callStatusOptions}
                                value={callStatus}
                                onChange={(val) => setCallStatus([...val])}
                                placeholder="Select Call Status"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: "black",
                                        "&:hover": { borderColor: "black" },
                                    }),
                                }}
                            />
                        </div>

                        <div className="flex flex-col">
                            <label className="font-semibold mb-1 text-black">Particulars</label>
                            <Select
                                isMulti
                                options={particularsOptions}
                                value={particulars}
                                onChange={(val) => setParticulars([...val])}
                                placeholder="Select Particulars"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: "black",
                                        "&:hover": { borderColor: "black" },
                                    }),
                                }}
                            />
                        </div>

                        <FilterInput label="Comments" value={callComments}
                            onChange={(val: string) => {
                                if (val.length <= 15) setCallComments(val);
                            }} />
                    </div>
                )}
            </div>

            {/* ✅ ACTION SECTION */}
            <div className="mt-8 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={() => setIsActionOpen(!isActionOpen)}
                >
                    <h2 className="text-xl font-bold text-black">Action Search</h2>

                    <span className="text-2xl font-bold">
                        {/* {isActionOpen ? "˄" : "˅"} */}
                        {isActionOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                </div>

                {isActionOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        <FilterInput label="Action From Date" type="date" value={actionFromDate} onChange={setActionFromDate} />
                        <FilterInput label="Action To Date" type="date" value={actionToDate} onChange={setActionToDate} />

                        <FilterInput label="Next Action From Date" type="date" value={nextActionFromDate} onChange={setNextActionFromDate} />
                        <FilterInput label="Next Action To Date" type="date" value={nextActionToDate} onChange={setNextActionToDate} />

                        <FilterInput label="LAD From Date" type="date" value={latestActionDateFrom} onChange={setLatestActionDateFrom} />
                        <FilterInput label="LAD To Date" type="date" value={latestActionDateTo} onChange={setLatestActionDateTo} />

                        <div className="flex flex-col">
                            <label className="font-semibold mb-1 text-black">Action Points</label>
                            <Select
                                isMulti
                                options={actionPointOptions}
                                value={actionPoints}
                                onChange={(val) => setActionPoints([...val])}
                                placeholder="Select Action Points"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        borderColor: "black",
                                        "&:hover": { borderColor: "black" },
                                    }),
                                }}
                            />
                        </div>

                        <FilterInput label="Next Action Comments" value={nextActionComments}
                            onChange={(val: string) => {
                                if (val.length <= 15) setNextActionComments(val);
                            }} />
                        <FilterInput label="Action Comments" value={actionComments}
                            onChange={(val: string) => {
                                if (val.length <= 15) setActionComments(val);
                            }} />
                    </div>
                )}
            </div>

            {/* ✅ ASSIGN SECTION */}
            <div className="mt-8 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div
                    className="flex justify-between items-center cursor-pointer select-none"
                    onClick={() => setIsAssignOpen(!isAssignOpen)}
                >
                    <h2 className="text-xl font-bold text-black">Assign Search</h2>

                    <span className="text-2xl font-bold">
                        {isAssignOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                    </span>
                </div>

                {isAssignOpen && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
                        {/* <FilterInput label="Assign From" value={assignFrom} onChange={setAssignFrom} />
                        <FilterInput label="Assign To" value={assignTo} onChange={setAssignTo} /> */}

                        <FilterInput label="Assign Date From" type="date" value={assignDateFrom} onChange={setAssignDateFrom} />
                        <FilterInput label="Assign Date To" type="date" value={assignDateTo} onChange={setAssignDateTo} />

                        <FilterSelect
                            label="Assign By"
                            value={assignBy}
                            onChange={setAssignBy}
                            options={[
                                { value: "", label: "Select Assign By" },
                                ...userOptions,
                            ]}
                        />

                        <FilterSelect
                            label="Assign To"
                            value={assignToOwner}
                            onChange={setAssignToOwner}
                            options={[
                                { value: "", label: "Select Assign To" },
                                ...userOptions,
                            ]}
                        />

                        <FilterInput label="Assign Comments" value={assignComments}
                            // onChange={(val: any[] | React.SetStateAction<string>) => {
                            //     if (val.length <= 50) setAssignComments(val);
                            // }} 
                            onChange={(val: string) => {
                                if (val.length <= 15) setAssignComments(val);
                            }}
                        />
                    </div>
                )}
            </div>
        </form>
    );
};

const FilterInput = ({
    label,
    value,
    onChange,
    type = "text",
    placeholder = "",
}: any) => (
    <div className="flex flex-col">
        <label className="font-semibold mb-1 text-black">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="border p-2 rounded border-gray-400 focus:border-black outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

const FilterSelect = ({ label, value, onChange, options }: any) => (
    <div className="flex flex-col">
        <label className="font-semibold mb-1 text-black">{label}</label>
        <select
            className="border p-2 rounded border-black"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            {options.map((op: any) => (
                <option key={op.value} value={op.value}>
                    {op.label}
                </option>
            ))}
        </select>
    </div>
);

export default CallManagementSearchFilters;

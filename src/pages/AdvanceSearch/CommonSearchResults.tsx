import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Checkbox, CircularProgress, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField, Typography, IconButton
} from '@mui/material';
import { commonSearch, commonSearchExport } from '../../api/apiConfig';
import { NotifyError } from '../../common/Toast/ToastMessage';
import { MdVerified } from 'react-icons/md';
import { GoUnverified } from 'react-icons/go';

const CommonSearchResults = ({ filters, onBack, No_Image_Available }: any) => {
    const navigate = useNavigate();

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
    const [goToPageInput, setGoToPageInput] = useState<string>('');
    const [exportLoading, setExportLoading] = useState(false);

    const columns = [
        { id: "select", label: "Select" },
        { id: 'profile_img', label: 'Image' },
        { id: 'profile_id', label: 'Profile ID' },
        { id: 'profile_name', label: 'Name' },
        { id: 'profile_age', label: 'Age' },
        { id: 'profile_gender', label: 'Gender' },
        { id: 'height', label: 'Height' },
        { id: 'profession', label: 'Profession' },
        { id: 'location', label: 'Location' },
        { id: 'star', label: 'Star' },
        { id: 'verified', label: 'Verified' },
    ];

    useEffect(() => {
        const fetchFilteredData = async () => {
            try {
                setLoading(true);

                // --- API PAYLOAD MAPPING ---
                const apiPayload = {
                    // IDs and Names
                    search_profile_id: filters.profileID || "",
                    profile_name: filters.name || "",

                    // Personal
                    gender: filters.gender || "",
                    email_id: filters.emailId || "",
                    mobile_no: filters.combinedContact || "",
                    age_from: filters.ageFrom || "",
                    age_to: filters.ageTo || "", // Fixed: Age To Passing

                    // last_action_date: filters.lastActionDate || "",
                    from_last_action_date: filters.lastActionDate || "",
                    to_last_action_date: filters.lastActionToDate || "",
                    from_doj: filters.regFromDate || "", // Maps Reg From -> from_doj
                    to_doj: filters.regToDate || "",
                    // DOB Parsing
                    dob_date: filters.dob ? filters.dob.split('-')[2] : "",
                    dob_month: filters.dob ? filters.dob.split('-')[1] : "",
                    dob_year: filters.dob ? filters.dob.split('-')[0] : "",

                    // Location & Status
                    state: filters.states || "",
                    city: filters.cityText || "",
                    status: filters.profileStatus || "",
                    created_by: filters.createdBy || "",
                    address: filters.address || "",
                    marriage_from: filters.marriageFromDate || "",
                    marriage_to: filters.marriageToDate || "",
                    engagement_from: filters.engagementFromDate || "",
                    engagement_to: filters.engagementToDate || "",
                    //admin_details: filters.adminDetails || "",
                    admin_comments: filters.adminComments || "",

                    // IMPORTANT: NRI Mapping (using dropdown value)
                    foreign_intrest: filters.nri || "",

                    // IMPORTANT: Stars Mapping (using the joined string)
                    matching_stars: filters.selectedBirthStars || "",

                    // Income
                    min_anual_income: filters.minAnnualIncome || "",
                    max_anual_income: filters.maxAnnualIncome || "",

                    // Dropdowns
                    membership: filters.selectedMembership || "",
                    martial_status: filters.selectedMaritalStatus || "",

                    // Education
                    education: filters.highestEducation || "",
                    field_of_study: filters.fieldOfStudy || "",
                    degree: filters.degrees || "",

                    // Professional & Family
                    father_name: filters.fatherName || "",
                    father_occupation: filters.fatherOccupation || "",
                    mother_name: filters.motherName || "",
                    mother_occupation: filters.motherOccupation || "",
                    business_name: filters.businessName || "",
                    company_name: filters.companyName || "",

                    // Delete Status
                    delete_status: filters.deleteStatus || "",

                    // Pagination
                    page_number: currentPage + 1, // API usually 1-based
                    per_page: itemsPerPage
                };

                const response = await commonSearch(apiPayload);

                if (response.Status === 1) {
                    setData(response.profiles || []);
                    setTotalItems(response.total_count || response.profiles.length);
                } else {
                    setData([]);
                    setTotalItems(0);
                    // Optional: Only show error if it's a real error, not just 0 results
                    // NotifyError(response.message || "No records found"); 
                }

            } catch (error: any) {
                console.error(error);
                NotifyError("Failed to fetch search results");
            } finally {
                setLoading(false);
            }
        };

        if (filters) {
            fetchFilteredData();
        }
    }, [filters, currentPage, itemsPerPage]);


    const handleExport = async () => {
        try {
            setExportLoading(true);

            // const exportPayload = {
            //     search_profile_id: filters.profileID || "",
            //     profile_name: filters.name || "",
            //     gender: filters.gender || "",
            //     email_id: filters.emailId || "",
            //     mobile_no: filters.combinedContact || "",
            //     age_from: filters.ageFrom || "",
            //     age_to: filters.ageTo || "",
            //     from_last_action_date: filters.lastActionDate || "",
            //     to_last_action_date: filters.lastActionToDate || "",
            //     from_doj: filters.regFromDate || "",
            //     to_doj: filters.regToDate || "",
            //     dob_date: filters.dob ? filters.dob.split('-')[2] : "",
            //     dob_month: filters.dob ? filters.dob.split('-')[1] : "",
            //     dob_year: filters.dob ? filters.dob.split('-')[0] : "",
            //     state: filters.states || "",
            //     city: filters.cityText || "",
            //     status: filters.profileStatus || "",
            //     created_by: filters.createdBy || "",
            //     address: filters.address || "",
            //     foreign_intrest: filters.nri || "",
            //     matching_stars: filters.selectedBirthStars || "",
            //     min_anual_income: filters.minAnnualIncome || "",
            //     max_anual_income: filters.maxAnnualIncome || "",
            //     membership: filters.selectedMembership || "",
            //     martial_status: filters.selectedMaritalStatus || "",
            //     education: filters.highestEducation || "",
            //     field_of_study: filters.fieldOfStudy || "",
            //     degree: filters.degrees || "",
            //     delete_status: filters.deleteStatus || "",

            //     // ADDED PARAMS FOR EXPORT
            //     export_type: "csv",
            //     page_number: 1, // Usually exports all, but passing 1 as safe default
            //     per_page: totalItems // Export all found records
            // };

            const exportPayload = {
                // IDs and Names
                search_profile_id: filters.profileID || "",
                profile_name: filters.name || "",

                // Personal
                gender: filters.gender || "",
                email_id: filters.emailId || "",
                mobile_no: filters.combinedContact || "",
                age_from: filters.ageFrom || "",
                age_to: filters.ageTo || "", // Fixed: Age To Passing

                // last_action_date: filters.lastActionDate || "",
                from_last_action_date: filters.lastActionDate || "",
                to_last_action_date: filters.lastActionToDate || "",
                from_doj: filters.regFromDate || "", // Maps Reg From -> from_doj
                to_doj: filters.regToDate || "",
                // DOB Parsing
                dob_date: filters.dob ? filters.dob.split('-')[2] : "",
                dob_month: filters.dob ? filters.dob.split('-')[1] : "",
                dob_year: filters.dob ? filters.dob.split('-')[0] : "",

                // Location & Status
                state: filters.states || "",
                city: filters.cityText || "",
                status: filters.profileStatus || "",
                created_by: filters.createdBy || "",
                address: filters.address || "",
                marriage_from: filters.marriageFromDate || "",
                marriage_to: filters.marriageToDate || "",
                engagement_from: filters.engagementFromDate || "",
                engagement_to: filters.engagementToDate || "",
                //admin_details: filters.adminDetails || "",
                admin_comments: filters.adminComments || "",

                // IMPORTANT: NRI Mapping (using dropdown value)
                foreign_intrest: filters.nri || "",

                // IMPORTANT: Stars Mapping (using the joined string)
                matching_stars: filters.selectedBirthStars || "",

                // Income
                min_anual_income: filters.minAnnualIncome || "",
                max_anual_income: filters.maxAnnualIncome || "",

                // Dropdowns
                membership: filters.selectedMembership || "",
                martial_status: filters.selectedMaritalStatus || "",

                // Education
                education: filters.highestEducation || "",
                field_of_study: filters.fieldOfStudy || "",
                degree: filters.degrees || "",

                // Professional & Family
                father_name: filters.fatherName || "",
                father_occupation: filters.fatherOccupation || "",
                mother_name: filters.motherName || "",
                mother_occupation: filters.motherOccupation || "",
                business_name: filters.businessName || "",
                company_name: filters.companyName || "",

                // Delete Status
                delete_status: filters.deleteStatus || "",

                // Pagination
                page_number: currentPage + 1, // API usually 1-based
                per_page: itemsPerPage,
                export_type: "excel",
            };

            const response = await commonSearchExport(exportPayload);

            // If your API returns a file (Blob)
            if (response instanceof Blob) {
                const url = window.URL.createObjectURL(response);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Advance_Search_Results_${new Date().toISOString().slice(0, 10)}.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
            } else if (response.Status === 1 && response.file_url) {
                // If your API returns a URL instead of a Blob
                window.open(response.file_url, '_blank');
            } else {
                NotifyError("Export failed or no data available.");
            }
        } catch (error) {
            console.error("Export Error:", error);
            NotifyError("An error occurred during export.");
        } finally {
            setExportLoading(false);
        }
    };

    // --- Pagination Handlers ---
    const handleGoToPage = () => {
        const pageNumber = parseInt(goToPageInput, 10);
        if (!isNaN(pageNumber)) {
            const lastPage = Math.ceil(totalItems / itemsPerPage) - 1;
            const newPage = Math.max(0, Math.min(pageNumber - 1, lastPage));
            setCurrentPage(newPage);
            setGoToPageInput('');
        }
    };

    const handleCheckboxChange = (profileId: string) => {
        setSelectedProfiles((prev) =>
            prev.includes(profileId) ? prev.filter(id => id !== profileId) : [...prev, profileId]
        );
    };

    const handleSelectAll = () => {
        if (selectedProfiles.length === data.length) {
            setSelectedProfiles([]);
        } else {
            setSelectedProfiles(data.map((profile) => profile.profile_id));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <Button variant="contained" onClick={onBack}>
                    Back to Filters
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleExport}
                    disabled={exportLoading || data.length === 0}
                    startIcon={exportLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    sx={{ fontWeight: 'bold' }}
                >
                    {exportLoading ? 'Exporting...' : 'Export Profiles'}
                </Button>
                {/* <Typography variant="h6">Total Records: {totalItems}</Typography> */}
            </div>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '300px' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <div className="mb-3 text-sm text-gray-600 font-medium">
                        Showing {totalItems === 0 ? 0 : currentPage * itemsPerPage + 1} to{" "}
                        {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of {totalItems} records
                    </div>
                    <Paper className="w-full">
                        <TableContainer sx={{ border: '1px solid #E0E0E0' }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead style={{ background: '#FFF9C9' }}>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell key={column.id} sx={{ fontWeight: "bold", color: "#ee3448" }}>
                                                {column.id === "select" ? (
                                                    <Checkbox
                                                        color="primary"
                                                        checked={data.length > 0 && selectedProfiles.length === data.length}
                                                        onChange={handleSelectAll}
                                                    />
                                                ) : column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.length > 0 ? (
                                        data.map((row) => (
                                            <TableRow key={row.profile_id}>
                                                <TableCell>
                                                    <Checkbox
                                                        checked={selectedProfiles.includes(row.profile_id)}
                                                        onChange={() => handleCheckboxChange(row.profile_id)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <img
                                                        src={row.profile_img || No_Image_Available}
                                                        alt="img"
                                                        className="w-12 h-12 rounded-full object-cover"
                                                        onError={(e: any) => e.target.src = No_Image_Available}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className="text-blue-600 cursor-pointer hover:underline"
                                                        onClick={() =>
                                                            window.open(`/viewProfile?profileId=${row.profile_id}`, "_blank")
                                                        }
                                                    >
                                                        {row.profile_id}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{row.profile_name}</TableCell>
                                                <TableCell>{row.profile_age}</TableCell>
                                                <TableCell>{row.profile_gender}</TableCell>
                                                <TableCell>{row.height}</TableCell>
                                                <TableCell>{row.profession}</TableCell>
                                                <TableCell>{row.location}</TableCell>
                                                <TableCell>{row.star}</TableCell>
                                                <TableCell>
                                                    {row.verified === 1 ? <MdVerified color="green" /> : <GoUnverified color="red" />}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} align="center">No Profiles Found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>

                    {/* --- PAGINATION CONTROLS --- */}
                    {Math.ceil(totalItems / itemsPerPage) > 0 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-sm text-gray-600">
                                {/* Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of {totalItems} records */}
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <Typography variant="body2">Go to page:</Typography>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={goToPageInput}
                                        onChange={(e) => setGoToPageInput(e.target.value)}
                                        inputProps={{ min: 1, max: Math.ceil(totalItems / itemsPerPage) }}
                                        style={{ width: '80px' }}
                                        onKeyPress={(e) => e.key === 'Enter' && handleGoToPage()}
                                    />
                                    <Button variant="contained" size="small" onClick={handleGoToPage} disabled={!goToPageInput}>
                                        Go
                                    </Button>
                                </div>

                                <IconButton onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>
                                    {"<<"}
                                </IconButton>
                                <IconButton onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))} disabled={currentPage === 0}>
                                    {"<"}
                                </IconButton>

                                {/* Page Numbers Logic */}
                                {(() => {
                                    const totalPages = Math.ceil(totalItems / itemsPerPage);
                                    const maxVisiblePages = 5;
                                    let startPage, endPage;

                                    if (totalPages <= maxVisiblePages) {
                                        startPage = 0;
                                        endPage = totalPages - 1;
                                    } else {
                                        const maxPagesBeforeCurrent = Math.floor(maxVisiblePages / 2);
                                        const maxPagesAfterCurrent = Math.ceil(maxVisiblePages / 2) - 1;
                                        if (currentPage < maxPagesBeforeCurrent) {
                                            startPage = 0;
                                            endPage = maxVisiblePages - 1;
                                        } else if (currentPage + maxPagesAfterCurrent >= totalPages) {
                                            startPage = totalPages - maxVisiblePages;
                                            endPage = totalPages - 1;
                                        } else {
                                            startPage = currentPage - maxPagesBeforeCurrent;
                                            endPage = currentPage + maxPagesAfterCurrent;
                                        }
                                    }
                                    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? "contained" : "text"}
                                            onClick={() => setCurrentPage(page)}
                                            style={{ minWidth: '32px', height: '32px', margin: '0 2px' }}
                                        >
                                            {page + 1}
                                        </Button>
                                    ));
                                })()}

                                <IconButton onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalItems / itemsPerPage) - 1))} disabled={currentPage >= Math.ceil(totalItems / itemsPerPage) - 1}>
                                    {">"}
                                </IconButton>
                                <IconButton onClick={() => setCurrentPage(Math.ceil(totalItems / itemsPerPage) - 1)} disabled={currentPage >= Math.ceil(totalItems / itemsPerPage) - 1}>
                                    {">>"}
                                </IconButton>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CommonSearchResults;
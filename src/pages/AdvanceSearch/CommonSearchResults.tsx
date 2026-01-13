import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Button, Checkbox, CircularProgress, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TextField, Typography, IconButton
} from '@mui/material';
import { commonSearch } from '../../api/apiConfig'; // Import the new API function
import { NotifyError } from '../../common/Toast/ToastMessage';
import { MdVerified } from 'react-icons/md';
import { GoUnverified } from 'react-icons/go';

// ... Keep your existing Interfaces ...

const CommonSearchResults = ({ filters, onBack, No_Image_Available }: any) => {
    const navigate = useNavigate();
    
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
    const [goToPageInput, setGoToPageInput] = useState<string>('');

    // Columns specific to Common Search Response
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

                // 1. MAP FORM DATA TO API BODY PARAMS
                // The keys on the left must match the "BODY PARAMS" list you provided
                const apiPayload = {
                    search_profile_id: filters.profileID || "",
                    profile_name: filters.name || "",
                    dob_date: filters.dob ? filters.dob.split('-')[2] : "", // Extract Day
                    dob_month: filters.dob ? filters.dob.split('-')[1] : "", // Extract Month
                    dob_year: filters.dob ? filters.dob.split('-')[0] : "", // Extract Year
                    age_from: filters.ageFrom || "",
                    age_to: filters.ageTo || "",
                    gender: filters.gender || "",
                    mobile_no: filters.combinedContact || "", // Assuming combined holds mobile
                    email_id: filters.emailId || "",
                    
                    // Family & Bio
                    father_name: filters.fatherName || "",
                    father_occupation: filters.fatherOccupation || "",
                    mother_name: filters.motherName || "",
                    mother_occupation: filters.motherOccupation || "",
                    business_name: filters.businessName || "",
                    company_name: filters.companyName || "",
                    
                    // Dropdowns & Multiselects
                    state: filters.selectedState || "",
                    city: filters.cityText || "",
                    status: filters.selectedProfileStatus || "",
                    created_by: filters.createdBy || "",
                    address: filters.address || "",
                    admin_comments: filters.adminComments || "",
                    
                    // Special fields
                    min_anual_income: filters.minAnnualIncome || "", // Note: API typo 'anual'
                    max_anual_income: filters.maxAnnualIncome || "", // Note: API typo 'anual'
                    membership: filters.selectedMembership || "",
                    martial_status: filters.selectedMaritalStatus || "",
                    matching_stars: filters.selectedBirthStars || "",
                    
                    // Education
                    education: filters.highestEducation || "",
                    field_of_study: filters.fieldOfStudy || "",
                    degree: filters.degrees || "",
                    
                    // Delete Statuses
                    delete_status: filters.deleteStatus || "", // Secondary status
                    
                    // Pagination
                    page_number: currentPage + 1,
                    per_page: itemsPerPage
                };

                // 2. Call the API
                const response = await commonSearch(apiPayload);

                if (response.Status === 1) {
                    setData(response.profiles || []);
                    // Assuming the API returns total_count for pagination. 
                    // If not, you might need to adjust logic or ask backend for count.
                    setTotalItems(response.total_count || response.profiles.length); 
                } else {
                    setData([]);
                    NotifyError(response.message || "No records found");
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

    // ... Keep existing Pagination and Handler functions (handleChangePage, handleSelectAll, etc.) ...

    return (
        <div className="container mx-auto p-4">
             <div className="flex justify-between items-center mb-4">
                <Button variant="contained" onClick={onBack}>
                    Back to Filters
                </Button>
                {/* <Typography variant="h5">Search Results ({totalItems})</Typography> */}
            </div>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: '300px' }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
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
                                                     onChange={() => {
                                                         if (selectedProfiles.length === data.length) setSelectedProfiles([]);
                                                         else setSelectedProfiles(data.map(d => d.profile_id));
                                                     }}
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
                                                        onChange={() => {
                                                            const newSelected = selectedProfiles.includes(row.profile_id)
                                                                ? selectedProfiles.filter(id => id !== row.profile_id)
                                                                : [...selectedProfiles, row.profile_id];
                                                            setSelectedProfiles(newSelected);
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <img 
                                                        src={row.profile_img || No_Image_Available} 
                                                        alt="img" 
                                                        className="w-12 h-12 rounded-full object-cover"
                                                        onError={(e:any) => e.target.src = No_Image_Available}
                                                    />
                                                </TableCell>
                                                <TableCell 
                                                    className="text-blue-600 cursor-pointer hover:underline"
                                                    onClick={() => navigate(`/viewProfile?profileId=${row.profile_id}`)}
                                                >
                                                    {row.profile_id}
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
                    {/* Add your pagination controls here (same as previous code) */}
                </>
            )}
        </div>
    );
};

export default CommonSearchResults;
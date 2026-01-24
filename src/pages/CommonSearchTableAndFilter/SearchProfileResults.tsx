
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { userMatchingProfilesFilter, userMatchingProfilesSendEmail, userMatchingProfilesPrintProfile, userMatchingProfilesWhatsapp } from '../../api/apiConfig';
import { NotifyError, NotifySuccess } from '../../common/Toast/ToastMessage';
import { MdVerified } from 'react-icons/md';
import { GoUnverified } from 'react-icons/go';
//import No_Image_Available from '../images/No_Image_Available .jpg';

// Interfaces
interface SearchProfileProps {
  profile_id: string;
  profile_name: string;
  profile_img: string;
  profile_age: number;
  profile_gender: string;
  height: string;
  weight: string;
  degree: string;
  profession: string;
  star: string;
  location: number;
  photo_protection: number;
  matching_score: number;
  wish_list: number;
  verified: number;
}

interface SearchProfileResultsProps {
  filters: any;
  onBack: () => void;
  No_Image_Available: any
}

const columns = [
  { id: "select", label: "Select" },
  { id: 'profile_img', label: 'Image' },
  { id: 'profile_id', label: 'Profile ID' },
  { id: 'profile_name', label: 'Name' },
  { id: 'profile_age', label: 'Age' },
  { id: 'profile_gender', label: 'Gender' },
  { id: 'height', label: 'Height' },
  { id: 'weight', label: 'Weight' },
  { id: 'degree', label: 'Degree' },
  { id: 'profession', label: 'Profession' },
  { id: 'location', label: 'Location' },
  { id: 'star', label: 'Star' },
  { id: 'matching_score', label: 'Matching Score' },
  { id: 'verified', label: 'Verified' },
];

const SearchProfileResults = ({ filters, onBack, No_Image_Available }: SearchProfileResultsProps) => {
  const navigate = useNavigate();
  const roleId = sessionStorage.getItem('role_id');

  const [matchingData, setMatchingData] = useState<SearchProfileProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [goToPageInput, setGoToPageInput] = useState<string>('');

  // Action states
  const [selectedFormat, setSelectedFormat] = useState<string>('');
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);
  const [printFormat, setPrintFormat] = useState<string>('');
  const [isPrintProfile, setIsPrintProfile] = useState<boolean>(false);
  const [whatsappFormat, setWhatsappFormat] = useState<string>('');
  const [iswhatsappProfile, setIsWhatsappProfile] = useState<boolean>(false);
  const location = useLocation();

  // useEffect(() => {
  //   const fetchFilteredData = async () => {
  //     try {
  //       setLoading(true);
  //       const MatchingprofileFilter = await userMatchingProfilesFilter(
  //         String(filters.profileID),
  //         currentPage + 1,
  //         itemsPerPage,
  //         String(filters.selectedComplexions),
  //         String(filters.selectedEducation),
  //         String(filters.heightFrom),
  //         String(filters.heightTo),
  //         String(filters.minAnnualIncome),
  //         String(filters.maxAnnualIncome),
  //         filters.foreignInterest,
  //         String(filters.selectedState),
  //         String(filters.selectedCity),
  //         String(filters.selectedMembership),
  //         filters.hasphotos,
  //         filters.selectedBirthStars,
  //         String(filters.ageDifference),
  //         filters.selectedProfessions.join(','),
  //         String(filters.ageFrom),
  //         String(filters.ageTo),
  //         String(filters.sarpaDhosam),
  //         String(filters.chevvaiDhosam),
  //         String(filters.profileName),
  //         String(filters.fatherAlive),
  //         String(filters.motherAlive),
  //         String(filters.mobileNo),    // Add mobile_no
  //         String(filters.gender),   // Gender
  //         String(filters.emailId),  // EmailId
  //         filters.dobDay, // day component
  //         filters.dobMonth, // month component
  //         filters.dobYear, // year component
  //         String(filters.selectedProfileStatus),
  //         String(filters.selectedMaritalStatus),
  //         String(filters.selectedFamilyStatus)
  //       );

  //       setMatchingData(MatchingprofileFilter.profiles || []);
  //       setTotalItems(MatchingprofileFilter.total_count || 0);
  //     } catch (error: any) {
  //       NotifyError(error.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (filters) {
  //     fetchFilteredData();
  //   }
  // }, [filters, currentPage, itemsPerPage]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const view = searchParams.get('view');

    if (view === 'results') {
      // Extract and split DOB back into individual parts for your API
      const dob = searchParams.get('dob') || '';
      let d = '', m = '', y = '';
      if (dob.includes('-')) {
        [y, m, d] = dob.split('-');
      }

      const fetchFilteredData = async () => {
        try {
          setLoading(true);
          
          // Map URL parameters to your userMatchingProfilesFilter function
          const response = await userMatchingProfilesFilter(
            searchParams.get('profileID') || '',
            currentPage + 1,
            itemsPerPage,
            searchParams.get('city') || '',
            searchParams.get('ageFrom') || '',
            searchParams.get('ageTo') || '',
            searchParams.get('profileName') || '',
            searchParams.get('mobile') || '',
            searchParams.get('gender') || '',
            searchParams.get('email') || '',
            d, m, y // Day, Month, Year parts
          );

          setMatchingData(response.profiles || []);
          setTotalItems(response.total_count || 0);
        } catch (error: any) {
          NotifyError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchFilteredData();
    }
  }, [location.search, currentPage, itemsPerPage]);

  const handleChangePage = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(0);
  };

  const handleCheckboxChange = (profileId: string) => {
    setSelectedProfiles((prevSelected) => {
      const isSelected = prevSelected.includes(profileId);
      return isSelected
        ? prevSelected.filter((id) => id !== profileId)
        : [...prevSelected, profileId];
    });
  };

  const handleSelectAll = () => {
    setSelectedProfiles((prevSelected) => {
      if (prevSelected.length === matchingData.length) {
        return [];
      } else {
        return matchingData.map((profile) => profile.profile_id);
      }
    });
  };

  const handleSendEmail = async () => {
    if (selectedProfiles.length === 0) {
      NotifyError("Please select at least one profile to send email");
      return;
    }
    if (!selectedFormat) {
      NotifyError("Please select an email format");
      return;
    }
    try {
      setIsSendingEmail(true);
      await userMatchingProfilesSendEmail(
        selectedFormat,
        String(selectedProfiles),
        String(filters.profileID),
        String(roleId),
      );
      NotifySuccess("Email sent successfully!");
    } catch (error: any) {
      NotifyError(error.message || "Failed to send email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handlePrintProfile = async () => {
    if (selectedProfiles.length === 0) {
      NotifyError("Please select at least one profile to print profile");
      return;
    }
    if (!printFormat) {
      NotifyError("Please select an Print format");
      return;
    }
    try {
      setIsPrintProfile(true);
      const response = await userMatchingProfilesPrintProfile(
        printFormat,
        String(selectedProfiles),
        String(filters.profileID),
        String(roleId),
      );
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profile_${filters.profileID}_print.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        NotifySuccess("Profile download started successfully!");
      } else {
        NotifySuccess("Profile Printed successfully!");
      }
    } catch (error: any) {
      NotifyError(error.message || "Failed to Print Profile");
    } finally {
      setIsPrintProfile(false);
    }
  };

  const handleProfileWhatsapp = async () => {
    if (selectedProfiles.length === 0) {
      NotifyError("Please select at least one profile to print profile");
      return;
    }
    if (!whatsappFormat) {
      NotifyError("Please select an Whatsapp format");
      return;
    }
    try {
      setIsWhatsappProfile(true);
      const response = await userMatchingProfilesWhatsapp(
        whatsappFormat,
        String(selectedProfiles),
        String(filters.profileID),
        "whatsapp",
        String(roleId),
      );
      if (response instanceof Blob) {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `profile_${filters.profileID}_print.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        NotifySuccess("Profile Viewed successfully!");
      }
    } catch (error: any) {
      NotifyError(error.message || "Failed to View Profile");
    } finally {
      setIsWhatsappProfile(false);
    }
  };

  const handleGoToPage = () => {
    const pageNumber = parseInt(goToPageInput, 10);
    if (!isNaN(pageNumber)) {
      const lastPage = Math.ceil(totalItems / itemsPerPage) - 1;
      const newPage = Math.max(0, Math.min(pageNumber - 1, lastPage));
      setCurrentPage(newPage);
      setGoToPageInput('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Button
        variant="contained"
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Back to Filters
      </Button>

      <div className="flex items-center justify-end space-x-10 mb-4">

      </div>

      {/* Table */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
          <CircularProgress size={50} thickness={4.5} />
        </Box>
      ) : (
        <>
          <div className="mb-3 text-sm text-gray-600 font-medium">
            Showing {totalItems === 0 ? 0 : currentPage * itemsPerPage + 1} to{" "}
            {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of {totalItems} records
          </div>
          <Paper className="w-full">
            <TableContainer sx={{ border: '1px solid #E0E0E0' }} component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead style={{ background: '#FFF9C9', padding: '17px' }}>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        sx={{
                          borderBottom: "1px solid #E0E0E0",
                          color: "#ee3448",
                          fontWeight: "bold",
                          fontSize: "1rem",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {column.id === "select" ? (
                          <Checkbox
                            color="primary"
                            checked={selectedProfiles.length === matchingData.length}
                            indeterminate={selectedProfiles.length > 0 && selectedProfiles.length < matchingData.length}
                            onChange={handleSelectAll}
                          />
                        ) : (
                          column.label
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {matchingData && matchingData.length > 0 ? (
                    matchingData.map((row) => (
                      <TableRow
                        key={row.profile_id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell>
                          <Checkbox
                            color="primary"
                            checked={selectedProfiles.includes(row.profile_id)}
                            onChange={() => handleCheckboxChange(row.profile_id)}
                          />
                        </TableCell>
                        <TableCell>
                          <img
                            className="rounded-full"
                            src={row.profile_img || No_Image_Available}
                            alt="Profile"
                            width={50}
                            height={50}
                            onError={(e) => (e.currentTarget.src = No_Image_Available)}
                          />
                        </TableCell>
                        <TableCell
                          onClick={() =>
                            window.open(`/viewProfile?profileId=${row.profile_id}`, "_blank")
                          }
                          sx={{
                            color: 'blue',
                            cursor: 'pointer',
                            textDecoration: 'none',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          {row.profile_id}
                        </TableCell>
                        <TableCell>{row.profile_name}</TableCell>
                        <TableCell>{row.profile_age}</TableCell>
                        <TableCell>{row.profile_gender}</TableCell>
                        <TableCell>{row.height}</TableCell>
                        <TableCell>{row.weight || 'N/A'}</TableCell>
                        <TableCell>{row.degree}</TableCell>
                        <TableCell>{row.profession}</TableCell>
                        <TableCell>{row.location}</TableCell>
                        <TableCell>{row.star}</TableCell>
                        <TableCell>{row.matching_score}</TableCell>
                        <TableCell>
                          {row.verified === 0 ? (
                            <MdVerified className="text-green-600" />
                          ) : (
                            <GoUnverified className="text-red-600" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={columns.length} sx={{ textAlign: 'center' }}>
                        No Search Records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Custom Pagination */}
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
                    inputProps={{
                      min: 1,
                      max: Math.ceil(totalItems / itemsPerPage),
                    }}
                    style={{ width: '80px' }}
                    onKeyPress={(e) => e.key === 'Enter' && handleGoToPage()}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleGoToPage}
                    disabled={!goToPageInput}
                  >
                    Go
                  </Button>
                </div>

                <IconButton
                  onClick={() => setCurrentPage(0)}
                  disabled={currentPage === 0}
                  aria-label="first page"
                >
                  {"<<"}
                </IconButton>

                <IconButton
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
                  disabled={currentPage === 0}
                  aria-label="previous page"
                >
                  {"<"}
                </IconButton>

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

                  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

                  return (
                    <div className="flex">
                      {pages.map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "contained" : "text"}
                          onClick={() => setCurrentPage(page)}
                          style={{
                            minWidth: '32px',
                            height: '32px',
                            margin: '0 2px',
                            backgroundColor: currentPage === page ? '#1976d2' : 'transparent',
                            color: currentPage === page ? '#fff' : '#000',
                          }}
                        >
                          {page + 1}
                        </Button>
                      ))}
                    </div>
                  );
                })()}

                <IconButton
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(totalItems / itemsPerPage) - 1))}
                  disabled={currentPage >= Math.ceil(totalItems / itemsPerPage) - 1}
                  aria-label="next page"
                >
                  {">"}
                </IconButton>

                <IconButton
                  onClick={() => setCurrentPage(Math.ceil(totalItems / itemsPerPage) - 1)}
                  disabled={currentPage >= Math.ceil(totalItems / itemsPerPage) - 1}
                  aria-label="last page"
                >
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

export default SearchProfileResults;
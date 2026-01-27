import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Button } from '@mui/material';
import { ArrowBack, CameraAlt, Print, Settings, WhatsApp } from '@mui/icons-material';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { fetchAnnualIncome, fetchGetHighestEducation, fetchProfessionalPrefe, GetDistrict, getStatus } from '../../../action';
import { useLocation, useNavigate } from 'react-router-dom';
import { downloadProfilePdf } from '../../../services/api';
import { CallManagementModel } from './ProfileViwePopup/CallManagementModel';
import { AdminDetailsPopup } from './ProfileViwePopup/AdminDetailsPopup';
import { DataHistoryPopup } from './ProfileViwePopup/DataHistoryPopup';
import { MyProfileShare } from '../WhatsUpShare/MyProfileShare';
import { notify } from '../../TostNotification';
import PaymentPopup from '../EditFormComponents/PaymentInfo/PaymentInfoPopup';
import { District } from '../profile_form_components/EducationalDetails';
import { apiAxios } from '../../../api/apiUrl';
import { toast } from 'react-toastify';
import { hasPermission } from '../../utils/auth';

// Past Call Data Popup Component
const PastCallDataPopup: React.FC<{
  open: boolean;
  onClose: () => void;
  profileId: string;
}> = ({ open, onClose, profileId }) => {
  const [callData, setCallData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fetchCallData = async () => {
    if (!profileId) return;

    setLoading(true);
    setError(null);
    try {
      const response = await apiAxios.get(`/api/profile-call-management/list/?profile_id=${profileId}`);

      console.log('API Response:', response.data);

      if (response.data && Array.isArray(response.data)) {
        setCallData(response.data);
      } else {
        setError('Invalid data format received from server');
      }
    } catch (err: any) {
      console.error('Error fetching call data:', err);
      setError(err.response?.data?.message || 'Failed to fetch call data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && profileId) {
      fetchCallData();
    }
  }, [open, profileId]);

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN');
    } catch {
      return 'Invalid Date';
    }
  };

  // Format time for display
  const formatTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return 'Invalid Time';
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-999 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b-2 border-grey-600 bg-white">
          <div className="flex items-center space-x-4">
            <h2 className="MuiBox-root css-1axc2eg mb-0">Past Call Data</h2>
          </div>
          <button
            onClick={onClose}
            className="text-red-500 hover:text-gray-700 text-2xl font-bold transition-colors"
          >
            ×
          </button>
        </div>

        {/* Data Table */}
        <div className="p-6 overflow-auto max-h-[70vh]">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading call data...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 bg-red-50 p-4 rounded-lg border border-red-200">{error}</p>
              <button
                onClick={fetchCallData}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && callData.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No call data found for this profile.</p>
            </div>
          )}

          {!loading && !error && callData.length > 0 && (
            <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className=" !text-red-600 !text-base !text-md text-nowrap font-bold yellow-bg">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Call Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In/Out</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comments</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Call</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {callData.map((call) => (
                    <tr key={call.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(call.updated_on)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatTime(call.updated_on)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          {call.call_type_value || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${call.call_status_value?.includes('Hot')
                          ? 'bg-red-100 text-red-800 border-red-200'
                          : call.call_status_value?.includes('Warm')
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : call.call_status_value?.includes('Cold')
                              ? 'bg-blue-100 text-blue-800 border-blue-200'
                              : call.call_status_value === 'Completed'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                          }`}>
                          {call.call_status_value || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {call.inoutbound_id === 1 ? 'Inbound' : call.inoutbound_id === 2 ? 'Outbound' : 'N/A'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {call.updated_by || 'N/A'}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs">
                        <div className="break-words" title={call.comments}>
                          {call.comments || 'No comments'}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {call.next_calldate ? formatDate(call.next_calldate) : 'Not Scheduled'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            Total Calls: <span className="font-semibold">{callData.length}</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchCallData}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow-sm transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface pageProps {
  profile: any;
  isViewDetai: boolean;
  setViewDetails: Dispatch<SetStateAction<boolean>>;
}

export interface AddOnPackage {
  package_id: number;
  name: string;
  description: string;
  amount: number;
}

interface Alert {
  id: number;
  alert_name: string;
}

interface AlertSettingsResponse {
  status: string;
  message: string;
  data: {
    'Email Alerts': Alert[];
    'SMS Alerts': Alert[];
  };
}

interface FamilyStatus {
  id: number;
  status: string;
  is_deleted: boolean;
}

interface AdminCommentResponse {
  status: number; // 1 for success
  message: string;
}

const ViewProfile: React.FC<pageProps> = ({
  profile,
  isViewDetai,
  setViewDetails,
}) => {
  const { register, setValue, watch } = useForm();
  const [profileView, setProfileView] = useState<any>({});
  const [profileView2, setProfileView2] = useState<any>({});
  const [profileView3, setProfileView3] = useState<any>({});
  const [profileView7, setProfileView7] = useState<any>({});

  const [emailAlerts, setEmailAlerts] = useState<Alert[]>([]);
  const [smsAlerts, setSmsAlerts] = useState<Alert[]>([]);
  const [familyStatuses, setFamilyStatuses] = useState<FamilyStatus[]>([]);
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [checkEmailAlert, setCheckEmailAlert] = useState<string | undefined>();
  const [smsAlert, setSmsAlert] = useState<string | undefined>();
  const [checkAddOn, setCheckAddOn] = useState<string | undefined>();
  const [image, setImage] = useState<string | null>(null);
  const [openCallManagement, setOpenCallManagement] = useState<boolean>(false);
  const [OpenAdminDetails, setOpenAdminDetails] = useState<boolean>(false);
  const [openPastCallData, setOpenPastCallData] = useState<boolean>(false);
  const [pass, setPass] = useState<any>({});
  const [open, setOpen] = useState(false);
  const [openDataHistory, setOpenDataHistory] = useState(false);
  const [isShareVisible, setIsShareVisible] = useState(false);
  const [isPdfOptionsVisible, setIsPdfOptionsVisible] = useState(false);
  const [addonPackage, setAddonPackage] = useState<AddOnPackage[]>([]);
  const [adminComments, setAdminComments] = useState<string>('');
  const [lastSavedComments, setLastSavedComments] = useState<string>('');
  const [isSavingComments, setIsSavingComments] = useState<boolean>(false); // To show loading state

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const profileId = queryParams.get('profileId');
  const adminUserID = sessionStorage.getItem('id') || localStorage.getItem('id');
  const planStatus = Number(profileView?.plan_status);
  const hideMembershipDates = [6, 7, 8, 9].includes(planStatus);
  const membershipStatus = profileView?.membership_status;
  const membershipActivation = Number(localStorage.getItem('membership_activation'));
  // Fetch data using useQuery
  const { data: AnnualIncomeData } = useQuery({
    queryKey: ['AnnualIncome'],
    queryFn: fetchAnnualIncome,
  });

  const { data: HighestEducationData } = useQuery({
    queryKey: ['GetHighestEducation'],
    queryFn: fetchGetHighestEducation,
  });

  const { data: ProfessionData } = useQuery({
    queryKey: ['ProfessionalPreference'],
    queryFn: fetchProfessionalPrefe,
  });

  const { data: WorkDistrictData } = useQuery({
    queryKey: [profileView2?.work_state, 'WorkDistrictViewProfile'],
    queryFn: () => GetDistrict(profileView2.work_state),
    enabled: !!profileView2?.work_state && profileView2?.work_country === '1',
  });

  const { data: Status } = useQuery({
    queryKey: ['Status'],
    queryFn: getStatus,
  });

  // Initialize profile data
  useEffect(() => {
    if (profile && profile.length > 0) {
      setPass(profile[0]);
    }
  }, [profile]);

  useEffect(() => {
    if (profile) {
      if (profile[6]) {
        const membership_fromdate = new Date(profile[6].membership_fromdate);
        const formattedDateFrom = membership_fromdate.toISOString().split('T')[0];

        const membership_todate = new Date(profile[6].membership_todate);
        const formattedDate = membership_todate.toISOString().split('T')[0];

        setValue('profileView.membership_fromdate', formattedDateFrom);
        setValue('profileView.membership_todate', formattedDate);
        setAdminComments(profile[6].Admin_comments || '');
        setLastSavedComments(profile[6].Admin_comments || '');
      }
    }
  }, [profile, setValue]);

  useEffect(() => {
    if (profile) {
      if (profile[6]?.DateOfJoin) {
        const dateOfJoin = new Date(profile[6].DateOfJoin);
        const formattedDate = dateOfJoin.toISOString().split('T')[0];
        setFormattedDate(formattedDate);
        setValue('profileView.DateOfJoin', formattedDate);
      }

      const checkEmailAlert = profile[6].Notifcation_enabled;
      setCheckEmailAlert(checkEmailAlert);
      const SmsAlert = profile[6].Notifcation_enabled;
      setSmsAlert(SmsAlert);
      const AddOnPackages = profile[6].Addon_package;
      setCheckAddOn(AddOnPackages);
      const file = profile[6].profile_image;
      if (file) {
        setImage(file);
      }
    }
  }, [profile]);

  useLayoutEffect(() => {
    if (profile && profile.length > 0) {
      setProfileView(profile[6] || {});
      setProfileView2(profile[2] || {});
      setProfileView3(profile[3] || {});
      setPass(profile[0] || {});
    }
  }, [profile]);

  useLayoutEffect(() => {
    if (profile && profile.length > 0) {
      setProfileView7(profile[7]);
    }
  }, [profile]);


  const handleSaveAdminComments = async () => {
    if (!profileId || isSavingComments) return;

    setIsSavingComments(true);

    const apiUrl = `/api/update-admincomments/${profileId}/`;

    try {
      const response = await apiAxios.put<AdminCommentResponse>(apiUrl, {
        Admin_comments: adminComments,
        admin_user_id: adminUserID,
      });

      if (response.status === 200) {
        toast.success('Admin comments saved successfully!');
        setLastSavedComments(adminComments);
        setProfileView((prev: any) => ({ ...prev, Admin_comments: adminComments }));
      } else {
        toast.error(response.data.message || 'Failed to save admin comments.', { type: 'error' });
      }
    } catch (error) {
      console.error('Error saving admin comments:', error);
      notify('An unexpected error occurred while saving comments.', { type: 'error' });
    } finally {
      setIsSavingComments(false);
    }
  };
  // Fetch additional data
  useEffect(() => {
    axios
      .get<FamilyStatus[]>('https://app.vysyamala.com/api/family-statuses/')
      .then((response) => {
        const filteredStatuses = response.data.filter(
          (status) => !status.is_deleted,
        );
        setFamilyStatuses(filteredStatuses);
      })
      .catch((error) => {
        console.error('Error fetching family statuses:', error);
      });
  }, []);

  useEffect(() => {
    axios
      .post<AlertSettingsResponse>(
        'https://app.vysyamala.com/auth/Get_alert_settings/',
      )
      .then((response) => {
        if (response.data.status === '1') {
          setEmailAlerts(response.data.data['Email Alerts']);
          setSmsAlerts(response.data.data['SMS Alerts']);
        } else {
          console.error('Failed to fetch alert settings.');
        }
      })
      .catch((error) => {
        console.error('Error fetching alert settings:', error);
      });
  }, []);

  const fetchAddOnPackages = async () => {
    try {
      const response = await axios.post(
        'https://app.vysyamala.com/auth/Get_addon_packages/',
      );
      if (response.data.status === 'success') {
        setAddonPackage(response.data.data);
      } else {
        console.log(response.data.message || 'Failed to fetch packages');
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAddOnPackages();
  }, []);

  const handleWhatsAppShare = () => {
    if (!profileId) {
      toast.error("Profile ID not found");
      return;
    }

    const url = `https://app.vysyamala.com/api/whatsapp-share/${profileId}/`;

    window.open(url, "_blank"); // open in new tab
  };


  // Memoized computed values for profile data
  const annualIncomeName = useMemo(() => {
    const id = profileView2?.anual_income;
    if (!id || !AnnualIncomeData) return 'Not available';
    const found = AnnualIncomeData.find((item: any) => String(item.id) === String(id));
    return found?.income || 'Not available';
  }, [profileView2, AnnualIncomeData]);

  const educationName = useMemo(() => {
    const id = profileView2?.highest_education;
    if (!id || !HighestEducationData) return 'Not available';
    const found = HighestEducationData.find((item: any) => String(item.education_id) === String(id));
    return found?.education_description || 'Not available';
  }, [profileView2, HighestEducationData]);

  const professionName = useMemo(() => {
    const id = profileView2?.profession;
    if (!id || !ProfessionData) return 'Not available';
    const found = ProfessionData.find((item: any) => String(item.Profes_Pref_id) === String(id));
    return found?.Profes_name || 'Not available';
  }, [profileView2, ProfessionData]);

  const placeOfStayName = useMemo(() => {
    const countryId = profileView2?.work_country;
    const districtId = profileView2?.work_district;
    const city = profileView2?.work_city;

    if (countryId === '1') {
      if (!districtId || !WorkDistrictData) return 'Not available';
      const found = WorkDistrictData.find((d: District) => String(d.disctict_id) === String(districtId));
      return found?.disctict_name || 'Not available';
    } else {
      return city || 'Not available';
    }
  }, [profileView2, WorkDistrictData]);

  const starName = useMemo(() => {
    return profileView3?.star_name || 'Not available';
  }, [profileView3]);

  // Helper functions
  const toggleSection10 = () => {
    setViewDetails(!isViewDetai);
  };

  const handlePrintProfile = (format: string) => {
    if (profileId) {
      downloadProfilePdf(profileId, format);
    } else {
      console.error('Profile ID is not available or invalid');
      notify('Invalid profile ID. Please check the profile details.', { type: 'error' });
    }
  };

  const toggleShareVisibility = () => {
    setIsShareVisible((prevState) => !prevState);
    setIsPdfOptionsVisible(false);
  };

  const togglePdfVisibility = () => {
    setIsPdfOptionsVisible((prevState) => !prevState);
    setIsShareVisible(false);
  };

  const email = profileView.Notifcation_enabled?.split(',');
  const sms = profileView.Notifcation_enabled?.split(',');
  const addOn = profileView.Addon_package?.split(',');

  return (
    <div className="bg-white p-8 mb-10 rounded shadow-md">
      <h4
        onClick={toggleSection10}
        className="text-red-600 flex items-center justify-between text-xl cursor-pointer font-semibold dark:text-white"
      >
        <span>Profile View</span>
        <svg
          className={`fill-current transform ${isViewDetai ? 'rotate-180' : ''}`}
          width="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
            fill=""
          ></path>
        </svg>
      </h4>

      {isViewDetai && (
        <div className="mt-3">
          {/* Header with back and action buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div
              className="flex items-center gap-2 text-blue-600 cursor-pointer hover:text-blue-800"
              onClick={() => navigate(-1)}
            >
              <ArrowBack fontSize="small" />
              <span>Back</span>
            </div>

            <div className="flex flex-wrap gap-4 sm:gap-6 text-gray-700">
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-gray-900"
                onClick={() =>
                  window.open(`/UploadApprovalProfileImg?profileId=${profileId}`, "_blank")
                }
              >
                <CameraAlt fontSize="small" />
                <span>Photo Update</span>
              </div>
              {/* <div className="flex items-center gap-2 cursor-pointer hover:text-green-600" onClick={toggleShareVisibility} > */}
              <div className="flex items-center gap-2 cursor-pointer hover:text-green-600" onClick={handleWhatsAppShare} >
                <WhatsApp fontSize="small" className=" text-green-700" />
                <span>WhatsApp</span>

                {isShareVisible && (
                  <MyProfileShare
                    closePopup={toggleShareVisibility}
                    profileImagess={profile[6]?.profile_image || ""}
                    profileId={profileId}
                    profileName={profile[6]?.Profile_name}
                    age={profile[6]?.age}
                    starName={starName}
                    annualIncome={annualIncomeName}
                    education={educationName}
                    profession={professionName}
                    companyName={profileView2?.company_name}
                    businessName={profileView2?.business_name}
                    placeOfStay={placeOfStayName}
                  />
                )}
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer hover:text-gray-900"
                onClick={togglePdfVisibility}
              >
                <Print fontSize="small" />
                <span>Print</span>

                {isPdfOptionsVisible && (
                  <div className='absolute right-20 mt-30 z-10 w-[220px] rounded-md shadow-lg p-2 bg-white max-sm:left-auto max-sm:right-[-200px]'>
                    <div className='flex flex-col items-start pb-1 font-semibold'>
                      <button onClick={() => handlePrintProfile('withoutaddress')}>Format 1</button>
                    </div>
                    <div className='flex flex-col items-start pb-1 font-semibold'>
                      <button onClick={() => handlePrintProfile('withaddress')}>Format 2</button>
                    </div>
                    <div className='flex flex-col items-start pb-1 font-semibold'>
                      <button onClick={() => handlePrintProfile('withoutcontact')}>Format 3</button>
                    </div>
                    <div className='flex flex-col items-start pb-1 font-semibold'>
                      <button onClick={() => handlePrintProfile('withonlystar')}>Format 5</button>
                    </div>
                    <div className='flex flex-col items-start pb-1 font-semibold'>
                      <button onClick={() => handlePrintProfile('withcontactonly')}>Format 7</button>
                    </div>
                    <div className='flex flex-col items-start pb-1 font-semibold'>
                      <button onClick={() => handlePrintProfile('withoutcontactonly')}>Format 8</button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                <Settings fontSize="small" />
                <span>Settings</span>
              </div>
            </div>
          </div>

          {/* Profile Image and Basic Info */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            {/* Profile Image */}
            <div className="flex flex-col items-center">
              <div className="border-2 border-red-600 w-[150px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[180px] md:h-[200px] flex items-center justify-center">
                {profile?.[6]?.profile_image ? (
                  <img
                    src={
                      profile[6].profile_image ||
                      'https://app.vysyamala.com/media/default_groom.png'
                    }
                    alt="Profile"
                    className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border border-red-500 shadow-md object-cover"
                  />
                ) : (
                  <p>Loading image...</p>
                )}
              </div>
              <div className="mt-2 text-center">
                <span className="text-vibrantOrange block">
                  {profileView.Package_name}
                </span>
                <span className="text-vibrantOrange">
                  valid till: {profileView.valid_till}
                </span>
              </div>
              <br />
              <span className={`text-green-700 font-bold text-xl`}>
                {profileId}
              </span>
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              {/* Profile ID and Basic Info */}
              <div className="flex flex-wrap items-center gap-1 text-sm sm:text-base">
                <span className="text-green-600">
                  {profileView.ProfileId}-{profileView.Profile_name}
                </span>
                <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                <span className="text-green-600">{profileView.age}</span>
                <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                <span className="text-green-600">{profileView.suya_gothram}</span>
                <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                <span className="text-green-600">{profileView.Package_name}</span>
                <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                <span className="text-green-600">valid till: {profileView.valid_till}</span>
                <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                <span className="text-green-600">Password: {pass.Password}</span>
                <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                <span className="text-green-600">idle days: {profileView.idle_days}</span>
                <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                <span className="text-green-600">Date of Registration:{" "}
                  {profileView?.DateOfJoin
                    ? new Date(profileView.DateOfJoin.replace("T", " "))
                      .toLocaleDateString("en-CA")
                    : "N/A"}</span>
              </div>
              <div className="w-full border-t-2 border-blue-600 my-2"></div>
              <div className="w-full border-t-2 border-blue-600"></div>

              {/* Stats Grid */}
              <div className="mt-4 overflow-x-auto">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-12 gap-2 min-w-[600px]">
                  {[
                    { count: profileView7.matchingprofile_count, label: "Matching Profile", onClick: `/UserMatchingProfiles?profileId=${profileId}` },
                    { count: profileView7.suggestedprofile_count, label: "Suggested Profile", onClick: `/suggestedProfiles?profileId=${profileId}` },
                    { count: profileView7.visibility_count, label: "Profile Visibility", onClick: `/UserProfileVisibilityFilter?profileId=${profileId}` },
                    { count: profileView7.viewedprofile_count, label: "Viewed Profile", onClick: `/ViewedProfilesById?profileId=${profileId}` },
                    { count: profileView7.visitorprofile_count, label: "Visitor Profile", onClick: `/VisitorProfilesById?profileId=${profileId}` },
                    { count: profileView7.ctocsend_count, label: "C to C Sent", onClick: `/CToCSentProfiles?profileId=${profileId}` },
                    { count: profileView7.ctocreceived_count, label: "C to C Received", onClick: `/CToCReceivedProfiles?profileId=${profileId}` },
                    { count: profileView7.exp_int_sentcount, label: "EI Sent", onClick: `/ExpressInterestProfiles?profileId=${profileId}` },
                    { count: profileView7.exp_int_reccount, label: "EI Received", onClick: `/ExpressInterestReceivedProfiles?profileId=${profileId}` },
                    { count: profileView7.mutual_int_count, label: "Mutual Interest", onClick: `/ExpressInterestMutualProfiles?profileId=${profileId}` },
                    { count: profileView7.shortlisted_count, label: "Shortlisted" },
                    { count: profileView7.prsent_count, label: "PR Sent", onClick: `/ProfileSentTo?profileId=${profileId}` },
                    { count: profileView7.varequest_count, label: "VA Request", onClick: `/VysaAssist?profileId=${profileId}` },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex flex-col items-center text-center p-1 border-l-2 border-orange-500 ${item.onClick ? 'cursor-pointer' : ''}`}
                      onClick={item.onClick ? () => navigate(item.onClick) : undefined}
                    >
                      <span className="text-orange-500 text-sm sm:text-lg font-semibold">{item.count}</span>
                      <span className="text-blue-500 text-xs sm:text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full border-t-2 border-blue-600 my-2"></div>

              {/* Profile Completion */}
              <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                <span className="text-green-600">
                  Profile Completion <span className="text-orange-500">{profileView.profile_completion}%</span>
                </span>

                {(membershipStatus !== null && membershipStatus !== undefined && membershipStatus === 'Renew') && (
                  <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-300">
                    <svg
                      className="w-5 h-5 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" />
                    </svg>
                    <span className="text-red-700 font-bold">
                      Renew
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-4">
                <Button
                  variant="contained"
                  size="small"
                  className="bg-blue-700 whitespace-nowrap"
                  onClick={() => navigate(`/UserMatchingProfiles?profileId=${profileId}`)}
                >
                  Matching Profiles
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  className="bg-blue-700 whitespace-nowrap"
                  // onClick={() => navigate(`/CallManagement?profileId=${profileId}`)}
                  onClick={() => window.open(`/CallManagement?profileId=${profileId}`, "_blank")}
                >
                  Call Management
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  className="bg-blue-700 whitespace-nowrap"
                  onClick={() => setOpenAdminDetails(true)}
                >
                  Admin Details
                </Button>

                <Button
                  variant="contained"
                  size="small"
                  className="bg-blue-700 whitespace-nowrap"
                  onClick={() => setOpenDataHistory(true)}
                >
                  Data History
                </Button>

                <div>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => setOpen(true)}
                    className="bg-blue-700 whitespace-nowrap w-45">
                    Payment Info
                  </Button>
                  <PaymentPopup open={open} onClose={() => setOpen(false)} profileId={profileId ?? ""} showAddButton={false} />
                </div>

                {/* Past Call Data Button */}
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => setOpenPastCallData(true)}
                  className="bg-blue-700 whitespace-nowrap hover:bg-blue-800 transition-colors"
                >
                  Past Call Data
                </Button>
              </div>

              {/* Profile Info Sections */}
              <div className="mt-4 flex flex-col lg:flex-row gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="mb-2">
                    <p className="text-[#5a5959e6] font-semibold">
                      Payment Info:
                      <span className="text-green-700 ml-1">
                        {profileView.payment_date}/{profileView.Package_name} /{profileView.add_on_pack_name}/{profileView.payment_mode}
                      </span>
                    </p>
                  </div>

                  {/* {membershipActivation !== 0 && ( */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-[#5a5959e6]">Profile Status:</span>
                    <span className="text-[#5a5959e6]">{profileView?.profile_status || "N/A"} {profileView?.others && profileView?.others.trim() !== "" && (
                      <> / {profileView.others}</>
                    )}</span>
                    <div className="h-4 border-l-2 border-gray-400 mx-1"></div>
                    <span className="font-semibold text-[#5a5959e6]">Profile Owner:</span>
                    <span className="text-[#5a5959e6]">{profileView?.profile_owner || "N/A"}</span>
                  </div>
                  {/* )} */}

                  {!hideMembershipDates && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <span className="font-semibold text-[#5a5959e6] whitespace-nowrap">Membership Date:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">From:</span>
                        <span className="text-[#5a5959e6]">
                          {watch('profileView.membership_fromdate')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold">To:</span>
                        <span className=" text-[#222020e6]">
                          {watch('profileView.membership_todate')}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-1 mb-2">
                    <span className="font-semibold text-[#5a5959e6] whitespace-nowrap">AddOn Packages:</span>
                    <span className="text-[#222020e6]">
                      {addonPackage
                        .filter(pkg => addOn?.includes(pkg.package_id.toString()))
                        .map(pkg => `${pkg.name}-${pkg.amount}`)
                        .join(', ')}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mb-2">
                    <span className="font-semibold text-[#5a5959e6]">
                      Visit Count No: <span className="font-normal">{profileView.visit_count}</span>
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#5a5959e6]">
                      Exp Interest: <span className="font-normal">
                        {profileView.exp_int_lock === 1 ? "Yes" : "No"}
                        {profileView.exp_int_lock === 1 && (
                          <span className="ml-2 font-semibold">Exp No Count: <span className="font-normal">{profileView.exp_int_count}</span></span>
                        )}
                      </span>
                    </span>
                  </div>

                  {/* Mobile Verification */}
                  <div className="bg-[#DDDFFF] p-2 rounded mt-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Mobile Number:</span>
                        <span className="text-red-500">{profileView.Mobile_no}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-semibold mr-2">Verification:</span>
                        <label className="ml-1 flex items-center">
                          <input
                            type="radio"
                            value="1"
                            {...register("mobile_otp_verify")}
                            checked={profileView.mobile_otp_verify === 1}
                            className="mr-1"
                          />
                          Yes
                        </label>
                        <label className="ml-3 flex items-center">
                          <input
                            type="radio"
                            value="0"
                            {...register("mobile_otp_verify")}
                            checked={profileView.mobile_otp_verify === 0}
                            className="mr-1"
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Admin Comments */}
                <div className="flex-1 max-w-full lg:max-w-md">
                  <textarea
                    id="admin-comments"
                    value={adminComments}
                    onChange={(e) => setAdminComments(e.target.value)}
                    //onBlur={handleSaveAdminComments}
                    className="w-full h-32 sm:h-40 border-2 border-green-500 rounded-3xl p-4 text-[#5a5959e6] focus:outline-none focus:border-blue-700 transition duration-300 resize-none"
                  // ... other props
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={handleSaveAdminComments}
                    disabled={isSavingComments}
                    className="bg-green-600 hover:bg-green-700 text-white mt-2"
                  >
                    {isSavingComments ? 'Saving...' : 'Save Admin Comments'}
                  </Button>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <label className="font-semibold">Horo Hint:</label>
                      <input
                        value={profileView.horoscope_hints}
                        type="text"
                        className="flex-1 border-2 border-blue-500 rounded-lg px-3 py-1 text-[#5a5959e6] focus:outline-none focus:border-blue-700"
                      />
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <label className="font-semibold">Admin Chevvai Dhosam:</label>
                      <span className="text-[#5a5959e6]">{profileView.calc_chevvai_dhosham}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="font-semibold">Admin Rahu/Kethu Dhosam:</label>
                      <span className="text-[#5a5959e6]">{profileView.calc_raguketu_dhosham}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <CallManagementModel
        open={openCallManagement}
        onClose={() => setOpenCallManagement(false)}
      />
      <AdminDetailsPopup
        open={OpenAdminDetails}
        onClose={() => setOpenAdminDetails(false)}
      />
      <DataHistoryPopup
        open={openDataHistory}
        onClose={() => setOpenDataHistory(false)}
        profileId={profileId || ''}
      />

      {/* Past Call Data Popup */}
      <PastCallDataPopup
        open={openPastCallData}
        onClose={() => setOpenPastCallData(false)}
        profileId={profileId || ''}
      />
    </div>
  );
};

export default ViewProfile;
import { Dispatch, SetStateAction, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  ArrowBack,
  Autorenew,
  CameraAlt,
  Print,
  Settings,
  WhatsApp,
} from '@mui/icons-material';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { notify, notifyDelete } from '../../TostNotification';
import {
  fetchAnnualIncome,
  fetchEditProfileDetails,
  fetchGetHighestEducation,
  fetchProfessionalPrefe,
  GetDistrict,
  getEditProfileView,
  getEditProfileViewStatus,
  getPrimaryStatus,
  getProfilePrimaryStatus,
  getProfileSecondaryStatus,
  getSecondaryStatus,
} from '../../../action';
import { useFormContext } from 'react-hook-form';
import { profileView } from '../../../types/EditProfilrSchema';
import ProfileForm from './adminForm';
import { useNavigate } from 'react-router-dom';
import { downloadProfilePdf } from '../../../services/api';
import { CallManagementModel } from '../viewProfileComponents/ProfileViwePopup/CallManagementModel';
import { AdminDetailsPopup } from '../viewProfileComponents/ProfileViwePopup/AdminDetailsPopup';
import { DataHistoryPopup } from '../viewProfileComponents/ProfileViwePopup/DataHistoryPopup';
import VerifyOTPPopup from '../verifyotp/verifyotppopup';
import { apiAxios } from '../../../api/apiUrl';
import { MyProfileShare } from '../WhatsUpShare/MyProfileShare';
import PaymentPopup from './PaymentInfo/PaymentInfoPopup';
import { District } from './EducationalDetails';
import { hasPermission } from '../../utils/auth';
import { toast } from 'react-toastify';

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

      // Log the response to see the actual structure
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
                  <tr className=''>
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
  handleSubmit: () => void;
  error: any;
  EditData: any;
  isViewDetais: boolean;
  setViewDetail: Dispatch<SetStateAction<boolean>>;
  refetchProfileData?: () => void; // ADD THIS
}

export interface AddOnPackage {
  package_id: number;
  name: string;
  description: string;
  amount: number;
}

export interface ProfileOwner {
  id: number;
  username: string;
}

export const fetchProfileOwners = async (): Promise<ProfileOwner[]> => {
  const response = await apiAxios.get('api/users/'); // Assuming apiAxios points to https://app.vysyamala.com
  return response.data;
};

const EditViewProfile: React.FC<pageProps> = ({
  isViewDetais,
  setViewDetail,
  EditData,
  handleSubmit,
  refetchProfileData
}) => {
  // Add state for Past Call Data popup
  const [openPastCallData, setOpenPastCallData] = useState<boolean>(false);

  const {
    setValue,
    watch,
    register,
    getValues,
    formState: { errors },
  } = useFormContext<profileView>();
  const [addonPackage, setAddonPackage] = useState<AddOnPackage[]>([]);
  const [profileView7, setProfileView7] = useState<any>({});
  const [openCallManagement, setOpenCallManagement] = useState<boolean>(false)
  const [openDataHistory, setOpenDataHistory] = useState<boolean>(false)
  const [OpenAdminDetails, setOpenAdminDetails] = useState<boolean>(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [open, setOpen] = useState(false);
  const [profileView, setProfileView] = useState<any>({});
  const [pass, setPass] = useState<any>({});
  const [profileView2, setProfileView2] = useState<any>({}); // State for profile[2]
  const [profileView3, setProfileView3] = useState<any>({});
  const [selectedOwner, setSelectedOwner] = useState<number | ''>('');


  const status = watch('profileView.status') ?? ''; // Ensure it doesn't break
  console.log("edit status", status)
  const primaryStatus = watch('profileView.primary_status') ?? ''; // Prevent undefined errors
  console.log("primaryStatus", primaryStatus)
  const secondaryStatus = watch('profileView.secondary_status') ?? '';
  const image = watch('profileView.profile_image');
  const navigate = useNavigate();
  const primary = watch('profileView.primary_status');
  const secondaryy = watch('profileView.secondary_status');
  const profileName = watch('profileView.Profile_name');
  const profileId = watch('profileView.ProfileId');
  const Mobile_no = watch('profileView.Mobile_no');
  const suya_gothram = watch('profileView.suya_gothram');
  const profile_completion = watch('profileView.profile_completion');
  const Registration_Date = watch('profileView.DateOfJoin');
  const chevvai = watch('profileView.calc_chevvai_dhosham');
  const raagu = watch('profileView.calc_raguketu_dhosham');
  const Package_name = watch('profileView.Package_name');
  const valid_till = watch('profileView.valid_till'); // Ensure this matches the schema
  const age = watch('profileView.age'); // Ensure this matches the schema
  const gender = watch('profileView.Gender')
  const created_date = watch('profileView.created_date');
  const idle_days = watch('profileView.idle_days');
  console.log("idle_days edit profile view ", idle_days);
  const visit_count = watch('profileView.visit_count');
  const exp_int_lock = watch('profileView.exp_int_lock');
  const exp_int_count = watch('profileView.exp_int_count');
  const payment_date = watch('profileView.payment_date');
  const payment_mode = watch('profileView.payment_mode');
  const add_on_pack_name = watch('profileView.add_on_pack_name');
  const planStatus = watch("profileView.plan_status");
  console.log("edit planStatus", planStatus)
  const hideMembershipDates = [6, 7, 8, 9].includes(Number(planStatus));
  console.log("hideMembershipDates", hideMembershipDates)
  const primaryStatusValue = Number(watch('profileView.primary_status'));
  console.log("edit primaryStatusValue", primaryStatusValue)
  const membershipStatus = watch('profileView.membership_status');
  const RoleID = localStorage.getItem('role_id') || sessionStorage.getItem('role_id');
  const shouldShowProfileOwner = RoleID === "7";


  const membershipActivation = Number(localStorage.getItem('membership_activation'));

  //Role value 3
  const [initialApiStatus, setInitialApiStatus] = useState<number | null>(null);
  console.log("initialApiStatus", initialApiStatus)
  const shouldHideSecondaryStatus = membershipActivation === 3 && [1, 2, 3, 4].includes(status);

  const isPreApprovedAndProtected = membershipActivation === 3 && initialApiStatus === 1;


  const isMembershipActive3 = membershipActivation === 3;
  const isStatus1to4 = [0, 1, 2, 3, 4].includes(Number(status));
  const isStatus1 = Number(status) === 1;

  // const shouldShowSecondaryStatusControls = useMemo(() => {
  //   // Show if membership is 3 AND status is 1, 2, 3, or 4 (your requirement)
  //   if (isMembershipActive3 && isStatus1to4) {
  //     return true;
  //   }


  //   return isMembershipActive3 && isStatus1to4;

  // }, [isMembershipActive3, isStatus1to4, membershipActivation, status]);

  const shouldShowSecondaryStatusControls = useMemo(() => {
    const currentStatus = Number(status);
    const initialStatusWasOne = initialApiStatus === 1;
    const initialStatusWasZero = initialApiStatus === 0;
    const isCurrentStatus1to4 = [0, 1, 2, 3, 4].includes(currentStatus);

    if (membershipActivation === 1) {
      return true;
    }

    // if (membershipActivation === 2) {
    //   return true;
    // }
    // 1. Hide if initial API status was 1 (first new requirement)
    if (initialStatusWasOne) {
      return false;
    }

    // 2. Show if original status was 0 and current status is now 1, 2, 3, or 4 (second new requirement)
    if (initialStatusWasZero && isCurrentStatus1to4) {
      return true;
    }

    // 3. Keep existing logic (Show if membership is 3 AND current status is 1, 2, 3, or 4)
    // Note: The logic in the component was: `return isMembershipActive3 && isStatus1to4;`
    // I will include this for completeness with the existing code's intent,
    // although the 'initial status was 0 and changed' case covers most of this.
    const isMembershipActive3 = membershipActivation === 3;
    if (isMembershipActive3 && isCurrentStatus1to4) {
      return true;
    }

    const isMembershipActive2 = membershipActivation === 2;
    if (isMembershipActive2 && isCurrentStatus1to4) {
      return true;
    }

    // Default: Hide
    return false;
  }, [status, initialApiStatus, membershipActivation]);



  const shouldAllowOnlyApprovedStatus = membershipActivation === 2 && ["6", "7", "8", "9"].includes(planStatus);

  const shouldHideSecondarySelects = isPreApprovedAndProtected;


  // Displaying membership date condition
  const shouldShowMembershipDates = useMemo(() => {
    // Condition 2: Check if the currently selected primaryStatus is between 26 and 30 (inclusive).
    const isPrimaryStatusInOverrideRange = primaryStatusValue === 30 || primaryStatusValue === 5 || primaryStatusValue === 6 || primaryStatusValue === 7 || primaryStatusValue === 8;

    // Condition 1: Check if planStatus is NOT one of the hiding values (6, 7, 8, 9).
    const isPlanStatusNotHiding = ![6, 7, 8, 9].includes(Number(planStatus));

    // Show if plan status is NOT in the hiding list OR if the primary status is in the override range.
    return isPlanStatusNotHiding || isPrimaryStatusInOverrideRange;
    //return isPrimaryStatusInOverrideRange;
  }, [planStatus, primaryStatusValue]);

  useEffect(() => {
    // Convert boolean to string for storage
    const value = shouldShowMembershipDates ? "true" : "false";

    // store in sessionStorage
    sessionStorage.setItem("shouldShowMembershipDates", value);

    // store in localStorage
    localStorage.setItem("shouldShowMembershipDates", value);

  }, [shouldShowMembershipDates]);

  //membership activation Role value 2
  const numericPlanStatus = Number(planStatus);
  const isPlanStatusNotFinalized = ![6, 7, 8, 9].includes(numericPlanStatus);

  const shouldDisableSpecificStatuses =
    membershipActivation === 2 &&
    isPlanStatusNotFinalized &&
    initialApiStatus === 1;

  // Handler function
  const { data: profileOwnersData, isLoading: isOwnersLoading } = useQuery<ProfileOwner[]>({
    queryKey: ['profileOwners'],
    queryFn: fetchProfileOwners,
  });



  // Handler function (Keep existing handler)
  // const handleOwnerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   // Convert the value to a number, or keep it as '' if empty
  //   const value = event.target.value;
  //   setSelectedOwner(value === '' ? '' : Number(value));
  // };
  const handleOwnerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    const ownerId = value === '' ? '' : Number(value);


    setSelectedOwner(ownerId);
    setValue('profileView.admin_user_id', ownerId as any, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

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

  // Fetch districts - needed for Place of Stay if in India
  const { data: WorkDistrictData } = useQuery({
    queryKey: [profileView2?.work_state, 'WorkDistrictViewProfile'], // Use a unique key part
    queryFn: () => GetDistrict(profileView2.work_state),
    enabled: !!profileView2?.work_state && profileView2?.work_country === '1', // Only fetch if state exists and country is India
  });

  useLayoutEffect(() => {
    if (EditData && EditData.length > 0) { // Use EditData here
      setProfileView(EditData[6] || {});   // Now setProfileView exists
      setProfileView2(EditData[2] || {});
      setProfileView3(EditData[3] || {});
      setPass(EditData[0] || {}); // Set pass state if needed
    }
  }, [EditData]);


  // ... rest of the component logic (toggleSection10, handlePrintProfile, etc.) ...

  // ---> FIND THE NAMES before rendering MyProfileShare <---
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
    const city = profileView2?.work_city; // Used for non-India

    if (countryId === '1') { // Assuming '1' is India
      if (!districtId || !WorkDistrictData) return 'Not available';
      const found = WorkDistrictData.find((d: District) => String(d.disctict_id) === String(districtId));
      return found?.disctict_name || 'Not available';
    } else {
      return city || 'Not available'; // Use city name directly if not India
    }
  }, [profileView2, WorkDistrictData]);

  const starName = useMemo(() => {
    // Assuming star name comes directly from profile[3].star_name
    return profileView3?.star_name || 'Not available';
  }, [profileView3]);
  useEffect(() => {
    if (EditData?.[6]) {
      const data = EditData[6];
      setValue('profileView.status', data.status ?? 0);
      setInitialApiStatus(Number(status));
      setValue('profileView.primary_status', data.secondary_status ?? '');
      setValue('profileView.secondary_status', data.plan_status ?? '');
      setValue('profileView.plan_status', data.plan_status ?? '');
      setValue('profileView.Profile_name', data.Profile_name ?? '');
      setValue('profileView.ProfileId', data.ProfileId ?? '');
      setValue('profileView.Mobile_no', data.Mobile_no ?? '');
      setValue('profileView.suya_gothram', data.suya_gothram ?? '');
      setValue('profileView.profile_completion', data.profile_completion ?? '');
      setValue('profileView.family_status', data.family_status ?? '');
      setValue('profileView.Gender', data.Gender ?? '');
      setValue(
        'profileView.calc_chevvai_dhosham',
        data.calc_chevvai_dhosham ?? '',
      );
      setValue('profileView.calc_raguketu_dhosham', data.calc_raguketu_dhosham ?? '',);
      setValue('profileView.horoscope_hints', data.horoscope_hints ?? '');
      setValue('profileView.Admin_comments', data.Admin_comments ?? '');
      setValue('profileView.Addon_package', data.Addon_package ?? '');
      const value =
        data.Notifcation_enabled?.trim() === '' || data.Notifcation_enabled == null
          ? ''
          : data.Notifcation_enabled;
      setValue(
        'profileView.Notifcation_enabled',
        value,
      );
      setValue('profileView.profile_image', EditData[6].profile_image);
      setValue('profileView.Package_name', data.Package_name ?? '');
      setValue('profileView.valid_till', data.valid_till ?? '');
      setValue('profileView.idle_days', data.idle_days ?? '');
      setValue('profileView.age', data.age ?? '');
      setValue('profileView.created_date', data.created_date ?? '');
      setValue('profileView.visit_count', data.visit_count === null || "" || 0 ? 0 : data.visit_count);
      setValue('profileView.exp_int_count', data.exp_int_count === null || "" || 0 ? 0 : data.exp_int_count);
      setValue('profileView.exp_int_lock', data.exp_int_lock === null || data.exp_int_lock === "" || data.exp_int_lock === undefined ? 0 : Number(data.exp_int_lock)
      );

      setValue('profileView.payment_date', data.payment_date ?? '');
      setValue('profileView.payment_mode', data.payment_mode ?? '');
      setValue('profileView.add_on_pack_name', data.add_on_pack_name ?? 0);
      setValue('profileView.mobile_otp_verify', data.mobile_otp_verify ?? '');
      setValue('profileView.membership_fromdate', data.membership_fromdate ?? '');
      setValue('profileView.membership_todate', data.membership_todate ?? '');
      setValue('profileView.membership_status', data.membership_status ?? '');
      setValue('profileView.others', data.others ?? '');

      if (data?.DateOfJoin) {
        const formattedDate = new Date(data.DateOfJoin)
          .toISOString()
          .split('T')[0];
        setValue('profileView.DateOfJoin', formattedDate);
      }
      const currentAdminUserId = data.profile_owner_id; // Check your API response for the actual field name

      if (currentAdminUserId !== undefined && currentAdminUserId !== null) {
        const ownerId = Number(currentAdminUserId);
        // 1. Initialize local state
        setSelectedOwner(ownerId);
        // 2. Initialize RHF context value for submission
        setValue('profileView.admin_user_id', ownerId as any);
      }
    }
  }, [EditData, initialApiStatus]);

  // Reset "others" field to empty string if it's hidden
  useEffect(() => {
    const currentPrimary = Number(primaryStatus);
    if (![12, 17, 22].includes(currentPrimary)) {
      setValue('profileView.others', '');
    }
  }, [primaryStatus, setValue]);

  useLayoutEffect(() => {
    if (EditData && EditData.length > 0) {
      setProfileView7(EditData[7]);
    }
  }, [EditData]);

  const toggleSection1 = () => {
    setViewDetail(!isViewDetais);
    console.log(isViewDetais, 'isViewDetais');
  };

  const { data: Status } = useQuery({
    queryKey: ['Status'],
    queryFn: getEditProfileViewStatus,
  });

  // const { data: Primary } = useQuery({
  //   queryKey: [status ?? '', 'primary'],
  //   queryFn: () => getProfilePrimaryStatus(status ?? ''),
  //   enabled: Boolean(status),
  // });

  // const { data: secondary } = useQuery({
  //   queryKey: [primaryStatus ?? '', 'secondary'],
  //   queryFn: () => getProfileSecondaryStatus(primaryStatus ?? ''),
  //   enabled: Boolean(primaryStatus),
  // });

  //   const { data: Primary } = useQuery({
  //   queryKey: [status ?? '', 'primary'],
  //   queryFn: () => getProfilePrimaryStatus(status ?? ''),
  //   enabled: status !== null && status !== undefined,  // ✅ allow 0
  // });

  const { data: Primary } = useQuery({
    queryKey: ['primaryStatus', status],
    queryFn: () => getProfilePrimaryStatus(status),
    enabled: status !== undefined && status !== null, // Allows 0
  });

  const { data: secondary } = useQuery({
    queryKey: [primaryStatus ?? '', 'secondary'],
    queryFn: () => getProfileSecondaryStatus(primaryStatus ?? ''),
    enabled: primaryStatus !== null && primaryStatus !== undefined, // ✅ allow 0
  });


  const fetchAddOnPackages = async () => {
    try {
      const response = await axios.post(
        'https://app.vysyamala.com/auth/Get_addon_packages/',
      );
      if (response.data.status === 'success') {
        console.log(response.data.data);
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

  const handlePrintProfile = (format: string) => {
    if (profileId) {
      downloadProfilePdf(profileId, format);
    } else {
      console.error('Profile ID is not available or invalid');
      notify('Invalid profile ID. Please check the profile details.', { type: 'error' });
    }
  };

  const sendOtp = async () => {
    try {
      const response = await apiAxios.post(
        '/api/send_mobile_otp/',
        {
          profile_id: profileId // Using the profileId from your form
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      if (response.data.status === 1) {
        // Success case
        console.log("OTP sent successfully:", response.data.message);
        setShowOtpPopup(true); // Show the OTP popup after successful send
        // You might want to show a success toast/notification here
      } else {
        console.error("Failed to send OTP:", response.data.message);
        // Show error message to user
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      // Show error message to user
    }
  };

  const handleWhatsAppShare = () => {
    if (!profileId) {
      toast.error("Profile ID not found");
      return;
    }

    const url = `https://app.vysyamala.com/api/whatsapp-share/${profileId}/`;

    window.open(url, "_blank"); // open in new tab
  };

  const [isShareVisible, setIsShareVisible] = useState(false);
  const [isPdfOptionsVisible, setIsPdfOptionsVisible] = useState(false);

  const toggleShareVisibility = () => {
    setIsShareVisible((prevState) => !prevState);
    setIsPdfOptionsVisible(false)
  };

  const togglePdfVisibility = () => {
    setIsPdfOptionsVisible((prevState) => !prevState)
    setIsShareVisible(false)
  }


  return (
    <div>
      <div>

        <div className="bg-white p-2 mb-10 rounded shadow-md">
          <h4
            onClick={toggleSection1}
            className="text-red-600 flex items-center justify-between text-xl cursor-pointer font-semibold dark:text-white"
          >
            <span>Edit Profile</span>{' '}
            {/* Add a title or any text here */}
            <svg
              className={`fill-current transform ${isViewDetais ? 'rotate-180' : ''
                }`}
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
          {isViewDetais && (
            <div >
              <div className="flex  items-center justify-between mt-3">
                {/* Back Text with Icon on Left */}
                <div className="flex items-center gap-2 text-blue-600 cursor-pointer hover:text-blue-800"
                  onClick={() => navigate(-1)}
                >
                  <ArrowBack fontSize="small" />
                  <span>Back</span>
                </div>

                {/* Other Texts with Icons on Right */}
                <div className="flex gap-6 text-gray-700">
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
                      // <Share closePopup={toggleShareVisibility} />
                      <MyProfileShare

                        closePopup={toggleShareVisibility}
                        // profileImagess={'https://www.kannikadhanam.com/members/parthasarathyr/'}
                        profileImagess={EditData[6]?.profile_image || ""}
                        //   profileImage={get_myprofile_personal?.profile_id}
                        profileId={profileId}
                        profileName={profileName}
                        age={age}
                        starName={starName} // Assuming profile[3].star_name has the name
                        annualIncome={annualIncomeName}
                        education={educationName}
                        profession={professionName}
                        companyName={profileView2?.company_name} // Pass company/business name directly
                        businessName={profileView2?.business_name}
                        placeOfStay={placeOfStayName}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900"
                    // onClick={handlePrintProfile}
                    onClick={togglePdfVisibility}
                  >
                    <Print fontSize="small" />
                    <span>Print</span>



                    {
                      isPdfOptionsVisible && (
                        <div className='absolute right-20 mt-60 z-10 w-[220px] rounded-md shadow-lg p-2 bg-white max-sm:left-auto max-sm:right-[-200px]'>
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
                      )
                    }
                  </div>
                  <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900">
                    <Settings fontSize="small" />
                    <span>Settings</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-2 mt-1 max-xl:flex-wrap">
                <div>
                  <div className="flex flex-col items-center ml-2 mt-2 border-2 border-red-600  w-[150px] h-[180px] sm:w-[180px] sm:h-[180px] md:w-[160px] md:h-[180px] lg:w-[170px] lg:h-[190px]">
                    {image ? (
                      <img
                        src={image}
                        alt="Profile"
                        className="w-40 h-40 rounded-full border border-gray-300 shadow-md mt-3"
                      />
                    ) : (
                      <p>Loading image...</p>
                    )}
                  </div>
                  <div className=" flex flex-col ml-2 mt-5">
                    <span className="text-vibrantOrange">
                      {Package_name}
                      {/* + Email */}
                    </span>
                    <br />
                    <span className="text-vibrantOrange">
                      valid till:{valid_till}
                    </span>
                    <br />
                    <span className={`text-green-700 font-bold text-xl`}>
                      {profileId}
                    </span>
                  </div>
                </div>

                {/* <div className="flex  mx-auto border-x-lime-100 overflow-auto rounded-xl "> */}
                <div className="flex  flex-wrap ">
                  <div>
                    <div className="flex items-center mt-5 flex-wrap ">
                      <span className="text-green-600">
                        {profileId}-{profileName}
                      </span>
                      <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                      <span className="text-green-600">{age}-{gender}</span>
                      <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                      <span className="text-green-600">{suya_gothram}</span>
                      <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                      <span className="text-green-600">
                        {Package_name}
                        {/* + Email */}
                      </span>
                      <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                      <span className="text-green-600">
                        valid till:{valid_till}
                      </span>
                      <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                      <span className="text-green-600">
                        created date:{created_date?.split('T')[0]}
                      </span>
                      <div className="h-4 border-l-2 border-green-800 mx-1"></div>
                      <span className="text-green-600">
                        idle days:{idle_days}
                      </span>
                    </div>
                    <div className="w-full border-t-2 border-blue-600 mt-2"></div>
                    <div className="w-full border-t-2 border-blue-600 mt-1"></div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 xl:grid-cols-12 lg:grid-cols-10 gap-3 overflow-auto ">
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 p-2 cursor-pointer" onClick={() => navigate(`/UserMatchingProfiles?profileId=${profileId}`)}>
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.matchingprofile_count}</span>
                        <span className="text-blue-500">Matching Profile</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 cursor-pointer" onClick={() => navigate(`/suggestedProfiles?profileId=${profileId}`)} >
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.suggestedprofile_count}</span>
                        <span className="text-blue-500">Suggested Profile</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 cursor-pointer" onClick={() => navigate(`/UserProfileVisibilityFilter?profileId=${profileId}`)} >
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.visibility_count}</span>
                        <span className="text-blue-500">Profile Visibility</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 p-2 cursor-pointer " onClick={() => navigate(`/ViewedProfilesById?profileId=${profileId}`)} >
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.viewedprofile_count}</span>
                        <span className="text-blue-500">Viewed Profile</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 p-2 cursor-pointer" onClick={() => navigate(`/VisitorProfilesById?profileId=${profileId}`)}>
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.visitorprofile_count}</span>
                        <span className="text-blue-500">Visitor Profile</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 p-2 cursor-pointer" onClick={(() => navigate(`/CToCSentProfiles?profileId=${profileId}`))} >
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.ctocsend_count}</span>
                        <span className="text-blue-500">C to C Sent</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 cursor-pointer" onClick={(() => navigate(`/CToCReceivedProfiles?profileId=${profileId}`))} >
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.ctocreceived_count}</span>
                        <span className="text-blue-500">C to C Received</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 p-2 cursor-pointer" onClick={(() => navigate(`/ExpressInterestProfiles?profileId=${profileId}`))} >
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.exp_int_sentcount}</span>
                        <span className="text-blue-500">EI Sent</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 cursor-pointer" onClick={() => navigate(`/ExpressInterestReceivedProfiles?profileId=${profileId}`)} >
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.exp_int_reccount}</span>
                        <span className="text-blue-500">EI Received</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 p-2 cursor-pointer" onClick={() => navigate(`/ExpressInterestMutualProfiles?profileId=${profileId}`)} >
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.mutual_int_count}</span>
                        <span className="text-blue-500">Mutual Interest</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 p-2" >
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.shortlisted_count}</span>
                        <span className="text-blue-500">Shortlisted</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 p-2 cursor-pointer" onClick={() => navigate(`/ProfileSentTo?profileId=${profileId}`)}>
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.prsent_count}</span>
                        <span className="text-blue-500">PR Sent</span>
                      </div>
                      <div className="flex flex-col items-center text-center border-l-2 border-orange-500 p-2 cursor-pointer" onClick={() => navigate(`/VysaAssist?profileId=${profileId}`)} >
                        <span className="text-orange-500 text-lg font-semibold">{profileView7.varequest_count}</span>
                        <span className="text-blue-500">VA Request</span>
                      </div>

                    </div>
                    <div className="w-full border-t-2 border-1 border-blue-600"></div>
                    <div className="flex items-center gap-5 mt-2">
                      <span className="text-green-600">
                        Profile Completion{' '}
                        <span className="text-orange-500">
                          {profile_completion}%
                        </span>
                      </span>

                      {(membershipStatus !== null && membershipStatus !== undefined && membershipStatus === 'Renew') && (
                        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-300 ml-17">
                          <Autorenew className="text-red-600" fontSize="small" />
                          <span className="text-red-700 font-bold">
                            Renew
                          </span>
                        </div>

                      )}
                      {/* <button type='button' className="bg-blue-700 text-white px-2 py-1 text-md mt-1 rounded">
                        Update owner
                      </button> */}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 p-4 gap-4">

                      <div>
                        <button
                          type="button"
                          onClick={() => navigate(`/UserMatchingProfiles?profileId=${profileId}`)}
                          className="bg-blue-700 text-white px-8 py-1 text-md h-auto rounded whitespace-nowrap"
                        >
                          Matching Profiles
                        </button>
                      </div>
                      <div>
                        <button
                          type="button"
                          // onClick={() => setOpenCallManagement(true)}
                          // onClick={() => navigate(`/CallManagement?profileId=${profileId}`)}
                          onClick={() => window.open(`/CallManagement?profileId=${profileId}`, "_blank")}
                          className={`bg-blue-700 text-white px-8 py-1 text-md h-auto rounded whitespace-nowrap `}
                        >
                          Call Management
                        </button>

                        {/* <CallManagementModel
                          open={openCallManagement}
                          onClose={() => setOpenCallManagement(false)}
                        /> */}
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setOpenAdminDetails(true)}
                          className={`bg-blue-700 text-white px-10 py-1 text-md h-auto rounded `}
                        >
                          Admin Details
                        </button>

                        <AdminDetailsPopup
                          open={OpenAdminDetails}
                          onClose={() => setOpenAdminDetails(false)}
                        />
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setOpenDataHistory(true)}
                          className={`bg-blue-700 text-white px-10 py-1 text-md h-auto rounded `}
                        >
                          Data History
                        </button>
                        <DataHistoryPopup
                          open={openDataHistory}
                          onClose={() => setOpenDataHistory(false)}
                          profileId={profileId || ''}
                        />
                      </div>

                      {/* <div>
                        <button
                          type="button"
                          className={`bg-blue-700 text-white px-5 py-1 text-md h-auto rounded whitespace-nowrap text-center`}
                        >
                          Invoice Generation
                        </button>
                      </div> */}
                      <div>
                        <button
                          type="button"
                          onClick={() => setOpen(true)}
                          className={`bg-blue-700 text-white px-10 py-1 text-md h-auto rounded whitespace-nowrap text-center`}
                        >
                          Payment Info
                        </button>
                        <PaymentPopup open={open} onClose={() => setOpen(false)} profileId={profileId} showAddButton={true} />
                      </div>

                      <div>
                        <button
                          type="button"
                          onClick={() => setOpenPastCallData(true)}
                          className="bg-blue-700 text-white px-8 py-1 text-md h-auto rounded whitespace-nowrap hover:bg-blue-800 transition-colors"
                        >
                          Past Call Data
                        </button>
                      </div>

                    </div>
                    {/* <div className='mb-4 ml-4'>
                      <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className={`bg-blue-700 w-45 text-white px-5 py-1 text-md h-auto rounded whitespace-nowrap text-center`}
                      >
                        Payment Info
                      </button>
                      <PaymentPopup open={open} onClose={() => setOpen(false)} profileId={profileId} showAddButton={true} />
                    </div> */}
                    <div className="flex max-xl:flex-wrap">
                      <div>
                        <div>
                          <p className="text-[#5a5959e6] font-semibold ">
                            Payment Info:
                            <span className="text-green-700">
                              {' '}
                              {payment_date}/{Package_name} /{add_on_pack_name}/{payment_mode}{' '}
                            </span>
                          </p>
                        </div>
                        {membershipActivation !== 0 && (
                          <div>
                            <div className="flex mt-3 gap-2">
                              <label className="font-semibold text-[#5a5959e6]">Profile Status:</label>
                              <select
                                {...register('profileView.status', {
                                  setValueAs: (value) => value === "" ? undefined : Number(value)
                                })}
                                className="px-2 py-1 border border-[#b5b2b2e6]  text-[#222020e6] rounded   "
                              >
                                <option value="" className=' text-[#000000e6] '>Select your Status</option>
                                {Status?.map((option) => {
                                  // const isDisabled =
                                  //   // Existing logic: only allow Approved (1) if conditions met
                                  //   // shouldAllowOnlyApprovedStatus && option.status_code !== 1 ||
                                  //   // 🔥 NEW LOGIC: If pre-approved and protected, disable everything except Approved (1)
                                  //   // isPreApprovedAndProtected && option.status_code !== 1;
                                  //   isPreApprovedAndProtected && option.status_code !== 1;

                                  //Role value 3 condition
                                  const isDisabledByExistingLogic =
                                    isPreApprovedAndProtected && option.status_code !== 1;

                                  //Role value 2 condition(membership activation)
                                  const isStatusToDisableByNewLogic = [0, 2, 3, 4].includes(option.status_code);
                                  const isDisabledByNewLogic = shouldDisableSpecificStatuses && isStatusToDisableByNewLogic;

                                  // Combine all disable conditions
                                  const isDisabled = isDisabledByExistingLogic || isDisabledByNewLogic;

                                  return (
                                    <option
                                      key={option.status_code}
                                      value={option.status_code}
                                      disabled={isDisabled}
                                      style={isDisabled ? { color: '#ccc', cursor: 'not-allowed' } : {}}
                                    >
                                      {option.status_name}
                                    </option>
                                  );
                                })}

                              </select>

                              {/* {(!shouldHideSecondaryStatus || (membershipActivation === 3 && status === 1)) && ( */}
                              {/* {(!shouldHideSecondaryStatus || isPreApprovedAndProtected) && !shouldHideSecondarySelects && ( */}
                              {shouldShowSecondaryStatusControls && (
                                <select
                                  {...register('profileView.primary_status', {
                                    setValueAs: (value) => value === "" ? undefined : Number(value)
                                  })}
                                  value={watch('profileView.primary_status') || ''}
                                  className="px-2 py-1 border  rounded  border-[#b5b2b2e6]  text-[#222020e6] "
                                >
                                  <option value="" className=' text-[#000000e6] '>Select Secondary Status</option>
                                  {Primary?.map((option) => (
                                    <option key={option.id} value={option.id}
                                      disabled={option.value === 0}  // Add this line
                                      style={option.value === 0 ? { color: '#ccc', cursor: 'not-allowed' } : {}}
                                      className=' text-[#000000e6] '>
                                      {option.sub_status_name}
                                    </option>
                                  ))}
                                </select>
                              )}

                              {/* {(!shouldHideSecondaryStatus || (membershipActivation === 3 && status === 1)) && Number(watch('profileView.status')) !== 0 && */}
                              {/* {(!shouldHideSecondaryStatus || isPreApprovedAndProtected) && !isPreApprovedAndProtected && Number(watch('profileView.status')) !== 0 && */}
                              {shouldShowSecondaryStatusControls && Number(watch('profileView.status')) !== 0 &&
                                watch('profileView.primary_status') &&
                                ![7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22].includes(Number(watch('profileView.primary_status'))) && (
                                  <select
                                    {...register('profileView.secondary_status', {
                                      setValueAs: (value) => value === "" ? undefined : Number(value)
                                    })}
                                    value={watch('profileView.secondary_status') || ''}
                                    className="px-2 py-1 border rounded  border-[#b5b2b2e6]  text-[#222020e6] "
                                  >
                                    <option value="">Select Plan Status</option>
                                    {secondary?.map((option) => (
                                      <option key={option.id} value={option.id} className=' text-[#000000e6] '>
                                        {option.plan_name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                            </div>

                            <div className="flex mt-5 mb-4 justify-center">
                              {[12, 17, 22].includes(Number(primaryStatus)) && (
                                <input
                                  type="text"
                                  {...register('profileView.others')}
                                  placeholder="Enter your reasons"
                                  className="w-70 h-10 border-2 border-blue-500 rounded-lg px-4 focus:outline-none focus:border-blue-700 transition duration-300"
                                />
                              )}
                            </div>
                          </div>
                        )}

                        {shouldShowProfileOwner && (
                          <div className="flex items-center gap-2 mb-2">
                            <label className="font-semibold text-[#5a5959e6]">Profile Owner:</label>
                            <select
                              {...register('profileView.admin_user_id', {
                                setValueAs: (value) => value === "" ? undefined : Number(value)
                              })}
                              value={watch('profileView.admin_user_id') || ''}
                              onChange={handleOwnerChange}
                              className="px-2 py-1 border rounded border-[#b5b2b2e6] text-[#222020e6]"
                              disabled={isOwnersLoading}
                            >
                              <option value="">
                                {isOwnersLoading ? 'Loading Owners...' : 'Select Owner'}
                              </option>
                              {profileOwnersData?.map((owner) => (
                                <option key={owner.id} value={owner.id}>
                                  {owner.username}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}

                        {shouldShowMembershipDates && (
                          <div className="flex gap-2 mt-3 mb-2">
                            <label className="font-semibold text-[#5a5959e6]">
                              Membership Date:
                            </label>
                            <div className="flex flex-col">
                              <div className="flex gap-1">
                                <label className="text-[#5a5959e6] font-medium">From:</label>
                                <input
                                  {...register('profileView.membership_fromdate')}
                                  type="date"
                                  className='font-medium text-[#5a5959e6] mb-1'
                                  value={watch('profileView.membership_fromdate')?.split('T')[0] || ''}
                                />
                              </div>
                              {errors?.profileView?.membership_fromdate && (
                                <span className="text-red-500 text-sm">
                                  {errors.profileView.membership_fromdate.message}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex gap-1">
                                <label className="text-[#5a5959e6] font-medium">To:</label>
                                <input
                                  {...register('profileView.membership_todate')}
                                  type="date"
                                  className='font-medium text-[#5a5959e6] mb-1'
                                  value={watch('profileView.membership_todate')?.split('T')[0] || ''}
                                />
                              </div>
                              {errors?.profileView?.membership_todate && (
                                <span className="text-red-500 text-sm">
                                  {errors.profileView.membership_todate.message}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="w-full">
                          <h5 className="text-[18px] text-[#5a5959e6] font-semibold mb-3">
                            AddOn Packages
                          </h5>
                          <div>
                            {addonPackage.map((Package: AddOnPackage) => (
                              <div
                                key={Package.package_id}
                                className="flex items-center mb-3"
                              >
                                <input
                                  type="checkbox"
                                  id={`package-${Package.package_id}`}
                                  className="mr-2 font-medium text-[#5a5959e6]"
                                  value={Package.package_id}
                                  checked={getValues(
                                    'profileView.Addon_package',
                                  )
                                    ?.split(',')
                                    .includes(`${Package.package_id}`)} // Ensure checked state aligns with form value
                                  onChange={() => {
                                    const currentValues = getValues(
                                      'profileView.Addon_package',
                                    )
                                      ? getValues(
                                        'profileView.Addon_package',
                                      ).split(',')
                                      : [];

                                    const index = currentValues.indexOf(
                                      `${Package.package_id}`,
                                    );
                                    if (index === -1) {
                                      currentValues.push(
                                        `${Package.package_id}`,
                                      );
                                    } else {
                                      currentValues.splice(index, 1);
                                    }

                                    // Update the value in React Hook Form
                                    setValue(
                                      'profileView.Addon_package',
                                      currentValues.filter(Boolean).join(','),
                                      { shouldValidate: true }, // Ensure validation is triggered
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={`package-${Package.package_id}`}
                                  className="cursor-pointer font-medium text-[#5a5959e6]"
                                >
                                  {Package.name} - {Package.amount}
                                </label>
                              </div>
                            ))}

                            {errors?.profileView?.Addon_package && (
                              <p className="text-red-600">
                                {errors.profileView.Addon_package.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          {/* <span className="font-semibold text-black">
                            Visit Count No:{' '}
                            <span className="font-medium text-[#000000e6]">{visit_count}</span>
                          </span> */}
                          <div className="flex items-center gap-2">
                            <label className="font-semibol text-[#5a5959e6]">Visit Count No:</label>
                            <input
                              {...register('profileView.visit_count', {
                                valueAsNumber: true // Ensures the value is treated as a number
                              })}
                              type="number"
                              min="0" // Prevent negative numbers
                              className="w-20 px-2 py-1 border border-[#b5b2b2e6]  text-[#222020e6] rounded font-medium "
                            />
                          </div>
                        </div>
                        {/* <div className="mt-2">
                          <span className="font-semibold text-black">
                            Exp int lock:
                            <span className="font-medium text-[#000000e6]">{exp_int_lock}</span>
                          </span>
                          <span className="font-semibold text-black ml-4">
                            No Count:{' '}
                            <span className="font-medium text-[#000000e6]">{exp_int_count}</span>
                          </span>

                        </div> */}
                        {/* <div className="mt-2 flex items-center gap-4">
  <div className="flex items-center gap-2">
    <label className="font-semibold text-black">Exp int lock:</label>
    <input
      {...register('profileView.exp_int_lock', {
        valueAsNumber: true
      })}
      type="number"
      min="0"
      className="w-20 px-2 py-1 border border-gray-300 rounded font-medium text-[#000000e6]"
    />
  </div> */}



                        <div className="mt-2 flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <label className="font-semibold text-[#5a5959e6]">Exp Interest:</label>
                            <select
                              {...register('profileView.exp_int_lock',
                                {
                                  valueAsNumber: true,
                                }
                              )}
                              className="w-24 px-2 py-1 border border-[#b5b2b2e6]  text-[#222020e6] rounded font-medium "
                            >
                              <option value={1}>Yes</option>
                              <option value={0}>No</option>
                            </select>
                          </div>


                          {Number(watch('profileView.exp_int_lock')) !== 0 && (
                            <div className="flex items-center gap-2">
                              <label className="font-medium text-[#5a5959e6]">Exp No Count:</label>
                              <input
                                {...register('profileView.exp_int_count', {
                                  valueAsNumber: true
                                })}
                                type="number"
                                min="0"
                                className="w-20 px-2 py-1 border border-gray-300 rounded font-medium text-[#000000e6]"
                              />
                            </div>
                          )}
                        </div>
                        <div>
                          {/* <button className="bg-blue-700 text-white px-2 py-1 text-md mt-1 rounded">Update profile status2</button> */}
                        </div>
                        <div
                          className="flex gap-6 bg-#DDDFFF mt-2"
                          style={{ backgroundColor: '#DDDFFF' }}>
                          <div className=" mt-2 flex">
                            <p className="text-[#5a5959e6] ml-2 font-medium">Mobile Number:</p>
                            <p className="text-red-500 text-[#000000e6]">{Mobile_no}</p>
                          </div>

                          <div className="mt-2 flex items-center">
                            <p className="text-[#5a5959e6] mr-2 font-semibold">Verification:</p>

                            <input
                              type="radio"
                              id="verifyYes"
                              {...register("profileView.mobile_otp_verify", {
                                required: "Please select mobile verification status"
                              })}
                              value="1"
                              checked={String(watch("profileView.mobile_otp_verify")) === "1"}
                              className="ml-1 font-medium"
                            />
                            <label htmlFor="verifyYes" className="ml-1 text-[#000000e6]">Yes</label>

                            <input
                              type="radio"
                              id="verifyNo"
                              {...register("profileView.mobile_otp_verify", {
                                required: "Please select mobile verification status"
                              })}
                              value="0"
                              checked={String(watch("profileView.mobile_otp_verify")) === "0"}
                              className="ml-2 font-medium text-[#000000e6]"
                            />
                            <label htmlFor="verifyNo" className="ml-1 text-[#000000e6]">No</label>


                          </div>

                          <div>
                            <button
                              onClick={sendOtp}
                              type="button"
                              className="bg-blue-700  text-white px-3 py-1 text-md mt-1 rounded">
                              Send otp
                            </button>
                          </div>
                        </div>
                        {errors?.profileView?.mobile_otp_verify && (
                          <p className="text-red-600 ml-2">
                            {errors.profileView.mobile_otp_verify.message || "Mobile verification is required"}
                          </p>
                        )}
                        <button
                          type="submit"
                          name="save2"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSubmit();
                          }}
                          className="hidden xl:block bg-blue-700  text-white px-3 py-1 text-md mt-8 rounded"
                        >
                          Update profile
                        </button>
                      </div>

                      <div className="flex flex-col items-center justify-center p-20 space-y-4">
                        {hasPermission('edit_profile_admin') && (
                          <div className="ml-30">
                            <ProfileForm
                              error={errors}
                              EditData={EditData}
                              profileId={profileId}
                            />
                          </div>
                        )}
                        {/* Horo Hint Section */}
                        <div className="flex items-center space-x-4">
                          <label className="font-semibold text-[#5a5959e6]">
                            Horo Hint:
                          </label>
                          <textarea
                            {...register('profileView.horoscope_hints')}
                            placeholder="Enter hint..."
                            className="w-70 h-10  border-2 text-[#5a5959e6] font-medium border-blue-500 rounded-lg px-4 focus:outline-none focus:border-blue-700 transition duration-300"
                          />
                          {errors?.profileView?.horoscope_hints && (
                            <p className="text-red-600">
                              {errors.profileView.horoscope_hints.message}
                            </p>
                          )}
                        </div>

                        {/* Save Button */}

                        {/* Admin Chevvai Dhosam Section */}
                        <div className="flex items-center gap-2">
                          <label className="font-semibold text-[#5a5959e6] ml-7">
                            Admin Chevvai Dhosam:
                          </label>

                          <span className='font-medium  text-[#5a5959e6]'>{chevvai}</span>
                        </div>
                        {errors?.profileView?.calc_chevvai_dhosham && (
                          <p className="text-red-600">
                            {errors.profileView.calc_chevvai_dhosham.message}
                          </p>
                        )}

                        {/* Admin Rahu/Kethu Dhosam Section */}
                        <div className="flex items-center gap-2">
                          <label className="font-semibold text-[#5a5959e6] ">
                            Admin Rahu/Kethu Dhosam:
                          </label>
                          <span className='font-medium text-[#5a5959e6] '>{raagu}</span>
                        </div>
                        {errors?.profileView?.calc_raguketu_dhosham && (
                          <p className="text-red-600">
                            {errors.profileView.calc_raguketu_dhosham.message}
                          </p>
                        )}
                        {(hasPermission('edit_profile_admin') && hasPermission('membership_activation')) && (
                          < div className=" justify-start items-start " >
                            <button
                              type="submit"
                              onClick={(e) => {
                                e.preventDefault();
                                handleSubmit();
                              }}
                              name="save2"
                              className="hidden max-xl:block bg-blue-700  text-white justify-start items-start px-3 py-1 text-md mt-8 rounded"
                            >
                              Update profile
                            </button>
                          </div>
                        )}
                      </div>
                      {showOtpPopup && (
                        <VerifyOTPPopup
                          onClose={() => setShowOtpPopup(false)}
                          profileId={profileId}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* PAST CALL DATA POPUP - ADDED HERE */}
      <PastCallDataPopup
        open={openPastCallData}
        onClose={() => setOpenPastCallData(false)}
        profileId={profileId || ''}
      />

      {/* Other existing popups */}
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
      {
        showOtpPopup && (
          <VerifyOTPPopup
            onClose={() => setShowOtpPopup(false)}
            profileId={profileId}
          />
        )
      }
    </div >
  );
};

export default EditViewProfile;

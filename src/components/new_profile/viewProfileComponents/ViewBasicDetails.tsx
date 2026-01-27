import {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import Input from '../../Fromfield/Inputfield';
import { useQuery } from '@tanstack/react-query';
import {
  fetchComplexionStatus,
  fetchCountryStatus,
  fetchStateStatus,
  GetCity,
  GetDistrict,
  getStatus,
} from '../../../action';
import axios from 'axios';
import { API_URL_Auth } from '../../../services/api';
import { HeightOption } from '../profile_form_components/AddProfileForm';

interface pageProps {
  profile: any;
  setGennder: Dispatch<SetStateAction<string>>;
}

const ViewBasicDetails: React.FC<pageProps> = ({ profile, setGennder }) => {
  const [isBasicDetailsOpen, setIsBasicDetailsOpen] = useState(true);
  const [basicDetails, setbasicDetails] = useState<any>({});
  const [maritialStatus, setMaritialStatus] = useState<any>([]);
  const [addOnPackages, setAddonPackages] = useState<any[]>([]);
  const [selectedValues, setSelectedValues] = useState<number[]>([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<number[]>([]);
  const [finalAddon, setFinalAddOn] = useState<any[]>([]);
  const [data, setPlane] = useState<any[]>([]);
  const [planeDetail, setPlaneDetails] = useState('');
  const [heightOptions, setHeightOptions] = useState<HeightOption[]>([]);

  const toggleSection1 = () => {
    setIsBasicDetailsOpen(!isBasicDetailsOpen);
  };

  useEffect(() => {
    const fetchHeight = async () => {
      try {
        const response = await axios.post(`${API_URL_Auth}/Get_Height/`);
        const options = Object.values(response.data) as HeightOption[];
        setHeightOptions(options);
      } catch (error) {
        console.error("Error fetching height options:", error);
      }
    };
    fetchHeight();
  }, []);
  const toggleSection2 = () => {
    setIsBasicDetailsOpen(!isBasicDetailsOpen);
  };
  const getAddonPackages = async () => {
    try {
      const response = await axios.post(
        `https://app.vysyamala.com/auth/Get_addon_packages/`,
      );
      const data = Object.values(response.data.data);
      setAddonPackages(data);
    } catch (error) {
      throw error;
    }
  };

  const handleAddOnChange = (
    rate: number,
    checked: boolean,
    packageId: number,
  ) => {
    if (checked) {
      setSelectedValues([...selectedValues, rate]);
      setSelectedPackageIds([...selectedPackageIds, packageId]);
    } else {
      const updatedValues = selectedValues.filter((val) => val !== rate);
      const updatedPackageIds = selectedPackageIds.filter(
        (id) => id !== packageId,
      );
      setSelectedValues(updatedValues);
      setSelectedPackageIds(updatedPackageIds);
    }
  };

  useLayoutEffect(() => {
    if (profile && profile.length > 0) {
      setbasicDetails(profile[0]);
    }
  }, [profile]);

  useEffect(() => {
    if (basicDetails.Addon_package) {
      const value = basicDetails.Addon_package;
      const addonPackageArray = value.split(',');
      const selectedPackages = addOnPackages.filter(
        (packageItem) =>
          addonPackageArray.includes(String(packageItem.package_id)),
      );
      if (JSON.stringify(selectedPackages) !== JSON.stringify(addOnPackages)) {
        setFinalAddOn(selectedPackages);
      }
    }

    if (basicDetails.Plan_id) {
      setPlaneDetails(basicDetails.Plan_id);
    }
  }, [basicDetails]);

  const getMaritalStatus = async () => {
    try {
      const response = await axios.post(
        'https://app.vysyamala.com/auth/Get_Marital_Status/',
      );
      const options = Object.values(response.data);
      setMaritialStatus(options);
      return options;
    } catch (error) {
      console.error('Error fetching marital status options:', error);
    }
  };

  useEffect(() => {
    getMaritalStatus();
  }, []);

  const { data: Status } = useQuery({
    queryKey: ['Status'],
    queryFn: getStatus,
  });

  const { data: Complexion } = useQuery({
    queryKey: ['complexion'],
    queryFn: fetchComplexionStatus,
  });

  const { data: Country } = useQuery({
    queryKey: ['Country'],
    queryFn: fetchCountryStatus,
  });

  const { data: State } = useQuery({
    queryKey: [basicDetails.Profile_country, 'State'],
    queryFn: () => fetchStateStatus(basicDetails.Profile_country),
    enabled: !!basicDetails.Profile_country && basicDetails.Profile_country === '1',
  });

  const { data: District } = useQuery({
    queryKey: [basicDetails.Profile_state, 'District'],
    queryFn: () => GetDistrict(basicDetails.Profile_state),
    enabled: !!basicDetails.Profile_state,
  });
  console.log('5656', District);

  // const { data: City } = useQuery({
  //   queryKey: [basicDetails.Profile_district, 'City'],
  //   queryFn: () => GetCity(basicDetails.Profile_district),
  //   enabled: !!basicDetails.Profile_district,
  // });
  console.log('5656', basicDetails.Profile_district);
  // console.log('5656', City);

  useEffect(() => {
    setGennder(basicDetails.Gender);
  }, [basicDetails]);

  const getPlaneDetais = async () => {
    try {
      const response = await axios.post(
        `https://app.vysyamala.com/auth/Get_palns/`,
      );
      const data = Object.values(response.data.data);
      setPlane(data);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    getAddonPackages();
    getPlaneDetais();
  }, []);

  // Check if country is not India (assuming India's ID is '1')
  const isNonIndiaCountry = basicDetails.Profile_country && basicDetails.Profile_country !== '1';

  return (
    <div className="bg-white p-5 mb-10 rounded shadow-md">
      <h4
        className="text-red-600 flex row items-center justify-between text-xl font-semibold  dark:text-white cursor-pointer  after-red-line::after"
        onClick={toggleSection1}
      >
        Basic Details
        <svg
          className={`fill-current transform ${isBasicDetailsOpen ? 'rotate-180' : ''
            }`}
          width={'20'}
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
      {isBasicDetailsOpen && (
        <div className="flex flex-col gap-5">
          {/* Basic Details Form Fields */}
          <div className="flex w-full flex-row gap-4">
            <div className="w-2/4 relative">
              <span className="absolute top-[2px] left-[48px] text-red-500">*</span>
              <Input
                value={basicDetails.Profile_name}
                required
                readOnly
                label={'Name'}
              />
            </div>
            <div className="w-2/4">
              <label className="block mb-1 font-bold text-[#5a5959e6]">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <Input
                value={basicDetails.Mobile_no}
                required
                readOnly
                label={''}
              />
            </div>
            {/* Gender Selector */}
            <div className="w-2/4 py-1">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Gender <span className="text-red-500">*</span>
              </label>

              <label className="block text-[#5a5959e6] font-bold mb-1 ml-20 capitalize">
                {basicDetails.Gender}
              </label>
              {/* <input
                value={basicDetails.Gender}
                required
                className="outline-none w-full px-4 py-2 border border-black rounded text-black font-semibold"
                readOnly
              /> */}
            </div>


          </div>

          <div className="flex w-full flex-row gap-4">
            <div className="w-2/4">
              <Input
                value={basicDetails.EmailId}
                readOnly
                required
                label={'Email'}
              />
            </div>
            <div className="w-2/4">
              <Input
                required
                readOnly
                value={basicDetails.Profile_alternate_mobile}
                label={'Alternate Mobile Number'}
              />
            </div>

            <div className="w-2/4">
              <label className="block mb-1 font-bold text-[#5a5959e6]">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <Input
                value={basicDetails.Profile_dob}
                readOnly
                required
                label={''}
                type={'date'}
              />
            </div>


          </div>

          <div className="flex w-full flex-row gap-4">

            <div className="w-full">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Select your Marital Status{' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                disabled
                value={basicDetails.Profile_marital_status}
                className="outline-none w-full px-4 py-2 border  rounded border-[#b5b2b2e6]  text-[#222020e6] font-semibold"
              >
                <option value="">Select your Marital Status</option>
                {maritialStatus?.map((option: any) => (
                  <option
                    key={option.marital_sts_id}
                    value={option.marital_sts_id}
                  >
                    {option.marital_sts_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <Input
                readOnly
                value={basicDetails.Profile_address}
                required
                label={'Address'}
              />
            </div>
            <div className="w-full">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Country<span className='text-red-500'>*</span>
              </label>
              <select
                disabled
                value={basicDetails.Profile_country}
                className="outline-none w-full px-4 py-2 border  rounded border-[#b5b2b2e6]  text-[#222020e6] font-semibold"
              >
                <option value="">-- Select your Country --</option>
                {Country?.map((option: any) => (
                  <option key={option.country_id} value={option.country_id}>
                    {option.country_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Conditional rendering based on country */}
          {basicDetails.Profile_country === '1' ? (
            // India-specific fields
            <div className="flex w-full flex-row gap-4">
              <div className="w-2/4">
                <label className="block text-[#5a5959e6] font-semibold mb-1">
                  State (Based on country selection){' '}

                </label>
                <select
                  disabled
                  value={basicDetails.Profile_state}
                  className="outline-none w-full px-4 py-2 border  rounded border-[#b5b2b2e6]  text-[#222020e6] font-semibold"
                >
                  <option value="" selected disabled>
                    -- Select State --
                  </option>
                  {State?.map((option: any) => (
                    <option key={option.state_id} value={option.state_id}>
                      {option.state_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-2/4">
                <label className="block text-[#5a5959e6] font-semibold mb-1">
                  District
                </label>

                <Input
                  readOnly
                  value={
                    // Find matching district name if it's an ID
                    District?.find(
                      (d: any) => String(d.disctict_id) === String(basicDetails.Profile_district)
                    )?.disctict_name ||
                    // Otherwise show text directly
                    basicDetails.Profile_district ||
                    ''
                  }
                  label={''}
                />
              </div>

              <div className="w-2/4">
                <label className="block text-[#5a5959e6] font-semibold mb-1">City</label>
                <Input
                  required
                  value={basicDetails.Profile_city || ''}
                  label={''}
                  type={'text'}
                  readOnly
                />
              </div>

            </div>
          ) : isNonIndiaCountry ? (
            // Non-India country fields
            <div className="flex w-full flex-row gap-4">
              <div className="w-2/4">
                <Input
                  required
                  value={basicDetails.Profile_city || ''}
                  label={'City'}
                  type={'text'}
                  readOnly
                />
              </div>
            </div>
          ) : null}

          {/* {basicDetails.Profile_country &&
            (
              // Case 1: state & district null
              (!basicDetails.Profile_state && !basicDetails.Profile_district && basicDetails.Profile_city) ||
              // Case 2: state exists, district null
              (basicDetails.Profile_state && !basicDetails.Profile_district && basicDetails.Profile_city)
            ) && (
              <div className="flex w-full flex-row gap-4 mt-2">
                <div className="w-2/4">
                  <Input
                    required
                    value={basicDetails.Profile_city}
                    label={'City'}
                    type={'text'}
                    readOnly
                  />
                </div>
              </div>
            )} */}


          <div className="flex w-full flex-row gap-4">
            <div className="w-2/4">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Complexion
              </label>
              <select
                value={basicDetails.Profile_complexion}
                disabled
                className="outline-none w-full px-4 py-2 border  rounded border-[#b5b2b2e6]  text-[#222020e6] font-semibold"
              >
                <option value="">Select your complexion</option>
                {Complexion?.map((option: any) => (
                  <option
                    key={option.complexion_id}
                    value={option.complexion_id}
                  >
                    {option.complexion_description}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-2/4">
              <Input
                required
                value={basicDetails.Profile_pincode}
                label={'Pincode'}
                type={'text'}
                readOnly
              />
            </div>

            <div className="w-2/4">
              <Input
                required
                readOnly
                value={basicDetails.Profile_whatsapp}
                label={'Whatsapp Mobile Number'}
              />
            </div>
          </div>
          <div className="flex w-full flex-row gap-4">
            <div className="w-1/3">
              <label className='block text-[#5a5959e6] font-medium mb-1'>
                Profile Height
                {/* <span className="text-red-500">*</span> */}
              </label>
              <select
                id="height"
                className={`text-ash font-medium block w-full px-3 py-2 border-[1px] border-[#b5b2b2e6]  text-[#222020e6] border-footer-text-gray rounded-[4px] focus-visible:outline-none`}
                // {...register("BasicDetail.Profile_height")}
                value={basicDetails.Profile_height}
                disabled
              >
                <option value="" selected disabled>
                  Select Height
                </option>
                {heightOptions.map((option) => (
                  <option key={option.height_id} value={option.height_id}>
                    {option.height_description}
                  </option>
                ))}
              </select>
              {/* {errors?.BasicDetail?.Profile_height && (
                <p className="text-red-600">{errors.BasicDetail.Profile_height.message?.toString()}</p>
              )} */}
            </div>

            <div className="w-1/3">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Facebook
              </label>

              <Input
                value={basicDetails.facebook || "N/A"}
                readOnly
                label={""}
              />
            </div>

            <div className="w-1/3">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                LinkedIn
              </label>

              <Input
                value={basicDetails.linkedin || "N/A"}
                readOnly
                label={""}
              />
            </div>
          </div>
          <div className="flex w-full flex-row gap-4">
            <div className="w-1/3">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Video url
              </label>

              <Input
                value={basicDetails.Video_url || "N/A"}
                readOnly
                label={""}
              />
            </div>
            <div className="w-1/3">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Profile Email ID
              </label>

              <Input
                value={basicDetails.Profile_emailid || "N/A"}
                readOnly
                label={""}
              />
            </div>
            <div className="w-1/3">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Profile Mobile No
              </label>

              <Input
                value={basicDetails.Profile_mobile_no || "N/A"}
                readOnly
                label={""}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewBasicDetails;
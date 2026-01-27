import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Input from '../../Fromfield/Inputfield';
import { useFormContext } from 'react-hook-form';
import {
  getMaritalStatus,
  fetchComplexionStatus,
  fetchCountryStatus,
  fetchStateStatus,
  GetDistrict,
  GetCity,
  getStatus,
  fetchAddOnPackage,
} from '../../../action';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useQuery } from '@tanstack/react-query';
import {
  Complexion,
  State,
  District,
  HeightOption,
} from '../profile_form_components/AddProfileForm';
import { MaritalStatusOption } from '../../../action';
import { Country } from '../profile_form_components/AddProfileForm';
// import { EditAlertSettings } from './EditAlertSettings';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { Controller } from 'react-hook-form';
import { BasicDetailss } from '../../../types/EditSchemaBasicDetails';
import axios from 'axios';
import { API_URL_Auth } from '../../../services/api';
interface formProps {
  error: any;
  EditData: any;
  setGender: (gender: string) => void;
  isBasicDetailsOpen: boolean;
  setIsBasicDetailsOpen: Dispatch<SetStateAction<boolean>>;
  setAlretSetting: Dispatch<SetStateAction<string>>;
  //setGetMaritalStatus:Dispatch<SetStateAction<string>>
  setGetMaritalStatus: Dispatch<SetStateAction<string>>;
}

export interface City {
  city_id: number;
  city_name: string;
}

export interface AddOnPackage {
  package_id: number,
  name: string,
  description: string,
  amount: number
}

const BasicDetails: React.FC<formProps> = ({
  EditData,
  setGender,
  error,
  isBasicDetailsOpen,
  setIsBasicDetailsOpen,
  setAlretSetting,
  setGetMaritalStatus
}) => {
  const {
    control,
    register,
    watch,
    setValue,
    clearErrors,
    trigger,
    setError,
    formState: { errors },
  } = useFormContext<BasicDetailss>();
  const selectedCountry = watch('BasicDetail.country');
  const selectedState = watch('BasicDetail.state') ?? '';
  const selectedDistrict = watch('BasicDetail.district') ?? '';
  const selectedCity = watch('BasicDetail.City');
  const selectAlternateNumber = watch('BasicDetail.Alt_Mobile_Number')
  const selectNumber = watch('BasicDetail.Mobile_no')
  const selectWhatsAppNumber = watch('BasicDetail.WhatsAppNumber')
  const [showCityTextInput, setShowCityTextInput] = useState(false);
  const [showCityTextField, setShowCityTextField] = useState(false); // State for "Others" option
  const [addonPackage, setAddonPackage] = useState<AddOnPackage[]>([])
  const [addonPackagecheck, setAddonPackagecheck] = useState('')
  const [isCityValid, setIsCityValid] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState('');
  const [heightOptions, setHeightOptions] = useState<HeightOption[]>([]);
  const [showCityAsTextInput, setShowCityAsTextInput] = useState(false);

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

  const { data: Status } = useQuery({
    queryKey: ['Status'],
    queryFn: getStatus,
  });

  const { data: MaritalStatus } = useQuery({
    queryKey: ['MaritalStatus'],
    queryFn: getMaritalStatus,
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
    queryKey: [selectedCountry, 'State'],
    queryFn: () => fetchStateStatus(selectedCountry),
    enabled: !!selectedCountry,
  });
  console.log(State)

  const { data: District } = useQuery({
    queryKey: [selectedState, 'District'],
    queryFn: () => GetDistrict(selectedState),
    enabled: !!selectedState,
  });

  const { data: City } = useQuery({
    queryKey: [selectedDistrict, 'City'],
    queryFn: () => GetCity(selectedDistrict),
    enabled: !!selectedDistrict,
  });
  const EmailRef = useRef<HTMLDivElement | null>(null);
  const MobileNoRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (errors?.BasicDetail?.Mobile_no) {
      MobileNoRef.current?.scrollIntoView({ behavior: 'smooth' });
      MobileNoRef.current?.focus();
    }
    if (errors?.BasicDetail?.Email) {
      EmailRef.current?.scrollIntoView({ behavior: 'smooth' });
      EmailRef.current?.focus();
    }
  }, [errors?.BasicDetail?.Mobile_no, errors?.BasicDetail?.Email]);
  useEffect(() => {
    if (error?.[0]?.Mobile_no) {
      setError('BasicDetail.Mobile_no', {
        type: 'manual',
        message: error?.[0]?.Mobile_no,
      });
    }

    if (error?.[0]?.EmailId) {
      setError('BasicDetail.Email', {
        type: 'manual',
        message: error?.[0]?.EmailId,
      });
    }
  }, [error, setError]);
  useEffect(() => {
    if (!error?.[0]?.Mobile_no) {
      clearErrors('BasicDetail.Mobile_no');
    }

    if (!error?.[0]?.EmailId) {
      clearErrors('BasicDetail.Email');
    }
  }, [error, clearErrors]);

  useEffect(() => {
    // Reset showCityTextInput when district changes
    setShowCityTextInput(false);

    // Preserve city value only if it was selected from the dropdown
    if (selectedCity !== "Others") {
      setValue("BasicDetail.City", selectedCity || "");
    }
  }, [selectedDistrict]);

  const handlePackageChange = (id: number) => {
    let currentPackage = addonPackagecheck ? addonPackagecheck.split(',') : [];

    const packageIndex = currentPackage.indexOf(`${id}`);

    if (packageIndex === -1) {
      // Add the profession to the list
      currentPackage.push(`${id}`);
    } else {
      // Remove the profession from the list
      currentPackage.splice(packageIndex, 1);
    }

    // Filter out any empty values and join them without extra commas
    setAddonPackagecheck(currentPackage.filter(Boolean).join(','));
  };

  const fetchAddOnPackages = async () => {
    try {
      const response = await axios.post(`${API_URL_Auth}/Get_addon_packages/`);
      if (response.data.status === 'success') {
        setAddonPackage(response.data.data)
      }
      else {
        console.log(response.data.message || 'Failed to fetch packages');
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchAddOnPackages()
  }, [])

  useEffect(() => {
    if (EditData) {
      setValue('BasicDetail.Name', EditData[0].Profile_name || '');
      setValue('BasicDetail.Gender', EditData[0].Gender || '');
      const formattedMobileNumber = `${EditData[0].Mobile_no}`; // Include country code if needed
      setValue('BasicDetail.Mobile_no', formattedMobileNumber || '');
      // setValue('BasicDetail.Mobile_no', EditData[0].Mobile_no);
      setValue('BasicDetail.Email', EditData[0].EmailId || '');
      //const formattedMobileAltNumber = `${EditData[0].Profile_alternate_mobile}`
      setValue(
        'BasicDetail.Alt_Mobile_Number', EditData[0].Profile_alternate_mobile || '');
      //   setValue('BasicDetail.Password', EditData[0].Password);
      setValue(
        'BasicDetail.marital_status',
        EditData[0].Profile_marital_status || '' || null);
      setValue('BasicDetail.dob', EditData[0].Profile_dob || '' || null);
      setValue('BasicDetail.complexion', EditData[0].Profile_dob || '' || null);
      setValue('BasicDetail.address', EditData[0].Profile_address || '' || null);
      setValue('BasicDetail.complexion', EditData[0].Profile_complexion || '' || null);
      setValue('BasicDetail.country', EditData[0].Profile_country || '' || null);
      setValue('BasicDetail.state', EditData[0].Profile_state || '' || null);
      setValue('BasicDetail.district', EditData[0].Profile_district || '' || null);
      setValue('BasicDetail.City', EditData[0].Profile_city || '' || null);
      setValue('BasicDetail.status', EditData[0].status || '' || null);
      setValue('BasicDetail.linkedin', EditData[0].linkedin || '');
      setValue('BasicDetail.facebook', EditData[0].facebook || '');
      setValue('BasicDetail.Video_url', EditData[0].Video_url || '');
      setValue('BasicDetail.Profile_mobile_no', EditData[0].Profile_mobile_no || '');
      setValue('BasicDetail.Profile_emailid', EditData[0].Profile_emailid || '');
      //const formattedWhatsupNumber = `${EditData[0].Profile_whatsapp}`
      setValue(
        'BasicDetail.WhatsAppNumber',
        EditData[0].Profile_whatsapp || '');
      setValue('BasicDetail.pincode', EditData[0].Profile_pincode || '' || null);
      setAddonPackagecheck(EditData[0].Addon_package || '' || null)

      if (EditData && EditData[0]?.Profile_city &&
        (!EditData[0]?.Profile_state || !EditData[0]?.Profile_district)) {
        setShowCityAsTextInput(true);
      }

      // Check if we need to show city as text input
      // if (EditData[0]?.Profile_city &&
      //   (!EditData[0]?.Profile_state || !EditData[0]?.Profile_district)) {
      //   setShowCityAsTextInput(true);
      //   setValue('BasicDetail.City', EditData[0].Profile_city || '' || null);
      // }
      if (EditData[0]?.Profile_city &&
        (!EditData[0]?.Profile_state || !EditData[0]?.Profile_district)) {
        setShowCityAsTextInput(true);
        setValue('BasicDetail.City', EditData[0].Profile_city || '' || null);
      } else {
        setShowCityAsTextInput(false);
      }

    }
  }, [EditData]);

  const selectedGender = watch('BasicDetail.Gender');
  useEffect(() => {
    if (selectedGender) {
      setGender(selectedGender);
    }
  }, [selectedGender]);

  useEffect(() => {
    if (City && selectedCity) {
      const cityExists = City.some(city => city.city_name === selectedCity);
      setIsCityValid(cityExists);
      setShowCityTextInput(!cityExists);
    }
  }, [City, selectedCity]);


  useEffect(() => {
    setGetMaritalStatus(maritalStatus)
  }, [maritalStatus])

  // useEffect(() => {
  //   if (selectedCountry && selectedCountry !== "1") {
  //     // Reset state, district, and city if country is not India
  //     setValue("BasicDetail.state", "");
  //     setValue("BasicDetail.district", "");
  //     setValue("BasicDetail.City", "");
  //   }
  // }, [selectedCountry, setValue]);


  useEffect(() => {
    if (selectedCountry && selectedCountry !== "1") {
      // For non-India countries, show city as text input
      setShowCityAsTextInput(true);
      // Reset state, district
      setValue("BasicDetail.state", "");
      setValue("BasicDetail.district", "");
    } else if (selectedCountry === "1") {
      // For India, check if we should show city as text input
      if (EditData && EditData[0]?.Profile_city &&
        (!EditData[0]?.Profile_state || !EditData[0]?.Profile_district)) {
        setShowCityAsTextInput(true);
      } else {
        setShowCityAsTextInput(false);
      }
    }
  }, [selectedCountry, setValue, EditData]);

  return (
    <div className="bg-white p-5 mb-10 rounded shadow-md">
      <h4
        className="text-red-600 flex row items-center justify-between text-xl font-semibold  dark:text-white cursor-pointer  after-red-line::after"
        onClick={toggleSection2}
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
            <div className="w-full">
              <Input
                required
                {...register('BasicDetail.Name')}
                label={'Name'}
                showAsterisk={true}
              />
              {errors?.BasicDetail?.Name && (
                <p className="text-red-600">
                  {errors.BasicDetail.Name.message}
                </p>
              )}
            </div>

            <div ref={MobileNoRef} className="w-full">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Mobile Number<span className='text-red-500'>*</span>
                {/* <span className="text-red-500">*</span> */}
              </label>
              <Controller
                name="BasicDetail.Mobile_no"
                control={control}
                render={({ field }) => (
                  <PhoneInput
                    preferredCountries={["in", "sg", "my", "ae", "us", "gb"]}
                    inputProps={{
                      autoFocus: true,
                      autoFormat: true,
                      className: 'custom-input text-[#222020e6] font-medium ',
                    }}
                    country={'in'}
                    {...register('BasicDetail.Mobile_no', { required: true })}

                    value={field.value}
                    // Manually map the onChange to handle PhoneInput's custom format
                    onChange={(value, data, event, formattedValue) => {
                      setValue('BasicDetail.Mobile_no', value); // Use setValue from React Hook Form
                    }}
                  />
                )}
              />
              {!selectNumber && errors?.BasicDetail?.Mobile_no && (
                <p className="text-red-600">
                  {errors.BasicDetail.Mobile_no.message?.toString()}
                </p>
              )}
            </div>
            {/* Gender Selector */}
            <div className="w-full py-1">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Gender <span className="text-red-500">*</span>
              </label>
              <label className="block text-[#222020e6] font-medium mb-1 ml-20 capitalize">
                {selectedGender}
              </label>
              {/* <input
                {...register('BasicDetail.Gender')}
                type="radio"
                value="male"
                id='male'
              />
              <label className="text-black font-medium px-4" htmlFor='male'>Male</label>
              <input
                {...register('BasicDetail.Gender')}
                type="radio"
                value="female"
                id='female'
              />
              <label className="text-black px-4 font-medium" htmlFor='female'>Female</label>
              {errors?.BasicDetail?.Gender && (
                <p className="text-red-600">
                  {errors.BasicDetail.Gender.message}
                </p>
              )} */}
            </div>
          </div>
          <div className="flex w-full flex-row gap-4">


            <div ref={EmailRef} className="w-full">
              <Input
                required
                {...register('BasicDetail.Email')}
                label={'Email'}
              />
              {errors?.BasicDetail?.Email && (
                <p className="text-red-600">
                  {errors.BasicDetail.Email.message?.toString()}
                </p>
              )}
            </div>

            <div ref={MobileNoRef} className="w-full">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Alternate Mobile Number
                {/* <span className="text-red-500">*</span> */}
              </label>
              <Controller
                name="BasicDetail.Alt_Mobile_Number"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className="w-full border border-[#b5b2b2e6] rounded-md px-4 py-2 text-[#222020e6] font-medium outline-none focus:outline-none "
                    maxLength={10} // optional if you want to restrict to 10 digits
                    onKeyPress={(e) => {
                      // Allow only digits (0-9)
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
              {!selectAlternateNumber && errors?.BasicDetail?.Alt_Mobile_Number && (
                <p className="text-red-600">
                  {errors.BasicDetail.Alt_Mobile_Number.message?.toString()}
                </p>
              )}
            </div>

            <div className="w-full relative">
              {/* The star placed relative to the label position */}
              <span className="absolute top-[2px] left-[95px] text-red-500">*</span>
              <Input
                required
                label="Date of Birth"
                type="date"
                {...register('BasicDetail.dob')}
              />

              {errors?.BasicDetail?.dob && (
                <p className="text-red-600">
                  {errors.BasicDetail.dob.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-row gap-4">


            <div className="w-full">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Select your Marital Status{' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                {...register('BasicDetail.marital_status')}
                onChange={(e) => {
                  setMaritalStatus(e.target.value);
                  setValue('BasicDetail.marital_status', e.target.value);
                }}
                className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] rounded text-[#222020e6] font-medium"
              >
                <option value="" className='text-[#000000e6] font-medium'>Select your Marital Status</option>
                {MaritalStatus?.map((option: MaritalStatusOption) => (
                  <option
                    key={option.marital_sts_id}
                    value={option.marital_sts_id}
                    className='text-[#000000e6] font-medium'
                  >
                    {option.marital_sts_name}
                  </option>
                ))}
              </select>
              {errors?.BasicDetail?.marital_status && (
                <p className="text-red-600">
                  {errors.BasicDetail.marital_status.message?.toString()}
                </p>
              )}
            </div>
            <div className="w-full">
              <Input
                required
                {...register('BasicDetail.address')}
                label={'Address'}
              />
              {errors?.BasicDetail?.address && (
                <p className="text-red-600">
                  {errors.BasicDetail.address.message?.toString()}

                </p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Country
                <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCountry}
                {...register('BasicDetail.country')}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue('BasicDetail.country', value);

                  setValue('BasicDetail.state', "");

                  // reset dependent fields
                  setValue('BasicDetail.district', "");
                  setValue('BasicDetail.City', "");

                  // hide manual city input when state changes
                  setShowCityAsTextInput(false);
                }}
                className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] rounded text-[#222020e6] font-medium"
              >
                <option value="">Select your Country </option>
                {Country?.map((option: Country) => (
                  <option key={option.country_id} value={option.country_id} className='text-[#000000e6] font-medium'>
                    {option.country_name}
                  </option>
                ))}
              </select>
              {errors?.BasicDetail?.country && (
                <p className="text-red-600">
                  {errors.BasicDetail.country.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-row gap-4">
            {selectedCountry === '1' && (
              <div className="w-2/4">
                <label className="block text-[#5a5959e6] font-semibold mb-1">
                  State (Based on country selection){' '}
                  {/* <span className="text-red-500">*</span> */}
                </label>
                <select
                  value={selectedState}
                  {...register('BasicDetail.state')}
                  onChange={(e) => {
                    const value = e.target.value;

                    // set state value
                    setValue('BasicDetail.state', value);

                    // reset dependent fields
                    setValue('BasicDetail.district', "");
                    setValue('BasicDetail.City', "");

                    // hide manual city input when state changes
                    setShowCityAsTextInput(false);
                  }}
                  className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] rounded text-[#222020e6] font-medium"
                >
                  <option value="" className='text-[#000000e6] font-medium' selected>
                    Select State
                  </option>
                  {State?.map((option: State) => (
                    <option key={option.state_id} value={option.state_id} className='text-[#000000e6] font-medium'>
                      {option.state_name}
                    </option>
                  ))}
                </select>
                {errors?.BasicDetail?.state && (
                  <p className="text-red-600">
                    {errors.BasicDetail.state.message?.toString()}
                    {/* State is required */}
                  </p>
                )}
              </div>
            )}



            {selectedCountry === '1' && (
              <div className="flex w-full flex-row gap-4">
                <div className="w-full">
                  <label className="block text-[#5a5959e6] font-semibold mb-1">
                    District
                  </label>
                  {Number(selectedState) > 7 ? (
                    <>
                      <input
                        type="text"
                        {...register('BasicDetail.district')}
                        className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] rounded text-[#222020e6] font-medium"
                        placeholder="Enter your District"
                      />
                    </>
                  ) : (
                    <select
                      value={selectedDistrict}
                      {...register('BasicDetail.district')}
                      className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] rounded text-[#222020e6] font-medium"
                      // onChange={(e) => {
                      //   const value = e.target.value;
                      //   setValue('BasicDetail.district', value);
                      //   // Reset city when district changes
                      //   setValue('BasicDetail.City', '');
                      //   setShowCityTextInput(false);
                      //   setIsCityValid(true); // Set to true to show city select when district changes
                      // }}
                      onChange={(e) => {
                        const value = e.target.value;
                        setValue('BasicDetail.district', value);
                        // Reset city when district changes
                        setValue('BasicDetail.City', '');
                        setShowCityTextInput(false);
                        setIsCityValid(true);

                        // If district is selected, don't show city as text input
                        if (value) {
                          setShowCityAsTextInput(false);
                        }
                      }}
                    >
                      <option value="" className='text-[#000000e6] font-medium'>
                        Select your District
                      </option>
                      {District?.map((option: District) => (
                        <option key={option.disctict_id} value={option.disctict_id} className='text-[#222020e6] font-medium'>
                          {option.disctict_name}
                        </option>
                      ))}
                    </select>
                  )}
                  {!selectedDistrict && errors?.BasicDetail?.district && (
                    <p className="text-red-600">
                      {errors.BasicDetail.district.message?.toString()}
                      {/* District is required */}
                    </p>
                  )}
                </div>

                {/* Conditionally render City as a text input if District is a text input */}
                {Number(selectedState) > 7 ? (
                  <div className="w-full">
                    <label className="block text-[#5a5959e6] font-semibold mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      {...register('BasicDetail.City', { required: 'City is required' })}
                      className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] rounded text-[#222020e6] font-medium"
                      placeholder="Enter your city"
                    />
                    {errors?.BasicDetail?.City && (
                      <p className="text-red-600" >
                        {/* {errors.BasicDetail.City.message?.toString()} */}
                        City is required
                      </p>
                    )}
                  </div>
                ) : (
                  selectedCountry === '1' && selectedDistrict && (
                    <div className="w-full">
                      <div className="flex items-center gap-0">
                        <label
                          htmlFor="city"
                          className="block mb-1 text-[#5a5959e6] font-semibold "
                        >
                          City
                          {/* <span className="text-red-500">*</span> */}
                        </label>
                        <div className="relative inline-block ml-2 group">
                          <AiOutlineInfoCircle className="text-gray-500 cursor-pointer ml-2" />
                          <div className="absolute hidden group-hover:flex flex-col bg-white border border-ashSecondary rounded shadow-md p-2 w-48 z-10">
                            <p className="text-sm text-black">
                              Select your city from the list. If your city is not listed, select Others.
                            </p>
                          </div>
                        </div>
                      </div>

                      {isCityValid ? (
                        <div>
                          <select
                            value={selectedCity}
                            className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] rounded text-[#222020e6] font-medium"
                            {...register('BasicDetail.City', {
                              required: 'City is required',
                            })}
                            onChange={(e) => {
                              const value = e.target.value;
                              setValue('BasicDetail.City', value);

                              if (value === 'Others') {
                                setShowCityTextInput(true);
                                setValue('BasicDetail.City', ''); // Reset for text input
                              } else {
                                setShowCityTextInput(false);
                              }
                            }}
                          >
                            <option value="" className='text-[#000000e6] font-medium'>Select City</option>
                            {City?.map((option: City) => (
                              <option key={option.city_id} value={option.city_name} className='text-[#000000e6] font-medium'>
                                {option.city_name}
                              </option>
                            ))}
                            <option value="Others">Others</option>
                          </select>

                          {showCityTextInput && (
                            <input
                              type="text"
                              className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] rounded mt-2"
                              {...register('BasicDetail.City', {
                                required: 'City is required',
                              })}
                              placeholder="Enter your city"
                              onChange={(e) => setValue('BasicDetail.City', e.target.value)}
                            />
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] rounded text-[#222020e6] font-medium"
                          {...register('BasicDetail.City', {
                            required: 'City is required',
                          })}
                          placeholder="Enter your city"
                          onChange={(e) => setValue('BasicDetail.City', e.target.value)}
                        />
                      )}
                      {!selectedCity && errors?.BasicDetail?.City && (
                        <p className="text-red-600">
                          {/* {errors.BasicDetail.City.message?.toString()} */}
                          City is required
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            )}


            {Number(selectedCountry) > 1 || showCityAsTextInput ? (
              <div className="w-2/4">
                <label className="block text-[#5a5959e6] font-semibold mb-1">
                  City
                  {/* <span className="text-red-500">*</span> */}
                </label>
                <input
                  type="text"
                  {...register('BasicDetail.City', { required: 'City is required' })}
                  className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] rounded text-[#222020e6] font-medium"
                  placeholder="Enter your city"
                />
                {errors?.BasicDetail?.City && (
                  <p className="text-red-600">
                    {/* {errors.BasicDetail.City.message?.toString()} */}
                    City is required
                  </p>
                )}
              </div>
            ) : (
              selectedCountry === '1' && selectedDistrict && (
                " "
              )
            )}

          </div>
          <div className="flex w-full flex-row gap-4">
            <div className="w-2/4">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Complexion
                {/* <span className="text-red-500">*</span> */}
              </label>
              <select
                {...register('BasicDetail.complexion')}
                className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] rounded text-[#222020e6] font-medium"
              >
                <option value="" className='text-[#000000e6] font-medium'>Select your complexion</option>
                {Complexion?.map((option: Complexion) => (
                  <option
                    key={option.complexion_id}
                    value={option.complexion_id}
                    className='text-[#000000e6] font-medium'
                  >
                    {option.complexion_description}
                  </option>
                ))}
              </select>
              {errors?.BasicDetail?.complexion && (
                <p className="text-red-600">
                  {errors.BasicDetail.complexion.message}
                </p>
              )}
            </div>

            <div className="w-2/4">
              <Input
                required
                {...register('BasicDetail.pincode')}
                label={'Pincode'}
                type={'text'}
                onKeyDown={(e) => {
                  if (
                    e.key !== 'Backspace' &&
                    e.key !== 'ArrowLeft' &&
                    e.key !== 'ArrowRight' &&
                    !/[0-9]/.test(e.key)
                  ) {
                    e.preventDefault();
                  }
                }}
              />
              {errors?.BasicDetail?.pincode && (
                <p className="text-red-600">
                  {errors.BasicDetail.pincode.message?.toString()}

                </p>
              )}
            </div>

            <div className="w-2/4">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Whatsapp Mobile Number
              </label>
              <Controller
                name="BasicDetail.WhatsAppNumber"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className="w-full border border-[#b5b2b2e6] rounded-md px-3 py-2 text-[#222020e6] font-medium outline-none focus:outline-none"
                    maxLength={10} // restrict to 10 digits
                    onKeyPress={(e) => {
                      // Allow only digits (0-9)
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e) => {
                      // Extra safety: remove non-digits if pasted
                      e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                      field.onChange(e.currentTarget.value);
                    }}
                  />
                )}
              />
              {!selectWhatsAppNumber && errors?.BasicDetail?.WhatsAppNumber && (
                <p className="text-red-600">
                  {errors.BasicDetail.WhatsAppNumber.message?.toString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full flex-row gap-4">
            <div className="w-1/3">
              <label className='block text-[#5a5959e6]   font-semibold mb-1'>
                Profile Height
                {/* <span className="text-red-500">*</span> */}
              </label>
              <select
                id="height"
                className={`text-ash font-medium block w-full px-3 py-2 border-[1px] border-[#b5b2b2e6] border-footer-text-gray rounded-[4px] focus-visible:outline-none`}
                {...register("BasicDetail.Profile_height")}
                value={watch("BasicDetail.Profile_height") || ""}
              >
                <option value="">
                  Select Height
                </option>
                {heightOptions.map((option) => (
                  <option key={option.height_id} value={option.height_id} className='font-semibold text-black'>
                    {option.height_description}
                  </option>
                ))}
              </select>
              {errors?.BasicDetail?.Profile_height && (
                <p className="text-red-600">{errors.BasicDetail.Profile_height.message?.toString()}</p>
              )}
            </div>

            <div className="w-1/3">
              <Input
                required
                {...register('BasicDetail.facebook')}
                label={'Facebook'}
              />
              {errors?.BasicDetail?.facebook && (
                <p className="text-red-600">
                  {errors.BasicDetail.facebook.message?.toString()}

                </p>
              )}
            </div>
            <div className="w-1/3">
              <Input
                required
                {...register('BasicDetail.linkedin')}
                label={'LinkedIn'}
              />
              {errors?.BasicDetail?.linkedin && (
                <p className="text-red-600">
                  {errors.BasicDetail.linkedin.message?.toString()}

                </p>
              )}
            </div>

          </div>
          <div className="flex w-full flex-row gap-4">
            <div className="w-1/3">
              <Input
                required
                {...register('BasicDetail.Video_url')}
                label={'Video url'}
              />
              {errors?.BasicDetail?.Video_url && (
                <p className="text-red-600">
                  {errors.BasicDetail.Video_url.message?.toString()}

                </p>
              )}
            </div>
            <div className="w-1/3">
              <Input
                required
                {...register('BasicDetail.Profile_emailid')}
                label={'Profile Email ID'}
              />
              {errors?.BasicDetail?.Video_url && (
                <p className="text-red-600">
                  {errors.BasicDetail.Video_url.message?.toString()}

                </p>
              )}
            </div>
            {/* <div className="w-1/3">
              <Input
                required
                {...register('BasicDetail.Profile_mobile_no')}
                label={'Profile Mobile No'}
              />
              {errors?.BasicDetail?.Video_url && (
                <p className="text-red-600">
                  {errors.BasicDetail.Video_url.message?.toString()}

                </p>
              )}
            </div> */}
            <div ref={MobileNoRef} className="w-1/3">
              <label className="block text-[#5a5959e6] font-semibold mb-1">
                Profile Mobile No
                {/* <span className="text-red-500">*</span> */}
              </label>
              <Controller
                name="BasicDetail.Profile_mobile_no"
                control={control}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className="w-full border border-[#b5b2b2e6] rounded-md px-4 py-2 text-[#222020e6] font-medium outline-none focus:outline-none "
                    maxLength={10} // optional if you want to restrict to 10 digits
                    onKeyPress={(e) => {
                      // Allow only digits (0-9)
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                )}
              />
            </div>
          </div>
        </div>
      )}
      <div className='flex justify-end mt-10 '>
        <button
          type="submit"
          className="bg-blue-500 text-white px-15 py-2 rounded"
        >
          Save Basic Details
        </button>
      </div>
    </div>
  );
};

export default BasicDetails;






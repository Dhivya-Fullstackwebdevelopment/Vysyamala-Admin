import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Input from '../../Fromfield/Inputfield';
import { Controller, useFormContext } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import {
  fetchComplexionStatus,
  fetchCountryStatus,
  fetchStateStatus,
  GetDistrict,
  GetCity,
  getStatus,
} from '../../../action';
import { FormValues } from '../AddProfile';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
// import { AlertSettings } from './AlretSettings';
import { AiOutlineInfoCircle } from 'react-icons/ai'; Notification
import { Typography } from '@mui/material';
export interface Complexion {
  complexion_id: string;
  complexion_description: string;
}
export interface Country {
  country_id: string;
  country_name: string;
}
export interface State {
  state_id: string;
  state_name: string;
}
export interface District {
  disctict_id: string;
  disctict_name: string;
}

interface StatusOption {
  status_code: string;
  status_name: string;
}
interface AddProfileForm {
  setGender: Dispatch<SetStateAction<string>>;

  error: any;
  isBasicDetailsOpen: boolean;

  setIsBasicDetailsOpen: Dispatch<SetStateAction<boolean>>;
  setAlretSetting: Dispatch<SetStateAction<string>>;
  setMariedStatusProbs: Dispatch<SetStateAction<boolean>>;
}
interface MaritalStatusOption {
  marital_sts_id: string;
  marital_sts_name: string;
}
export interface HeightOption {
  height_id: number;
  height_description: string;
}

const AddProfileForm: React.FC<AddProfileForm> = ({
  setAlretSetting,
  isBasicDetailsOpen,
  setIsBasicDetailsOpen,
  setGender,
  error,
  setMariedStatusProbs
}) => {
  const {
    register,
    watch,
    trigger,
    setError,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<FormValues>();
  const status = watch('AddProfileForm.status');


  const selectedCountryId = watch('AddProfileForm.Profile_country');
  const selectedStateId = watch('AddProfileForm.Profile_state');
  const selectedDistrictId = watch('AddProfileForm.Profile_district');
  const [showCityTextInput, setShowCityTextInput] = useState(false);
  const maritalStatusClick = watch('AddProfileForm.Profile_marital_status')
  const cityDropdown = watch('AddProfileForm.Profile_city')
  const [maritalStatus, setMaritalStatus] = useState<boolean>(false);
  const [heightOptions, setHeightOptions] = useState<HeightOption[]>([]);

  useEffect(() => {
    const fetchHeight = async () => {
      try {
        const response = await axios.post(`https://app.vysyamala.com/auth/Get_Height/`);
        const options = Object.values(response.data) as HeightOption[];
        setHeightOptions(options);
      } catch (error) {
        console.error("Error fetching height options:", error);
      }
    };
    fetchHeight();
  }, []);

  console.log('maritalStatus', maritalStatus);
  // useEffect(() => {
  //   const setChildrenView = maritalStatusClick && [2, 3, 5].includes(Number(maritalStatusClick));
  //   setMaritalStatus(setChildrenView);
  // }, [maritalStatusClick]);

  useEffect(() => {
    if (maritalStatusClick === undefined || maritalStatusClick === "") {
      setMaritalStatus(false);
    } else {
      const setChildrenView = [2, 3, 5].includes(Number(maritalStatusClick));
      setMaritalStatus(setChildrenView);
    }
  }, [maritalStatusClick]);
  const [maritialStatus, setMaritialStatus] = useState<MaritalStatusOption[]>(
    [],
  );
  const toggleSection1 = () => {
    setIsBasicDetailsOpen(!isBasicDetailsOpen);
  };

  useEffect(() => {
    setMariedStatusProbs(maritalStatus)
  }, [maritalStatus])

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
    queryKey: [selectedCountryId, 'State'],
    queryFn: () => fetchStateStatus(selectedCountryId),
    enabled: !!selectedCountryId,
  });

  const { data: District } = useQuery({
    queryKey: [selectedStateId, 'District'],
    queryFn: () => GetDistrict(selectedStateId),
    enabled: !!selectedStateId,
  });

  const { data: City } = useQuery({
    queryKey: [selectedDistrictId, 'City'],
    queryFn: () => GetCity(selectedDistrictId),
    enabled: !!selectedDistrictId,
  });
  const SelectedGender = watch('AddProfileForm.Gender');
  console.log(SelectedGender)
  // useEffect(() => {
  //   return setGender(SelectedGender);
  // }, [SelectedGender]);

  useEffect(() => {
    if (SelectedGender !== undefined) {
      setGender(SelectedGender);
    }
  }, [SelectedGender]);

  const getMaritalStatus = async () => {
    try {
      const response = await axios.post(
        ' https://app.vysyamala.com/auth/Get_Marital_Status/',
      );
      const options: MaritalStatusOption[] = Object.values(response.data);
      console.log(options)
      setMaritialStatus(options);
      return options;
    } catch (error) {
      console.error('Error fetching marital status options:', error);
    }
  };
  useEffect(() => {
    getMaritalStatus();
  }, []);

  const EmailRef = useRef<HTMLDivElement | null>(null);

  const MobileNoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (errors?.AddProfileForm?.EmailId) {
      EmailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      EmailRef.current?.focus();
    }
    if (errors?.AddProfileForm?.Mobile_no) {
      MobileNoRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      MobileNoRef.current?.focus();
    }
  }, [errors?.AddProfileForm?.Mobile_no, errors?.AddProfileForm?.EmailId]);

  useEffect(() => {
    if (error?.[0]?.Mobile_no) {
      setError('AddProfileForm.Mobile_no', {
        type: 'manual',
        message: error[0].Mobile_no,  // Changed message to be a string
      });
    }

    if (error?.[0]?.EmailId) {
      setError('AddProfileForm.EmailId', {
        type: 'manual',
        message: error[0].EmailId,  // Changed message to be a string
      });
    }
  }, [error, setError]);

  useEffect(() => {
    if (!error?.[0]?.Mobile_no) {
      clearErrors('AddProfileForm.Mobile_no');
    }

    if (!error?.[0]?.EmailId) {
      clearErrors('AddProfileForm.EmailId');
    }
  }, [error, clearErrors]);


  return (
    <div className="bg-white p-5 mb-10 rounded shadow-md">
      <div>
        <Typography
          sx={{
            marginBottom: '20px',
            color: 'black',
            fontSize: '1.5rem',
            fontWeight: 'bold',
          }}
        >
          Add New Profile
        </Typography>
      </div>
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
          <div className="flex w-full flex-row  gap-4 max-md:flex-col">
            <div className="w-2/4 max-md:w-full max-md:w-full">
              <Input
                required
                label={'Name'}
                showAsterisk={true}
                // name="temp_profileid"
                {...register('AddProfileForm.Profile_name')}
              />
              {errors?.AddProfileForm?.Profile_name && (
                <p className="text-red-600">
                  {errors.AddProfileForm.Profile_name.message}
                </p>
              )}
            </div>

            {/* Gender Selector */}
            <div className="w-2/4  py-1 max-md:w-full">
              <label className="block text-black font-medium mb-1">
                Select Gender <span className="text-red-500">*</span>
              </label>
              <input
                type="radio"
                value="Male"
                id="male"
                // name="Gender"
                {...register('AddProfileForm.Gender')}
              />
              <label className="text-black px-4" htmlFor="male">Male</label>
              <input
                type="radio"
                value="Female"
                id="female"
                // name="Gender"
                {...register('AddProfileForm.Gender')}
              />
              <label className="text-black px-4" htmlFor="female">Female</label>
              {errors?.AddProfileForm?.Gender && (
                <p className="text-red-600">
                  {errors.AddProfileForm.Gender.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-row gap-4 max-md:flex-col">
            <div ref={MobileNoRef} className="w-2/4 max-md:w-full">
              <label className="block text-black font-medium mb-1">
                Mobile Number<span className="text-red-500">*</span>

              </label>
              {/* <PhoneInput
                preferredCountries={["in", "sg", "my", "ae", "us", "gb"]} // Ensure "in" is first

                inputProps={{
                  autoFocus: true,
                  autoFormat: true,
                  className: 'custom-input',
                }}
                country={'in'}
                {...register('AddProfileForm.Mobile_no', { required: true })}
                // Manually map the onChange to handle PhoneInput's custom format
                onChange={(value, data, event, formattedValue) => {
                  setValue('AddProfileForm.Mobile_no', value); // Use setValue from React Hook Form
                }}
              // Optionally, handle onBlur as needed
              // onBlur={(event) => {
              //   trigger('AddProfileForm.Mobile_no'); // Trigger validation on blur
              // }}
              /> */}
              <Controller
                name="AddProfileForm.Mobile_no"
                control={control}
                // REMOVE THIS LINE
                // rules={{ required: true }} 
                render={({ field }) => (
                  <PhoneInput
                    preferredCountries={["in", "sg", "my", "ae", "us", "gb"]}
                    country={'in'}
                    inputProps={{
                      autoFocus: true,
                      className: 'custom-input',
                    }}
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                )}
              />
              {errors?.AddProfileForm?.Mobile_no && (
                <p className="text-red-600">
                  {' '}
                  {errors.AddProfileForm.Mobile_no.message?.toString()}
                </p>
              )}
            </div>

            <div ref={EmailRef} className="w-2/4 max-md:w-full">
              <Input
                required
                label={'Email'}
                {...register('AddProfileForm.EmailId')}
              />
              {errors?.AddProfileForm?.EmailId && (
                <p className="text-red-600">
                  {' '}
                  {errors.AddProfileForm.EmailId.message?.toString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full flex-row gap-4 max-md:flex-col">
            <div className="w-full">
              <Input
                required
                label={'Create Password'}
                showAsterisk={true}
                // name="Password"
                {...register('AddProfileForm.Password')}
              />
              {errors?.AddProfileForm?.Password && (
                <p className="text-red-600">
                  {' '}
                  {errors.AddProfileForm.Password.message?.toString()}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-black font-medium mb-1">
                Select your Marital Status{' '}
                <span className="text-red-500">*</span>
              </label>
              <select
                // name="Profile_marital_status"
                className="outline-none w-full px-4 py-2 border border-black rounded"
                {...register('AddProfileForm.Profile_marital_status')}

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
              {errors?.AddProfileForm?.Profile_marital_status && (
                <p className="text-red-600">
                  {' '}
                  {errors.AddProfileForm.Profile_marital_status.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-row gap-4 max-md:flex-col">
            <div className="w-full">
              <Input
                required
                label={'Date of Birth'}
                type={'date'}
                showAsterisk={true}
                // name="Profile_dob"
                {...register('AddProfileForm.Profile_dob')}
              />
              {errors?.AddProfileForm?.Profile_dob && (
                <p className="text-red-600">
                  {' '}
                  {errors.AddProfileForm.Profile_dob.message?.toString()}
                </p>
              )}
            </div>
            <div className="w-full">
              <Input
                required
                label={'Address'}
                // name="Profile_address"
                {...register('AddProfileForm.Profile_address')}
              />
              {errors?.AddProfileForm?.Profile_address && (
                <p className="text-red-600">
                  {errors.AddProfileForm.Profile_address.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-row gap-4 max-md:flex-col">
            <div className="w-full">
              <label className="block text-black font-medium mb-1">
                Complexion

              </label>
              <select
                // name="Profile_complexion"
                {...register('AddProfileForm.Profile_complexion')}
                className="outline-none w-full px-4 py-2 border border-black rounded"
              // onChange={(e) =>
              //   handleInputChange1(e, 'Profile_complexion')
              // }
              >
                <option value="">Select your complexion</option>
                {Complexion?.map((option: Complexion) => (
                  <option
                    key={option.complexion_id}
                    value={option.complexion_id}
                  >
                    {option.complexion_description}
                  </option>
                ))}
              </select>

              {errors?.AddProfileForm?.Profile_complexion && (
                <p className="text-red-600">
                  {errors.AddProfileForm.Profile_complexion.message?.toString()}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className="block text-black font-medium mb-1">
                Country
                <span className="text-red-500">*</span>
              </label>
              <select
                // name="Profile_country"
                {...register('AddProfileForm.Profile_country')}
                className="outline-none w-full px-4 py-2 border border-black rounded"
              >
                <option value=""> Select your Country </option>
                {Country?.map((option: Country) => (
                  <option key={option.country_id} value={option.country_id}>
                    {option.country_name}
                  </option>
                ))}
              </select>
              {errors?.AddProfileForm?.Profile_country && (
                <p className="text-red-600">
                  {errors.AddProfileForm.Profile_country.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <div className="flex w-full flex-row gap-4 max-md:flex-col">
            {selectedCountryId == '1' && (
              <div className="w-2/4 max-md:w-full">
                <label className="block text-black font-medium mb-1">
                  State (Based on country selection){' '}

                </label>
                <select
                  // name="Profile_state"

                  {...register('AddProfileForm.Profile_state')} // Update this line
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                //   {...register('Profile_state')}
                >
                  <option value="" selected>
                    Select State
                  </option>
                  {State?.map((option: State) => (
                    <option key={option.state_id} value={option.state_id}>
                      {option.state_name}
                    </option>
                  ))}
                </select>
                {errors?.AddProfileForm?.Profile_state && (
                  <p className="text-red-600">
                    {errors.AddProfileForm.Profile_state.message?.toString()}
                  </p>
                )}
              </div>
            )}

            {Number(selectedStateId) > 7 ? (

              <>


                <div className="w-2/4 max-md:w-full">
                  <label
                    htmlFor="district"
                    className="block mb-1 text-black font-medium"
                  >
                    District
                  </label>
                  <input
                    id="district"
                    type="text"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    {...register('AddProfileForm.Profile_district', { required: 'District is required' })}
                    placeholder="Enter your district"
                  />
                  {errors?.AddProfileForm?.Profile_district && (
                    <p className="text-red-600">
                      {errors.AddProfileForm.Profile_district.message?.toString()}
                    </p>
                  )}
                </div>

                <div className="w-2/4 max-md:w-full">
                  <label
                    htmlFor="city"
                    className="block mb-1 text-black font-medium"
                  >
                    City
                    <div className="relative inline-block ml-2 group">
                      <AiOutlineInfoCircle className="text-gray-500 cursor-pointer ml-2" />

                      <div className="absolute hidden group-hover:flex flex-col bg-white border border-ashSecondary rounded shadow-md p-2 w-48 z-10">
                        <p className="text-sm text-black">
                          Select your city from the list. If your city is
                          not listed, select Others.
                        </p>
                      </div>
                    </div>
                  </label>

                  <div>
                    <input
                      id="city"
                      type="text"
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                      {...register('AddProfileForm.Profile_city', { required: 'City is required' })}
                      placeholder="Enter your city"
                    />
                    {errors?.AddProfileForm?.Profile_city && (
                      <p className="text-red-600">
                        {errors.AddProfileForm.Profile_city.message?.toString()}
                      </p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              // Display District as a dropdown
              (selectedCountryId === '1' && selectedStateId && (
                <div className="w-2/4 max-md:w-full">
                  <label
                    htmlFor="district"
                    className="block text-black font-medium mb-1"
                  >
                    District
                  </label>
                  <select
                    id="district"
                    className="outline-none w-full px-4 py-2 border border-black rounded"
                    {...register('AddProfileForm.Profile_district', { required: 'District is required' })}
                    defaultValue=""
                  >
                    <option value="" >
                      Select District
                    </option>
                    {District?.map((option: District) => (
                      <option key={option.disctict_id} value={option.disctict_id}>
                        {option.disctict_name}
                      </option>
                    ))}
                  </select>
                  {errors?.AddProfileForm?.Profile_district && (
                    <p className="text-red-600">
                      {errors.AddProfileForm.Profile_district.message?.toString()}
                    </p>
                  )}
                </div>
              )))}

          </div>
          <div className="flex w-full flex-row gap-4 max-md:flex-col">

            {Number(selectedCountryId) > 1 && Number(selectedStateId) <= 7 ? (
              <div className="w-2/4 max-md:w-full">
                <div className="flex items-center gap-0">
                  <label
                    htmlFor="city"
                    className="block mb-1 text-black font-medium"
                  >
                    City
                  </label>
                  <div className="relative inline-block ml-2 group">
                    <AiOutlineInfoCircle className="text-gray-500 cursor-pointer ml-2" />

                    <div className="absolute hidden group-hover:flex flex-col bg-white border border-ashSecondary rounded shadow-md p-2 w-48 z-10">
                      <p className="text-sm text-black">
                        Select your city from the list. If your city is
                        not listed, select Others.
                      </p>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                  {...register('AddProfileForm.Profile_city', { required: 'City is required' })}
                  placeholder="Enter your city"
                />
                {errors?.AddProfileForm?.Profile_city && (
                  <p className="text-red-600">
                    {errors.AddProfileForm.Profile_city.message?.toString()}
                  </p>
                )}
              </div>
            ) : (
              selectedCountryId === '1' &&
              Number(selectedDistrictId) > 0 && Number(selectedStateId) < 7 && (
                <div className="w-2/4 max-md:w-full">
                  <div className="flex items-center gap-0">
                    <label
                      htmlFor="city"
                      className="block mb-1 text-black font-medium"
                    >
                      City
                    </label>
                    <div className="relative inline-block ml-2 group">
                      <AiOutlineInfoCircle className="text-gray-500 cursor-pointer ml-2" />
                      {/* Tooltip */}
                      <div className="absolute hidden group-hover:flex flex-col bg-white border border-ashSecondary rounded shadow-md p-2 w-48 z-10">
                        <p className="text-sm text-black">
                          Select your city from the list. If your city is not listed, select Others.
                        </p>
                      </div>
                    </div>
                  </div>
                  {!showCityTextInput ? (
                    <select
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                      {...register('AddProfileForm.Profile_city')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setShowCityTextInput(value === "Others");

                      }}
                    >
                      <option value="" selected>
                        Select City
                      </option>
                      {City?.map((option: any) => (
                        <option key={option.city_id} value={option.city_name}>
                          {option.city_name}
                        </option>
                      ))}
                      <option value="Others">Others</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                      {...register('AddProfileForm.Profile_city', { required: 'City is required' })}
                      placeholder="Enter your city"
                    />
                  )}
                  {!cityDropdown && errors?.AddProfileForm?.Profile_city && (
                    <p className="text-red-600">
                      {errors.AddProfileForm.Profile_city.message?.toString()}
                    </p>
                  )}
                </div>
              )
            )}


            <div className="w-2/4 max-md:w-full">
              <Input
                required
                label={'Post code'}

                type={'text'}
                onKeyDown={(e) => {
                  const allowedKeys = [
                    '0',
                    '1',
                    '2',
                    '3',
                    '4',
                    '5',
                    '6',
                    '7',
                    '8',
                    '9',
                    '+',
                    'Backspace',
                    'Tab',
                    'ArrowLeft',
                    'ArrowRight',
                    'Delete',
                  ];

                  // If the key pressed is not allowed, prevent it
                  if (!allowedKeys.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
                // name="Profile_pincode"
                {...register('AddProfileForm.Profile_pincode')}
              // {...register('Profile_pincode')}
              />
              {errors?.AddProfileForm?.Profile_pincode && (
                <p className="text-red-600">
                  {' '}
                  {errors.AddProfileForm.Profile_pincode.message?.toString()}
                </p>
              )}
            </div>
            <div className="w-2/4 max-md:w-full">
              <label className="block text-black font-medium mb-1">
                Alternate Mobile Number

              </label>
              <Controller
                name="AddProfileForm.Alt_Mobile_Number"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-[#000000e6] font-medium outline-none focus:outline-none"
                    maxLength={10} // restrict to 10 digits
                    onKeyPress={(e) => {
                      // Allow only numbers
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e) => {
                      // Extra check: remove any non-numeric characters if pasted
                      const cleaned = e.currentTarget.value.replace(/\D/g, "");
                      e.currentTarget.value = cleaned;
                      field.onChange(cleaned);
                    }}
                    onBlur={() => trigger("AddProfileForm.Alt_Mobile_Number")}
                  />
                )}
              />
            </div>
          </div>

          <div className="flex w-full flex-row gap-4 max-md:flex-col">
            <div className="w-2/4 max-md:w-full">
              <label className="block text-black font-medium mb-1">Status</label>
              <select
                {...register('AddProfileForm.status')}
                className="outline-none w-full px-4 py-2 border border-black rounded bg-gray-200 cursor-not-allowed"
                defaultValue={Status?.find((option: StatusOption) => option.status_name === "Newly Registered")?.status_code || ""}
                disabled
                value={status}
              >
                {Status?.map((option: any) => (
                  <option key={option.status_code} value={option.status_code}>
                    {option.status_name}
                  </option>
                ))}
              </select>
              {errors?.AddProfileForm?.status && (
                <p className="text-red-600">{errors.AddProfileForm.status.message?.toString()}</p>
              )}
            </div>

            <div className="w-2/4">
              <label className='block text-black font-medium mb-1'>
                Profile Height
                {/* <span className="text-red-500">*</span> */}
              </label>
              <select
                id="height"
                className={`text-ash font-medium block w-full px-3 py-2 border-[1px] border-footer-text-gray rounded-[4px] focus-visible:outline-none`}
                {...register("AddProfileForm.Profile_height")}
              >
                <option value="" selected>
                  Select Height
                </option>
                {heightOptions.map((option) => (
                  <option key={option.height_id} value={option.height_id}>
                    {option.height_description}
                  </option>
                ))}
              </select>
              {errors?.AddProfileForm?.Profile_height && (
                <p className="text-red-600">{errors.AddProfileForm.Profile_height.message?.toString()}</p>
              )}
            </div>

            <div className="w-2/4 max-md:w-full">
              <label className="block text-black font-medium mb-1">
                Whatsapp Number
              </label>
              <Controller
                name="AddProfileForm.WhatsAppNumber"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <input
                    type="text"
                    {...field}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-[#000000e6] font-medium outline-none focus:outline-none"
                    maxLength={10} // restrict to 10 digits
                    onKeyPress={(e) => {
                      // Allow only digits
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e) => {
                      // Clean pasted input (remove non-digits)
                      const cleaned = e.currentTarget.value.replace(/\D/g, "");
                      e.currentTarget.value = cleaned;
                      field.onChange(cleaned);
                    }}
                    onBlur={() => trigger("AddProfileForm.WhatsAppNumber")}
                  />
                )}
              />
              {errors?.AddProfileForm?.WhatsAppNumber && (
                <p className="text-red-600">
                  {errors.AddProfileForm.WhatsAppNumber.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex w-full flex-row gap-4 max-md:flex-col">
            <div className="w-2/4 max-md:w-full">
              <Input
                label="Facebook"
                // placeholder="https://facebook.com/username"
                {...register("AddProfileForm.facebook")}
              />
            </div>
            <div className="w-2/4 max-md:w-full">
              <Input
                label="LinkedIn"
                //placeholder="https://linkedin.com/in/username"
                {...register("AddProfileForm.linkedin")}
              />
            </div>

            <div className="w-2/4 max-md:w-full">
              <Input
                label="Video URL"
                //placeholder="https://youtube.com/..."
                {...register("AddProfileForm.Video_url")}
              />
            </div>
          </div>
          <div className="flex w-full flex-row gap-4 max-md:flex-col">
            <div className="w-[410px] max-md:w-full">
              <Input
                label="Profile Email ID"
                type="email"
                {...register("AddProfileForm.Profile_emailid")}
              />
              {errors?.AddProfileForm?.Profile_emailid && (
                <p className="text-red-600">
                  {errors.AddProfileForm.Profile_emailid.message?.toString()}
                </p>
              )}
            </div>

            <div className="w-[410px] max-md:w-full">
              <label className="block text-black font-medium mb-1">
                Profile Mobile No
              </label>

              <Controller
                name="AddProfileForm.Profile_mobile_no"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    maxLength={10}
                    onInput={(e) => {
                      const cleaned = e.currentTarget.value.replace(/\D/g, "");
                      field.onChange(cleaned);
                    }}
                  />
                )}
              />
            </div>

          </div>
          {/* <AlertSettings setAlretSetting={setAlretSetting} /> */}
        </div>

      )}
    </div>
  );
};

export default AddProfileForm;

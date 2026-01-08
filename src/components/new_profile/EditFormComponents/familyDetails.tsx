import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Input from '../../Fromfield/Inputfield';
import { FamilyDetailsValues } from '../../../EditSceema';
import { useFormContext } from 'react-hook-form';
import { bloodGroups } from '../../../scema';
import { fetchFamilyTypes, fetchFamilyStatus, fetchFamilyValues, fetchPropertyworth, fetchSuyaGothram } from '../../../action';
import { useQuery } from '@tanstack/react-query';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import Select from 'react-select';
import { IoMdArrowDropdown } from 'react-icons/io';

interface formProps {
  EditData: any;
  isFamilyDetailsOpen: boolean;
  setIsFamilyDetailsOpen: Dispatch<SetStateAction<boolean>>;
  getMaritalStatus: string;
  setChildrenn: Dispatch<SetStateAction<boolean>>;

}

const FamilyDetails: React.FC<formProps> = ({
  EditData,
  isFamilyDetailsOpen,
  setIsFamilyDetailsOpen,
  getMaritalStatus,
  setChildrenn
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FamilyDetailsValues>();
  const watchedValues = watch('FamilyDetails'); // Watch the entire FamilyDetails object
  useEffect(() => {
    // This will log the data to the console every time a field changes
    console.log("Current FamilyDetails Data:", watchedValues);
  }, [watchedValues]);

  // Also, keep the error log to see what fails on submit
  console.log("Validation Errors on Re-render:", errors.FamilyDetails);

  const buttonClass = (isSelected: boolean) =>
    isSelected ? 'bg-blue-500 text-white' : '';
  const physicallyChalanged = watch('FamilyDetails.physicallyChalanged');
  const selectedBrother = watch('FamilyDetails.selectedBrother');
  const marriedBrother = watch('FamilyDetails.marriedBrother');
  const selectedSister = watch('FamilyDetails.selectedSister');
  const marriedSisters = watch('FamilyDetails.marriedSisters');
  const selectedFamilyTypeValue = watch('FamilyDetails.FamilyType');
  const BloodGroup = watch('FamilyDetails.bloodGroup')
  const NoOfChildren = watch('FamilyDetails.no_of_children')
  const EyeWear = watch('FamilyDetails.EyeWear')
  const toggleSection3 = () => {
    setIsFamilyDetailsOpen(!isFamilyDetailsOpen);
  };
  const { data: propertyworth } = useQuery({
    queryKey: [' propertyworth'],
    queryFn: fetchPropertyworth,
  });
  const { data: FamilyTypes } = useQuery({
    queryKey: ['FamilyTypes'],
    queryFn: fetchFamilyTypes,
  });
  const { data: FamilyStatus } = useQuery({
    queryKey: ['FamilyStatus'],
    queryFn: fetchFamilyStatus,
  });
  const { data: FamilyValues } = useQuery({
    queryKey: ['FamilyValues'],
    queryFn: fetchFamilyValues,
  });
  const [selectedFamilyType, setSelectedFamilyType] = useState('');
  const [selectedFamilyStatus, setSelectedFamilyStatus] = useState('');
  const [selectedFamilyValues, setSelectedFamilyValues] = useState('');
  //const [weight,setWeight]=useState('')
  const familyTypeRef = useRef<HTMLDivElement | null>(null);
  // const[childrenView,setChildrenView]=useState()

  //  useEffect(()=>{
  //    if (EditData) {
  //      const maritalStatus =getMaritalStatus
  //  console.log('12mk',maritalStatus)
  //   const showChildrenField = maritalStatus && ['2', '3', '5'].includes(maritalStatus);
  // setChildrenView(showChildrenField)
  // }
  //  },[ EditData])
  //const setChildrenView = getMaritalStatus && ['2', '3', '5'].includes(getMaritalStatus);

  const [maritalValues, setMaritalValues] = useState('');
  console.log("1lo", maritalValues);

  useEffect(() => {
    if (EditData) {
      const data = EditData[0].Profile_marital_status
      setMaritalValues(data)
    }
  }, [EditData])
  const setChildrenView = maritalValues && [2, 3, 5].includes(Number(maritalValues));
  const adminSuyaGothram = watch('FamilyDetails.suya_gothram_admin');
  const adminUncleGothram = watch('FamilyDetails.uncle_gothram_admin');
  useEffect(() => {
    setChildrenn(Boolean(setChildrenView)); // Ensure we're passing a boolean
  }, [setChildrenView, setChildrenn]);
  useEffect(() => {
    if (EditData) {
      setValue('FamilyDetails.fathername', EditData[1].father_name || '');
      setValue('FamilyDetails.fatherOccupation', EditData[1].father_occupation || '');
      setValue('FamilyDetails.motherName', EditData[1].mother_name || '');
      setValue('FamilyDetails.motherOccupation', EditData[1].mother_occupation || '');
      setValue('FamilyDetails.FamilyName', EditData[1].family_name || '');
      setValue('FamilyDetails.AboutMyself', EditData[1].about_self || '');
      setValue('FamilyDetails.MyHobbies', EditData[1].hobbies || '');
      setValue('FamilyDetails.bloodGroup', EditData[1].blood_group || '');
      setValue('FamilyDetails.FamilyType', EditData[1].family_type || '');
      setSelectedFamilyType(EditData[1].family_type || '');
      setValue('FamilyDetails.FamilyValue', EditData[1].family_value || '');
      setSelectedFamilyValues(EditData[1].family_value || '');
      setValue('FamilyDetails.FamilyStatus', EditData[1].family_status || '');
      setSelectedFamilyStatus(EditData[1].family_status || '');
      setValue('FamilyDetails.selectedBrother', EditData[1].no_of_brother || '');
      setValue('FamilyDetails.selectedSister', EditData[1].no_of_sister || '');
      setValue('FamilyDetails.marriedBrother', EditData[1].no_of_bro_married || '');
      setValue('FamilyDetails.marriedSisters', EditData[1].no_of_sis_married || '');
      setValue('FamilyDetails.UncleGothram', EditData[1].uncle_gothram || '');
      setValue('FamilyDetails.physicallyChalanged', EditData[1].Pysically_changed || 'no');
      setValue('FamilyDetails.PropertyDetails', EditData[1].property_details || '');
      setValue('FamilyDetails.PropertyWorth', EditData[1].property_worth || '');
      setValue('FamilyDetails.EyeWear', EditData[1].eye_wear || '');
      setValue('FamilyDetails.SuyaGothram', EditData[1].suya_gothram || '');
      setValue('FamilyDetails.AncestorOrigin', EditData[1].ancestor_origin || '');
      setValue('FamilyDetails.AboutMyFamily', EditData[1].about_family || '');
      setValue('FamilyDetails.weight', EditData[1].weight?.toString() || '');
      setValue('FamilyDetails.mother_alive', EditData[1].mother_alive || '');
      setValue('FamilyDetails.father_alive', EditData[1].father_alive || '');
      //   setValue('FamilyDetails.no_of_children',EditData[1].no_of_children || '')
      // if (setChildrenView) {
      //   setValue('FamilyDetails.no_of_children', EditData[1].no_of_children || 0) ;
      // } else {
      //   // Clear the value when field shouldn't be shown
      //   setValue('FamilyDetails.no_of_children', undefined, { shouldValidate: false });
      // }
      setValue('FamilyDetails.suya_gothram_admin', EditData[1].suya_gothram_admin || '');
      setValue('FamilyDetails.uncle_gothram_admin', EditData[1].uncle_gothram_admin || '');
      setValue('FamilyDetails.no_of_children', EditData[1].no_of_children || '');
    }
  }, [EditData, setValue]);


  useEffect(() => {
    if (EditData) {
      // ... other setValue calls

      // CORRECTED LOGIC FOR no_of_children
      if (setChildrenView) {
        const initialValue = EditData[1].no_of_children;
        // Use `??` to correctly handle `0` as a valid number.
        // Set to `undefined` if the API provides null/undefined.
        setValue('FamilyDetails.no_of_children', initialValue ?? undefined);
      } else {
        // This correctly clears the value when the field is hidden
        setValue('FamilyDetails.no_of_children', undefined, { shouldValidate: false });
      }

      // REMOVE THE DUPLICATE/UNCONDITIONAL LINE THAT WAS HERE:
      // setValue('FamilyDetails.no_of_children', EditData[1].no_of_children || '');
    }
  }, [EditData, setValue, setChildrenView]);
  // const onSubmit=(data:FamilyDetailsValues)=>{
  //   console.log("form submitting Data",data)
  // }
  useEffect(() => {
    if (EditData && EditData[1]) {
      const family = EditData[1];

      // Set Physically Challenged Yes/No
      setValue(
        'FamilyDetails.physicallyChalanged',
        family.Pysically_changed || 'no'
      );

      // Set details ONLY if yes
      if (family.Pysically_changed === 'yes') {
        setValue(
          'FamilyDetails.Physically_challenged_details',
          family.Physically_challenged_details || ''
        );
      } else {
        // Clear if no
        setValue(
          'FamilyDetails.Physically_challenged_details',
          '',
          { shouldValidate: false }
        );
      }
    }
  }, [EditData, setValue]);


  const { data: SuyaGothram } = useQuery({
    queryKey: ['SuyaGothram'],
    queryFn: fetchSuyaGothram,
  });


  const options = SuyaGothram?.map((gothram) => ({
    value: gothram.id,
    label: gothram.sanketha_namam
  }));
  // const gothramOptions = SuyaGothram?.map((gothram) => ({
  //     value: gothram.id,
  //     label: gothram.sanketha_namam
  //   }));
  const gothramOptions = SuyaGothram?.map((gothram) => ({
    value: String(gothram.id),  // Convert to string to match backend
    label: gothram.sanketha_namam
  }));

  const handleAdminSuyaGothramChange = (selectedOption: any) => {
    setValue('FamilyDetails.suya_gothram_admin', selectedOption?.value || '');
  };

  const handleAdminUncleGothramChange = (selectedOption: any) => {
    setValue('FamilyDetails.uncle_gothram_admin', selectedOption?.value || '');
  };

  const selectedAdminSuyaGothram = gothramOptions?.find(
    option => option.value === adminSuyaGothram
  );

  const selectedAdminUncleGothram = gothramOptions?.find(
    option => option.value === adminUncleGothram
  );


  const weight = watch("FamilyDetails.weight");
  useEffect(() => {
    if (weight === "0") {
      setValue("FamilyDetails.weight", "N/A");
    }
  }, [weight, setValue]);

  return (
    <div>
      <div className="bg-white p-5 mb-10 rounded shadow-md ">
        <h4
          className="text-red-600 flex row items-center justify-between text-xl font-semibold  dark:text-white cursor-pointer  after-red-line::after"
          onClick={toggleSection3}
        >
          Family Details
          <svg
            className={`fill-current transform ${isFamilyDetailsOpen ? 'rotate-180' : ''
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
        {isFamilyDetailsOpen && (
          <div className="flex flex-col gap-5">
            <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <Input
                  required
                  {...register('FamilyDetails.fathername')}
                  label={'Father name'}
                  showAsterisk={true}
                />
                {errors?.FamilyDetails?.fathername && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.fathername.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="block mb-1 font-bold text-[#5a5959e6]">
                  Father Occupation
                </label>
                <Input
                  required
                  {...register('FamilyDetails.fatherOccupation')}
                  label={''}
                />
                {errors?.FamilyDetails?.fatherOccupation && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.fatherOccupation.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input
                  required
                  {...register('FamilyDetails.motherName')}
                  label={'Mother name'}
                />
                {errors?.FamilyDetails?.motherName && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.motherName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <Input
                  required
                  {...register('FamilyDetails.motherOccupation')}
                  label={'Mother Occupation'}
                />
                {errors?.FamilyDetails?.motherOccupation && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.motherOccupation.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input
                  {...register('FamilyDetails.FamilyName')}
                  label={'Family name'}
                  type={'text'}
                />
                {/* {errors?.FamilyDetails?.FamilyType && (
                    <p className="text-red-600">Family Name is required</p>
                  )} */}
                {errors?.FamilyDetails?.FamilyName && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.FamilyName.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input
                  required
                  {...register('FamilyDetails.AboutMyself')}
                  label={'About Myself'}
                  type={'text'}
                />
                {errors?.FamilyDetails?.AboutMyself && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.AboutMyself.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <Input
                  required
                  {...register('FamilyDetails.MyHobbies')}
                  label={'My Hobbies'}
                  type={'text'}
                />
                {errors?.FamilyDetails?.MyHobbies && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.MyHobbies.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="block text-[#5a5959e6] font-medium mb-1">
                  Blood Group
                </label>
                <select
                  value={BloodGroup}
                  {...register('FamilyDetails.bloodGroup')}
                  className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] text-[#222020e6]  rounded  font-medium"
                >
                  <option value="" selected>
                    -- Select Blood Group --
                  </option>
                  {bloodGroups.map((group) => (
                    <option key={group.type} value={group.abbreviation} className='text-[#000000e6] font-medium'>
                      {group.abbreviation}
                    </option>
                  ))}
                </select>
                {errors?.FamilyDetails?.bloodGroup && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.bloodGroup.message}
                  </p>
                )}
              </div>


              {setChildrenView && (
                <div className='w-full'>
                  <label className="block mb-1 text-base text-[#5a5959e6] font-medium ">
                    Number of Children
                  </label>
                  <div className="relative">
                    {/* <select
                      id="no_of_children"
                      className="outline-none w-full text-placeHolderColor px-3 py-2.5 text-sm border border-ashBorder rounded appearance-none"
                      // {...register("FamilyDetails.no_of_children")}
                      value={NoOfChildren ?? undefined}
                      {...register("FamilyDetails.no_of_children", {
                        valueAsNumber: true, // Convert to number automatically
                        setValueAs: (value) => value === "" ? undefined : Number(value),
                      })}
                    //defaultValue={EditData?.[1]?.no_of_children || ""}
                    >
                      <option value="" disabled selected>Select Number of Children</option>
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select> */}



                    <select
                      id="no_of_children"
                      className="outline-none w-full text-placeHolderColor px-3 py-2.5 text-sm border border-[#b5b2b2e6] text-[#222020e6] rounded appearance-none"
                      // Just use valueAsNumber to handle the type conversion automatically
                      {...register("FamilyDetails.no_of_children", {
                        valueAsNumber: true,
                      })}
                    >
                      <option value="">Select Number of Children</option> {/* Use empty string value for the placeholder */}
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                    <IoMdArrowDropdown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
              )}
            </div>


            <div className="flex w-full flex-row gap-4">


              <div className="w-full py-1">
                <label className="block text-[#5a5959e6] font-semibold mb-1">
                  Father Alive{' '}

                </label>

                <input
                  {...register('FamilyDetails.father_alive')}
                  type="radio"
                  value="yes"
                  id='aliveYes'
                />

                <label className=" text-[#222020e6] px-4 font-medium" htmlFor='aliveYes'>Yes</label>

                <input
                  {...register('FamilyDetails.father_alive')}
                  type="radio"
                  value="no"
                  id='aliveNo'
                />
                <label className="text-[#222020e6] px-4 font-medium" htmlFor='aliveNo'>No</label>
                {errors?.FamilyDetails?.father_alive && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.father_alive.message}
                  </p>
                )}
              </div>

              <div className="w-full py-1">
                <label className="block text-[#5a5959e6] font-semibold mb-1">
                  Mother Alive{' '}

                </label>

                <input
                  {...register('FamilyDetails.mother_alive')}
                  type="radio"
                  value="yes"
                  id='mother_aliveYes'
                />

                <label className=" text-[#222020e6] px-4 font-medium" htmlFor='mother_aliveYes'>Yes</label>

                <input
                  {...register('FamilyDetails.mother_alive')}
                  type="radio"
                  value="no"
                  id='mother_aliveNo'
                />
                <label className=" text-[#222020e6] px-4 font-medium" htmlFor='mother_aliveNo'>No</label>
                {errors?.FamilyDetails?.mother_alive && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.mother_alive.message}
                  </p>
                )}
              </div>
            </div>



            <div>
              <div className="flex w-full flex-row gap-4">
                <div className="w-full py-1">
                  <label className="block text-[#5a5959e6] font-semibold mb-1">
                    Family Type
                  </label>
                  <div
                    ref={familyTypeRef}
                    className="w-full inline-flex rounded"
                  >
                    {FamilyTypes?.map((type) => (
                      <label
                        key={type.family_id}
                        className={`w-full px-5 py-3 text-sm font-bold border border-[#b5b2b2e6]   text-center cursor-pointer  ${String(selectedFamilyTypeValue) ===
                          String(type.family_id)
                          ? 'bg-blue-500 text-white'
                          : ''
                          }`}
                        onClick={() => setSelectedFamilyType(type.family_id)}
                      >
                        <input
                          value={type.family_id}
                          {...register('FamilyDetails.FamilyType', {
                            required: true,
                          })} // Add required validation
                          type="radio"
                          className="w-0 text-[#000000e6] font-medium"
                        />
                        {type.family_description}
                      </label>
                    ))}
                  </div>
                  {errors?.FamilyDetails?.FamilyType && (
                    <p className="text-red-600">Family Type is required</p>
                  )}
                </div>

                <div className="w-full py-1">
                  <label className="block text-[#5a5959e6] font-semibold mb-1">
                    Family Value
                  </label>
                  <div className="w-full inline-flex rounded">
                    {FamilyValues?.map((value) => (
                      <label
                        key={value.family_value_id}
                        className={`w-full px-5 py-3 text-sm font-bold border border-[#b5b2b2e6] cursor-pointer  ${String(selectedFamilyValues) ===
                          String(value.family_value_id)
                          ? 'bg-blue-500 text-white'
                          : ''
                          }`}
                        onClick={() =>
                          setSelectedFamilyValues(value.family_value_id)
                        }
                      >
                        <input
                          value={value.family_value_id}
                          {...register('FamilyDetails.FamilyValue')}
                          type="radio"
                          className="w-0"
                        />

                        {value.family_value_name}
                      </label>
                    ))}
                  </div>
                  {errors?.FamilyDetails?.FamilyValue && (
                    <p className="text-red-600">Family Value is required</p>
                  )}
                </div>
              </div>
              <div className="w-full py-1">
                <label className="block text-[#5a5959e6] font-semibold mb-1">
                  Family Status
                </label>
                <div className="w-full inline-flex rounded">
                  {FamilyStatus?.map((status) => (
                    <label
                      key={status.family_status_id}
                      className={`w-full px-5 py-3 text-sm font-bold border border-[#b5b2b2e6]  cursor-pointer ${String(selectedFamilyStatus) ===
                        String(status.family_status_id)
                        ? 'bg-blue-500 text-white'
                        : ''
                        }`}
                      onClick={() =>
                        setSelectedFamilyStatus(status.family_status_id)
                      }
                    >
                      <input
                        value={status.family_status_id}
                        {...register('FamilyDetails.FamilyStatus')}
                        type="radio"
                        className="w-0"
                      />
                      {status.family_status_name}
                    </label>
                  ))}
                </div>
                {errors?.FamilyDetails?.FamilyStatus && (
                  <p className="text-red-600">Family status is required</p>
                )}
              </div>
              <div className="mt-3 flex items-center space-x-48">
                <div>
                  <h1 className="block text-[#5a5959e6] font-semibold mb-1">
                    Brother
                  </h1>
                  <div className="flex flex-col">
                    <div className="inline-flex rounded">
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <label
                          key={num}
                          className={`px-5 py-3 text-sm font-bold  border border-[#b5b2b2e6]  text-center cursor-pointer ${selectedBrother === num.toString() ? 'bg-blue-500 text-white' : ''
                            }`}
                        >
                          <input
                            value={num}
                            type="radio"
                            {...register('FamilyDetails.selectedBrother', {
                              onChange: (e) => {
                                if (e.target.value === '0') {
                                  setValue('FamilyDetails.marriedBrother', '0');
                                }
                              }
                            })}
                            className="w-0"
                          />
                          {num === 5 ? '5+' : num}
                        </label>
                      ))}
                    </div>
                    {errors?.FamilyDetails?.selectedBrother && (
                      <p className="text-red-600">
                        Please select no of brothers
                      </p>
                    )}
                  </div>
                </div>

                {selectedBrother !== '0' && Number(selectedBrother) > 0 && (
                  <div>
                    <h1 className="mb-3 text-[#5a5959e6] font-bold">
                      Married
                    </h1>
                    <div className="flex flex-col">
                      <div className="inline-flex rounded">
                        {[...Array(Math.min(Number(selectedBrother) + 1, 6)).keys()].map((num) => (
                          <label
                            key={num}
                            className={`px-10 py-3 text-sm font-bold  border border-[#b5b2b2e6]   cursor-pointer ${marriedBrother === num.toString() ? 'bg-blue-500 text-white' : ''
                              }`}
                          >
                            <input
                              value={num}
                              type="radio"
                              {...register('FamilyDetails.marriedBrother')}
                              className="w-0"
                            />
                            {num === 5 ? '5+' : num}
                          </label>
                        ))}
                      </div>
                    </div>
                    {/* {errors?.FamilyDetails?.marriedBrother && (
                      <p className="text-red-600">
                        Please select count of married brothers
                      </p>
                    )} */}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center space-x-48">
                <div>
                  <h1 className="block text-[#5a5959e6] font-semibold mb-1">
                    Sister
                  </h1>
                  <div className="flex flex-col">
                    <div className="inline-flex rounded">
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <label
                          key={num}
                          className={`px-5 py-3 text-sm font-bold border border-[#b5b2b2e6] 
cursor-pointer  ${selectedSister === num.toString() ? 'bg-blue-500 text-white' : ''}`}
                        >
                          {num === 5 ? '5+' : num}
                          <input
                            value={num}
                            {...register('FamilyDetails.selectedSister', {
                              onChange: (e) => {
                                if (e.target.value === '0') {
                                  setValue('FamilyDetails.marriedSisters', '0');
                                }
                              }
                            })}
                            type="radio"
                            className="w-0"
                          />
                        </label>
                      ))}
                    </div>
                    {errors?.FamilyDetails?.selectedSister && (
                      <p className="text-red-600">
                        Please select no of sisters
                      </p>
                    )}
                  </div>
                </div>

                {selectedSister !== '0' && Number(selectedSister) > 0 && (
                  <div>
                    <h1 className="mb-3 text-[#5a5959e6] font-semibold">
                      Married
                    </h1>
                    <div className="flex flex-col">
                      <div className="inline-flex rounded">
                        {[...Array(Math.min(Number(selectedSister) + 1, 6)).keys()].map((num) => (
                          <label
                            key={num}
                            className={`px-10 py-3 text-sm  font-bold border border-[#b5b2b2e6]  cursor-pointer ${marriedSisters === num.toString() ? 'bg-blue-500 text-white' : ''
                              }`}
                          >
                            <input
                              value={num}
                              {...register('FamilyDetails.marriedSisters')}
                              type="radio"
                              className="w-0"
                            />
                            {num === 5 ? '5+' : num}
                          </label>
                        ))}
                      </div>
                      {errors?.FamilyDetails?.marriedSisters && (
                        <p className="text-red-600">
                          Please select count of married sisters
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex w-full flex-row gap-4 mt-5">
                <div className="w-full py-1">
                  <label className="block text-[#5a5959e6] font-semibold mb-1">
                    Physically Challenged{' '}

                  </label>

                  <input
                    {...register('FamilyDetails.physicallyChalanged')}
                    type="radio"
                    value="yes"
                  />

                  <label className="text-[#5a5959e6] px-4 font-medium">Yes</label>

                  <input
                    {...register('FamilyDetails.physicallyChalanged')}
                    type="radio"
                    value="no"
                  />
                  <label className="text-[#5a5959e6] px-4 font-medium">No</label>
                  {errors?.FamilyDetails?.physicallyChalanged && (
                    <p className="text-red-600">
                      {errors.FamilyDetails.physicallyChalanged.message}
                    </p>
                  )}
                </div>
                {physicallyChalanged === 'yes' ? (
                  <div className="w-full">
                    <Input
                      {...register('FamilyDetails.Physically_challenged_details')}
                      label={'Challenged Detail'}
                      type={'text'}
                    />
                  </div>
                ) : (
                  ''
                )}

                <div className="w-full">
                  {/* <Input
                    {...register('FamilyDetails.PropertyDetails')}
                    label={'Property Details'}
                    type={'text'}
                  /> */}
                  <div className='flex items-center'>
                    <label className="block text-[#5a5959e6] font-semibold mb-1">
                      Property Details
                    </label>
                    <div className="relative inline-block ml-2 group">
                      <AiOutlineInfoCircle className="text-primary align-middle" />
                      {/* Tooltip */}
                      <div className="absolute hidden group-hover:flex flex-col bg-white border border-ashSecondary rounded shadow-md p-2 w-48 z-10">
                        <p className="text-sm text-black">Residential,</p>
                        <p className="text-sm text-black">Commercial,</p>
                        <p className="text-sm text-black">Shopping Complex,</p>
                        <p className="text-sm text-black">Farm house,,</p>
                        <p className="text-sm text-black">Shop,</p>
                        <p className="text-sm text-black">Agriculture land,</p>
                        <p className="text-sm text-black">
                          Multistorage building etc.,
                        </p>
                      </div>
                    </div>
                  </div>
                  <Input
                    {...register('FamilyDetails.PropertyDetails')}
                    label={''}
                    type={'text'}
                  />
                  {errors?.FamilyDetails?.PropertyDetails && (
                    <p className="text-red-600">
                      {errors.FamilyDetails.PropertyDetails.message}
                    </p>
                  )}
                </div>
                <div className="w-full">
                  <label className="block text-[#5a5959e6] font-semibold mb-1 items-center">
                    <span>Property Worth</span>
                    <div className="relative inline-block ml-2 group">
                      <AiOutlineInfoCircle className="text-primary align-middle cursor-pointer" />
                      {/* Tooltip */}
                      <div className="absolute hidden group-hover:flex flex-col bg-white border border-ashSecondary rounded shadow-md p-2 w-48 z-10">
                        <p className="text-sm text-black">
                          Approx 1c, 5c, 50c, 30L, 80L, etc.
                        </p>
                      </div>
                    </div>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter property worth"
                    {...register('FamilyDetails.PropertyWorth')}
                    className="outline-none w-full px-4 py-2 border font-medium border-[#b5b2b2e6] text-[#222020e6] rounded"
                  />
                  {errors?.FamilyDetails?.PropertyWorth && (
                    <p className="text-red-600">
                      {errors.FamilyDetails.PropertyWorth.message}
                    </p>
                  )}
                </div>
              </div>

            </div>
            <div className="flex w-full flex-row gap-4">

              <div className="w-full">
                <Input
                  {...register('FamilyDetails.UncleGothram')}
                  label={'Uncle Gothram'}
                  type={'text'}
                />
                {errors?.FamilyDetails?.UncleGothram && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.UncleGothram.message}
                  </p>
                )}
              </div>

              <div className='w-full mt-1'>
                <label className='block text-[#5a5959e6] font-semibold '>
                  Uncle Gothram (Admin)
                </label>
                <Select
                  options={gothramOptions}
                  value={selectedAdminUncleGothram}
                  onChange={handleAdminUncleGothramChange}
                  className="w-full text-sm border border-[#b5b2b2e6] text-[#222020e6] font-medium rounded"
                  placeholder="Select Uncle Gothram"
                  isClearable
                />
              </div>

              <div className="w-full">
                <Input
                  {...register('FamilyDetails.SuyaGothram')}
                  label={'Suya Gothram'}
                  showAsterisk={true}
                />
                {errors?.FamilyDetails?.SuyaGothram && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.SuyaGothram.message}
                  </p>
                )}
              </div>
              <div className='w-full mt-1'>
                <label className='block text-[#5a5959e6] font-semibold '>
                  Suya Gothram (Admin)
                </label>

                <Select
                  options={gothramOptions}
                  value={selectedAdminSuyaGothram}
                  onChange={handleAdminSuyaGothramChange}
                  className="w-full text-sm border border-[#b5b2b2e6] text-[#222020e6] font-medium rounded"
                  placeholder="Select Suya Gothram"
                  isClearable
                />
              </div>

            </div>
            <div className="flex w-full flex-row gap-4">

              <div className="w-full">
                {/* <Input
                  onKeyDown={(e) => {
                    if (
                      e.key !== 'Backspace' &&
                      e.key !== 'ArrowLeft' &&
                      e.key !== 'ArrowRight' &&
                      e.key !== 'Tab' &&
                      !/[0-9]/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}


                  {...register('FamilyDetails.weight', {
                    setValueAs: (value) => (value === '' ? undefined : value),

                  })}

                  placeholder="Kg"
                  label={'weight'}
                  type={'text'}
                // name="weight"
                /> */}
                <Input
                  {...register("FamilyDetails.weight", {
                    setValueAs: (value) => {
                      if (value === "" || value === undefined) return undefined;
                      if (value === "N/A") return "N/A"; // keep as N/A
                      return value;
                    },
                  })}
                  placeholder="Kg"
                  label={"Weight"}
                  type={"text"}
                  onKeyDown={(e) => {
                    if (
                      e.key !== "Backspace" &&
                      e.key !== "ArrowLeft" &&
                      e.key !== "ArrowRight" &&
                      e.key !== "Tab" &&
                      !/[0-9]/.test(e.key)
                    ) {
                      e.preventDefault();
                    }
                  }}
                />


              </div>

              <div className="w-full">
                <label className="block text-[#5a5959e6] font-semibold mb-1">
                  Eye wear
                </label>
                <select
                  {...register('FamilyDetails.EyeWear')}
                  // defaultValue="Select Eye Wear" // very important to show placeholder
                  className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] text-[#222020e6] font-medium rounded"
                >
                  <option value="">
                    -- Select Eye Wear --
                  </option>
                  <option value="Unknown">Unknown</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>

                </select>

                {errors?.FamilyDetails?.EyeWear && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.EyeWear.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input
                  {...register('FamilyDetails.AncestorOrigin')}
                  label={'Ancestor Origin'}
                  type={'text'}
                />

              </div>

              <div className="w-full ">
                <label className="block text-[#5a5959e6] font-semibold mb-1">
                  About my Family
                </label>
                <textarea
                  className="outline-none w-full h-10.5 px-4 py-2 border  font-medium border-[#b5b2b2e6] text-[#222020e6] rounded"
                  {...register('FamilyDetails.AboutMyFamily')}
                ></textarea>
                {errors?.FamilyDetails?.AboutMyFamily && (
                  <p className="text-red-600">
                    {errors.FamilyDetails.AboutMyFamily.message}
                  </p>
                )}
              </div>

            </div>

          </div>
        )}
        <div className='flex justify-end mt-10 '>
          <button
            // onClick={formHandleSubmit}
            type="submit"
            className="bg-blue-500 text-white px-15 py-2 rounded"
          >
            Save Family Details
          </button>
        </div>
      </div>

    </div>
  );
};

export default FamilyDetails;

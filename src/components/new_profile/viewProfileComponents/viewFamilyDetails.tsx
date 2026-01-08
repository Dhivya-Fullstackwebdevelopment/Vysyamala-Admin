import { useEffect, useState } from 'react';

import Input from '../../Fromfield/Inputfield';
import { useQuery } from '@tanstack/react-query';
import Select from 'react-select';
import {
  fetchFamilyStatus,
  fetchFamilyTypes,
  fetchFamilyValues,
  fetchPropertyworth,
  fetchSuyaGothram,
} from '../../../action';
import { IoMdArrowDropdown } from 'react-icons/io';
interface pageProp {
  profile: any;
}
const ViewFamilyDetailsForm: React.FC<pageProp> = ({ profile }) => {
  const [isFamilyDetailsOpen, setIsFamilyDetailsOpen] = useState(true);
  const [familyDetails, setFamilyDetails] = useState<any>(true);

  const toggleSection2 = () => {
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
  const { data: SuyaGothram } = useQuery({
    queryKey: ['SuyaGothram'],
    queryFn: fetchSuyaGothram
  })
  useEffect(() => {
    if (profile && profile.length > 0) {
      const familyData = profile[1];
      // Transform eye_wear from "1"/"0" to "Yes"/"No" for display
      if (familyData.eye_wear === "1" || familyData.eye_wear === "0") {
        familyData.eye_wear = familyData.eye_wear === "1" ? "Yes" : "No";
      }
      setFamilyDetails(familyData);
      console.log(profile[1])
    }
  }, [profile]);
  const buttonClass = (isSelected: boolean) =>
    isSelected ? 'bg-blue-500 text-white' : '';
  console.log(familyDetails, 'basicDetailsbasicDetailsbasicDetails');


  const options = SuyaGothram?.map((gothram) => ({
    value: gothram.id,
    label: gothram.sanketha_namam
  }));
  const [childrenView, setChildrenView] = useState()
  useEffect(() => {
    if (profile) {
      const getMaritalStatus = profile[0].Profile_marital_status;
      const setChildren = getMaritalStatus && ['2', '3', '5'].includes(getMaritalStatus);
      setChildrenView(setChildren)
    }
  }, [profile])
  return (
    <div>
      <div className="bg-white p-5 mb-10 rounded shadow-md ">
        <h4
          className="text-red-600 flex row items-center justify-between text-xl font-semibold  dark:text-white cursor-pointer  after-red-line::after"
          onClick={toggleSection2}
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
                <label className="block mb-1 font-bold text-[#5a5959e6]">
                  Father name <span className="text-red-500">*</span>
                </label>
                <Input
                  readOnly
                  value={familyDetails.father_name}
                  required
                  label={''}
                />
              </div>
              <div className="w-full">
                <label className="block mb-1 font-bold text-[#5a5959e6]">
                  Father Occupation
                </label>
                <Input
                  readOnly
                  value={familyDetails.father_occupation}
                  required
                  label={''}
                />
              </div>
              <div className="w-full">
                <Input
                  readOnly
                  value={familyDetails.mother_name}
                  required
                  label={'Mother name'}
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <Input
                  readOnly
                  value={familyDetails.mother_occupation}
                  required
                  label={'Mother Occupation'}
                />
              </div>
              <div className="w-full">
                <Input
                  readOnly
                  value={familyDetails.family_name}
                  label={'Family name'}
                  type={'text'}
                  name="family_name"
                />
              </div>
              <div className="w-full">
                <Input
                  readOnly
                  value={familyDetails.about_self}
                  required
                  label={'About Myself'}
                  type={'text'}
                />
              </div>
            </div>

            <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <Input
                  readOnly
                  value={familyDetails.hobbies}
                  required
                  label={'My Hobbies'}
                />
              </div>
              <div className="w-full">
                <Input
                  readOnly
                  value={familyDetails.blood_group}
                  required
                  label={' Blood Group'}
                  type={'text'}
                />
              </div>
              <div className="w-full">
                <label className="block text-[#5a5959e6] font-medium mb-1">
                  Eye wear
                </label>
                <select
                  value={familyDetails.eye_wear}
                  disabled
                  className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                >
                  <option value="">
                    -- Select Eye Wear --
                  </option>
                  <option value="Unknown" className='text-black font-semibold'>Unknown</option>
                  <option value="Yes" className='text-black font-semibold'>Yes</option>
                  <option value="No" className='text-black font-semibold'>No</option>

                </select>
              </div>
            </div>
            <div className="flex w-full flex-row gap-4">
              {/* Father Alive */}
              <div className="w-full py-1">
                <label className="block text-[#5a5959e6] font-medium mb-1">
                  Father Alive
                </label>
                <div className="flex items-center">
                  <label className="flex items-center mr-4">
                    <input
                      type="radio"
                      checked={familyDetails.father_alive === "yes"}
                      readOnly
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={familyDetails.father_alive === "no"}
                      readOnly
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>

              {/* Mother Alive */}
              <div className="w-full py-1">
                <label className="block text-[#5a5959e6] font-medium mb-1">
                  Mother Alive
                </label>
                <div className="flex items-center">
                  <label className="flex items-center mr-4">
                    <input
                      type="radio"
                      checked={familyDetails.mother_alive === "yes"}
                      readOnly
                      className="mr-2"
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={familyDetails.mother_alive === "no"}
                      readOnly
                      className="mr-2"
                    />
                    No
                  </label>
                </div>
              </div>
            </div>
            <div>
              <div className="flex w-full flex-row gap-4">
                <div className="w-full py-1">
                  <label className="block text-[#5a5959e6] font-medium mb-1">
                    Family Type
                  </label>
                  <div className="w-full inline-flex rounded">
                    {FamilyTypes?.map((type) => (
                      <label
                        key={type.family_id}
                        className={`w-full px-5 py-3 text-sm border-[#b5b2b2e6] font-medium border text-center cursor-pointer  ${String(familyDetails.family_type) ===
                          String(type.family_id)
                          ? 'bg-blue-500 text-white'
                          : ''
                          }`}
                      >
                        <input
                          disabled
                          value={familyDetails.family_type}
                          type="radio"
                          className="w-0"
                        />
                        {type.family_description}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="w-full py-1">
                  <label className="block text-[#5a5959e6] font-medium mb-1">
                    Family Value
                  </label>
                  <div className="w-full inline-flex rounded">
                    {FamilyValues?.map((value) => (
                      <label
                        key={familyDetails.family_value}
                        className={`w-full px-5 py-3 text-sm border-[#b5b2b2e6] font-medium border cursor-pointer  ${String(familyDetails.family_value) ===
                          String(value.family_value_id)
                          ? 'bg-blue-500 text-white'
                          : ''
                          }`}
                      >
                        <input
                          value={value.family_value_id}
                          disabled
                          type="radio"
                          className="w-0"
                        />

                        {value.family_value_name}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="w-full py-1">
                <label className="block text-[#5a5959e6] font-medium mb-1">
                  Family Status
                </label>
                <div className="w-full inline-flex rounded">
                  {FamilyStatus?.map((status) => (
                    <label
                      key={status.family_status_id}
                      className={`w-full px-5 py-3 text-sm font-medium border-[#b5b2b2e6] border cursor-pointer ${String(familyDetails.family_status) ===
                        String(status.family_status_id)
                        ? 'bg-blue-500 text-white'
                        : ''
                        }`}
                    >
                      <input
                        value={familyDetails.family_status}
                        disabled
                        type="radio"
                        className="w-0"
                      />
                      {status.family_status_name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-48">
                <div>
                  <h1 className="block text-[#5a5959e6] font-medium mb-1">
                    Brother
                  </h1>
                  <div className="flex flex-col">
                    <div className="inline-flex rounded">
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <label
                          key={num}
                          className={`px-5 py-3 text-sm border-[#b5b2b2e6] font-medium border text-center 
cursor-pointer  ${buttonClass(
                            familyDetails.no_of_brother !== null &&
                            Number(familyDetails.no_of_brother) === num,
                          )}`}
                        >
                          <input
                            disabled
                            value={num}
                            type="radio"
                            className="w-0"
                          />
                          {num === 5 ? '5+' : num}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                {familyDetails.no_of_brother > 0 && (
                  <div>
                    <h1 className="mb-1 text-[#5a5959e6] font-semibold">
                      Married
                    </h1>
                    <div className="flex flex-col">
                      <div className="inline-flex border-[#b5b2b2e6] font-medium rounded">
                        {[
                          ...Array(
                            Math.min(
                              Number(familyDetails.no_of_brother) + 1 || 0,
                              6,
                            ),
                          ).keys(),
                        ].map((num) => (
                          <label
                            key={num}
                            className={`px-10 py-3 text-sm font-medium border 
cursor-pointer  ${buttonClass(
                              familyDetails.no_of_bro_married !== null &&
                              Number(familyDetails.no_of_bro_married) === num,
                            )}`}
                          >
                            <input value={num} type="radio" className="w-0" />
                            {num === 5 ? '5+' : num}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center space-x-48">
                <div className="mt-3 flex items-center space-x-48">
                  <div>
                    <h1 className="block text-black font-semibold mb-1">
                      Sister
                    </h1>
                    <div className="flex flex-col">
                      <div className="inline-flex rounded">
                        {[0, 1, 2, 3, 4, 5].map((num) => (
                          <label
                            key={num}
                            className={`px-5 py-3 text-sm text-black font-medium border 
cursor-pointer  ${buttonClass(
                              familyDetails.no_of_sister !== null &&
                              Number(familyDetails.no_of_sister) === num,
                            )}`}
                          >
                            {num === 5 ? '5+' : num}
                            <input value={num} type="radio" className="w-0" />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {familyDetails.no_of_sister > 0 && (
                    <div>
                      <h1 className="mb-3 text-black font-medium">
                        Married
                      </h1>
                      <div className="flex flex-col">
                        <div className="inline-flex rounded">
                          {[
                            ...Array(
                              Math.min(
                                Number(familyDetails.no_of_sister) + 1 || 0,
                                6,
                              ),
                            ).keys(),
                          ].map((num) => (
                            <label
                              key={num}
                              className={`px-10 py-3 text-sm font-medium border 
cursor-pointer  ${buttonClass(
                                familyDetails.no_of_sis_married !== null &&
                                Number(familyDetails.no_of_sis_married) ===
                                num,
                              )}`}
                            >
                              <input value={num} type="radio" className="w-0" />
                              {num === 5 ? '5+' : num}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-row gap-4">
                {/* <div className="w-full py-1">
                  <Input
                    readOnly
                    value={familyDetails.Pysically_changed}
                    required
                    label={' Physically Challenged'}
                    type={'text'}
                  />
                </div> */}
                <div className="w-full py-1">
                  <label className="block text-[#5a5959e6] font-medium mb-1">
                    Physically Challenged
                  </label>
                  <div className="flex items-center">
                    <label className="flex items-center mr-4">
                      <input
                        type="radio"
                        checked={familyDetails.Pysically_changed === "yes"}
                        readOnly
                        className="mr-2"
                      />
                      Yes
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={familyDetails.Pysically_changed === "no"}
                        readOnly
                        className="mr-2"
                      />
                      No
                    </label>
                  </div>
                </div>
                {familyDetails.Pysically_changed === 'yes' && (
                  <div className="w-full">
                    <Input
                      label={'Challenged Detail'}
                      value={familyDetails.Physically_challenged_details}
                      type={'text'} 
                      readOnly/>
                  </div>
                )}

                <div className="w-full ">
                  <Input
                    readOnly
                    value={familyDetails.property_details}
                    label={'Property Details'}
                    type={'text'}

                  />
                </div>
                <div className="w-full">
                  {/* <label className="block text-black  font-semibold mb-1">
                    Property Worth
                  </label> */}
                  {/* <select
                    disabled
                    value={familyDetails.property_worth}
                    className="outline-none w-full px-4 py-2 text-black font-medium border border-black rounded"
                  >
                    <option value="" className='text-black font-semibold'>Select property worth</option>

                    {propertyworth?.map((property: any) => (
                      <option
                        key={property.property_id}
                        value={property.property_id}
                        className='text-black font-medium'
                      >
                        {property.property_description}
                      </option>
                    ))}
                  </select> */}
                  <Input
                    readOnly
                    value={familyDetails.property_worth}
                    label={'Property Worth'}
                    type={'text'}

                  />
                </div>
              </div>
            </div>

            <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <Input
                  placeholder="Kg"
                  readOnly
                  value={familyDetails.weight === '0' ? "N/A" : familyDetails.weight}
                  label={'weight'}
                  type={'text'}
                  name="weight"
                />
              </div>
              <div className="w-full">
                <label className="block text-[#5a5959e6] font-semibold mb-1">
                  About my Family
                </label>
                <textarea
                  readOnly
                  value={familyDetails.about_family}
                  className="outline-none w-full h-10.5 font-medium  px-4 py-2 border border-[#b5b2b2e6]  text-[#222020e6] rounded"
                ></textarea>
              </div>
              <div className="w-full">
                <Input
                  readOnly
                  value={familyDetails.ancestor_origin}
                  label={'Ancestor Origin'}
                  type={'text'}
                />
              </div>
              {childrenView && (
                <div className='w-full'>
                  <label className="block mb-1 text-base text-[#5a5959e6] font-medium ">
                    Number of Children
                  </label>
                  <div className="relative">
                    <select
                      id="no_of_children"
                      className="outline-none w-full text-placeHolderColor px-3 py-2.5 text-sm border border-[#b5b2b2e6]  text-[#222020e6] rounded appearance-none"
                      // {...register("FamilyDetails.no_of_children")}
                      value={profile[1].no_of_children}
                      //                 {...register("FamilyDetails.no_of_children", {
                      //   valueAsNumber: true, // Convert to number automatically
                      //   setValueAs: (value) => value === "" ? undefined : Number(value),
                      // })}
                      disabled
                    >
                      <option value="" disabled selected>Select Number of Children</option>
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

              <div className="w-full">
                <Input
                  readOnly
                  value={familyDetails.uncle_gothram}
                  label={'Uncle Gothram'}
                  type={'text'}
                />
              </div>
              {/* <div className='w-full mt-1'>
                <label className='block text-black font-medium '>
                  Uncle Gothram (Admin)
                </label>
                <select className='outline-none w-full border border-black text-black font-medium rounded px-4 py-2'>
                  {SuyaGothram?.map((option)=>(
                    <option key={option.id} value={option.id} className='text-black font-semibold truncate'>{option.sanketha_namam}</option>
                  ))}

                </select>
              </div> */}

              <div className="w-full ">
                {/* <label className="block text-black font-medium mb-1">
    Uncle Gothram (Admin)
  </label> */}
                <div className="relative">
                  {/* <select
      className="block w-full max-w-full border border-black text-black font-medium rounded px-3 py-2 text-sm md:text-base truncate"
      size={1}
    >
      {SuyaGothram?.map((option) => (
        <option
          key={option.id}
          value={option.id}
          className="truncate text-black font-semibold"
        >
          {option.sanketha_namam}
        </option>
      ))}
    </select> */}
                  {/* <Select
  options={options}
  className="w-full text-sm border border-black text-black font-medium rounded "
  placeholder="Select Uncle Gothram"
/> */}

                </div>
                <div className="w-full mt-1">
                  <label className="block text-[#5a5959e6] font-medium mb-1">
                    Uncle Gothram (Admin)
                  </label>
                  <div className="relative">
                    <select
                      value={familyDetails.uncle_gothram_admin || "0"}
                      disabled
                      className="outline-none w-full  font-medium border border-[#b5b2b2e6]  text-[#222020e6] rounded px-4 py-2"
                    >
                      <option value="0">Not Selected</option>
                      {SuyaGothram?.map((option) => (
                        <option
                          key={option.id}
                          value={option.id}
                          className="text-black font-semibold"
                        >
                          {option.gothram_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

              <div className="w-full text-black font-medium">
                <Input
                  readOnly
                  value={familyDetails.suya_gothram}
                  label={'Suya Gothram'}
                  showAsterisk={true}
                />
              </div>
              <div className='w-full mt-1'>
                {/* <label className='block text-black font-medium '>
                  Suya Gothram (Admin)
                </label> */}
                {/* <select className='outline-none w-full border border-black text-black font-medium rounded px-4 py-2'>
                  {SuyaGothram?.map((option)=>(
                    <option key={option.id} value={option.id} className='text-black font-semibold'>{option.sanketha_namam}</option>
                  ))}

                </select> */}
                {/* <Select
  options={options}
className="w-full text-sm border border-black text-black font-medium rounded "
  placeholder="Select Suya  Gothram"
/> */}

                <div className="w-full ">
                  <label className="block text-[#5a5959e6] font-medium mb-1">
                    Suya Gothram (Admin)
                  </label>
                  <div className="relative">
                    <select
                      value={familyDetails.suya_gothram_admin || "0"}
                      disabled
                      className="outline-none w-full font-medium border border-[#b5b2b2e6]  text-[#222020e6] rounded px-4 py-2"
                    >
                      <option value="0">Not Selected</option>
                      {SuyaGothram?.map((option) => (
                        <option
                          key={option.id}
                          value={option.id}
                          className="text-black font-semibold"
                        >
                          {option.gothram_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

              </div>

            </div>


          </div>
        )}
      </div>
    </div>
  );
};

export default ViewFamilyDetailsForm;

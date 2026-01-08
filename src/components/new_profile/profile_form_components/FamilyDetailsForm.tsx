import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { FormValues } from '../AddProfile';
import Input from '../../Fromfield/Inputfield';
import {
  fetchFamilyTypes,
  FamilyValue,
  fetchFamilyValues,
  fetchFamilyStatus,
  FamilyStatus,
  fetchPropertyworth,
  fetchSuyaGothram,
} from '../../../action';
fetchFamilyStatus;
import { useForm, useFormContext } from 'react-hook-form';
import { bloodGroups } from '../../../scema';
import FamilyForm, { FamilyType } from './util/familyDetailsButtonGroup';
import { useQuery } from '@tanstack/react-query';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { IoMdArrowDropdown } from 'react-icons/io';

interface FamilyDetailsDetails {
  familyType?: string;
  familyValue?: string;
  familyStatus?: string;
  brother: number;
  marriedBrother: number;
  sister: number;
  marriedSister: number;
}

interface pageProp {
  setFamilyName: Dispatch<SetStateAction<string>>;
  setAboutMyFamily: Dispatch<SetStateAction<string>>;
  // setSelectedBrother: Dispatch<SetStateAction<number>>;
  // selectedBrother: number;
  setSelectedFamilyValues: Dispatch<SetStateAction<string>>;
  selectedFamilyValues: string;
  setSelectedFamilyType: Dispatch<SetStateAction<string>>;
  selectedFamilyType: string;
  selectedFamilyStatus: string;
  setSelectedFamilyStatus: Dispatch<SetStateAction<string>>;
  setPropertyDetail: Dispatch<SetStateAction<string>>;
  setPropertyWorth: Dispatch<SetStateAction<string>>;
  setSuyaGothram: Dispatch<SetStateAction<string>>;
  setUncleGothram: Dispatch<SetStateAction<string>>;
  setAnchesterOrgin: Dispatch<SetStateAction<string>>;
  setWeight: Dispatch<SetStateAction<string>>;
  weight: string;
  isFamilyDetailsOpen: boolean,
  setIsFamilyDetailsOpen: Dispatch<SetStateAction<boolean>>
  maritalStatusProbs: string

}
const FamilyDetailsForm: React.FC<pageProp> = ({
  setFamilyName,
  setAboutMyFamily,
  setIsFamilyDetailsOpen,
  isFamilyDetailsOpen,
  // setSelectedBrother,
  // selectedBrother,
  setSelectedFamilyValues,
  setSelectedFamilyType,
  selectedFamilyValues,
  selectedFamilyType,
  setSelectedFamilyStatus,
  selectedFamilyStatus,
  setPropertyWorth,
  setSuyaGothram,
  setUncleGothram,
  setPropertyDetail,
  setAnchesterOrgin,
  setWeight,
  maritalStatusProbs
}) => {
  const { setValue } = useForm<FamilyDetailsDetails>();
  const [familyTypes, setFamilyTypes] = useState<FamilyType[]>([]);
  const [familyValues, setFamilyValues] = useState<FamilyValue[]>([]);
  const [familyStatus, setFamilyStatus] = useState<FamilyStatus[]>([]);
  // Add these near the other state declarations at the top of the component
  const [fatherAlive, setFatherAlive] = useState<string>('');
  const [motherAlive, setMotherAlive] = useState<string>('');

  // const [isFamilyDetailsOpen, setIsFamilyDetailsOpen] = useState(true);
  const toggleSection2 = () => {
    setIsFamilyDetailsOpen(!isFamilyDetailsOpen);
  };
  const {
    watch,
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const { data: propertyworth } = useQuery({
    queryKey: [' propertyworth'],
    queryFn: fetchPropertyworth,
  });
  useEffect(() => {
    const getFamilyTypes = async () => {
      const types = await fetchFamilyTypes();
      setFamilyTypes(types);
    };

    getFamilyTypes();
  }, []);

  useEffect(() => {
    const getFamilyValues = async () => {
      const types = await fetchFamilyValues();
      setFamilyValues(types);
    };

    getFamilyValues();
  }, []);

  useEffect(() => {
    const getFamilyStatus = async () => {
      const types = await fetchFamilyStatus();
      setFamilyStatus(types);
    };

    getFamilyStatus();
  }, []);

  // const handleBrotherChange = (num: number) => {
  //   setSelectedBrother(num);
  //   // setSelectedMarriedBrother(0); // Reset married brother count when changing brother count
  // };

  const buttonClass = (isSelected: boolean) =>
    isSelected ? 'bg-blue-500 text-white' : '';
  const handleValueSelection = (id: string) => {
    setSelectedFamilyValues(id);
  };

  const handleStatusSelection = (id: string) => {
    setSelectedFamilyStatus(id);
  };
  const handleTypeSelection = (id: string) => {
    setSelectedFamilyType(id);
  };
  const selectedBrother = watch('FamilyDetailsForm.selectedBrother');
  const marriedBrother = watch('FamilyDetailsForm.marriedBrother');
  const selectedSister = watch('FamilyDetailsForm.selectedSister');
  const marriedSisters = watch('FamilyDetailsForm.marriedSisters');
  const physicallyChalanged = watch('FamilyDetailsForm.physicallyChalanged');

  const { data: SuyaGothram } = useQuery({
    queryKey: ['SuyaGothram'],
    queryFn: fetchSuyaGothram
  })
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
            {/* <div className="flex w-full flex-row gap-4 max-md:flex-col"> */}
            <div className="flex w-full flex-row gap-4 sm:flex-col md:flex-row lg:flex-row">

              <div className="w-full">
                <Input
                  required
                  label={'Father name'}
                  showAsterisk={true}
                  // name="father_name"
                  {...register('FamilyDetailsForm.fathername')}
                />
                {errors?.FamilyDetailsForm?.fathername && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.fathername.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="block mb-1 font-bold text-black">
                  Father Occupation
                </label>
                <Input
                  required
                  label={''}
                  {...register('FamilyDetailsForm.fatherOccupation')}
                />

                {errors?.FamilyDetailsForm?.fatherOccupation && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.fatherOccupation.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              <div className="w-full">
                <Input
                  required
                  label={'Mother name'}
                  {...register('FamilyDetailsForm.motherName')}
                />
                {errors?.FamilyDetailsForm?.motherName && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.motherName.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input
                  required
                  label={'Mother Occupation'}
                  {...register('FamilyDetailsForm.motherOccupation')}
                />

                {errors?.FamilyDetailsForm?.motherOccupation && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.motherOccupation.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              <div className="w-full">
                <Input
                  label={'Family name'}
                  type={'text'}
                  // name="family_name"
                  {...register('FamilyDetailsForm.family_name')}
                // onChange={(e) => setFamilyName(e.target.value)}
                />
                {errors?.FamilyDetailsForm?.family_name && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.family_name.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input
                  required
                  label={'About Myself'}
                  type={'text'}
                  {...register('FamilyDetailsForm.aboutMyself')}
                />
                {errors?.FamilyDetailsForm?.aboutMyself && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.aboutMyself.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              <div className="w-full">
                <Input
                  required
                  label={'My Hobbies'}
                  {...register('FamilyDetailsForm.MyHobbies')}
                // {...register('hobbies')}
                />
                {errors?.FamilyDetailsForm?.MyHobbies && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.MyHobbies.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="block text-black font-medium mb-1">
                  Blood Group
                </label>
                <select
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                  {...register('FamilyDetailsForm.bloodGroup')}
                >
                  <option value="" selected>
                    Select Blood Group
                  </option>
                  {bloodGroups.map((group) => (
                    <option key={group.type} value={group.abbreviation}>
                      {group.abbreviation}
                    </option>
                  ))}
                </select>
                {errors?.FamilyDetailsForm?.bloodGroup && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.bloodGroup.message}
                  </p>
                )}
              </div>
              {maritalStatusProbs && (
                <div className='w-full'>
                  <label className="block mb-1 text-base text-black font-medium ">
                    Number of Children
                  </label>
                  <div className="relative">
                    <select
                      id="no_of_children"
                      className="outline-none w-full text-placeHolderColor px-3 py-2.5 text-sm border border-ashBorder rounded appearance-none"
                      // {...register("FamilyDetails.no_of_children")}

                      {...register("FamilyDetailsForm.no_of_children",
                        {
                          valueAsNumber: true, // Convert to number automatically
                          setValueAs: (value) => value === "" ? undefined : Number(value),
                        })}
                      defaultValue={0}
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
                  {errors?.FamilyDetailsForm?.no_of_children && (
                    <p className="text-red-600">
                      {errors.FamilyDetailsForm.no_of_children.message}
                    </p>
                  )}
                </div>
              )}
            </div>


            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              <div className="w-full py-1">
                <label className="block text-black font-medium mb-1">
                  Father Alive
                </label>
                <div className="flex items-center">
                  <label className="flex items-center mr-4">
                    <input
                      type="radio"
                      value="yes"
                      //  checked={fatherAlive === 'yes'}
                      // onChange={() => setFatherAlive('yes')}
                      className="mr-2"
                      {...register('FamilyDetailsForm.fatherAlive')}
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="no"
                      // checked={fatherAlive === 'no'}
                      //  onChange={() => setFatherAlive('no')}
                      className="mr-2"
                      {...register('FamilyDetailsForm.fatherAlive')}
                    />
                    No
                  </label>
                </div>
                {errors?.FamilyDetailsForm?.fatherAlive && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.fatherAlive.message}
                  </p>
                )}
              </div>

              <div className="w-full py-1">
                <label className="block text-black font-medium mb-1">
                  Mother Alive
                </label>
                <div className="flex items-center">
                  <label className="flex items-center mr-4">
                    <input
                      type="radio"
                      value="yes"
                      //  checked={motherAlive === 'yes'}
                      // onChange={() => setMotherAlive('yes')}
                      className="mr-2"
                      {...register('FamilyDetailsForm.motherAlive')}
                    />
                    Yes
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="no"
                      // checked={motherAlive === 'no'}
                      //   onChange={() => setMotherAlive('no')}
                      className="mr-2"
                      {...register('FamilyDetailsForm.motherAlive')}
                    />
                    No
                  </label>
                </div>
                {errors?.FamilyDetailsForm?.motherAlive && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.motherAlive.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="flex w-full flex-row gap-4 max-md:flex-col">
                <div className="w-full py-1">
                  <label className="block text-black font-medium mb-1">
                    Family Type
                  </label>
                  <div className="w-full inline-flex rounded max-md:flex-col">
                    {familyTypes.map((type) => (
                      <label
                        key={type.family_id}
                        className={`w-full px-5 py-3 text-sm font-medium border text-center cursor-pointer  ${selectedFamilyType === type.family_id
                          ? 'bg-blue-500 text-white'
                          : ''
                          }`}
                        onClick={() => handleTypeSelection(type.family_id)}
                      >
                        <input
                          value={type.family_id}
                          {...register('FamilyDetailsForm.FamilyType')}
                          type="radio"
                          className="w-0"
                        />
                        {type.family_description}
                      </label>
                    ))}
                  </div>
                  {errors?.FamilyDetailsForm?.FamilyType && (
                    <p className="text-red-600">{errors.FamilyDetailsForm.FamilyType.message}</p>
                  )}
                </div>

                <div className="w-full py-1">
                  <label className="block text-black font-medium mb-1">
                    Family Value
                  </label>
                  <div className="w-full inline-flex rounded max-md:flex-col">
                    {familyValues.map((value) => (
                      <label
                        key={value.family_value_id}
                        className={`w-full px-5 py-3 text-sm font-medium border cursor-pointer ${selectedFamilyValues === value.family_value_id
                          ? 'bg-blue-500 text-white'
                          : ''
                          }`}
                        onClick={() =>
                          handleValueSelection(value.family_value_id)
                        }
                      >
                        <input
                          value={value.family_value_id}
                          {...register('FamilyDetailsForm.FamilyValue')}
                          type="radio"
                          className="w-0"
                        />

                        {value.family_value_name}
                      </label>
                    ))}
                  </div>
                  {errors?.FamilyDetailsForm?.FamilyValue && (
                    <p className="text-red-600">{errors.FamilyDetailsForm.FamilyValue.message}</p>
                  )}
                </div>
              </div>

              <div className="w-full py-1">
                <label className="block text-black font-medium mb-1">
                  Family Status
                </label>
                <div className="w-full inline-flex rounded max-md:flex-col">
                  {familyStatus.map((status) => (
                    <label
                      key={status.family_status_id}
                      className={`w-full px-5 py-3 text-sm font-medium border cursor-pointer ${selectedFamilyStatus === status.family_status_id
                        ? 'bg-blue-500 text-white'
                        : ''
                        }`}
                      onClick={() =>
                        handleStatusSelection(status.family_status_id)
                      }
                    >
                      <input
                        value={status.family_status_id}
                        {...register('FamilyDetailsForm.FamilyStatus')}
                        type="radio"
                        className="w-0"
                      />
                      {status.family_status_name}
                    </label>
                  ))}
                </div>
                {errors?.FamilyDetailsForm?.FamilyStatus && (
                  <p className="text-red-600">{errors.FamilyDetailsForm.FamilyStatus.message}</p>
                )}
              </div>

              {/* <div className="mt-3 flex items-center gap-5 max-md:flex-col max-md:items-start"> */}
              <div className="mt-3 grid grid-cols-2 max-md:grid-cols-1">
                <div>
                  <h1 className="block text-black font-medium mb-1">
                    Brother
                  </h1>
                  <div className="flex flex-col ">
                    <div className="inline-flex rounded max-md:flex-wrap">
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <label
                          key={num}
                          className={`px-8 py-3 text-sm font-medium border text-center cursor-pointer max-md:px-3 ${buttonClass(
                            selectedBrother !== null &&
                            Number(selectedBrother) === num,
                          )}`}
                        >
                          <input
                            value={num}
                            type="radio"
                            {...register('FamilyDetailsForm.selectedBrother')}
                            className="w-0"
                          />
                          {num === 5 ? '5+' : num}
                        </label>
                      ))}
                    </div>
                    {errors?.FamilyDetailsForm?.selectedBrother && (
                      <p className="text-red-600">
                        {errors.FamilyDetailsForm.selectedBrother.message}
                      </p>
                    )}
                  </div>
                </div>

                {selectedBrother !== null && Number(selectedBrother) > 0 && (
                  <div className='w-full'>
                    <h1 className="mb-3">
                      Married
                    </h1>
                    <div className="flex flex-col ">
                      <div className="inline-flex rounded ">
                        {[
                          ...Array(
                            Math.min(Number(selectedBrother) + 1, 6),
                          ).keys(),
                        ].map((num) => (
                          <label
                            key={num}
                            className={`px-10 py-3 text-sm font-medium border cursor-pointer max-md:px-3 ${buttonClass(
                              marriedBrother !== null &&
                              Number(marriedBrother) === num,
                            )}`}
                          >
                            <input
                              value={num}
                              type="radio"
                              {...register('FamilyDetailsForm.marriedBrother')}
                              className="w-0"
                            />
                            {num === 5 ? '5+' : num}
                          </label>
                        ))}
                      </div>
                    </div>
                    {errors?.FamilyDetailsForm?.marriedBrother && (
                      <p className="text-red-600">
                        {errors.FamilyDetailsForm.marriedBrother.message}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 max-md:grid-cols-1">
                <div>
                  <h1 className="block text-black font-medium mb-1">
                    Sister
                  </h1>
                  <div className="flex flex-col">
                    <div className="inline-flex rounded">
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <label
                          key={num}
                          className={`px-8 py-3 text-sm font-medium border cursor-pointer max-md:px-3 ${buttonClass(
                            selectedSister !== null &&
                            Number(selectedSister) === num,
                          )}`}
                        >
                          {num === 5 ? '5+' : num}
                          <input
                            value={num}
                            {...register('FamilyDetailsForm.selectedSister')}
                            type="radio"
                            className="w-0"
                          />
                        </label>
                      ))}
                    </div>
                    {errors?.FamilyDetailsForm?.selectedSister && (
                      <p className="text-red-600">
                        {errors.FamilyDetailsForm.selectedSister.message}
                      </p>
                    )}
                  </div>
                </div>

                {selectedSister !== null && Number(selectedSister) > 0 && (
                  <div>
                    <h1 className="mb-3">
                      Married
                    </h1>
                    <div className="flex flex-col">
                      <div className="inline-flex rounded">
                        {[
                          ...Array(
                            Math.min(Number(selectedSister) + 1, 6),
                          ).keys(),
                        ].map((num) => (
                          <label
                            key={num}
                            className={`px-10 py-3 text-sm font-medium border cursor-pointer max-md:px-3 ${buttonClass(
                              marriedSisters !== null &&
                              Number(marriedSisters) === num,
                            )}`}
                          >
                            <input
                              value={num}
                              {...register('FamilyDetailsForm.marriedSisters')}
                              type="radio"
                              className="w-0"
                            />
                            {num === 5 ? '5+' : num}
                          </label>
                        ))}
                      </div>
                      {errors?.FamilyDetailsForm?.marriedSisters && (
                        <p className="text-red-600">
                          {errors.FamilyDetailsForm.marriedSisters.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex w-full flex-row gap-4 max-md:flex-col">
                {/* <div className="w-full py-1">
                  <label className="block text-black font-medium mb-1">
                    Physically Challenged{' '}

                  </label>

                  <input
                    type="radio"
                    value="yes"
                    {...register('FamilyDetailsForm.physicallyChalanged')}
                  />

                  <label className="text-black px-4">Yes</label>

                  <input
                    type="radio"
                    value="no"
                    {...register('FamilyDetailsForm.physicallyChalanged')}
                  />
                  <label className="text-black px-4">No</label>
                  {errors?.FamilyDetailsForm?.physicallyChalanged && (
                    <p className="text-red-600">
                      {errors.FamilyDetailsForm.physicallyChalanged.message}
                    </p>
                  )}
                </div> */}

                <div className="flex w-full gap-4 max-md:flex-col">
                  <div className="w-1/2 max-md:w-full py-1">
                    <label className="block text-black font-medium mb-1">
                      Physically Challenged{' '}
                    </label>
                    <div className='flex items-center'>
                      {/* Wrap input and text in a label for clickability */}
                      <label className="text-black px-4 cursor-pointer">
                        <input
                          type="radio"
                          value="yes"
                          className='mr-2'
                          {...register('FamilyDetailsForm.physicallyChalanged')}
                        />
                        Yes
                      </label>

                      <label className="text-black px-4 cursor-pointer">
                        <input
                          type="radio"
                          value="no"
                          className='mr-2'
                          {...register('FamilyDetailsForm.physicallyChalanged')}
                        />
                        No
                      </label>
                    </div>
                    {errors?.FamilyDetailsForm?.physicallyChalanged && (
                      <p className="text-red-600">
                        {errors.FamilyDetailsForm.physicallyChalanged.message}
                      </p>
                    )}
                  </div>

                  {/* Make the check lowercase to match the radio button value */}
                  {/* {physicallyChalanged === 'yes' && (
    <div className="w-full">
        <Input 
            label={'Challenged Details'} 
            type={'text'} 
            // Also register this field so its value can be saved if needed
            {...register('FamilyDetailsForm.Pysically_changed')}
        />
    </div>
)} */}

                  {physicallyChalanged === 'yes' ? (
                    <div className="w-1/2 max-md:w-full">
                      <Input
                        label="Challenged Detail"
                        type="text"
                        {...register('FamilyDetailsForm.physicallyChallengedDetails')}
                      />
                      {errors?.FamilyDetailsForm?.physicallyChallengedDetails && (
                        <p className="text-red-600">
                          {errors.FamilyDetailsForm.physicallyChallengedDetails.message}
                        </p>
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                </div>
                <div className="w-full">
                  <div className='flex items-center'>
                    <label className="block text-black font-medium mb-1">
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
                    //  onChange={(e) => setPropertyDetail(e.target.value)}
                    label={''}
                    type={'text'}
                    {...register('FamilyDetailsForm.PropertyDetails')}
                  />
                  {errors?.FamilyDetailsForm?.PropertyDetails && (
                    <p className="text-red-600">
                      {errors.FamilyDetailsForm.PropertyDetails.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="flex w-full flex-row gap-4 max-md:flex-col">

              <div className="w-full">

                <div className='flex items-center'>
                  <label className="block text-black font-medium mb-1">
                    Property Worth
                  </label>
                  <div className="relative inline-block ml-2 group">
                    <AiOutlineInfoCircle className="text-primary align-middle" />
                    {/* Tooltip */}
                    <div className="absolute hidden group-hover:flex flex-col bg-white border border-ashSecondary rounded shadow-md p-2 w-48 z-10">
                      <p className="text-sm text-black">
                        Approx 1c, 5c, 50c, 30L, 80L, etc.,
                      </p>
                    </div>
                  </div>
                </div>
                <Input
                  //onChange={(e) => setPropertyWorth(e.target.value)}
                  type={'text'} label={''}
                  {...register('FamilyDetailsForm.PropertyWorth')}
                />
                {errors?.FamilyDetailsForm?.PropertyWorth && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.PropertyWorth.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label className="block text-black font-medium mb-1">
                  Eye wear
                </label>
                <select
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                  {...register('FamilyDetailsForm.EyeWear')}
                >
                  <option value="">
                    Select Eye Wear
                  </option>
                  <option value="Unknown">Unknown</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors?.FamilyDetailsForm?.EyeWear && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.EyeWear.message}
                  </p>
                )}
              </div>



            </div>
            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              <div className="w-full">
                <Input
                  label={'Uncle Gothram'}
                  type={'text'}
                  // onChange={(e) => setUncleGothram(e.target.value)}
                  {...register('FamilyDetailsForm.UncleGothram')}
                />
                {errors?.FamilyDetailsForm?.UncleGothram && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.UncleGothram.message}
                  </p>
                )}
              </div>


              <div className='w-full  mt-1'>
                <label className='block text-black font-medium'>
                  Uncle Gothram (Admin)
                </label>
                <select
                  className='outline-none w-full border border-black rounded px-4 py-2'
                  // value={uncleGothramAdmin}
                  // onChange={(e) => setUncleGothramAdmin(e.target.value)}
                  {...register('FamilyDetailsForm.uncleGothramAdmin')}
                >
                  <option value="0">Select Uncle Gothram</option>
                  {SuyaGothram?.map((option) => (
                    <option key={option.id} value={option.id}>{option.gothram_name}</option>
                  ))}
                </select>
                {errors?.FamilyDetailsForm?.uncleGothramAdmin && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.uncleGothramAdmin.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input
                  label={'Suya Gothram'}
                  showAsterisk={true}
                  //onChange={(e) => setSuyaGothram(e.target.value)}
                  {...register('FamilyDetailsForm.SuyaGothram')}
                />
                {errors?.FamilyDetailsForm?.SuyaGothram && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.SuyaGothram.message}
                  </p>
                )}
              </div>

              <div className='w-full mt-1'>
                <label className='block text-black font-medium'>
                  Suya Gothram (Admin)
                </label>
                <select
                  className='outline-none w-full border border-black rounded px-4 py-2'
                  // value={suyaGothramAdmin}
                  // onChange={(e) => setSuyaGothramAdmin(e.target.value)}
                  {...register('FamilyDetailsForm.suyaGothramAdmin')}
                >
                  <option value="0">Select Suya Gothram</option>
                  {SuyaGothram?.map((option) => (
                    <option key={option.id} value={option.id}>{option.gothram_name}</option>
                  ))}
                </select>
                {errors?.FamilyDetailsForm?.suyaGothramAdmin && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.suyaGothramAdmin.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              <div className="w-full">
                <Input
                  placeholder="Kg"
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
                  label={'weight'}
                  type={'text'}
                  {...register('FamilyDetailsForm.weight')}
                // name="weight"
                // onChange={(e) => setWeight(e.target.value)}
                />
                {errors?.FamilyDetailsForm?.weight && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.weight.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <Input
                  label={'Ancestor Origin'}
                  type={'text'}
                  onChange={(e) => setAnchesterOrgin(e.target.value)}

                // {...register('FamilyDetailsForm.AncestorOrigin')}
                />
                {/* {errors?.FamilyDetailsForm?.AncestorOrigin && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.AncestorOrigin.message}
                  </p>
                )} */}
              </div>
            </div>
            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              <div className="w-2/4">
                <label className="block text-black font-medium mb-1">
                  About my Family
                </label>
                <textarea
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                  // onChange={(e) => setAboutMyFamily(e.target.value)}
                  {...register('FamilyDetailsForm.AboutMyFamily')}
                ></textarea>
                {errors?.FamilyDetailsForm?.AboutMyFamily && (
                  <p className="text-red-600">
                    {errors.FamilyDetailsForm.AboutMyFamily.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyDetailsForm;

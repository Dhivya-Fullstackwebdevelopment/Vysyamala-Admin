import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import AmsamGrid from '../../HoroDetails/AmsamGrid';
import RasiGrid from '../../HoroDetails/RasiGrid';
import { useQuery } from '@tanstack/react-query';
import {
  fetchBirthStar,
  fetchRasi,
  fetchLagnam,
  getDasaName,
} from '../../../action';
import { FormValues } from '../AddProfile';
import { useFormContext } from 'react-hook-form';

interface hororScopeProp {
  setBirthStarId: Dispatch<SetStateAction<string>>;
  setAmsaKattam: Dispatch<SetStateAction<string>>;
  setRasiKattam: Dispatch<SetStateAction<string>>;
  setHoroHint: Dispatch<SetStateAction<string>>;
  setDasaName: Dispatch<SetStateAction<string>>;
  setIsHoroscopeDetailsOpen: Dispatch<SetStateAction<boolean>>;
  setRasiId: React.Dispatch<React.SetStateAction<string>>;
  isHoroscopeDetailsOpen: boolean;
}

const HororScopeDetails: React.FC<hororScopeProp> = ({
  setAmsaKattam,
  setRasiKattam,
  setHoroHint,
  setDasaName,
  setRasiId,
  setBirthStarId,
  isHoroscopeDetailsOpen,
  setIsHoroscopeDetailsOpen,
}) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<FormValues>();

  const selectedBirthStarId = watch('HororScopeDetails.BirthStar');
  const selectBirtRasiId = watch('HororScopeDetails.Rasi');
  const birthTime = watch('HororScopeDetails.timeOfBirth');
  console.log(birthTime, 'birthTime');
  const toggleSection4 = () => {
    setIsHoroscopeDetailsOpen(!isHoroscopeDetailsOpen);
  };

  const { data: BirthStar } = useQuery({
    queryKey: ['BirthStar'],
    queryFn: fetchBirthStar,
  });
  const { data: Rasi } = useQuery({
    queryKey: [selectedBirthStarId, 'Rasi'],
    queryFn: () => fetchRasi(selectedBirthStarId),
    enabled: !!selectedBirthStarId,
  });
  const { data: lagnam } = useQuery({
    queryKey: ['lagnam'],
    queryFn: fetchLagnam,
  });
  const { data: Dasa } = useQuery({
    queryKey: ['Dasa'],
    queryFn: getDasaName,
  });

  const [rasiContent, setRasiContent] = useState<string>('');
  const [amsamContent, setAmsamContent] = useState<string>('');


  // const handleTimeChange = () => {
  //   const hour = hours;
  //   const minute = minutes;
  //   const period = periods;

  //   let formattedHour = parseInt(hour, 10);
  //   if (period === 'PM' && formattedHour < 12) {
  //     formattedHour += 12;
  //   } else if (period === 'AM' && formattedHour === 12) {
  //     formattedHour = 0;
  //   }

  //   const formattedTime = `${formattedHour
  //     .toString()
  //     .padStart(2, '0')}:${minute}`;
  //   setValue('HororScopeDetails.timeOfBirth', formattedTime);
  // };


  // // In HororScopeDetails component
  // const handleTimeChange = () => {
  //   if (!hours || !minutes || !periods) return;

  //   let formattedHour = parseInt(hours, 10);
  //   if (periods === 'PM' && formattedHour < 12) {
  //     formattedHour += 12;
  //   } else if (periods === 'AM' && formattedHour === 12) {
  //     formattedHour = 0;
  //   }

  //   const formattedTime = `${formattedHour.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  //   setValue('HororScopeDetails.timeOfBirth', formattedTime);
  // };


  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [period, setPeriod] = useState('AM');

  // This function combines the selected time values and updates the form state.
  const handleTimeChange = () => {
    if (hours && minutes && period) {
      const combinedTime = `${hours}:${minutes} ${period}`;
      // Set the value for react-hook-form so it can be submitted
      setValue("HororScopeDetails.timeOfBirth", combinedTime, { shouldValidate: true });
    }
  };

  // This useEffect triggers the time update whenever one of the dropdowns changes.
  useEffect(() => {
    handleTimeChange();
  }, [hours, minutes, period, setValue]);

  // Add this useEffect to initialize time if needed
  // useEffect(() => {
  //   const time = watch('HororScopeDetails.timeOfBirth');
  //   if (time) {
  //     const [hourStr, minuteStr] = time.split(':');
  //     let hour = parseInt(hourStr, 10);
  //     let period = 'AM';

  //     if (hour >= 12) {
  //       period = 'PM';
  //       if (hour > 12) hour -= 12;
  //     } else if (hour === 0) {
  //       hour = 12;
  //     }

  //     sethour(hour.toString().padStart(2, '0'));
  //     setminute(minuteStr);
  //     setperiod(period);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (hours && minutes && periods) {
  //     handleTimeChange();
  //   }
  // }, [hours, minutes, periods]);
  const onRasiContentsChange = (newContent: any) => {
    setRasiContent(newContent);
  };

  const onAmsamContentsChange = (newContent: any) => {
    setAmsamContent(newContent);
  };
  useEffect(() => {
    setBirthStarId(selectedBirthStarId);
    setRasiId(selectBirtRasiId)
    setAmsaKattam(amsamContent);
    setRasiKattam(rasiContent);
  }, [selectedBirthStarId, rasiContent, amsamContent]);
  // console.log(rasiContent, 'rasiContent');
  // console.log(amsamContent, 'amsamContent');

  // Watch the three Dasa Balance fields
  const dasaYear = watch('HororScopeDetails.dhasaBalanceYear');
  const dasaMonth = watch('HororScopeDetails.dhasaBalanceMonth');
  const dasaDay = watch('HororScopeDetails.dhasaBalanceDay');

  // Use an effect to manage the logic
  useEffect(() => {
    // Check if any field has a meaningful value (not '' or '0')
    const isAnyFieldSet =
      (dasaYear && dasaYear !== '0') ||
      (dasaMonth && dasaMonth !== '0') ||
      (dasaDay && dasaDay !== '0');

    // Prevent this logic from running on initial load before values are set
    if (dasaYear === undefined || dasaMonth === undefined || dasaDay === undefined) {
      return;
    }

    if (isAnyFieldSet) {
      // If at least one field is set, ensure others default to '0' instead of ''
      if (dasaYear === '' || dasaYear === undefined) {
        setValue('HororScopeDetails.dhasaBalanceYear', '0', { shouldValidate: true });
      }
      if (dasaMonth === '' || dasaMonth === undefined) {
        setValue('HororScopeDetails.dhasaBalanceMonth', '0', { shouldValidate: true });
      }
      if (dasaDay === '' || dasaDay === undefined) {
        setValue('HororScopeDetails.dhasaBalanceDay', '0', { shouldValidate: true });
      }
    } else {
      // If all fields have been cleared by the user, reset any '0' values back to ''
      if (dasaYear === '0') {
        setValue('HororScopeDetails.dhasaBalanceYear', '', { shouldValidate: true });
      }
      if (dasaMonth === '0') {
        setValue('HororScopeDetails.dhasaBalanceMonth', '', { shouldValidate: true });
      }
      if (dasaDay === '0') {
        setValue('HororScopeDetails.dhasaBalanceDay', '', { shouldValidate: true });
      }
    }
  }, [dasaYear, dasaMonth, dasaDay, setValue]);

  return (
    <div>
      <div className="bg-white p-5 mb-10 rounded shadow-md">
        <h4
          className="text-red-600 flex row items-center justify-between text-xl font-semibold  dark:text-white cursor-pointer  after-red-line::after"
          onClick={toggleSection4}
        >
          Horoscope Details
          <svg
            className={`fill-current transform ${isHoroscopeDetailsOpen ? 'rotate-180' : ''
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
        {isHoroscopeDetailsOpen && (
          <div className="flex flex-col gap-5 pt-2">
            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              <div className="w-full">
                <label className="block text-black font-semibold mb-1">
                  Time of Birth
                </label>
                <div className="flex items-center space-x-2">
                  <select value={hours} onChange={(e) => setHours(e.target.value)} className="px-3 py-2 border rounded border-gray-500 w-full">
                    <option value="" >Hour</option>
                    {Array.from({ length: 12 }, (_, i) => (<option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>{(i + 1).toString().padStart(2, '0')}</option>))}
                  </select>
                  <span>:</span>
                  <select value={minutes} onChange={(e) => setMinutes(e.target.value)} className="px-3 py-2 border rounded border-gray-500 w-full">
                    <option value="" >Min</option>
                    {Array.from({ length: 60 }, (_, i) => (<option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>))}
                  </select>
                  <select value={period} onChange={(e) => setPeriod(e.target.value)} className="px-3 py-2 border rounded border-gray-500">

                    <option value="AM">AM</option><option value="PM">PM</option>
                  </select>
                </div>
                {/* Hidden input to store the combined time for react-hook-form */}
                <input
                  type="hidden"
                  {...register('HororScopeDetails.timeOfBirth', { required: "Time is required" })}
                />
                {errors?.HororScopeDetails?.timeOfBirth && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.timeOfBirth.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="place_of_birth"
                  className="block text-black font-medium mb-1"
                >
                  Place of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  id="place_of_birth"
                  type="text"
                  {...register('HororScopeDetails.PlaceofBirth')}
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                />
                {errors?.HororScopeDetails?.PlaceofBirth && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.PlaceofBirth.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              {/* Birth Star Selector - Takes 3/4 of the width */}
              <div className="w-3/4 max-md:w-full">
                <label
                  htmlFor="birthstar_name"
                  className="block text-black font-medium mb-1"
                >
                  Birth Star <span className="text-red-500">*</span>
                </label>
                <select
                  id="birthstar_name"
                  //   value={birthStarId}
                  {...register('HororScopeDetails.BirthStar')}
                  // onChange={handleBirthStarChange}
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                >
                  <option value="" >
                    Select your Birth Star
                  </option>

                  {BirthStar?.map((option: any) => (
                    <option key={option.birth_id} value={option.birth_id}>
                      {option.birth_star}
                    </option>
                  ))}
                </select>
                {errors?.HororScopeDetails?.BirthStar && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.BirthStar.message}
                  </p>
                )}
              </div>
              <div className="w-1/4 max-md:w-full">
                <label htmlFor="padham" className="block text-black font-medium mb-1">
                  Padham
                </label>
                <select
                  id="padham"
                  {...register('HororScopeDetails.padham', { valueAsNumber: true })}
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className="w-full">
                <label
                  htmlFor="birth_rasi_name"
                  className="block text-black font-medium mb-1"
                >
                  Rasi <span className="text-red-500">*</span>
                </label>
                <select
                  id="birth_rasi_name"
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                  {...register('HororScopeDetails.Rasi')}
                >
                  <option value="" selected >
                    Select your Rasi
                  </option>
                  {Rasi?.map((option: any) => (
                    <option key={option.rasi_id} value={option.rasi_id}>
                      {option.rasi_name}
                    </option>
                  ))}
                </select>
                {errors?.HororScopeDetails?.Rasi && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.Rasi.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              <div className="w-full">
                <label
                  htmlFor="lagnam"
                  className="block text-black font-medium mb-1"
                >
                  Lagnam
                </label>
                <select
                  id="lagnam"
                  {...register('HororScopeDetails.lagnam')}
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                >
                  <option value="" >
                    -- Select your Lagnam
                  </option>
                  {lagnam?.map((option: any) => (
                    <option key={option.didi_id} value={option.didi_id}>
                      {option.didi_description}
                    </option>
                  ))}
                </select>
                {errors?.HororScopeDetails?.lagnam && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.lagnam.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="chevvai_dosaham"
                  className="block text-black font-medium mb-1"
                >
                  Chevvai Dhosam
                </label>
                <select
                  id="chevvai_dosaham"
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                  {...register('HororScopeDetails.ChevvaiDhosam')}
                  defaultValue=""
                >
                  <option value="" >
                    Select Chevvai Dhosam
                  </option>
                  <option value="UnKnown">UnKnown</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
                {errors?.HororScopeDetails?.ChevvaiDhosam && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.ChevvaiDhosam.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              <div className="w-full">
                <label
                  htmlFor="ragu_dosham"
                  className="block text-black font-medium mb-1"
                >
                  Sarpa Dhosham
                </label>
                <select
                  id="ragu_dosham"
                  {...register('HororScopeDetails.SarpaDhosham')}
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                  defaultValue="" // Ensure that this sets the initial value to the placeholder
                >
                  <option value="" >
                    Select Sarpa Dhosham
                  </option>
                  <option value="Unknown">Unknown</option> {/* Correct typo */}
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>

                {errors?.HororScopeDetails?.SarpaDhosham && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.SarpaDhosham.message}
                  </p>
                )}
              </div>

              <div className="w-full">
                <label
                  htmlFor="nalikai"
                  className="block text-black font-medium mb-1"
                >
                  Naalikai
                </label>
                <input
                  id="nalikai"
                  type="text"
                  {...register('HororScopeDetails.nalikai')}
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                />
                {errors?.HororScopeDetails?.nalikai && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.nalikai.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-row gap-4 max-md:flex-col">
              <div className="w-2/4 max-md:w-full">
                <label htmlFor="dasa_name" className="block mb-1">
                  Dasa Name
                </label>
                <select
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                  id="dasaDropdown"
                  defaultValue=""
                  // onChange={(e) => setDasaName(e.target.value)}
                  {...register('HororScopeDetails.dasa_name')}
                >
                  <option value="" selected >
                    Select Dasa Name
                  </option>

                  {Dasa?.map((dasa: any, index: any) => (
                    <option key={index} value={dasa.dasa_description}>
                      {dasa.dasa_description}
                    </option>
                  ))}
                </select>

                {errors?.HororScopeDetails?.dasa_name && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.dasa_name.message}
                  </p>
                )}
              </div>

              <div className="w-2/4 max-md:w-full">
                <label htmlFor="dasaBalance" className="block mb-1">
                  Dasa Balance
                </label>
                <div className="flex space-x-2">
                  {/* Year */}
                  <div className="w-full">
                    <select
                      id="year"
                      {...register('HororScopeDetails.dhasaBalanceYear')}
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                      defaultValue=""
                    >
                      <option value="" >
                        Year
                      </option>
                      <option value="0" >
                        0
                      </option>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Month */}
                  <div className="w-full">
                    <select
                      id="month"
                      {...register('HororScopeDetails.dhasaBalanceMonth')}
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                      defaultValue=""
                    >
                      <option value="" >
                        Month
                      </option>
                      <option value="0" >
                        0
                      </option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Day */}
                  <div className="w-full">
                    <select
                      id="dasa_balance"
                      {...register('HororScopeDetails.dhasaBalanceDay')}
                      className="outline-none w-full px-4 py-2 border border-black rounded"
                      defaultValue=""
                    >
                      <option value="" >
                        Day
                      </option>
                      <option value="0" >
                        0
                      </option>
                      {[...Array(31)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

            </div>

            <div className='grid grid-cols-2 gap-4'>

              <div className="w-full mb-1 max-md:w-full">
                <label htmlFor="horoscopeHints" className="block">
                  Horoscope Hints
                </label>
                <input
                  id="horoscopeHints"
                  type="text"
                  onChange={(e) => setHoroHint(e.target.value)}
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                />
                {/* {errors.horoscopeHints && (
        <span className="text-red-500">
          {errors.horoscopeHints.message}
        </span>
      )} */}


              </div>
              <div className="w-full">
                <label
                  htmlFor="Didi"
                  className="block text-black font-medium mb-0"
                >
                  Didi
                </label>
                <input
                  id="Didi"
                  type="text"
                  {...register('HororScopeDetails.didi')}
                  className="outline-none w-full px-4 py-2 border border-black rounded"
                />
                {/* {errors?.HororScopeDetails?.nalikai && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.nalikai.message}
                  </p>
                )} */}
              </div>
            </div>


            {/* Rasi Grid and Amsam Grid components */}
            <div>
              <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
                Rasi Grid
              </h4>
              <RasiGrid
                centerLabel={'Rasi'}
                onRasiContentsChange={onRasiContentsChange}
              />
            </div>

            <br />

            <div>
              <h4 className="text-xl font-semibold text-black dark:text-white mb-4">
                Amsam Grid
              </h4>
              <AmsamGrid
                centerLabel={'Amsam'}
                onAmsamContentsChange={onAmsamContentsChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HororScopeDetails;
function setValue(arg0: string, formattedTime: string) {
  throw new Error('Function not implemented.');
}

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
//import { EditValues, HororScopeDetails } from '../../../EditSceema';
import {
  fetchBirthStar,
  fetchRasi,
  fetchLagnam,
  getDasaName,
} from '../../../action';
import { useQuery } from '@tanstack/react-query';
import RasiGridnew from './RasiGridnew';
import AmsamGridnew from './AmsamGridNew';
import { HoroScopeDetails } from '../../../types/EditSchemaHoro';
interface formProps {
  setAmsaKattam: (rasiKattam: string) => void;
  setRasiKattam: (rasiKattam: string) => void;
  EditData: any;
  setBirthStarId: (gender: string) => void;
  isHoroscopeDetailsOpen: boolean,
  setIsHoroscopeDetailsOpen: Dispatch<SetStateAction<boolean>>
}
const EditHororScopeDetails: React.FC<formProps> = ({ isHoroscopeDetailsOpen, setIsHoroscopeDetailsOpen, EditData, setBirthStarId, setRasiKattam, setAmsaKattam }) => {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<HoroScopeDetails>();

  // const [editRasiGridData, setEditRasiGridData] = useState('');
  // const [editAmsamGridData, setEditAmsamRasiGridData] = useState('');
  // In EditHororScopeDetails component
  const [editRasiGridData, setEditRasiGridData] = useState(EditData?.[3]?.rasi_kattam || '');
  const [editAmsamGridData, setEditAmsamRasiGridData] = useState(EditData?.[3]?.amsa_kattam || '');
  const [showRasiError, setShowRasiError] = useState(false);
  const [showAmsamError, setShowAmsamError] = useState(false);
  const toggleSection5 = () => {
    setIsHoroscopeDetailsOpen(!isHoroscopeDetailsOpen);
  };
  const selectedBirthStarId = watch('HororScopeDetails.BirthStar');
  const chevaiDosam = watch('HororScopeDetails.ChevvaiDhosam');
  const birthTime = watch('HororScopeDetails.timeOfBirth');
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

  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [horoscopeDetails, setHoroscopeDetails] = useState();
  const [amsaKatamDetals, setAmsaKattamDetails] = useState();

  const birtTime = watch('HororScopeDetails.timeOfBirth');
  const dasaName = watch('HororScopeDetails.dasaName');
  const birthStare = watch("HororScopeDetails.BirthStar")
  useEffect(() => {
    if (birthStare) {
      setBirthStarId(birthStare)
    }
  }, [birthStare])
  console.log(birtTime, 'birtTime');
  const handleRasiGridChange = (newData: string) => {
    setEditRasiGridData(newData);
  };
  const handleAmsamGridChange = (newData: string) => {
    setEditAmsamRasiGridData(newData);
  };


  console.log(editRasiGridData, 'editRasiGridData');
  console.log(editAmsamGridData, 'editAmsamGridData');
  const [hours, sethour] = useState('');
  const [minutes, setminute] = useState('');
  const [periods, setperiod] = useState("AM");

  // const handleTimeChange = () => {
  //   const hour = hours;
  //   const minute = minutes;
  //   const period = periods;
  //   // const combinedTime = `${hour}:${minute} ${period}`;
  //   // setTime(combinedTime);
  //   let formattedHour = parseInt(hour, 10);
  //   if (period === "PM" && formattedHour < 12) {
  //     formattedHour += 12;
  //   } else if (period === "AM" && formattedHour === 12) {
  //     formattedHour = 0;
  //   }

  //   const formattedTime = `${formattedHour
  //     .toString()
  //     .padStart(2, "0")}:${minute}`;
  //   setValue("HororScopeDetails.timeOfBirth", formattedTime);
  // };
  // useEffect(() => {
  //   if (hours && minutes && periods) {
  //     handleTimeChange();
  //   }
  // }, [hours, minutes, periods]);

  const handleTimeChange = () => {
    if (hours && minutes && periods) {
      const combinedTime = `${hours}:${minutes} ${periods}`;
      setValue("HororScopeDetails.timeOfBirth", combinedTime, { shouldValidate: true });
    }
  };

  useEffect(() => {
    handleTimeChange();
  }, [hours, minutes, periods, setValue]);
  const [horoDetails, setHoroDetails] = useState<any>({});
  useEffect(() => {
    if (EditData) {
      setHoroDetails(EditData[3]);
    }
  }, [EditData]);

  const [day, setDay] = useState<any>('');
  const [month, setMonth] = useState<any>('');
  const [year, setYear] = useState<any>('');

  useEffect(() => {
    // Get dasaBalance from horoDetails instead of hardcoding
    const dasaBalance = horoDetails?.dasa_balance_display || "";
    console.log("Dasa Balance:", dasaBalance);

    // Handle different possible formats
    let day, month, year;

    if (dasaBalance) {
      try {
        // Handle format: "12 Years, 11 Months, 13 Days"
        const parts = dasaBalance.split(',');
        console.log('parts:', parts);

        if (parts.length === 3) {
          year = parts[0].trim().split(' ')[0];    // "12 Years" → "12"
          month = parts[1].trim().split(' ')[0];   // "11 Months" → "11"
          day = parts[2].trim().split(' ')[0];     // "13 Days" → "13"
        }

        // Alternative approach using regex for more flexibility
        const yearMatch = dasaBalance.match(/(\d+)\s*Years?/);
        const monthMatch = dasaBalance.match(/(\d+)\s*Months?/);
        const dayMatch = dasaBalance.match(/(\d+)\s*Days?/);

        // Use the correct match variables
        year = yearMatch ? yearMatch[1] : year;
        month = monthMatch ? monthMatch[1] : month;
        day = dayMatch ? dayMatch[1] : day;

        console.log("Parsed values:", { year, month, day });

      } catch (error) {
        console.error("Error parsing dasaBalance:", error);
      }
    }

    setDay(day);
    setMonth(month);
    setYear(year);
  }, [horoDetails]);

  useEffect(() => {
    if (EditData) {
      const dasaBalance = EditData[3].dasa_balance;
      console.log("45", dasaBalance);

      const dasaBalanceView = EditData[3].dasa_balance_display;
      console.log("45", dasaBalanceView);

      setValue('HororScopeDetails.timeOfBirth', EditData[3].time_of_birth);
      setValue('HororScopeDetails.PlaceofBirth', EditData[3].place_of_birth);
      setValue('HororScopeDetails.BirthStar', EditData[3].birthstar_name);
      const padhamValue = EditData[3].padham !== null && EditData[3].padham !== undefined
        ? EditData[3].padham.toString()
        : '';
      setValue('HororScopeDetails.padham', padhamValue);
      //setValue('HororScopeDetails.Rasi', EditData[3].birth_rasi_name) ;
      setValue('HororScopeDetails.lagnam', EditData[3].lagnam_didi);
      setValue('HororScopeDetails.ChevvaiDhosam', EditData[3].chevvai_dosaham);
      setValue('HororScopeDetails.SarpaDhosham', EditData[3].ragu_dosham);
      setValue('HororScopeDetails.nalikai', EditData[3].nalikai);
      setValue('HororScopeDetails.dasaName', EditData[3].dasa_name);
      setValue('HororScopeDetails.horoscopeHints', EditData[3].horoscope_hints);
      setValue('HororScopeDetails.DasaBalanceDay', EditData[3].one);
      setValue('HororScopeDetails.DasaBalanceMonth', EditData[3].two);
      setValue('HororScopeDetails.DasaBalanceYear', EditData[3].three);
      setHoroscopeDetails(EditData[3].rasi_kattam);
      setAmsaKattamDetails(EditData[3].amsa_kattam);
      setRasiKattam(EditData[3].rasi_kattam)
      setAmsaKattam(EditData[3].amsa_kattam)
      setValue('HororScopeDetails.rasiKattam', EditData[3].rasi_kattam || '');
      setValue('HororScopeDetails.amsaKattam', EditData[3].amsa_kattam || '');
      setValue('HororScopeDetails.didi', EditData[3].didi || '');

      if (dasaBalance && typeof dasaBalance === 'string') {
        // Extract numbers using regex
        const yearMatch = dasaBalance.match(/(\d+)\s*Years?/);
        const monthMatch = dasaBalance.match(/(\d+)\s*Months?/);
        const dayMatch = dasaBalance.match(/(\d+)\s*Days?/);

        const year = yearMatch ? yearMatch[1] : "";
        const month = monthMatch ? monthMatch[1] : "";
        const day = dayMatch ? dayMatch[1] : "";

        setValue("HororScopeDetails.DasaBalanceDay", day || "");
        setValue("HororScopeDetails.DasaBalanceMonth", month || "");
        setValue("HororScopeDetails.DasaBalanceYear", year || "");
      }
      // Handle the old colon format as fallback
      else if (dasaBalance && dasaBalance.includes(":")) {
        const [year, month, day] = dasaBalance
          .split(",")
          .map((item: string) => item.split(":")[1]);

        setValue("HororScopeDetails.DasaBalanceDay", day || "");
        setValue("HororScopeDetails.DasaBalanceMonth", month || "");
        setValue("HororScopeDetails.DasaBalanceYear", year || "");
      } else {
        console.warn("Invalid or missing dasa_balance:", dasaBalance);
        setValue("HororScopeDetails.DasaBalanceDay", "");
        setValue("HororScopeDetails.DasaBalanceMonth", "");
        setValue("HororScopeDetails.DasaBalanceYear", "");
      }
      const timeOfBirth = EditData[3].time_of_birth;
      if (timeOfBirth && timeOfBirth.includes(' ')) {
        setValue('HororScopeDetails.timeOfBirth', timeOfBirth);
        const [time, period] = timeOfBirth.split(" ");
        if (time && time.includes(":")) {
          const [h, m] = time.split(":");
          sethour(h);
          setminute(m);
        }
        if (period) {
          setperiod(period);
        }
      }

    }
  }, [EditData, setValue, setRasiKattam, setAmsaKattam]);

  // In EditHororScopeDetails.tsx, add this new useEffect

  // This hook waits for the Rasi options to be fetched before setting the value
  useEffect(() => {
    // Check if the Rasi data array exists, has items, and EditData is present
    if (Rasi && Rasi.length > 0 && EditData) {
      setValue('HororScopeDetails.Rasi', EditData[3].birth_rasi_name);
    }
  }, [Rasi, EditData, setValue]); // This effect runs when the Rasi data changes

  useEffect(() => {
    if (editRasiGridData) {
      setRasiKattam(editRasiGridData);
      setValue('HororScopeDetails.rasiKattam', editRasiGridData);
      setShowRasiError(false);
    }
    if (editAmsamGridData) {
      setAmsaKattam(editAmsamGridData);
      setValue('HororScopeDetails.amsaKattam', editAmsamGridData);
      setShowAmsamError(false);
    }
  }, [editRasiGridData, editAmsamGridData]);

  // Add validation check before form submission
  const rasiValue = watch('HororScopeDetails.rasiKattam');
  const amsamValue = watch('HororScopeDetails.amsaKattam');

  const validateGrids = () => {

    if (!rasiValue) {
      setShowRasiError(true);
    }
    if (!amsamValue) {
      setShowAmsamError(true);
    }

    return rasiValue && amsamValue;
  };
  useEffect(() => {
    validateGrids()
  }, [rasiValue, amsamValue])

  // In the useEffect that handles EditData
  useEffect(() => {
    if (EditData) {
      // ... other initialization code ...
      setEditRasiGridData(EditData[3].rasi_kattam || '');
      setEditAmsamRasiGridData(EditData[3].amsa_kattam || '');
    }
  }, [EditData]);

  useEffect(() => {
    if (EditData && EditData[3]) {
      const dasaBalance = EditData[3].dasa_balance_display;

      if (dasaBalance) {
        // Simple regex to extract numbers for years, months, days
        const yearMatch = dasaBalance.match(/(\d+)\s*Years?/);
        const monthMatch = dasaBalance.match(/(\d+)\s*Months?/);
        const dayMatch = dasaBalance.match(/(\d+)\s*Days?/);

        const year = yearMatch ? yearMatch[1] : "";
        const month = monthMatch ? monthMatch[1] : "";
        const day = dayMatch ? dayMatch[1] : "";

        // Set the form values directly
        setValue("HororScopeDetails.DasaBalanceYear", year);
        setValue("HororScopeDetails.DasaBalanceMonth", month);
        setValue("HororScopeDetails.DasaBalanceDay", day);
      }
    }
  }, [EditData, setValue]);

  // START: ADD THIS LOGIC
  // 1. Watch the three Dasa Balance fields
  const dasaYear = watch('HororScopeDetails.DasaBalanceYear');
  const dasaMonth = watch('HororScopeDetails.DasaBalanceMonth');
  const dasaDay = watch('HororScopeDetails.DasaBalanceDay');

  // 2. Use an effect to manage the logic
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
      if (dasaYear === '') setValue('HororScopeDetails.DasaBalanceYear', '0', { shouldValidate: true });
      if (dasaMonth === '') setValue('HororScopeDetails.DasaBalanceMonth', '0', { shouldValidate: true });
      if (dasaDay === '') setValue('HororScopeDetails.DasaBalanceDay', '0', { shouldValidate: true });
    } else {
      // If all fields have been cleared by the user, reset any '0' values back to ''
      if (dasaYear === '0') setValue('HororScopeDetails.DasaBalanceYear', '', { shouldValidate: true });
      if (dasaMonth === '0') setValue('HororScopeDetails.DasaBalanceMonth', '', { shouldValidate: true });
      if (dasaDay === '0') setValue('HororScopeDetails.DasaBalanceDay', '', { shouldValidate: true });
    }
  }, [dasaYear, dasaMonth, dasaDay, setValue]);

  return (
    <div>
      <div className="bg-white p-5 mb-10 rounded shadow-md">
        <h4
          className="text-red-600 flex row items-center justify-between text-xl font-semibold  dark:text-white cursor-pointer  after-red-line::after"
          onClick={toggleSection5}
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
            <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <label className="block text-[#5a5959e6] font-semibold mb-1">
                  Time of Birth
                </label>
                <div className="flex items-center space-x-2">
                  <select value={hours} onChange={(e) => sethour(e.target.value)} className="px-3 py-2 border rounded border-gray-500 w-full">
                    <option value="" >Hour</option>
                    {Array.from({ length: 12 }, (_, i) => (<option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>{(i + 1).toString().padStart(2, '0')}</option>))}
                  </select>
                  <span>:</span>
                  <select value={minutes} onChange={(e) => setminute(e.target.value)} className="px-3 py-2 border rounded border-gray-500 w-full">
                    <option value="" >Min</option>
                    {Array.from({ length: 60 }, (_, i) => (<option key={i} value={i.toString().padStart(2, '0')}>{i.toString().padStart(2, '0')}</option>))}
                  </select>
                  <select value={periods} onChange={(e) => setperiod(e.target.value)} className="px-3 py-2 border rounded border-gray-500">
                    <option value="AM">AM</option><option value="PM">PM</option>
                  </select>
                </div>
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
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Place of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  id="place_of_birth"
                  type="text"
                  {...register('HororScopeDetails.PlaceofBirth')}
                  className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                />
                {errors?.HororScopeDetails?.PlaceofBirth && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.PlaceofBirth.message}
                  </p>
                )}
              </div>

              {/* Birth Star Selector */}
              {/* <div className="w-full">
                <label
                  htmlFor="birthstar_name"
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Birth Star<span className="text-red-500">*</span>
                </label>
                <select
                  id="birthstar_name"
                  {...register('HororScopeDetails.BirthStar')}
                  className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                >
                  <option value="" className='text-[#000000e6] font-semibold'>
                    -- Select your Birth Star --
                  </option>
                  {BirthStar?.map((option: any) => (
                    <option key={option.birth_id} value={option.birth_id} className='text-[#000000e6] font-medium'>
                      {option.birth_star}
                    </option>
                  ))}
                </select>
                {errors?.HororScopeDetails?.BirthStar && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.BirthStar.message}
                  </p>
                )}
              </div> */}

              <div className="w-full flex gap-2"> {/* Wrapper to hold Star and Padham */}
                <div className="w-3/4">
                  <label htmlFor="birthstar_name" className="block text-[#5a5959e6] font-semibold mb-1">
                    Birth Star<span className="text-red-500">*</span>
                  </label>
                  <select
                    id="birthstar_name"
                    {...register('HororScopeDetails.BirthStar')}
                    className="outline-none w-full px-4 py-2 border font-medium border-[#b5b2b2e6] text-[#222020e6] rounded"
                  >
                    <option value="">-- Select --</option>
                    {BirthStar?.map((option: any) => (
                      <option key={option.birth_id} value={option.birth_id}>
                        {option.birth_star}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-1/4">
                  <label htmlFor="padham" className="block text-[#5a5959e6] font-semibold mb-1">
                    Padham
                  </label>
                  <select
                    id="padham"
                    {...register('HororScopeDetails.padham')}
                    className="outline-none w-full px-4 py-2 border font-medium border-[#b5b2b2e6] text-[#222020e6] rounded"
                  >
                    <option value="">Select</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <label
                  htmlFor="birth_rasi_name"
                  className="block text-[#5a5959e6] font-semibold mb-1 "
                >
                  Rasi <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('HororScopeDetails.Rasi')}
                  id="birth_rasi_name"
                  className="outline-none w-full px-4 py-2  font-medium border border-[#b5b2b2e6]  text-[#222020e6] rounded"
                >
                  <option value="" selected className='text-[#000000e6] font-medium'>
                    -- Select your Rasi --
                  </option>
                  {Rasi?.map((option: any) => (
                    <option key={option.rasi_id} value={option.rasi_id} className='text-[#000000e6] font-medium'>
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

              <div className="w-full">
                <label
                  htmlFor="lagnam"
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Lagnam
                </label>
                <select
                  id="lagnam"
                  {...register('HororScopeDetails.lagnam')}
                  className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"

                >
                  <option value="" className='text-[#000000e6] font-medium'>
                    Select your Lagnam
                  </option>
                  {lagnam?.map((option: any) => (
                    <option key={option.didi_id} value={option.didi_id} className='text-[#000000e6] font-medium'>
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
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Chevvai Dhosam
                </label>
                <select
                  id="chevvai_dosaham"
                  value={chevaiDosam}
                  {...register('HororScopeDetails.ChevvaiDhosam')}
                  className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6]  text-[#222020e6] font-medium  rounded"
                  defaultValue=""
                >
                  <option value="" className='text-[#000000e6] font-medium'>
                    Select Chevvai Dhosam
                  </option>
                  <option value="UnKnown" className='text-[#000000e6] font-medium'>UnKnown</option>
                  <option value="Yes" className='text-[#000000e6] font-medium'>Yes</option>
                  <option value="No" className='text-[#000000e6] font-medium'>No</option>
                </select>
                {errors?.HororScopeDetails?.ChevvaiDhosam && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.ChevvaiDhosam.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <label
                  htmlFor="ragu_dosham"
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Sarpa Dhosham
                </label>
                <select
                  id="ragu_dosham"
                  {...register('HororScopeDetails.SarpaDhosham')}
                  className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                  defaultValue=""
                >
                  <option value="" className='text-[#000000e6] font-medium'>
                    Select Sarpa Dhosham
                  </option>
                  <option value="Unknown" className='text-[#000000e6] font-medium'>Unknown</option>
                  <option value="Yes" className='text-[#000000e6] font-medium'>Yes</option>
                  <option value="No" className='text-[#000000e6] font-medium'>No</option>
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
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Naalikai
                </label>
                <input
                  {...register('HororScopeDetails.nalikai')}
                  id="nalikai"
                  type="text"
                  className="outline-none w-full px-4 py-2  font-medium border border-[#b5b2b2e6]  text-[#222020e6] rounded"
                />
                {errors?.HororScopeDetails?.nalikai && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.nalikai.message}
                  </p>
                )}
              </div>
              <div className="w-full">
                <label htmlFor="dasa_name" className="block mb-1 text-[#5a5959e6] font-semibold">
                  Dasa Name
                </label>
                <select
                  value={dasaName}
                  {...register('HororScopeDetails.dasaName')}
                  className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6]  text-[#222020e6] font-medium  rounded"
                  id="dasaDropdown"
                  defaultValue=""
                >
                  <option value="" selected className='text-[#000000e6] font-medium'>
                    -- Select Dasa Name --
                  </option>
                  {Dasa?.map((dasa: any, index: any) => (
                    <option key={index} value={dasa.dasa_description} className='text-[#000000e6] font-medium'>
                      {dasa.dasa_description}
                    </option>
                  ))}
                </select>
                {errors?.HororScopeDetails?.dasaName && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.dasaName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex w-full flex-row gap-4">

              <div className="w-2/4">
                <label htmlFor="dasaBalance" className="block text-[#5a5959e6] font-semibold mb-1">
                  Dasa Balance
                </label>
                <div className="flex space-x-2">

                  <div className="w-full">
                    {/* <label  className="block text-black font-semibold mb-1">
      Year
  </label> */}
                    <select
                      {...register('HororScopeDetails.DasaBalanceYear')}
                      id="year"
                      className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                    >
                      <option value="" className='text-[#000000e6] font-medium'>
                        Year
                      </option>
                      <option value="0">0</option>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map(
                        (year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div className="w-full">
                    {/* <label  className="block text-black font-semibold mb-1">
     Month
  </label> */}
                    <select
                      id="month"
                      {...register('HororScopeDetails.DasaBalanceMonth')}
                      className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                    >
                      <option value="" className='text-[#000000e6] font-medium'>
                        Month
                      </option>
                      <option value="0">0</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    {/* <label className="block text-black font-semibold mb-1">
                      Day
                    </label> */}
                    <select
                      {...register('HororScopeDetails.DasaBalanceDay')}
                      id="dasa_balance"
                      className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6]  text-[#222020e6] font-medium rounded"
                    >
                      <option value="" className='text-[#000000e6] font-medium'>
                        Day
                      </option>
                      <option value="0">0</option>
                      {[...Array(31)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className=" mb-1 w-[50%]">
                <label htmlFor="horoscopeHints" className="block text-[#5a5959e6] font-semibold mb-1">
                  Horoscope Hints
                </label>
                <input
                  {...register('HororScopeDetails.horoscopeHints')}
                  id="horoscopeHints"
                  type="text"
                  className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                />
              </div>
              {/* <div className=" mb-1 w-[50%]"></div> */}
              <div className=" mb-1 w-[50%]">
                <label
                  htmlFor="didi"
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Didi
                </label>
                <input
                  {...register('HororScopeDetails.didi')}
                  id="didi"
                  type="text"
                  className="outline-none w-full px-4 py-2 font-medium border border-[#b5b2b2e6]  text-[#222020e6] rounded"
                />
                {errors?.HororScopeDetails?.didi && (
                  <p className="text-red-600">
                    {errors.HororScopeDetails.didi.message}
                  </p>
                )}
              </div>
            </div>

            {/* Rasi Grid and Amsam Grid components */}
            <div>
              <h4 className="text-xl font-semibold text-[#5a5959e6] dark:text-white mb-4">
                Rasi Grid
              </h4>
              <RasiGridnew
                onChange={handleRasiGridChange}
                isEditing={true}
                data={horoscopeDetails ?? ''}
                centerLabel={'Rasi'}
              />
              {/* {showRasiError && !watch('HororScopeDetails.rasiKattam') && (
                <p className="text-red-600 mt-2">Please fill Rasi Grid details</p>
              )} */}
            </div>

            <br />

            <div>
              <h4 className="text-xl font-semibold text-[#5a5959e6] dark:text-white mb-4">
                Amsam Grid
              </h4>
              <AmsamGridnew
                onChange={handleAmsamGridChange}
                isEditing={true}
                data={amsaKatamDetals ?? ''}
                centerLabel={'Amsam'}
              />
              {/* {showAmsamError && !watch('HororScopeDetails.amsaKattam') && (
                <p className="text-red-600 mt-2">Please fill Amsa Grid details</p>
              )} */}
            </div>
          </div>
        )}
        <div className='flex justify-end mt-10 '>
          <button
            // onClick={formHandleSubmit}
            type="submit"
            onClick={() => validateGrids()}
            className="bg-blue-500 text-white px-15 py-2 rounded"
          >
            Save Horoscope Details
          </button>


          {/* <button
  type="submit" // Change from "submit" to prevent default behavior
  onClick={() => {
    if (validateGrids()) {
      // Trigger form submission manually
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }
  }}
  className="bg-blue-500 text-white px-15 py-2 rounded"
>
  Save Horoscope Details
</button> */}
        </div>
      </div>
    </div>
  );
};

export default EditHororScopeDetails;

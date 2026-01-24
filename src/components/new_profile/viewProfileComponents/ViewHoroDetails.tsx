// import { Dispatch, SetStateAction, useEffect, useState } from 'react';
// import { useFormContext } from 'react-hook-form';

// import {
//   fetchBirthStar,
//   fetchRasi,
//   fetchLagnam,
//   getDasaName,
// } from '../../../action';
// import { useQuery } from '@tanstack/react-query';
// import RasiGridview from './RasiGridView';
// import AmsamGridview from './AmsamGridView';

// interface pageProps {
//   profile: any;
//   setBirthStar: Dispatch<SetStateAction<string>>
// }
// const ViewHoroDetails: React.FC<pageProps> = ({ profile, setBirthStar }) => {
//   const [horoDetails, setHoroDetails] = useState<any>({});
//   const [day, setDay] = useState<any>('');
//   const [month, setMonth] = useState<any>('');
//   const [year, setYear] = useState<any>('');
//   const [hour, setHour] = useState('');
//   const [minute, setMinute] = useState('');
//   const [period, setPeriod] = useState('');
//   useEffect(() => {
//     setBirthStar(horoDetails.birthstar_name)
//   }, [horoDetails])
//   console.log(horoDetails.birthstar_name);

//   useEffect(() => {
//     if (profile && profile.length > 0) {
//       setHoroDetails(profile[3]);
//     }
//   }, [profile]);
//   const [isHoroscopeDetailsOpen, setIsHoroscopeDetailsOpen] = useState(true);

//   const toggleSection4 = () => {
//     setIsHoroscopeDetailsOpen(!isHoroscopeDetailsOpen);
//   };

//   const { data: BirthStar } = useQuery({
//     queryKey: ['BirthStar'],
//     queryFn: fetchBirthStar,
//   });
//   const { data: Rasi } = useQuery({
//     queryKey: [horoDetails.birth_rasi_name, 'Rasi'],
//     queryFn: () => fetchRasi(horoDetails.birthstar_name),
//     enabled: !!horoDetails.birth_rasi_name,
//   });
//   const { data: lagnam } = useQuery({
//     queryKey: ['lagnam'],
//     queryFn: fetchLagnam,
//   });
//   const { data: Dasa } = useQuery({
//     queryKey: ['Dasa'],
//     queryFn: getDasaName,
//   });

//   useEffect(() => {
//     // Get dasaBalance from horoDetails instead of hardcoding
//     const dasaBalance = horoDetails?.dasa_balance_display || "";
//     console.log("Dasa Balance:", dasaBalance);

//     // Handle different possible formats
//     let day, month, year;

//     if (dasaBalance) {
//       try {
//         // Handle format: "12 Years, 11 Months, 13 Days"
//         const parts = dasaBalance.split(',');
//         console.log('parts:', parts);

//         if (parts.length === 3) {
//           year = parts[0].trim().split(' ')[0];    // "12 Years" → "12"
//           month = parts[1].trim().split(' ')[0];   // "11 Months" → "11"
//           day = parts[2].trim().split(' ')[0];     // "13 Days" → "13"
//         }

//         // Alternative approach using regex for more flexibility
//         const yearMatch = dasaBalance.match(/(\d+)\s*Years?/);
//         const monthMatch = dasaBalance.match(/(\d+)\s*Months?/);
//         const dayMatch = dasaBalance.match(/(\d+)\s*Days?/);

//         // Use the correct match variables
//         year = yearMatch ? yearMatch[1] : year;
//         month = monthMatch ? monthMatch[1] : month;
//         day = dayMatch ? dayMatch[1] : day;

//         console.log("Parsed values:", { year, month, day });

//       } catch (error) {
//         console.error("Error parsing dasaBalance:", error);
//       }
//     }

//     setDay(day);
//     setMonth(month);
//     setYear(year);
//   }, [horoDetails]);

//   //     const  dasaBalance=EditData[3].dasa_balance;

//   //       const splitValue = dasaBalance
//   //       const [day, month, year] = splitValue.split(",")
//   //       .map((item: string) => item.split(":")[1]);
//   // console.log(day, month, year)

//   //       setValue("HororScopeDetails.DasaBalanceDay",day)
//   //       setValue("HororScopeDetails.DasaBalanceMonth",month)
//   //       setValue("HororScopeDetails.DasaBalanceYear",year)

//   //       const timeOfBirth =  EditData[3].time_of_birth;
//   //       const [time, period] = timeOfBirth.split(" ");
//   //       const [hours, minutes] = time.split(":");
//   //       sethour(hours);
//   //       setminute(minutes);
//   //       setperiod(period);
//   useEffect(() => {
//     // const timeOfBirth =  horoDetails.time_of_birth;
//     //      const [time, period] = timeOfBirth.split(" ");
//     //        const [hours, minutes] = time.split(":");
//     //        setHour(hours);
//     //        setMinute(minutes);
//     //        setPeriod(period);
//   }, []);


//   useEffect(() => {
//     // This effect parses the time_of_birth string to set the hour, minute, and period.
//     // It expects the time format to be "HH:MM AM/PM".
//     if (horoDetails.time_of_birth && typeof horoDetails.time_of_birth === 'string') {
//       // Split the string into time and period parts, e.g., ["03:04", "AM"]
//       const timeParts = horoDetails.time_of_birth.split(' ');

//       // Check if the split resulted in two parts (time and period)
//       if (timeParts.length === 2) {
//         const time = timeParts[0]; // "03:04"
//         const period = timeParts[1]; // "AM"

//         // Split the time part into hours and minutes
//         const [hours, minutes] = time.split(':');

//         // Check if we successfully got hours and minutes
//         if (hours && minutes) {
//           setHour(hours);
//           setMinute(minutes);
//           setPeriod(period);
//         }
//       }
//     }
//   }, [horoDetails.time_of_birth]);

//   return (
//     <div>
//       <div className="bg-white p-5 mb-10 rounded shadow-md">
//         <h4
//           className="text-red-600 flex row items-center justify-between text-xl font-semibold  dark:text-white cursor-pointer  after-red-line::after"
//           onClick={toggleSection4}
//         >
//           Horoscope Details
//           <svg
//             className={`fill-current transform ${isHoroscopeDetailsOpen ? 'rotate-180' : ''
//               }`}
//             width={'20'}
//             viewBox="0 0 20 20"
//             fill="none"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               fillRule="evenodd"
//               clipRule="evenodd"
//               d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
//               fill=""
//             ></path>
//           </svg>
//         </h4>
//         {isHoroscopeDetailsOpen && (
//           <div className="flex flex-col gap-5 pt-2">
//             <div className="flex w-full flex-row gap-4">

//               <div className="w-full">
//                 <label htmlFor="timeOfBirth" className="block text-[#5a5959e6] font-semibold mb-1">
//                   Time of Birth
//                 </label>
//                 <div className="flex items-center space-x-2">
//                   <select
//                     value={hour}
//                     disabled
//                     className="px-3 py-2 border rounded border-[#b5b2b2e6]  text-[#222020e6]border-[#b5b2b2e6]  text-[#222020e6] font-medium focus:outline-none focus:border-blue-500"
//                   >
//                     <option value="">Hours</option>
//                     {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (

//                       <option
//                         key={hour}
//                         value={hour.toString().padStart(2, '0')}
//                       >
//                         {hour}
//                       </option>
//                     ))}
//                   </select>
//                   <span>:</span>
//                   <select
//                     value={minute}
//                     disabled
//                     className="px-3 py-2 border rounded border-[#b5b2b2e6]  text-[#222020e6] font-medium focus:outline-none focus:border-blue-500"
//                   >
//                     <option value="">Mins</option>
//                     {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
//                       <option
//                         key={minute}
//                         value={minute.toString().padStart(2, '0')}
//                       >
//                         {minute.toString().padStart(2, '0')}
//                       </option>
//                     ))}
//                   </select>
//                   <select
//                     value={period}
//                     disabled
//                     className="px-3 py-2 border rounded border-[#b5b2b2e6]  text-[#222020e6] font-medium focus:outline-none focus:border-blue-500"
//                   >
//                     <option value="AM">AM</option>
//                     <option value="PM">PM</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="w-full">
//                 <label
//                   htmlFor="place_of_birth"
//                   className="block text-[#5a5959e6] font-semibold mb-1"
//                 >
//                   Place of Birth <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   value={horoDetails.place_of_birth}
//                   readOnly
//                   id="place_of_birth"
//                   type="text"
//                   className="outline-none w-full px-4  font-medium py-2 border border-[#b5b2b2e6]  text-[#222020e6] rounded"
//                 />
//               </div>
//               {/* Birth Star Selector */}
//               <div className="w-full">
//                 <label
//                   htmlFor="birthstar_name"
//                   className="block text-[#5a5959e6] font-semibold mb-1"
//                 >
//                   Birth Star<span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={horoDetails.birthstar_name}
//                   disabled
//                   id="birthstar_name"
//                   className="outline-none w-full px-4 py-2 border font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
//                 >
//                   <option value="" disabled>
//                     -- Select your Birth Star --
//                   </option>
//                   {BirthStar?.map((option: any) => (
//                     <option key={option.birth_id} value={option.birth_id} className='text-black font-semibold'>
//                       {option.birth_star}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//             </div>




//             <div className="flex w-full flex-row gap-4">

//               <div className="w-full">
//                 <label
//                   htmlFor="birth_rasi_name"
//                   className="block text-[#5a5959e6] font-semibold mb-1"
//                 >
//                   Rasi <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={horoDetails.birth_rasi_name}
//                   disabled
//                   id="birth_rasi_name"
//                   className="outline-none w-full px-4 py-2 border font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
//                 >
//                   <option value="" selected disabled>
//                     -- Select your Rasi --
//                   </option>
//                   {Rasi?.map((option: any) => (
//                     <option key={option.rasi_id} value={option.rasi_id}>
//                       {option.rasi_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>




//               <div className="w-full">
//                 <label
//                   htmlFor="lagnam"
//                   className="block text-[#5a5959e6] font-semibold mb-1"
//                 >
//                   Lagnam
//                 </label>
//                 <select
//                   value={horoDetails.lagnam_didi}
//                   disabled
//                   id="lagnam"
//                   className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6]  text-[#222020e6] font-medium  rounded"
//                 >
//                   <option value="" disabled>
//                     -- Select your Lagnam
//                   </option>
//                   {lagnam?.map((option: any) => (
//                     <option key={option.didi_id} value={option.didi_id}>
//                       {option.didi_description}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="w-full">
//                 <label
//                   htmlFor="chevvai_dosaham"
//                   className="block text-[#5a5959e6] font-semibold  mb-1"
//                 >
//                   Chevvai Dhosam
//                 </label>
//                 <select
//                   value={horoDetails.chevvai_dosaham}
//                   disabled
//                   id="chevvai_dosaham"
//                   className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
//                   defaultValue=""
//                 >
//                   <option value="" disabled>
//                     -- Select Chevvai Dhosam --
//                   </option>
//                   <option value="UnKnown">UnKnown</option>
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                 </select>
//               </div>
//             </div>

//             <div className="flex w-full flex-row gap-4">
//               <div className="w-full">
//                 <label
//                   htmlFor="ragu_dosham"
//                   className="block text-[#5a5959e6] font-semibold mb-1"
//                 >
//                   Sarpa Dhosham
//                 </label>
//                 <select
//                   value={horoDetails.ragu_dosham}
//                   disabled
//                   id="ragu_dosham"
//                   className="outline-none w-full px-4 py-2  font-medium border border-[#b5b2b2e6]  text-[#222020e6] rounded"
//                   defaultValue=""
//                 >
//                   <option value="" disabled>
//                     -- Select Sarpa Dhosham --
//                   </option>
//                   <option value="Unknown">Unknown</option>
//                   <option value="Yes">Yes</option>
//                   <option value="No">No</option>
//                 </select>
//               </div>

//               <div className="w-full">
//                 <label
//                   htmlFor="nalikai"
//                   className="block text-[#5a5959e6] font-semibold mb-1"
//                 >
//                   Naalikai
//                 </label>
//                 <input
//                   value={horoDetails.nalikai}
//                   disabled
//                   id="nalikai"
//                   type="text"
//                   className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
//                 />
//               </div>
//               <div className="w-full text-[#5a5959e6] font-medium">
//                 <label htmlFor="dasa_name" className="block mb-1">
//                   Dasa Name
//                 </label>
//                 <select
//                   value={horoDetails.dasa_name}
//                   disabled
//                   className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
//                   id="dasaDropdown"
//                   defaultValue=""
//                 >
//                   <option value="" selected disabled>
//                     -- Select Dasa Name --
//                   </option>
//                   {Dasa?.map((dasa: any, index: any) => (
//                     <option key={index} value={dasa.dasa_description}>
//                       {dasa.dasa_description}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* <div className="flex w-full flex-row gap-4">


//               <div className="w-2/4 text-[#000000e6] font-medium">
//                 <label htmlFor="dasaBalance" className="block mb-1">
//                   Dasa Balance
//                 </label>
//                 <div className="flex space-x-2">
//                   <div className="w-full">
//                     <select
//                       value={day}
//                       disabled
//                       id="dasa_balance"
//                       className="outline-none w-full px-4 py-2 text-[#000000e6] font-medium border border-black rounded"
//                       defaultValue=""
//                     >
//                       <option value="" disabled>
//                         Day
//                       </option>
//                       {[...Array(31)].map((_, i) => (
//                         <option key={i + 1} value={i + 1}>
//                           {i + 1}
//                         </option>
//                       ))}
//                     </select>
//                   </div>


//                   <div className="w-full">
//                     <select
//                       value={month}
//                       disabled
//                       id="month"
//                       className="outline-none w-full px-4 py-2 border border-black rounded"
//                     >
//                       <option value="" disabled>
//                         Month
//                       </option>
//                       {[...Array(12)].map((_, i) => (
//                         <option key={i + 1} value={i + 1}>
//                           {i + 1}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className="w-full">
//                     <select
//                       disabled
//                       value={year}
//                       id="year"
//                       className="outline-none w-full px-4 py-2 border border-black rounded"
//                     >
//                       <option value="" disabled>
//                         Year
//                       </option>
//                       {Array.from({ length: 30 }, (_, i) => i + 1).map(
//                         (year) => (
//                           <option key={year} value={year}>
//                             {year}
//                           </option>
//                         ),
//                       )}
//                     </select>
//                   </div>
//                 </div>

//               </div>

//               <div className=" mb-1 w-full">
//                 <label htmlFor="horoscopeHints" className="block text-black font-semibold">
//                   Horoscope Hints
//                 </label>
//                 <input
//                   disabled
//                   value={horoDetails.horoscope_hints}
//                   id="horoscopeHints"
//                   type="text"
//                   className="outline-none w-1/2 px-4 py-2 border text-[#000000e6] font-medium border-black rounded"
//                 />
//               </div>
//             </div> */}

//             <div className="flex w-full flex-row gap-4 items-start">
//               {/* Dasa Balance */}
//               <div className="w-1/3 text-[#5a5959e6] font-medium">
//                 <label htmlFor="dasaBalance" className="block mb-1">
//                   Dasa Balance
//                 </label>
//                 <div className="grid grid-cols-3 gap-2">

//                   <div>
//                     <select
//                       disabled
//                       value={year}
//                       id="year"
//                       className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6]  text-[#222020e6] rounded"
//                     >
//                       <option value="">
//                         Year
//                       </option>
//                       <option value="">
//                         0 Years
//                       </option>
//                       {Array.from({ length: 30 }, (_, i) => i + 1).map(
//                         (year) => (
//                           <option key={year} value={year}>
//                             {year} Years
//                           </option>
//                         ),
//                       )}
//                     </select>
//                   </div>
//                   <div>
//                     <select
//                       value={month}
//                       disabled
//                       id="month"
//                       className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6]  text-[#222020e6] rounded"
//                     >
//                       <option value="">
//                         Month
//                       </option>
//                       <option value="">
//                         0 Months
//                       </option>
//                       {[...Array(12)].map((_, i) => (
//                         <option key={i + 1} value={i + 1}>
//                           {i + 1} Months
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   <div>
//                     <select
//                       value={day}
//                       disabled
//                       id="dasa_balance"
//                       className="outline-none w-full px-4 py-2 border-[#b5b2b2e6]  text-[#222020e6] font-medium border  rounded"
//                       defaultValue=""
//                     >
//                       <option value="" >
//                         Day
//                       </option>
//                       <option value="">
//                         0 Days
//                       </option>
//                       {[...Array(31)].map((_, i) => (
//                         <option key={i + 1} value={i + 1}>
//                           {i + 1} Days
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               </div>

//               {/* Horoscope Hints */}
//               <div className="w-1/3">
//                 <label htmlFor="horoscopeHints" className="block text-[#5a5959e6] font-semibold mb-1">
//                   Horoscope Hints
//                 </label>
//                 <input
//                   disabled
//                   value={horoDetails.horoscope_hints}
//                   id="horoscopeHints"
//                   type="text"
//                   className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
//                 />
//               </div>

//               {/* Didi */}
//               <div className="w-1/3">
//                 <label
//                   htmlFor="Didi"
//                   className="block text-[#5a5959e6] font-semibold mb-1"
//                 >
//                   Didi
//                 </label>
//                 <input
//                   value={horoDetails.didi}
//                   disabled
//                   id="Didi"
//                   type="text"
//                   className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
//                 />
//               </div>
//             </div>

//             {/* Rasi Grid and Amsam Grid components */}
//             <div>
//               <h4 className="text-xl font-semibold text-[#5a5959e6] dark:text-white mb-4">
//                 Rasi Grid
//               </h4>
//               <RasiGridview
//                 centerLabel={'Rasi'}
//                 rasiTemp={'1'}
//                 data={horoDetails.rasi_kattam}
//               />
//             </div>

//             <br />

//             <div>
//               <h4 className="text-xl font-semibold text-[#5a5959e6] dark:text-white mb-4">
//                 Amsam Grid
//               </h4>
//               <AmsamGridview
//                 centerLabel={'Amsam'}
//                 rasiTemp={'1'}
//                 data={horoDetails.amsa_kattam}
//               />
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ViewHoroDetails;


import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  fetchBirthStar,
  fetchRasi,
  fetchLagnam,
  getDasaName,
} from '../../../action';
import { useQuery } from '@tanstack/react-query';
import RasiGridview from './RasiGridView';
import AmsamGridview from './AmsamGridView';

interface pageProps {
  profile: any;
  setBirthStar: Dispatch<SetStateAction<string>>
}
const ViewHoroDetails: React.FC<pageProps> = ({ profile, setBirthStar }) => {
  const [horoDetails, setHoroDetails] = useState<any>({});
  const [day, setDay] = useState<any>('');
  const [month, setMonth] = useState<any>('');
  const [year, setYear] = useState<any>('');
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [period, setPeriod] = useState('');

  useEffect(() => {
    setBirthStar(horoDetails.birthstar_name)
  }, [horoDetails])

  useEffect(() => {
    if (profile && profile.length > 0) {
      setHoroDetails(profile[3]);
    }
  }, [profile]);

  const [isHoroscopeDetailsOpen, setIsHoroscopeDetailsOpen] = useState(true);

  const toggleSection4 = () => {
    setIsHoroscopeDetailsOpen(!isHoroscopeDetailsOpen);
  };

  const { data: BirthStar } = useQuery({
    queryKey: ['BirthStar'],
    queryFn: fetchBirthStar,
  });

  const { data: Rasi } = useQuery({
    queryKey: [horoDetails.birth_rasi_name, 'Rasi'],
    queryFn: () => fetchRasi(horoDetails.birthstar_name),
    enabled: !!horoDetails.birth_rasi_name,
  });

  const { data: lagnam } = useQuery({
    queryKey: ['lagnam'],
    queryFn: fetchLagnam,
  });

  const { data: Dasa } = useQuery({
    queryKey: ['Dasa'],
    queryFn: getDasaName,
  });

  // Function to parse dasa balance and handle empty/zero values properly
  const parseDasaBalance = (dasaBalance: string) => {
    let day = '0';
    let month = '0';
    let year = '0';

    if (dasaBalance && dasaBalance.trim() !== '') {
      try {
        // Handle format: "5 Years, 0 Months, 0 Days"
        const yearMatch = dasaBalance.match(/(\d+)\s*Years?/);
        const monthMatch = dasaBalance.match(/(\d+)\s*Months?/);
        const dayMatch = dasaBalance.match(/(\d+)\s*Days?/);

        // Extract values, default to '0' if not found
        year = yearMatch ? yearMatch[1] : '0';
        month = monthMatch ? monthMatch[1] : '0';
        day = dayMatch ? dayMatch[1] : '0';

        console.log("Parsed values from dasa_balance:", { year, month, day });

      } catch (error) {
        console.error("Error parsing dasaBalance:", error);
        // Set defaults on error
        year = '0';
        month = '0';
        day = '0';
      }
    }

    return { day, month, year };
  };

  useEffect(() => {
    // Get dasaBalance from horoDetails - use dasa_balance if available, fallback to dasa_balance_display
    const dasaBalance = horoDetails?.dasa_balance || horoDetails?.dasa_balance_display || "";
    console.log("Original Dasa Balance:", dasaBalance);

    const parsedValues = parseDasaBalance(dasaBalance);

    setDay(parsedValues.day);
    setMonth(parsedValues.month);
    setYear(parsedValues.year);
  }, [horoDetails]);

  useEffect(() => {
    // This effect parses the time_of_birth string to set the hour, minute, and period.
    if (horoDetails.time_of_birth && typeof horoDetails.time_of_birth === 'string') {
      const timeParts = horoDetails.time_of_birth.split(' ');

      if (timeParts.length === 2) {
        const time = timeParts[0];
        const period = timeParts[1];
        const [hours, minutes] = time.split(':');

        if (hours && minutes) {
          setHour(hours);
          setMinute(minutes);
          setPeriod(period);
        }
      }
    }
  }, [horoDetails.time_of_birth]);

  const getDisplayValue = (value: string) => {
    return value === '0' ? '' : value;
  };


  // Function to check if value is zero for styling


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
            <div className="flex w-full flex-row gap-4">
              <div className="w-full">
                <label htmlFor="timeOfBirth" className="block text-[#5a5959e6] font-semibold mb-1">
                  Time of Birth
                </label>
                <div className="flex items-center space-x-2">
                  <select
                    value={hour}
                    disabled
                    className="px-3 py-2 border rounded border-[#b5b2b2e6]  text-[#222020e6]border-[#b5b2b2e6]  text-[#222020e6] font-medium focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Hours</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                      <option
                        key={hour}
                        value={hour.toString().padStart(2, '0')}
                      >
                        {hour}
                      </option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={minute}
                    disabled
                    className="px-3 py-2 border rounded border-[#b5b2b2e6]  text-[#222020e6] font-medium focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Mins</option>
                    {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                      <option
                        key={minute}
                        value={minute.toString().padStart(2, '0')}
                      >
                        {minute.toString().padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                  <select
                    value={period}
                    disabled
                    className="px-3 py-2 border rounded border-[#b5b2b2e6]  text-[#222020e6] font-medium focus:outline-none focus:border-blue-500"
                  >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>

              <div className="w-full">
                <label
                  htmlFor="place_of_birth"
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Place of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  value={horoDetails.place_of_birth}
                  readOnly
                  id="place_of_birth"
                  type="text"
                  className="outline-none w-full px-4  font-medium py-2 border border-[#b5b2b2e6]  text-[#222020e6] rounded"
                />
              </div>

              {/* Birth Star Selector */}
              {/* <div className="w-full"> */}
              <div className="w-full flex gap-2"> {/* Wrapper to hold Star and Padham */}
                <div className="w-3/4">
                  <label
                    htmlFor="birthstar_name"
                    className="block text-[#5a5959e6] font-semibold mb-1"
                  >
                    Birth Star<span className="text-red-500">*</span>
                  </label>
                  <select
                    value={horoDetails.birthstar_name}
                    disabled
                    id="birthstar_name"
                    className="outline-none w-full px-4 py-2 border font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                  >
                    <option value="" disabled>
                      -- Select your Birth Star --
                    </option>
                    {BirthStar?.map((option: any) => (
                      <option key={option.birth_id} value={option.birth_id} className='text-black font-semibold'>
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
                    value={horoDetails.padham}
                    disabled
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
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Rasi <span className="text-red-500">*</span>
                </label>
                <select
                  value={horoDetails.birth_rasi_name}
                  disabled
                  id="birth_rasi_name"
                  className="outline-none w-full px-4 py-2 border font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                >
                  <option value="" selected disabled>
                    -- Select your Rasi --
                  </option>
                  {Rasi?.map((option: any) => (
                    <option key={option.rasi_id} value={option.rasi_id}>
                      {option.rasi_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label
                  htmlFor="lagnam"
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Lagnam
                </label>
                <select
                  value={horoDetails.lagnam_didi}
                  disabled
                  id="lagnam"
                  className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6]  text-[#222020e6] font-medium  rounded"
                >
                  <option value="" disabled>
                    -- Select your Lagnam
                  </option>
                  {lagnam?.map((option: any) => (
                    <option key={option.didi_id} value={option.didi_id}>
                      {option.didi_description}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full">
                <label
                  htmlFor="chevvai_dosaham"
                  className="block text-[#5a5959e6] font-semibold  mb-1"
                >
                  Chevvai Dhosam
                </label>
                <select
                  value={horoDetails.chevvai_dosaham}
                  disabled
                  id="chevvai_dosaham"
                  className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                  defaultValue=""
                >
                  <option value="" disabled>
                    -- Select Chevvai Dhosam --
                  </option>
                  <option value="UnKnown">UnKnown</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
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
                  value={horoDetails.ragu_dosham}
                  disabled
                  id="ragu_dosham"
                  className="outline-none w-full px-4 py-2  font-medium border border-[#b5b2b2e6]  text-[#222020e6] rounded"
                  defaultValue=""
                >
                  <option value="" disabled>
                    -- Select Sarpa Dhosham --
                  </option>
                  <option value="Unknown">Unknown</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <div className="w-full">
                <label
                  htmlFor="nalikai"
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Naalikai
                </label>
                <input
                  value={horoDetails.nalikai}
                  disabled
                  id="nalikai"
                  type="text"
                  className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                />
              </div>
              <div className="w-full text-[#5a5959e6] font-medium">
                <label htmlFor="dasa_name" className="block mb-1">
                  Dasa Name
                </label>
                <select
                  value={horoDetails.dasa_name}
                  disabled
                  className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                  id="dasaDropdown"
                  defaultValue=""
                >
                  <option value="" selected disabled>
                    -- Select Dasa Name --
                  </option>
                  {Dasa?.map((dasa: any, index: any) => (
                    <option key={index} value={dasa.dasa_description}>
                      {dasa.dasa_description}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex w-full flex-row gap-4 items-start">
              {/* Dasa Balance */}
              <div className="w-1/3 text-[#5a5959e6] font-medium">
                <label htmlFor="dasaBalance" className="block mb-1">
                  Dasa Balance
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <select
                      disabled
                      // value={year || ""}
                      value={getDisplayValue(year) || year}
                      id="year"
                      className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] text-[#222020e6] rounded"
                    >
                      <option value="">Year</option>
                      <option value="0">0 Years</option>
                      {Array.from({ length: 30 }, (_, i) => i + 1).map(
                        (yearVal) => (
                          <option key={yearVal} value={yearVal}>
                            {yearVal} Years
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                  <div>
                    <select
                      // value={month || ""}
                      value={getDisplayValue(month) || month}
                      disabled
                      id="month"
                      className="outline-none w-full px-4 py-2 border border-[#b5b2b2e6] text-[#222020e6] rounded"
                    >
                      <option value="">Month</option>
                      <option value="0">0 Months</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Months
                        </option>
                      ))}
                    </select>

                  </div>
                  <div>
                    <select
                      // value={day || ""}
                      value={getDisplayValue(day) || day}
                      disabled
                      id="dasa_balance"
                      className="outline-none w-full px-4 py-2 border-[#b5b2b2e6] text-[#222020e6] font-medium border rounded"
                    >
                      <option value="">Day</option>
                      <option value="0">0 Days</option>
                      {[...Array(31)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Days
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Horoscope Hints */}
              <div className="w-1/3">
                <label htmlFor="horoscopeHints" className="block text-[#5a5959e6] font-semibold mb-1">
                  Horoscope Hints
                </label>
                <input
                  disabled
                  value={horoDetails.horoscope_hints}
                  id="horoscopeHints"
                  type="text"
                  className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                />
              </div>

              {/* Didi */}
              <div className="w-1/3">
                <label
                  htmlFor="Didi"
                  className="block text-[#5a5959e6] font-semibold mb-1"
                >
                  Didi
                </label>
                <input
                  value={horoDetails.didi}
                  disabled
                  id="Didi"
                  type="text"
                  className="outline-none w-full px-4 py-2 border  font-medium border-[#b5b2b2e6]  text-[#222020e6] rounded"
                />
              </div>
            </div>

            {/* Rasi Grid and Amsam Grid components */}
            <div>
              <h4 className="text-xl font-semibold text-[#5a5959e6] dark:text-white mb-4">
                Rasi Grid
              </h4>
              {horoDetails?.rasi_kattam ? (
                <RasiGridview
                  centerLabel={'Rasi'}
                  rasiTemp={'1'}
                  data={horoDetails.rasi_kattam}
                />
              ) : (
                <div className="text-gray-500 italic">No Rasi Grid data available</div>
              )}
            </div>

            <br />

            <div >
              <h4 className="text-xl font-semibold text-[#5a5959e6] dark:text-white mb-4">
                Amsam Grid
              </h4>
              {horoDetails?.amsa_kattam ? (
                <AmsamGridview
                  centerLabel={'Amsam'}
                  rasiTemp={'1'}
                  data={horoDetails.amsa_kattam}
                />
              ) : (
                <div className="text-gray-500 italic">No Amsam Grid data available</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewHoroDetails;

import axios from 'axios';
import { MatchingStar } from '../components/new_profile/profile_form_components/Partner_preference';
import { apiAxios } from './apiUrl';
import { SubStatus } from '../components/new_profile/viewProfileComponents/ProfileViwePopup/CallManagementModel';

const adminUserID = sessionStorage.getItem('id') || localStorage.getItem('id');

// User Matching Profiles Page -> Annual Income List
export const userAnnualIncome = async () => {
    try {
        const response = await apiAxios.post('/auth/Get_Annual_Income/', {});
        console.log("Annual Income fetched successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch Annual Income");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error fetching Annual Income:", error.message || error);
        throw new Error("Unable to fetch Annual Income. Please try again later.");
    }
};

// User Matching Profiles Page -> Profession List
export const userProfession = async () => {
    try {
        const response = await apiAxios.post('/auth/Get_Profes_Pref/', {});
        console.log("Profession fetched successfully", response);

        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch Profession");
        }

        return response.data; // Adjust based on the actual response structure

    } catch (error: any) {
        console.error("Error fetching Profession:", error.message || error);
        throw new Error("Unable to fetch Profession. Please try again later.");
    }
};

// User Matching Profiles Page -> MaritalStatus List
export const userMaritalStatus = async () => {
    try {
        const response = await apiAxios.post('/auth/Get_Marital_Status/', {});
        console.log("MaritalStatus fetched successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch MaritalStatus");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error fetching MaritalStatus:", error.message || error);
        throw new Error("Unable to fetch MaritalStatus. Please try again later.");
    }
};

// User Matching Profiles Page -> Education List
export const userEducation = async () => {
    try {
        const response = await apiAxios.post('/auth/Get_Highest_Education/', {});
        console.log("Education fetched successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch Education");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error fetching Education:", error.message || error);
        throw new Error("Unable to fetch Education. Please try again later.");
    }
};

// User Matching Profiles Page -> State List
export const userState = async () => {
    try {
        const response = await apiAxios.post('/auth/Get_State_Pref/')
        console.log("State fetched successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch State");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error fetching State:", error.message || error);
        throw new Error("Unable to fetch State. Please try again later.");
    }
};

//Mode, plans list api
export const getMembershipPlans = async () => {
    try {
        const response = await apiAxios.get('/api/get-plans/');
        return response.data; // This returns the object containing { status: true, plans: [...] }
    } catch (error) {
        throw error;
    }
};

// In api/apiConfig.js
export const getProfileHolder = async () => {
    // Replace axiosInstance with your actual axios import
    const response = await apiAxios.post('auth/Get_Profileholder/');
    return response.data;
};


// // User Matching Profiles Page -> City List
// export const userCity = async (districtID: number) => {
//     try {
//         const response = await apiAxios.post('/auth/Get_City/', {
//             district_id: districtID,
//         });
//         console.log("City fetched successfully", response);

//         // Assuming the API returns an object with a `status` field and a `data` field
//         if (!response.data || response.status !== 200) {
//             throw new Error("Failed to fetch City");
//         }

//         return response.data; // Adjust based on the actual response structure

//     } catch (error: any) {
//         console.error("Error fetching City:", error.message || error);
//         throw new Error("Unable to fetch City. Please try again later.");
//     }
// };

// API call to fetch district preferences
export const userCity = async () => {
    try {
        // Send GET request to the API endpoint
        const response = await apiAxios.post('/auth/Get_district_pref/');
        console.log("City preferences fetched successfully", response);
        // Check if the response is successful
        if (!response.data || response.status !== 200 || response.data.status !== 'success') {
            throw new Error("Failed to fetch city preferences");
        }
        // Return the district data from the API response
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching city preferences:", error.message || error);
        throw new Error("Unable to fetch city preferences. Please try again later.");
    }
};

// User Matching Profiles Page -> Complexion List
export const userComplexion = async () => {
    try {
        const response = await apiAxios.post('/auth/Get_Complexion/', {});
        console.log("Complexion fetched successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch Complexion");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error fetching Complexion:", error.message || error);
        throw new Error("Unable to fetch Complexion. Please try again later.");
    }
};


// User Matching Profiles Page -> FamilyStatus List
export const userFamilyStatus = async () => {
    try {
        const response = await apiAxios.post('/auth/Get_FamilyStatus/', {});
        console.log("FamilyStatus fetched successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch FamilyStatus");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error fetching FamilyStatus:", error.message || error);
        throw new Error("Unable to fetch FamilyStatus. Please try again later.");
    }
};


// User Matching Profiles Page -> Membership List
export const userMembership = async () => {
    try {
        const response = await apiAxios.post('/api/get_allplans/', {});
        console.log("Membership fetched successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch Membership");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error fetching Membership:", error.message || error);
        throw new Error("Unable to fetch Membership. Please try again later.");
    }
};



// User Matching Profiles Page -> Matching stars List
export const userMatchingStars = async (rasiID: string, starID: string, gender: string) => {
    try {
        const response = await apiAxios.post('/auth/Get_Matchstr_Pref/', {
            birth_rasi_id: rasiID,
            birth_star_id: starID,
            gender: gender,
        });
        console.log("User Matching stars fetched successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch User Matching stars");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error fetching User Matching stars:", error.message || error);
        throw new Error("Unable to fetch User Matching stars. Please try again later.");
    }
};


// export const userMatchingStars = async (
//   birth_rasi_id:string,
//   birthStarId: string,
//   gender: string,
// ) => {
//   try {
//     const response = await apiAxios.post('/auth/Get_Matchstr_Pref/', {
//       birth_rasi_id:birth_rasi_id,
//       birth_star_id: birthStarId,
//       gender: gender,
//     });

//     const matchCountArrays: MatchingStar[][] = Object.values(response.data).map(
//       (matchCount: any) => matchCount,
//     );
//     console.log(matchCountArrays)
//     return matchCountArrays;
//   } catch (error) {
//     console.error('Error fetching match preferences:', error);
//     // Handle the error
//   }
// };



// User Matching Profiles Page -> Matching Records List
export const userMatchingProfiles = async (profileID: string, pageNumber: number, pageSize: number) => {
    try {
        const response = await apiAxios.post('/api/Get_prof_list_match/', {
            profile_id: profileID, // Replace with the actual category ID
            page_number: pageNumber, // Replace with the actual branch ID
            per_page: pageSize, // Replace with the actual branch ID
        });
        console.log("User Matching records fetched successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch User Matching records");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error fetching User Matching records:", error.message || error);
        throw new Error("Unable to fetch User Matching records. Please try again later.");
    }
};



// export const userMatchingProfilesFilterListMatch = async (
//     ProfileID: string, pageNumber: number, pageSize: number, Complexion: string, Education: string, HeightFrom: number,
//     HeightTo: number, MinAnualIncome: number, MaxAnualIncome: number, ForeignInterest: string, State: number,
//     City: number, Membership: number, HasPhotos: string, matching_stars: number, ageDifference: number, sarpaDhosham: string,
//     chevvaiDhosam: string, selectedProfessions: string, fatherLive: string, motherLive: string, selectedMaritalStatus: string, selectedFamilyStatus: string, sentInWhatsapp: string
//     // hasphotos: any, selectedMembership: any,
//     //  sentInWhatsapp: any,   destRasiIds: any,
// ) => {
//     try {
//         const response = await apiAxios.post('/api/Get_prof_list_match/', {
//             profile_id: ProfileID,
//             page_number: pageNumber, // Replace with the actual branch ID
//             per_page: pageSize, // Replace with the actual branch ID
//             complexion: Complexion,
//             education: Education,
//             height_from: HeightFrom,
//             height_to: HeightTo,
//             min_anual_income: MinAnualIncome,
//             max_anual_income: MaxAnualIncome,
//             foreign_intrest: ForeignInterest,
//             state: State,
//             city: City,
//             membership: Membership,
//             has_photos: HasPhotos,
//             matching_stars: matching_stars,
//             search_age: ageDifference,
//             ragu: sarpaDhosham,
//             chev: chevvaiDhosam,
//             search_profession: selectedProfessions,
//             father_alive: fatherLive,
//             mother_alive: motherLive,
//             marital_status: selectedMaritalStatus,
//             family_status: selectedFamilyStatus,
//             whatsapp_field: sentInWhatsapp
//         });
//         console.log("User Matching records filter fetched successfully", response);
//         // Assuming the API returns an object with a `status` field and a `data` field
//         if (!response.data || response.status !== 200) {
//             throw new Error("Failed to fetch User Matching records filter");
//         }
//         return response.data; // Adjust based on the actual response structure
//     } catch (error: any) {
//         console.error("Error fetching User Matching records filter:", error.message || error);
//         throw new Error("Unable to fetch User Matching records filter. Please try again later.");
//     }
// };


export const userMatchingProfilesFilterListMatch = async (
    ProfileID: string,
    pageNumber: number,
    pageSize: number,
    Complexion: string,
    Education: string,
    selectedFieldsOfStudy: string, // Add this
    selectedDegrees: string, // Add this
    HeightFrom: number,
    HeightTo: number,
    MinAnualIncome: number,
    MaxAnualIncome: number,
    ForeignInterest: string,
    State: number,
    City: number,
    Membership: number,
    HasPhotos: string,
    matching_stars: number,
    ageDifference: number,
    sarpaDhosham: string,
    chevvaiDhosam: string,
    selectedProfessions: string,
    fatherLive: string,
    motherLive: string,
    selectedMaritalStatus: string,
    selectedFamilyStatus: string,
    sentInWhatsapp: string,
    //prefPoruthamStarRasi: string,
    fromDateOfJoin: string,
    toDateOfJoin: string,
    ExceptViewed: boolean | string,  // Accept both boolean and string
    ExceptVisitor: boolean | string, // Accept both boolean and string
    profileType: 'matching' | 'suggested' = 'matching',
    actionType: string = 'all', // New parameter for action type
    status: string = 'all', // New parameter for status
    search: string = ""
) => {
    try {
        const exceptViewedBool = ExceptViewed === true || ExceptViewed === 'true';
        const exceptVisitorBool = ExceptVisitor === true || ExceptVisitor === 'true';
        // Determine the endpoint based on profileType
        const endpoint = profileType === 'suggested'
            ? '/api/Get_suggest_list_match/'
            : '/api/Get_prof_list_match/';

        const response = await apiAxios.post(endpoint, {
            profile_id: ProfileID,
            page_number: pageNumber,
            per_page: pageSize,
            complexion: Complexion,
            education: Education,
            height_from: HeightFrom,
            height_to: HeightTo,
            min_anual_income: MinAnualIncome,
            max_anual_income: MaxAnualIncome,
            foreign_intrest: ForeignInterest,
            state: State,
            city: City,
            membership: Membership,
            has_photos: HasPhotos,
            matching_stars: matching_stars,
            search_age: ageDifference,
            ragu: sarpaDhosham,
            chev: chevvaiDhosam,
            search_profession: selectedProfessions,
            father_alive: fatherLive,
            mother_alive: motherLive,
            marital_status: selectedMaritalStatus,
            family_status: selectedFamilyStatus,
            whatsapp_field: sentInWhatsapp,
            pref_fieldof_study: selectedFieldsOfStudy, // Add this
            degree: selectedDegrees, // Add this
            //pref_porutham_star_rasi: prefPoruthamStarRasi,
            from_dateofjoin: fromDateOfJoin,
            to_dateofjoin: toDateOfJoin,
            except_viewed: exceptViewedBool,   // Send as proper boolean
            except_visitor: exceptVisitorBool, // Send as proper booleanF
            action_type: actionType, // Add action_type parameter
            status: status, // Add status parameter
            search: search
        });

        console.log(`User ${profileType} records filter fetched successfully`, response);

        if (!response.data || response.status !== 200) {
            throw new Error(`Failed to fetch User ${profileType} records filter`);
        }

        return response.data;
    } catch (error: any) {
        console.error(`Error fetching User ${profileType} records filter:`, error.message || error);
        throw new Error(`Unable to fetch User ${profileType} records filter. Please try again later.`);
    }
};



// User Matching Profiles Page -> Matching Records filter List
export const userMatchingProfilesFilter = async (
    ProfileID: string | null,
    pageNumber: number,
    pageSize: number,
    // Complexion: string | null,
    // Education: string,
    // HeightFrom: string,
    // HeightTo: string,
    // MinAnualIncome: string,
    // MaxAnualIncome: string,
    // ForeignInterest: string,
    // State: string,
    City: string,
    // Membership: string,
    // HasPhotos: string,
    // matching_stars: number,
    // selectedBirthStarIds: string,
    // ageDifference: string,
    // selectedProfessions: string,
    ageFrom: string,
    ageTo: string,
    // sarpaDhosam: string,
    // chevvaiDhosam: string,
    profileName: string,
    // selectedBirthStarIds
    // fatherAlive: string,
    // motherAlive: string,
    mobileNo: string,
    Gender: string,
    EmailId: string,
    dobDay: string, // Add this
    dobMonth: string, // Add this
    dobYear: string, // Add this
    // status: string,
    // selectedMaritalStatus: string,
    // selectedFamilyStatus: string,
) => {
    try {
        const response = await apiAxios.post('/api/common-search/', {
            search_profile_id: ProfileID,
            page_number: pageNumber, // Replace with the actual branch ID
            per_page: pageSize, // Replace with the actual branch ID
            // complexion: Complexion,
            // education: Education,
            // height_from: HeightFrom,
            // height_to: HeightTo,
            // min_anual_income: MinAnualIncome,
            // max_anual_income: MaxAnualIncome,
            // foreign_intrest: ForeignInterest,
            // state: State,
            city: City,
            // membership: Membership,
            // has_photos: HasPhotos,
            // matching_stars: selectedBirthStarIds,
            // search_age: ageDifference,
            // search_profession: selectedProfessions,
            age_from: ageFrom,
            age_to: ageTo,
            // ragu_dosham: sarpaDhosam,
            // chevvai_dosham: chevvaiDhosam,
            profile_name: profileName,
            // father_alive: fatherAlive,
            // mother_alive: motherAlive,
            mobile_no: mobileNo,
            gender: Gender,
            email_id: EmailId,
            dob_date: dobDay,
            dob_month: dobMonth,
            dob_year: dobYear,
            // status: status,
            // marital_status: selectedMaritalStatus,
            // family_status: selectedFamilyStatus,
        });
        console.log("User Matching records filter fetched successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch User Matching records filter");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error fetching User Matching records filter:", error.message || error);
        throw new Error("Unable to fetch User Matching records filter. Please try again later.");
    }
};

export const commonSearch = async (data: {
    search_profile_id: any; profile_name: any; dob_date: any; dob_month: any; dob_year: any; age_from: any; age_to: any; gender: any; mobile_no: any; email_id: any; father_name: any; father_occupation: any; mother_name: any; mother_occupation: any; business_name: any; company_name: any; state: any; city: any; status: any; created_by: any; address: any; admin_comments: any; min_anual_income: any; max_anual_income: any; membership: any; martial_status: any; matching_stars: any; education: any; field_of_study: any; degree: any; delete_status: any; page_number: number; per_page: number; marriage_from: any;
    marriage_to: any;
    engagement_from: any;
    engagement_to: any;
    //admin_details: any;
    from_last_action_date?: any;
    to_last_action_date?: any;
    export_type?: string;
}) => {
    try {
        const response = await apiAxios.post('api/common-search/', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const commonSearchExport = async (data: any) => {
    try {
        const response = await apiAxios.post('api/common-search/', data, {
            responseType: 'blob', // 👈 Required for binary data like Excel
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// User Matching Profiles Page -> Matching Records Send Email
export const userMatchingProfilesSendEmail = async (Format: string, ProfileID: string, ToProfileID: string, ProfileOwner: string) => {
    try {
        const formData = new FormData();
        formData.append("format", Format);
        formData.append("profile_id", ProfileID);
        formData.append("to_profile_id", ToProfileID);
        formData.append("profile_owner", ProfileOwner);
        const response = await apiAxios.post('/api/Matching_sendemail/', formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        console.log("Sent Email successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to send Email");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error Sending Email", error.message || error);
        throw new Error("Unable to Send Email. Please try again later.");
    }
};

// User Matching Profiles Page -> Matching Records Print Profile
export const userMatchingProfilesPrintProfile = async (Format: string, ProfileID: string, ToProfileID: string, ProfileOwner: string) => {
    try {
        const formData = new FormData();
        formData.append("format", Format);
        formData.append("profile_id", ProfileID);
        formData.append("to_profile_id", ToProfileID);
        formData.append("profile_owner", ProfileOwner);
        const response = await apiAxios.post('/api/matching-print-profiles/', formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: 'blob', // This is crucial for PDF downloads
            });
        console.log("Matching Profile Printed successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (response.status !== 200) {
            throw new Error("Failed to Matching Profile Print");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error Matching Profile Print", error.message || error);
        throw new Error("Unable to Matching Profile Print. Please try again later.");
    }
};

export const MatchingPrintProfile = async (
    Format: string,
    ProfileIDs: string,   // comma-separated profile IDs
    ToProfileID: string,
    // ProfileOwner: string  // optional if still required
) => {
    try {
        const queryParams = new URLSearchParams({
            profile_ids: ProfileIDs,     // e.g. "VF31248,VF53626"
            pdf_format: Format,          // e.g. "match_full_profile"
            profile_to: ToProfileID,     // e.g. "VM56320"
            // If your API still needs owner, you can add:
            // profile_owner: ProfileOwner
        });

        const response = await apiAxios.get(
            `/api/admin-match-pdf-with-format/?${queryParams.toString()}`,
            { responseType: 'blob' } // Ensure file download works
        );

        if (response.status !== 200) {
            throw new Error("Failed to Matching Profile Print");
        }

        return response.data; // This will be a Blob (PDF file)
    } catch (error: any) {
        console.error("Error Matching Profile Print", error.message || error);
        throw new Error("Unable to Matching Profile Print. Please try again later.");
    }
};

// User Matching Profiles Page -> Matching Records Print Profile
export const userMatchingProfilesWhatsapp = async (Format: string, ProfileID: string, ToProfileID: string, ActionType: string, ProfileOwner: string) => {
    try {
        const formData = new FormData();
        formData.append("format", Format);
        formData.append("profile_id", ProfileID);
        formData.append("to_profile_id", ToProfileID);
        formData.append("action_type", ActionType);
        formData.append("profile_owner", ProfileOwner);
        const response = await apiAxios.post('/api/Matching_whatsapp/', formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                responseType: 'blob', // This is crucial for PDF downloads
            });
        console.log("Matching Profile Printed successfully", response);
        // Assuming the API returns an object with a `status` field and a `data` field
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to Matching Profile Print");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error Matching Profile Print", error.message || error);
        throw new Error("Unable to Matching Profile Print. Please try again later.");
    }
};


export const MatchingWhatsappProfile = async (
    Format: string,
    ProfileIDs: string,   // comma-separated profile IDs
    ToProfileID: string,
    // ProfileOwner: string  // optional if still required
) => {
    try {
        const queryParams = new URLSearchParams({
            profile_ids: ProfileIDs,     // e.g. "VF31248,VF53626"
            pdf_format: Format,          // e.g. "match_full_profile"
            profile_to: ToProfileID,     // e.g. "VM56320"
            // If your API still needs owner, you can add:
            // profile_owner: ProfileOwner
        });

        const response = await apiAxios.get(
            `/api/admin-match-pdf-with-format/?${queryParams.toString()}`,
            { responseType: 'blob' } // Ensure file download works
        );

        if (response.status !== 200) {
            throw new Error("Failed to Matching Profile Print");
        }

        return response.data; // This will be a Blob (PDF file)
    } catch (error: any) {
        console.error("Error Matching Profile Print", error.message || error);
        throw new Error("Unable to Matching Profile Print. Please try again later.");
    }
};

export const MatchingEmailProfile = async (
    Format: string,
    ProfileIDs: string,   // comma-separated profile IDs
    ToProfileID: string,
    // ProfileOwner: string  // optional if still required
) => {
    try {
        const queryParams = new URLSearchParams({
            profile_ids: ProfileIDs,     // e.g. "VF31248,VF53626"
            pdf_format: Format,          // e.g. "match_full_profile"
            profile_to: ToProfileID,     // e.g. "VM56320"
            // If your API still needs owner, you can add:
            // profile_owner: ProfileOwner
        });

        const response = await apiAxios.get(
            `/api/admin-match-pdf-with-format/?${queryParams.toString()}`,
            { responseType: 'blob' } // Ensure file download works
        );

        if (response.status !== 200) {
            throw new Error("Failed to Matching Profile Print");
        }

        return response.data; // This will be a Blob (PDF file)
    } catch (error: any) {
        console.error("Error Matching Profile Print", error.message || error);
        throw new Error("Unable to Matching Profile Print. Please try again later.");
    }
};

// CallMAnagement --> Fetch Call Types 
export const fetchCallTypes = async () => {
    try {
        const response = await apiAxios.get('/api/calltypes/');
        if (response.status !== 200 || !Array.isArray(response.data)) {
            throw new Error("Failed to fetch CallTypes");
        }
        // Optional: Clean or process response if needed
        const callTypes = response.data.map((item: any) => ({
            id: item.id,
            name: item.call_type,
            status: item.status
        }));

        return callTypes; // This can now be used in dropdowns, lists, etc.
    } catch (error: any) {
        console.error("Error fetching call types:", error.message || error);
        throw new Error("Unable to fetch call types. Please try again later.");
    }
};
// CallMAnagement --> Fetch Callstatus 
export const fetchCallStatus = async () => {
    try {
        const response = await apiAxios.get('/api/callstatus/');
        if (response.status !== 200 || !Array.isArray(response.data)) {
            throw new Error("Failed to fetch Call Status");
        }
        // Optional: Clean or process response if needed
        const callStatus = response.data.map((item: any) => ({
            id: item.id,
            name: item.call_status,
            status: item.status
        }));

        return callStatus; // This can now be used in dropdowns, lists, etc.
    } catch (error: any) {
        console.error("Error fetching call status:", error.message || error);
        throw new Error("Unable to fetch call status. Please try again later.");
    }
};

// CallMAnagement --> Fetch CallAction 
export const fetchCallAction = async () => {
    try {
        const response = await apiAxios.get('/api/callactions/');
        if (response.status !== 200 || !Array.isArray(response.data)) {
            throw new Error("Failed to fetch Call Action");
        }
        // Optional: Clean or process response if needed
        const callStatus = response.data.map((item: any) => ({
            id: item.id,
            name: item.call_action_name,
            status: item.status
        }));

        return callStatus; // This can now be used in dropdowns, lists, etc.
    } catch (error: any) {
        console.error("Error fetching call actions:", error.message || error);
        throw new Error("Unable to fetch call actions. Please try again later.");
    }
};

// CallManagememntList
export const fetchProfileCallManagement = async (profileId: string) => {
    try {
        const response = await apiAxios.get(`/api/profile-call-management/list/`, {
            params: { profile_id: profileId }
        });
        if (response.status !== 200 || !Array.isArray(response.data)) {
            throw new Error("Failed to fetch Call Managemen");
        }
        return response.data;
    } catch (error: any) {
        console.error("Error fetching profile call management data:", error.message || error);
        throw new Error("Unable to fetch profile call management. Please try again later.");
    }
};

// create CallMAnagement
export const creatCallManagement = async (profileID: string, ProfileStatusID: string, OwnerID: string, comments: string, CallType?: string, CallStatus?: string, CallAction?: string, NextCallDate?: string, FutureAction?: string, NextDateAction?: string, WorkAssign?: string) => {
    try {
        const formData = new FormData();
        formData.append("profile_id", profileID);
        formData.append("profile_status_id", ProfileStatusID);
        formData.append("owner_id", OwnerID);
        formData.append("comments", comments);
        // formData.append("call_type_id", CallType);
        // Only append if provided
        if (CallType) {
            formData.append("call_type_id", CallType);
        }
        if (CallStatus) {
            formData.append("call_status_id", CallStatus);
        }
        if (CallAction) {
            formData.append("callaction_today_id", CallAction);
        }
        if (NextCallDate) {
            formData.append("next_calldate", NextCallDate);
        }
        if (FutureAction) {
            formData.append("future_actiontaken_id", FutureAction);
        }
        if (NextDateAction) {
            formData.append("next_dateaction_point", NextDateAction);
        }
        if (WorkAssign) {
            formData.append("work_asignid", WorkAssign);
        }
        const response = await apiAxios.post('/api/profile-call-management/create/', formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        console.log("call Management created successfully", response);
        if (!response.data || response.status !== 201) {
            throw new Error("Failed to create Call Management");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error creating CallManagement", error.message || error);
        throw new Error("Unable to create callMangement. Please try again later.");
    }
};

//Admin Details--> create MarriageSettleDetails
export const createMarriageSettleDetails = async (
    profileID: string,
    OwnerID: string,
    MarriageDate: string,
    GroomBrideFatherName: string,
    GroomBrideVysysaID: string,
    EngagementDate: string,
    MarriagePhotoDetails: string,
    EngagementPhotoDetails: string,
    AdminMarriageComments: string,
    GroomBrideName: string,
    GroomBrideCity: string,
    SettledThru: string,
    SettledThruOthers: string,
    MarriageComments: string,
    MarriageInvitationDetails: string,
    EngagementInvitationDetails: string,
    AdminSettledThru: string,
    AdminSettledThruOthers: string,
    MarriageLocation: string,
    InstagramAccept: string,
    WishCardAccept: string,
) => {
    try {
        const formData = new FormData();
        formData.append("profile_id", profileID);
        formData.append("owner_id", OwnerID);
        // Only append if provided
        if (MarriageDate) {
            formData.append("marriage_date", MarriageDate);
        }
        if (GroomBrideFatherName) {
            formData.append("groombridefathername", GroomBrideFatherName);
        }
        if (GroomBrideVysysaID) {
            formData.append("groom_bride_vysyamala_id", GroomBrideVysysaID);
        }
        if (EngagementDate) {
            formData.append("engagement_date", EngagementDate);
        }
        if (MarriagePhotoDetails) {
            formData.append("marriage_photo_details", MarriagePhotoDetails);
        }
        if (EngagementPhotoDetails) {
            formData.append("engagement_photo_details", EngagementPhotoDetails);
        }
        if (AdminMarriageComments) {
            formData.append("admin_marriage_comments", AdminMarriageComments);
        }
        if (GroomBrideName) {
            formData.append("groom_bride_name", GroomBrideName);
        }
        if (GroomBrideCity) {
            formData.append("groombridecity", GroomBrideCity);
        }
        if (SettledThru) {
            formData.append("settled_thru", SettledThru);
        }
        // if (SettledThruOthers) {
        formData.append("others", SettledThruOthers);
        // }
        if (MarriageComments) {
            formData.append("marriage_comments", MarriageComments);
        }
        if (MarriageInvitationDetails) {
            formData.append("marriage_invitation_details", MarriageInvitationDetails);
        }
        if (EngagementInvitationDetails) {
            formData.append("engagement_invitation_details", EngagementInvitationDetails);
        }
        if (AdminSettledThru) {
            formData.append("admin_settled_thru", AdminSettledThru);
        }
        // if (AdminSettledThruOthers) {
        formData.append("admin_others", AdminSettledThruOthers);
        // }
        if (MarriageLocation) {
            formData.append("marriage_location", MarriageLocation);
        }
        if (WishCardAccept) {
            formData.append("wish_card_accept", WishCardAccept);
        }
        if (InstagramAccept) {
            formData.append("instagram_accept", InstagramAccept);
        }
        const response = await apiAxios.post('/api/marriage-settle-details/create/', formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        console.log("Marriage Settle Details created successfully", response);
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to create Marriage Settle Details");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error creating Marriage Settle Details", error.message || error);
        throw new Error("Unable to create Marriage Settle Details. Please try again later.");
    }
};


// AdminDetails --> PaymentDetails
export const updatePaymentDetails = async (
    profileID: string,
    PaymentType: string,
    OwnerID: string,
    Status: string,
    PaymentRefno: string,
    DiscountAmount: string
) => {
    try {
        const formData = new FormData();
        formData.append("profile_id", profileID);
        formData.append("payment_type", PaymentType);
        formData.append("status", Status);
        formData.append("owner_id", OwnerID);
        formData.append("payment_refno", PaymentRefno);
        if (DiscountAmount) {
            formData.append("discount_amont", DiscountAmount);
        }
        const response = await apiAxios.post('/api/payment-transaction/create/', formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
        console.log("Payment Details created successfully", response);
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to create Payment Details");
        }
        return response.data; // Adjust based on the actual response structure
    } catch (error: any) {
        console.error("Error creating Payment Details", error.message || error);
        throw new Error("Unable to create Payment Details. Please try again later.");
    }
};

//Admin Details --> Payment details
export const fetchPaymentTransactions = async (profileID: string) => {
    try {
        const response = await apiAxios.get(`/api/payment-transaction/list/`, {
            params: {
                profile_id: profileID
            }
        });
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch payment transactions");
        }
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching payment transactions:", error.message || error);
        throw new Error("Unable to fetch payment transactions. Please try again later.");
    }
};

//fetchPaymentTransactions
export const fetchMarriageSettleDetails = async (profileID: string) => {
    try {
        const response = await apiAxios.get(`/api/marriage-settle-details/list/`, {
            params: {
                profile_id: profileID
            }
        });
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch Marriage Settle Details");
        }
        return response.data;
    } catch (error: any) {
        console.error("Error fetching  Marriage Settle Detail:", error.message || error);
        throw new Error("Unable to fetch  Marriage Settle Detail. Please try again later.");
    }
};

// fetchPhotoProofDetails
export const fetchPhotoProofDetails = async (profileID: string) => {
    try {
        const response = await apiAxios.get(`/api/get-photo-proof-details/`, {
            params: {
                profile_id: profileID,
                admin_user_id: adminUserID,
            }
        });
        if (!response.data || response.status !== 200 || response.data.status !== "success") {
            throw new Error("Failed to fetch Photo Proof Details");
        }
        return response.data.data;
    } catch (error: any) {
        console.error("Error fetching Photo Proof Details:", error.message || error);
        throw new Error("Unable to fetch Photo Proof Details. Please try again later.");
    }
};


export const getPhotoProofDetails = async (
    profileID: string,
    imageID: string,
    isDeleted: string,
    imageApproved: string,
    photoPassword: string,
    photoProtection: string,
) => {
    try {
        const formData = new FormData();
        formData.append("profile_id", profileID);
        formData.append("image_id", imageID);
        formData.append("is_deleted", isDeleted);
        formData.append("image_approved", imageApproved);
        formData.append("photo_password", photoPassword);
        formData.append("photo_protection", photoProtection);
        formData.append("admin_user_id", adminUserID ?? '');


        const response = await apiAxios.post('/api/get-photo-proof-details/', formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },

        });

        console.log("Photo Proof Details fetched successfully", response);
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch Photo Proof Details");
        }

        return response.data;
    } catch (error: any) {
        console.error("Error fetching Photo Proof Details", error.message || error);
        throw new Error("Unable to fetch Photo Proof Details. Please try again later.");
    }
};

export const uploadProofFiles = async (
    profileId: string,
    horoscopeFile: File | null,
    idProofFile: File | null,
    divorceFile: File | null, // Assuming the API parameter is 'divorce_file'
    horoscopeAdminFile: File | null, // 1. Add this new parameter
    photoProtection: boolean
) => {
    const formData = new FormData();
    formData.append('profile_id', profileId);

    // Only append files if they exist
    if (horoscopeFile) {
        formData.append('horoscope_file', horoscopeFile);
    }
    if (idProofFile) {
        formData.append('idproof_file', idProofFile);
    }
    if (divorceFile) {
        formData.append('divorcepf_file', divorceFile);
    }

    if (horoscopeAdminFile) {
        formData.append('horoscope_file_admin', horoscopeAdminFile);
    }

    formData.append('photo_protection', photoProtection ? "1" : "0");

    try {
        const response = await apiAxios.post(`auth/Photo_Id_Settings/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading proof files:", error);
        throw error; // Re-throw the error to be caught by the calling function
    }
};


export const deleteFile = async (profileId, modelType, fieldName) => {
    const url = 'https://app.vysyamala.com/api/delete-file/';
    const body = {
        model_type: modelType,
        profile_id: profileId,
        field_name: fieldName,
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // Add any necessary authorization headers here (e.g., Authorization: `Bearer ${token}`)
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        // You might want to get more details from the response body for the error
        throw new Error(`Failed to delete file: ${response.statusText}`);
    }

    // Assuming the API returns a success message or JSON
    return response.json();
};


export const uploadNewProfileImages = async (profileId: string, newFiles: File[]) => {
    // FormData is required for sending files
    const formData = new FormData();

    // 1. Append the profile_id
    formData.append('profile_id', profileId);
    formData.append('admin_user_id', adminUserID ?? '');
    // 2. Append each new image file.
    // The key 'new_image_files' is used for every file.
    // The backend will receive this as a list of files.
    newFiles.forEach((file) => {
        formData.append('new_image_files', file);
    });

    try {
        // Make the POST request to the endpoint
        const response = await apiAxios.post('/auth/ImageSetEdit/', formData, {
            headers: {
                // This header is crucial for file uploads
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading new profile images:", error);
        throw error; // Re-throw the error to be caught by the component
    }
};

//get full ProfileDetails
export const getProfileDetails = async (profileID: string) => {
    try {
        const response = await apiAxios.get(
            `/api/profile_details/${profileID}/`
        );
        console.log("Profile Details fetched successfully", response);
        if (!response.data || response.status !== 200) {
            throw new Error("Failed to fetch Profile Details");
        }
        return response.data;
    } catch (error: any) {
        console.error("Error fetching Profile Details", error.message || error);
        throw new Error("Unable to fetch Profile Details. Please try again later.");
    }
};

//CallManagement --> Admin-list
export const fetchAdminUsers = async () => {
    try {
        const response = await apiAxios.get(
            `/api/admin-users/list/`
        );
        return response.data;
    } catch (error: any) {
        console.error("Error fetching admin users", error.message || error);
        throw new Error("Unable to fetch admin users");
    }
};



// export const fetchProfilestatus = async () => {
//   try {
//     const response = await apiAxios.post(
//       `/api/get_sub_status_master/`,{primary_status:1}
//     );
//     console.log("dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",response)
//     return response.data;
//   } catch (error: any) {
//     console.error("Error fetching admin users", error.message || error);
//     throw new Error("Unable to fetch admin users");
//   }
// };

export const fetchProfilestatus = async (): Promise<SubStatus[]> => {
    try {
        const response = await apiAxios.post(
            `/api/get_sub_status_master/`,
            { primary_status: 1 }
        );
        return response.data.data; // assuming `data` inside response is the array
    } catch (error: any) {
        console.error("Error fetching profile status:", error.message || error);
        throw new Error("Unable to fetch profile status");
    }
};

// Add these API functions to your api/apiConfig.ts file
export const userFieldOfStudy = async (): Promise<any> => {
    try {
        const response = await apiAxios.post(`auth/Get_Field_ofstudy/`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching field of study:", error);
        throw error;
    }
};

export const userDegrees = async (): Promise<any> => {
    try {
        const response = await apiAxios.get(`auth/pref_degree_list/`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching degrees:", error);
        throw error;
    }
};

//call status, Actions, types, particular dropdown api
export const getCallManageMasters = async (): Promise<any> => {
    try {
        const response = await apiAxios.get(`api/callmanage-masters/
`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching call manage masters:", error);
        throw error;
    }
};

//owner - extract Username from these api
export const getUsers = async (): Promise<any> => {
    try {
        const response = await apiAxios.get(`api/users/`);
        return response.data;
    } catch (error: any) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

//call management search
// export const callManagementSearch = async (data: {
//     search_value: any;          // ProfileId / Mobile no
//     owner: any;
//     plan: any;
//     status: any;
//     from_date: any;
//     to_date: any;

//     call_from_date: any;
//     call_to_date: any;
//     next_call_from_date: any;
//     next_call_to_date: any;
//     call_type: any;
//     call_status: any;
//     particulars: any;
//     call_comments: any;

//     action_from_date: any;
//     action_to_date: any;
//     next_action_from_date: any;
//     next_action_to_date: any;
//     action_point: any;
//     next_action: any;
//     action_comments: any;
//     next_action_comments: any;

//     assign_from_date: any;
//     assign_to_date: any;
//     assigned_by: any;
//     assigned_to: any;
//     assign_notes: any;

//     // ✅ Optional (if backend supports pagination)
//     page_number?: number;
//     per_page?: number;
// }) => {
//     try {
//         const response = await apiAxios.post("api/call-management-search/", data);
//         return response.data;
//     } catch (error) {
//         throw error;
//     }
// };


export const callManagementSearch = async (payload: any) => {
    const res = await apiAxios.post("api/call-management-search/", payload);
    return res.data;
};

export const callManagementSearchexport = async (payload: any) => {
    // const res = await apiAxios.post("api/call-management-search/", payload);
     const res = await apiAxios.post('api/call-management-search/', payload, {
            responseType: 'blob', // 👈 Required for binary data like Excel
        });
    return res.data;
};


import axios from 'axios';
import { notify } from '../components/TostNotification';

export const API_URL = 'https://app.vysyamala.com/api'; // Replace with your actual API URL
export const API_URL_Auth = ' https://app.vysyamala.com/auth';
const adminUserID = sessionStorage.getItem('id') || localStorage.getItem('id');
// export const API_URL = 'https://gl9hwr3r-8000.inc1.devtunnels.ms/api'; // Replace with your actual API URL
// export const API_URL_Auth = ' https://gl9hwr3r-8000.inc1.devtunnels.ms/auth';


export const signIn = ` ${API_URL}/login/`;
export const getRecords = () => axios.get(`${API_URL}/logindetails_temp/`);
export const addRecord = (data: any) =>
  axios.post(`${API_URL}/logindetails_temp/`, data);
export const updateRecord = (id: string, data: any) =>
  axios.put(`${API_URL}/logindetails_temp/${id}/`, data);
export const deleteRecord = (id: string) =>
  axios.delete(`${API_URL}/logindetails_temp/${id}/`);
export const approveRecord = (id: string) =>
  axios.post(`${API_URL}/approve/${id}/`);
export const disapproveRecord = (id: string) =>
  axios.post(`${API_URL}/disapprove/${id}/`);
export const baseUrl = `${API_URL}/newprofile_get/`;
export const quickUpload = `${API_URL}/quick-upload/`;
export const ExpressIntrest = `${API_URL}/express-interest/`;

export const fetchStatePreferences = async () => {
  const response = await axios.post(
    'https://app.vysyamala.com/auth/Get_State_Pref/',
  );
  return Object.values(response.data); // Convert response to array
};
export const downloadExcel = async () => {
  const response = await fetch(`${API_URL}/export/excel/`, {
    method: 'GET',
    mode: 'cors',
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const blob = await response.blob();
  return blob;
};




// export const downloadProfilePdf = async (profileId: string, format: string) => {
//   //const apiUrl = 'https://app.vysyamala.com/api/generate_short_profile_pdf/';
//   const apiUrl = `${API_URL}/admin-pdf-with-format/`;
//   try {
//     // Show loading indicator
//     notify('Generating PDF...', { type: 'info' });

//     const response = await fetch(apiUrl, {
//       // method: 'POST',
//        method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         format: format,
//         profile_id: profileId
//       })
//     });

//     if (!response.ok) {
//       throw new Error(`Failed to generate PDF: ${response.statusText}`);
//     }

//     // Get the PDF as a blob
//     const pdfBlob = await response.blob();

//     // Create a URL for the blob
//     const pdfUrl = URL.createObjectURL(pdfBlob);

//     // Try to open in new tab
//     const newWindow = window.open(pdfUrl, '_blank');

//     if (!newWindow) {
//       // If popup blocked, offer download
//       const downloadLink = document.createElement('a');
//       downloadLink.href = pdfUrl;
//       downloadLink.download = `profile_${profileId}_${format}.pdf`;
//       document.body.appendChild(downloadLink);
//       downloadLink.click();
//       document.body.removeChild(downloadLink);
//       notify('PDF downloaded successfully', { type: 'success' });
//     }

//     // Revoke the blob URL after use
//     setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);

//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     notify('Failed to generate PDF. Please try again.', { type: 'error' });
//   }
// };



export const downloadProfilePdf = async (profileId: string, format: string) => {
  const apiUrl = `https://app.vysyamala.com/api/admin-pdf-with-format/?profile_id=${encodeURIComponent(profileId)}&pdf_format=${encodeURIComponent(format)}`;

  try {
    // Show loading indicator
    notify('Generating PDF...', { type: 'info' });

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to generate PDF: ${response.statusText}`);
    }


    const newWindow = window.open(apiUrl, "_blank");
    if (!newWindow) {
      // If popup blocked, offer download
      const downloadLink = document.createElement('a');
      downloadLink.href = apiUrl;
      downloadLink.download = `profile_${profileId}_${format}.pdf`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      notify('PDF downloaded successfully', { type: 'success' });
    }

    // Revoke the blob URL after use
    setTimeout(() => URL.revokeObjectURL(apiUrl), 1000);

  } catch (error) {
    console.error('Error generating PDF:', error);
    notify('Failed to generate PDF. Please try again.', { type: 'error' });
  }
};

// export const getExpressIntrest = async (
//   fromDate: string,
//   toDate: string,
//   states: number[],
//   page:number,
//   rowsPerPage:number
// ) => {
//   const params = new URLSearchParams({
//     from_date: fromDate,
//     to_date: toDate,
//     profile_state: states.join(','),
//     page:page.toString(),
//     page_size:rowsPerPage.toString
//   });

//   const url = `https://app.vysyamala.com/api/express-interest/?${params.toString()}`;
//   const response = await axios.get(url);
//   console.log(response.data)
//   return response.data;
// };

export const getExpressIntrest = async (
  fromDate: string,
  toDate: string,
  states: number[],
  page: number,
  rowsPerPage: number,
  status: string
) => {
  const params = new URLSearchParams({
    from_date: fromDate,
    to_date: toDate,
    page: page.toString(),
    page_size: rowsPerPage.toString(),

  });

  // Only add profile_state if states array is not empty
  if (states && states.length > 0) {
    params.append('profile_state', states.join(','));
  }
  if (status !== "") {
    params.append('status', status);
  }

  const url = `https://app.vysyamala.com/api/express-interest/?${params.toString()}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    // Re-throw the error to be handled by the component
    throw error;
  }
};


// export const getCountries = async () => {
//     return await axios.get(`${API_URL}/countries/`);
// };

// export const addCountry = async (country: any) => {
//     return await axios.post(`${API_URL}/countries/`, country);
// };

// export const updateCountry = async (id: string, country: any) => {
//     return await axios.put(`${API_URL}/countries/${id}/`, country);
// };

// export const deleteCountry = async (id: string) => {
//     return await axios.delete(`${API_URL}/countries/${id}/`);
// };

// Fetch all countries
export const getCountries = async () => {
  return await axios.get(`${API_URL}/countries/`);
};

// Add a new country
export const addCountry = async (countryData: any) => {
  return await axios.post(`${API_URL}/countries/`, countryData);
};

// Update an existing country
export const updateCountry = async (id: string, countryData: any) => {
  return await axios.put(`${API_URL}/countries/${id}/`, countryData);
};

// Delete a country
export const deleteCountry = async (id: string) => {
  return await axios.delete(`${API_URL}/countries/${id}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// State API

// State API
export const getStates = async () => {
  return await axios.get(`${API_URL}/states/`);
};

export const addState = async (state: any) => {
  return await axios.post(`${API_URL}/states/`, state);
};

export const updateState = async (stateId: string, state: any) => {
  return await axios.patch(`${API_URL}/states/${stateId}/`, state);
};

export const deleteState = async (stateId: string) => {
  return await axios.delete(`${API_URL}/states/${stateId}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// export const getStates = async (countryId: string) => {
//     return await axios.get(`${API_URL}/countries/${countryId}/states/`);
// };

// export const addState = async (countryId: string, state: any) => {
//     return await axios.post(`${API_URL}/countries/${countryId}/states/`, state);
// };

// export const updateState = async (countryId: string, stateId: string, state: any) => {
//     return await axios.put(`${API_URL}/countries/${countryId}/states/${stateId}/`, state);
// };

// export const deleteState = async (countryId: string, stateId: string) => {
//     return await axios.delete(`${API_URL}/countries/${countryId}/states/${stateId}/`);
// };

// // District API
// export const getDistricts = async (countryId: string, stateId: string) => {
//     return await axios.get(`${API_URL}/countries/${countryId}/states/${stateId}/districts/`);
// };

// export const addDistrict = async (countryId: string, stateId: string, district: any) => {
//     return await axios.post(`${API_URL}/countries/${countryId}/states/${stateId}/districts/`, district);
// };

// export const updateDistrict = async (countryId: string, stateId: string, districtId: string, district: any) => {
//     return await axios.put(`${API_URL}/countries/${countryId}/states/${stateId}/districts/${districtId}/`, district);
// };

// export const deleteDistrict = async (countryId: string, stateId: string, districtId: string) => {
//     return await axios.delete(`${API_URL}/countries/${countryId}/states/${stateId}/districts/${districtId}/`);
// };

// District API
export const getDistricts = async () => {
  return await axios.get(`${API_URL}/districts/`);
};

export const addDistrict = async (district: any) => {
  return await axios.post(`${API_URL}/districts/`, district);
};

export const updateDistrict = async (districtId: string, district: any) => {
  return await axios.put(`${API_URL}/districts/${districtId}/`, district);
};

export const deleteDistrict = async (districtId: string) => {
  return await axios.delete(`${API_URL}/districts/${districtId}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};


export const getDistrictss = async (stateId: number) => {
  return await axios.get(`${API_URL}/districts/?state_id=${stateId}`);
};

export const getCitiess = async (districtId: number) => {
  return await axios.get(`${API_URL}/cities/?district_id=${districtId}`);
};

// Cities API
export const getCities = async () => {
  return await axios.get(`${API_URL}/cities/`);
};

export const addCity = async (city: any) => {
  return await axios.post(`${API_URL}/cities/`, city);
};

export const updateCity = async (cityId: string, city: any) => {
  return await axios.patch(`${API_URL}/cities/${cityId}/`, city);
};

export const deleteCity = async (cityId: string) => {
  return await axios.delete(`${API_URL}/cities/${cityId}/`, {
    data: {
      admin_user_id: adminUserID,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Fetch all profile_owner
export const getProfileOwner = async () => {
  return await axios.get(`${API_URL}/profile_owner/`);
};

// Add a new ProfileOwner
export const addProfileOwner = async (modeData: any) => {
  return await axios.post(`${API_URL}/profile_owner/`, modeData);
};

// Update an existing ProfileOwner
export const updateProfileOwner = async (id: string, modeData: any) => {
  return await axios.put(`${API_URL}/profile_owner/${id}/`, modeData);
};

// Delete a ProfileOwner
export const deleteProfileOwner = async (id: string) => {
  return await axios.delete(`${API_URL}/profile_owner/${id}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};


// Religions API
export const getreligions = async () => {
  return await axios.get(`${API_URL}/religions/`);
};

export const addreligions = async (religions: any) => {
  return await axios.post(`${API_URL}/religions/`, religions);
};

export const updatereligions = async (id: string, religions: any) => {
  return await axios.put(`${API_URL}/religions/${id}/`, religions);
};

export const deletereligions = async (id: string) => {
  return await axios.delete(`${API_URL}/religions/${id}/`);
};

export const getCastes = async () => {
  return await axios.get(`${API_URL}/castes/`);
};

export const addCaste = async (caste: any) => {
  return await axios.post(`${API_URL}/castes/`, caste);
};

export const updateCaste = async (id: string, caste: any) => {
  return await axios.put(`${API_URL}/castes/${id}/`, caste);
};

export const deleteCaste = async (id: string) => {
  return await axios.delete(`${API_URL}/castes/${id}/`);
};

// Profile Holders API
export const getProfileHolders = async () => {
  return await axios.get(`${API_URL}/profile-holders/`);
};

export const addProfileHolder = async (profileHolder: any) => {
  return await axios.post(`${API_URL}/profile-holders/`, profileHolder);
};

export const updateProfileHolder = async (id: string, profileHolder: any) => {
  return await axios.put(`${API_URL}/profile-holders/${id}/`, profileHolder);
};

export const deleteProfileHolder = async (id: string) => {
  return await axios.delete(`${API_URL}/profile-holders/${id}/`);
};

// Parents Occupations API
export const getParentsOccupations = async () => {
  return await axios.get(`${API_URL}/parents-occupations/`);
};

export const addParentsOccupation = async (parentsOccupation: any) => {
  return await axios.post(`${API_URL}/parents-occupations/`, parentsOccupation);
};

export const updateParentsOccupation = async (
  id: string,
  parentsOccupation: any,
) => {
  return await axios.put(
    `${API_URL}/parents-occupations/${id}/`,
    parentsOccupation,
  );
};

export const deleteParentsOccupation = async (id: string) => {
  return await axios.delete(`${API_URL}/parents-occupations/${id}/`);
};

// UG Degrees API
export const getUgDegrees = async () => {
  return await axios.get(`${API_URL}/ug-degrees/`);
};

export const addUgDegree = async (ugDegree: any, adminUserID: string) => {
  return await axios.post(`${API_URL}/ug-degrees/`, {
    ...ugDegree,
    admin_user_id: adminUserID,
  });
};

export const updateUgDegree = async (id: string, ugDegree: any, adminUserID: string) => {
  return await axios.put(`${API_URL}/ug-degrees/${id}/`, {
    ...ugDegree,
    admin_user_id: adminUserID,
  });
};

export const deleteUgDegree = async (id: string, adminUserID: string) => {
  return await axios.delete(`${API_URL}/ug-degrees/${id}/`, {
    data: { admin_user_id: adminUserID } // DELETE requires body in axios
  });
};

// Annual Incomes API
export const getAnnualIncomes = async () => {
  return await axios.get(`${API_URL}/annual-incomes/`);
};

export const addAnnualIncome = async (annualIncome: any) => {
  return await axios.post(`${API_URL}/annual-incomes/`, annualIncome);
};

export const updateAnnualIncome = async (id: string, annualIncome: any) => {
  return await axios.put(`${API_URL}/annual-incomes/${id}/`, annualIncome);
};

export const deleteAnnualIncome = async (id: string) => {
  return await axios.delete(`${API_URL}/annual-incomes/${id}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};
// Place of Births API
export const getPlaceOfBirths = async () => {
  return await axios.get(`${API_URL}/place-of-births/`);
};

export const addPlaceOfBirth = async (placeOfBirth: any) => {
  return await axios.post(`${API_URL}/place-of-births/`, placeOfBirth);
};

export const updatePlaceOfBirth = async (id: string, placeOfBirth: any) => {
  return await axios.put(`${API_URL}/place-of-births/${id}/`, placeOfBirth);
};

export const deletePlaceOfBirth = async (id: string) => {
  return await axios.delete(`${API_URL}/place-of-births/${id}/`);
};

// Birth Stars API
export const getBirthStars = async () => {
  const response = await axios.get(`${API_URL}/birth-stars/`);
  console.log("birthStarsData", response.data);
  return response.data;
};

export const addBirthStar = async (birthStar: any) => {
  return await axios.post(`${API_URL}/birth-stars/`, birthStar);
};

export const updateBirthStar = async (id: string, birthStar: any) => {
  return await axios.put(`${API_URL}/birth-stars/${id}/`, birthStar);
};

export const deleteBirthStar = async (id: string) => {
  return await axios.delete(`${API_URL}/birth-stars/${id}/`);
};

// Rasis API
export const getRasis = async () => {
  return await axios.get(`${API_URL}/rasis/`);
};

export const addRasi = async (rasi: any) => {
  return await axios.post(`${API_URL}/rasis/`, rasi);
};

export const updateRasi = async (id: string, rasi: any) => {
  return await axios.put(`${API_URL}/rasis/${id}/`, rasi);
};

export const deleteRasi = async (id: string) => {
  return await axios.delete(`${API_URL}/rasis/${id}`);
};

// Lagnams API
export const getLagnams = async () => {
  return await axios.get(`${API_URL}/lagnams/`);
};

export const addLagnam = async (lagnam: any) => {
  return await axios.post(`${API_URL}/lagnams/`, lagnam);
};

export const updateLagnam = async (id: string, lagnam: any) => {
  return await axios.put(`${API_URL}/lagnams/${id}/`, lagnam);
};

export const deleteLagnam = async (id: string) => {
  return await axios.delete(`${API_URL}/lagnams/${id}/`);
};

// Dasa Balances API
export const getDasaBalances = async () => {
  return await axios.get(`${API_URL}/dasa-balances/`);
};

export const addDasaBalance = async (dasaBalance: any) => {
  return await axios.post(`${API_URL}/dasa-balances/`, dasaBalance);
};

export const updateDasaBalance = async (id: string, dasaBalance: any) => {
  return await axios.put(`${API_URL}/dasa-balances/${id}/`, dasaBalance);
};

export const deleteDasaBalance = async (id: string) => {
  return await axios.delete(`${API_URL}/dasa-balances/${id}/`);
};

//familytypes
// Fetch all family types
export const getFamilyTypes = async () => {
  return await axios.get(`${API_URL}/family-types/`);
};

// Add a new family type
export const addFamilyType = async (familyType: any) => {
  return await axios.post(`${API_URL}/family-types/`, familyType);
};

// Update an existing family type
export const updateFamilyType = async (id: string, familyType: any) => {
  return await axios.put(`${API_URL}/family-types/${id}/`, familyType);
};

// Delete a family type by ID
export const deleteFamilyType = async (id: string) => {
  return await axios.delete(`${API_URL}/family-types/${id}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

//familystatus
// Fetch all family statuses
export const getFamilyStatuses = async () => {
  return await axios.get(`${API_URL}/family-statuses/`);
};

// Add a new family status
export const addFamilyStatus = async (familyStatus: any) => {
  return await axios.post(`${API_URL}/family-statuses/`, familyStatus);
};

// Update an existing family status
export const updateFamilyStatus = async (id: string, familyStatus: any) => {
  return await axios.put(`${API_URL}/family-statuses/${id}/`, familyStatus);
};

// Delete a family status by ID
export const deleteFamilyStatus = async (id: string) => {
  return await axios.delete(`${API_URL}/family-statuses/${id}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

//Data Table Url
// export const getDataTable = async () => {
//     return await axios.get(`${API_URL}/newprofile_get/?page=1&page_size=10&ordering=&search=`);
// };

// Fetch all properties
export const getProperties = async () => {
  return await axios.get(`${API_URL}/properties/`);
};

// Add a new property
export const addProperty = async (propertyData: any) => {
  return await axios.post(`${API_URL}/properties/`, propertyData);
};

// Update an existing property
export const updateProperty = async (id: string, propertyData: any) => {
  return await axios.put(`${API_URL}/properties/${id}/`, propertyData);
};

// Delete a property
export const deleteProperty = async (id: string) => {
  return await axios.delete(`${API_URL}/properties/${id}/`);
};

// Fetch all education levels
export const getEducationLevels = async () => {
  return await axios.get(`${API_URL}/education-levels/`);
};

// Add a new education level
export const addEducationLevel = async (educationData: any) => {
  return await axios.post(`${API_URL}/education-levels/`, educationData);
};

// Update an existing education level
export const updateEducationLevel = async (id: string, educationData: any) => {
  return await axios.put(`${API_URL}/education-levels/${id}/`, educationData);
};

// Delete an education level
export const deleteEducationLevel = async (id: string) => {
  return await axios.delete(`${API_URL}/education-levels/${id}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};


//COMPLEXION
// Fetch all complexions

export const getComplexion = async () => {
  return await axios.get(`${API_URL}/complexions/`);
};

// Add a new complexions
export const addComplection = async (familyValue: any) => {
  return await axios.post(`${API_URL}/complexions/`, familyValue);
};
// Update an existing complexion
export const updateComplexions = async (id: string, familyValue: any) => {
  return await axios.put(`${API_URL}/complexions/${id}/`, familyValue);
};
// Delete a complexion
export const deleteComplexions = async (id: string) => {
  return await axios.delete(`${API_URL}/complexions/${id}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Fetch all heights
export const getHeights = async () => {
  return await axios.get(`${API_URL}/heights/`);
};

// Add a new height
export const addHeight = async (heightData: any) => {
  return await axios.post(`${API_URL}/heights/`, heightData);
};

// Update an existing height
export const updateHeight = async (id: string, heightData: any) => {
  return await axios.put(`${API_URL}/heights/${id}/`, heightData);
};

// Delete a height
export const deleteHeight = async (id: string) => {
  return await axios.delete(`${API_URL}/heights/${id}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};


// Fetch all marital statuses
export const getMaritalStatuses = async () => {
  return await axios.get(`${API_URL}/marital-statuses/`);
};

// Add a new marital status
export const addMaritalStatus = async (statusData: any) => {
  return await axios.post(`${API_URL}/marital-statuses/`, statusData);
};

// Update an existing marital status
export const updateMaritalStatus = async (id: string, statusData: any) => {
  return await axios.put(`${API_URL}/marital-statuses/${id}/`, statusData);
};

// Delete a marital status
export const deleteMaritalStatus = async (id: string) => {
  return await axios.delete(`${API_URL}/marital-statuses/${id}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};


// Fetch all state preferences
export const getStatePrefs = async () => {
  return await axios.get(`${API_URL}/stateprefs/`);
};

// Add a new state preference
export const addStatePref = async (stateValue: any) => {
  return await axios.post(`${API_URL}/stateprefs/`, stateValue);
};

// Update an existing state preference
export const updateStatePref = async (id: string, stateValue: any) => {
  return await axios.put(`${API_URL}/stateprefs/${id}/`, stateValue);
};

// Delete a state preference
export const deleteStatePref = async (id: string) => {
  return await axios.delete(`${API_URL}/stateprefs/${id}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};


export const getDataTable = async (
  search: string = '',
  orderBy: string = '',
  order: 'asc' | 'desc' = 'asc',
  page: number = 1,
  pageSize: number = 10,
) => {
  try {
    const ordering = order === 'asc' ? orderBy : `-${orderBy}`;
    const response = await axios.get(`${API_URL}/newprofile_get/`, {
      params: {
        page: page,
        page_size: pageSize,
        ordering: ordering,
        search: search,
      },
    });
    return response;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const apiService = {
  getBirthStars: () => axios.get(`${API_URL}/birth-stars/`),
  getPlaceOfBirths: () => axios.get(`${API_URL}/place-of-births/`),
  getRasis: () => axios.get(`${API_URL}/rasis/`),
  getLagnams: () => axios.get(`${API_URL}/lagnams/`),
  getDasaBalances: () => axios.get(`${API_URL}/dasa-balances/`),

  getBirthStar: (id: number) => axios.get(`${API_URL}/birth-stars/${id}/`),
  getPlaceOfBirth: (id: number) =>
    axios.get(`${API_URL}/place-of-births/${id}/`),
  getRasi: (id: string) => axios.get(`${API_URL}/rasis/${id}/`),
  getLagnam: (id: number) => axios.get(`${API_URL}/lagnams/${id}/`),
  getDasaBalance: (id: number) => axios.get(`${API_URL}/dasa-balances/${id}/`),

  createBirthStar: (data: any) => axios.post(`${API_URL}/birth-stars/`, data),
  createPlaceOfBirth: (data: any) =>
    axios.post(`${API_URL}/place-of-births/`, data),
  createRasi: (data: any) => axios.post(`${API_URL}/rasis/`, data),
  createLagnam: (data: any) => axios.post(`${API_URL}/lagnams/`, data),
  createDasaBalance: (data: any) =>
    axios.post(`${API_URL}/dasa-balances/`, data),

  updateBirthStar: (id: number, data: any) =>
    axios.put(`${API_URL}/birth-stars/${id}/`, data),
  updatePlaceOfBirth: (id: number, data: any) =>
    axios.put(`${API_URL}/place-of-births/${id}/`, data),
  updateRasi: (id: string, data: any) =>
    axios.put(`${API_URL}/rasis/${id}/`, data),
  updateLagnam: (id: number, data: any) =>
    axios.put(`${API_URL}/lagnams/${id}/`, data),
  updateDasaBalance: (id: number, data: any) =>
    axios.put(`${API_URL}/dasa-balances/${id}/`, data),

  deleteBirthStar: (id: number) =>
    axios.delete(`${API_URL}/birth-stars/${id}/`),
  deletePlaceOfBirth: (id: number) =>
    axios.delete(`${API_URL}/place-of-births/${id}/`),
  deleteRasi: (id: string) => axios.delete(`${API_URL}/rasis/${id}/`),
  deleteLagnam: (id: number) => axios.delete(`${API_URL}/lagnams/${id}/`),
  deleteDasaBalance: (id: number) =>
    axios.delete(`${API_URL}/dasa-balances/${id}/`),
};

export const BirthStarApi = ' https://app.vysyamala.com/api/birth-stars/';
export const GothramApi = ' https://app.vysyamala.com/api/gothrams/';

//rasi api

export const fetchRasi = `${API_URL}/rasis/`;
// lagnam
export const lagnamApi = `${API_URL}/lagnams/`;
// dasabalance
export const dasaBalanCeApi = ` ${API_URL}/dasa-balances/`;

//familyvalues
// Fetch all family Values
export const getFamilyValues = async () => {
  return await axios.get(`${API_URL}/family-values/`);
};

// Add a new family value
export const addFamilyValue = async (familyValue: any) => {
  return await axios.post(`${API_URL}/family-values/`, familyValue);
};
// Update an existing family value
export const updateFamilyValue = async (id: string, familyValue: any) => {
  return await axios.put(`${API_URL}/family-values/${id}/`, familyValue);
};
// Delete a family Value by ID
export const deleteFamilyValue = async (id: string) => {
  return await axios.delete(`${API_URL}/family-values/${id}/`, {
    data: {
      admin_user_id: adminUserID,   // <-- RAW JSON body
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
};

//addprofile register flow
export const addProfileApi = `${API_URL}/add-profile/`;
//editprofile
// export const editProfileApi = `${API_URL}/edit-profile`;
export const editProfileApi = `${API_URL}/edit-profile-with-permission`;
//matching profile
export const matchingProfile = `${API_URL_Auth}/Get_prof_list_match/`;
export const matchingProfileApi = `${API_URL}/Get_prof_list_match/`;
export const CToCReceivedProfileApi = `${API_URL}/call_action_received/`;
export const suggestedProfileApi = `${API_URL}/Get_suggest_list_match/`;
export const ViewedProfilesProfileApi = `${API_URL}/Viewed_profiles/`;
export const visitorProfileApi = `${API_URL}/Visitor_profiles/`
export const GetPhotoRequestProfileApi = `${API_URL}/Get_photo_request/`;
export const LoginDetailsApi = `${API_URL}/login-details/`;
export const VysyaAssistProfileApi = `${API_URL}/vysassist/`;
export const PersonalNotesProfileApi = `${API_URL}/Personal_notes/`;
export const ExpressInterestProfileApi = `${API_URL}/Express_interest/`;
export const ExpressInterestMutualApi = `${API_URL}/Express_interest_mutual/`;
export const ExpressInterestReceivedApi = `${API_URL}/Express_interest_received/`;
//profileImageApproval
export const profileImgApproval = `${API_URL}/get_profile-images_approval/`;
//photo request
export const photoRequest = `${API_URL}/photo-requests/`;

//addOrUpdateProfileHolder
export const addOrUpdateProfileHolder = `https://app.vysyamala.com/api/profile-holders/`;

///cms page
export const cmsFetchData = `${API_URL}/page-list/`;
export const cmsDeleteData = `${API_URL}/page/delete/`;
//award galary
export const awardList = `${API_URL}/awards_list/`;
export const awadrDelete = `${API_URL}/awards/delete/`;
export const awardEdit = `${API_URL}/awards/edit/`;
export const awards = `${API_URL}/awards/`;
//homepage
export const homePageApi = `${API_URL}/homepage/`;
export const homePageImgUpload = `${API_URL}/upload-image/`;
//success story
export const successStoryList = `${API_URL}/success_stories_list/`;
export const successStoryDelete = `${API_URL}/success_stories/delete/`;

//edit success story
export const sucessStoriesApi = `${API_URL}/success_stories/`;
export const successStoryEdit = `${API_URL}/success_stories/edit/`;

//admin settings
export const adminsettings = `${API_URL}/admin-settings/`;
export const adminSettingsUpdate = ` ${API_URL}/admin-settings/update/`;

//edit profile page
export const getParentOccupation = `https://app.vysyamala.com/auth/Get_Parent_Occupation/`;
//vys assist
export const vysAssistApi = `${API_URL}/profile-vys-assist/`;

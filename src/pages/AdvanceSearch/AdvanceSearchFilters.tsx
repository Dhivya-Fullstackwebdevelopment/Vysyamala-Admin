import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotifyError } from '../../common/Toast/ToastMessage';
import {
    userAnnualIncome,
    userEducation,
    userFamilyStatus,
    userMaritalStatus,
    userState,
    userMembership,
    getMembershipPlans,
    getProfileHolder,
} from '../../api/apiConfig';
import { getBirthStars } from '../../services/api';
import { getEditProfileViewStatus } from '../../action';
import { Button, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import { fetchFieldOfStudy, fetchDegree } from '../../action';
import Select from 'react-select';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

// Interfaces
interface AnnualIncome { income_id: number; income_description: string; }
interface MaritalStatus { marital_sts_id: number; marital_sts_name: string; }
interface HighestEducation { education_id: number; education_description: string; }
interface State { State_Pref_id: number; State_name: string; }
interface Membership { id: number; plan_name: string; plan_price: string; }
interface FamilyStatus { family_status_id: number; family_status_name: string; }
interface ProfileStatus { status_code: number; status_name: string; }
export interface GetDegree { degeree_id: string; degeree_description: string; }
export interface getFieldOfStudy { study_id: string; study_description: string; }
interface ProfileHolder {
    owner_id: number;
    owner_description: string;
}

interface AdvanceSearchFiltersProps {
    onFilterSubmit: (filters: any) => void;
    loading: boolean;
}

const AdvanceSearchFilters = ({ onFilterSubmit, loading }: AdvanceSearchFiltersProps) => {
    // State declarations
    const [profileID, setProfileID] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [ageFrom, setAgeFrom] = useState('');
    const [ageTo, setAgeTo] = useState('');
    const [gender, setGender] = useState('');
    const [combinedContact, setCombinedContact] = useState('');
    const [emailId, setEmailId] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [fatherOccupation, setFatherOccupation] = useState('');
    const [motherName, setMotherName] = useState('');
    const [motherOccupation, setMotherOccupation] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [lastActionDate, setLastActionDate] = useState('');
    const [lastActionToDate, setLastActionToDate] = useState('');
    const [regFromDate, setRegFromDate] = useState('');
    const [regToDate, setRegToDate] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [cityText, setCityText] = useState('');
    const [selectedProfileStatus, setSelectedProfileStatus] = useState('');
    const [createdBy, setCreatedBy] = useState('');
    const [address, setAddress] = useState('');
    const [adminComments, setAdminComments] = useState('');
    const [nri, setNri] = useState(''); // Updated to use dropdown values
    const [deleteStatus, setDeleteStatus] = useState('');
    const [secondaryDeleteStatus, setSecondaryDeleteStatus] = useState('');

    // Dropdown Data States
    const [annualIncomes, setAnnualIncomes] = useState<AnnualIncome[]>([]);
    const [minAnnualIncome, setMinAnnualIncome] = useState('');
    const [maxAnnualIncome, setMaxAnnualIncome] = useState('');
    const [educations, setEducations] = useState<HighestEducation[]>([]);
    const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [plans, setPlans] = useState<{ id: number, plan_name: string }[]>([]);
    const [familyStatuses, setFamilyStatuses] = useState<FamilyStatus[]>([]);
    const [birthStars, setBirthStars] = useState<any[]>([]);
    const [profileStatuses, setProfileStatuses] = useState<ProfileStatus[]>([]);

    // Multi-select States
    const [selectedGenders, setSelectedGenders] = useState<any[]>([]);
    const [selectedStates, setSelectedStates] = useState<any[]>([]);
    const [selectedProfileStatuses, setSelectedProfileStatuses] = useState<any[]>([]);
    const [selectedDeleteStatuses, setSelectedDeleteStatuses] = useState<any[]>([]);

    const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<string[]>([]);
    const [selectedBirthStars, setSelectedBirthStars] = useState<string[]>([]);
    const [selectedMembership, setSelectedMembership] = useState<any[]>([]);
    const [selectedEducation, setSelectedEducation] = useState<string>('');
    const [selectedFieldOfStudy, setSelectedFieldOfStudy] = useState<string>('');
    const [fieldOfStudyOptions, setFieldOfStudyOptions] = useState<getFieldOfStudy[]>([]);
    const [degreeOptions, setDegreeOptions] = useState<GetDegree[]>([]);
    const [selectedDegreeValues, setSelectedDegreeValues] = useState<any[]>([]);
    const [otherDegree, setOtherDegree] = useState('');
    const [showOtherInput, setShowOtherInput] = useState(false);
    const [createdHolderOptions, setCreatedHolderOptions] = useState<ProfileHolder[]>([]);
    const [marriageFromDate, setMarriageFromDate] = useState('');
    const [marriageToDate, setMarriageToDate] = useState('');
    const [engagementFromDate, setEngagementFromDate] = useState('');
    const [engagementToDate, setEngagementToDate] = useState('');

    const membershipPlanOptions = plans.map((plan) => ({
        value: plan.id.toString(),
        label: plan.plan_name,
    }));

    const handleMobileChange = (val: string) => {
        // Regex allows only digits. Empty string allowed to let user delete.
        if (/^\d*$/.test(val)) {
            setCombinedContact(val);
        }
    };

    // Logic for Admin Details (No specific limit mentioned, but similar structure)
    const [adminDetails, setAdminDetails] = useState('');

    // Logic for Admin Comments (50 Char limit)
    const handleAdminCommentsChange = (val: string) => {
        if (val.length <= 15) {
            setAdminComments(val);
        }
    };
    useEffect(() => {
        const fetchSearchData = async () => {
            try {
                const [inc, mar, edu, st, mem, fam, star, status, plansData, profileHoldersData] = await Promise.all([
                    userAnnualIncome(), userMaritalStatus(), userEducation(),
                    userState(), userMembership(), userFamilyStatus(),
                    getBirthStars(), getEditProfileViewStatus(), getMembershipPlans(), getProfileHolder(),
                ]);

                setAnnualIncomes(Object.values(inc));
                setMaritalStatuses(Object.values(mar));
                setEducations(Object.values(edu));
                setStates(Object.values(st));
                setMemberships(mem.data || []);
                setFamilyStatuses(Object.values(fam));
                setBirthStars(star);
                setProfileStatuses(status);
                if (plansData && plansData.status) {
                    setPlans(plansData.plans);
                }
                if (profileHoldersData) {
                    setCreatedHolderOptions(Object.values(profileHoldersData));
                }

            } catch (error: any) {
                NotifyError(error.message);
            }
        };
        fetchSearchData();
    }, []);

    const handleMultiSelect = (id: string, current: string[], setter: Function) => {
        setter(current.includes(id) ? current.filter(i => i !== id) : [...current, id]);
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const fields = await fetchFieldOfStudy();
                setFieldOfStudyOptions(fields);
            } catch (error) {
                console.error("Error loading education data", error);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        const loadDegrees = async () => {
            if (selectedEducation && selectedFieldOfStudy && ['1', '2', '3', '4'].includes(selectedEducation)) {
                try {
                    const data = await fetchDegree(selectedEducation, selectedFieldOfStudy);
                    setDegreeOptions(data);
                } catch (error) {
                    setDegreeOptions([]);
                }
            }
        };
        loadDegrees();
    }, [selectedEducation, selectedFieldOfStudy]);

    const handleDegreeChange = (selectedOptions: any) => {
        setSelectedDegreeValues(selectedOptions || []);
        const hasOthers = selectedOptions?.some((opt: any) => opt.value === '86');
        setShowOtherInput(!!hasOthers);
        if (!hasOthers) setOtherDegree('');
    };

    const customSelectStyles = {
        control: (base: any) => ({
            ...base,
            borderColor: "black",
            "&:hover": { borderColor: "black" },
        }),
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        // const hasProfileID = profileID.trim() !== "";
        // const hasName = name.trim() !== "";
        // const hasDOB = dob !== "";

        // if (!hasProfileID && !hasName && !hasDOB) {
        //     NotifyError("Please select at least one filter from Profile ID, Name, or Date of Birth before searching.");
        //     return; // Stop the function here
        // }

        const isAnyFilterSelected =
            profileID.trim() !== "" ||
            name.trim() !== "" ||
            dob !== "" ||
            ageFrom.trim() !== "" ||
            ageTo.trim() !== "" ||
            selectedGenders.length > 0 ||
            combinedContact.trim() !== "" ||
            emailId.trim() !== "" ||
            address.trim() !== "" ||
            lastActionDate !== "" ||
            lastActionToDate !== "" ||
            regFromDate !== "" ||
            regToDate !== "" ||
            minAnnualIncome !== "" ||
            maxAnnualIncome !== "" ||
            fatherName.trim() !== "" ||
            fatherOccupation.trim() !== "" ||
            motherName.trim() !== "" ||
            motherOccupation.trim() !== "" ||
            businessName.trim() !== "" ||
            companyName.trim() !== "" ||
            selectedStates.length > 0 ||
            cityText.trim() !== "" ||
            createdBy !== "" ||
            adminComments.trim() !== "" ||
            nri !== "" ||
            selectedProfileStatuses.length > 0 ||
            selectedDeleteStatuses.length > 0 ||
            selectedMaritalStatus.length > 0 ||
            selectedBirthStars.length > 0 ||
            selectedMembership.length > 0 ||
            selectedEducation !== "" ||
            selectedFieldOfStudy !== "" ||
            selectedDegreeValues.length > 0 ||
            otherDegree.trim() !== "" ||
            adminDetails.trim() !== "" ||
            marriageFromDate !== "" ||
            marriageToDate !== "" ||
            engagementFromDate !== "" ||
            engagementToDate !== "";

        if (!isAnyFilterSelected) {
            NotifyError("Please select at least one filter from Profile ID, Name, or Date of Birth before searching.");
            return;
        }


        if (profileID.trim() !== "") {
            const upperID = profileID.toUpperCase();
            if (!upperID.startsWith("VF") && !upperID.startsWith("VM")) {
                NotifyError("Profile ID must start with VF or VM.");
                return;
            }
        }

        // 3. Specific Validation for Mobile Number (if filled)
        if (combinedContact.trim() !== "") {
            if (combinedContact.length < 5) {
                NotifyError("Mobile number must be at least 5 digits.");
                return;
            }
        }

        // FIXED: Added missing fields (ageTo, gender, combinedContact, emailId)
        const filters = {
            profileID, name, dob, ageFrom, ageTo,
            gender: selectedGenders.map(g => g.value).join(','),
            combinedContact, emailId,
            lastActionDate, // This will map to last_action_date
            lastActionToDate,
            regFromDate,    // This will map to from_doj
            regToDate,
            minAnnualIncome, maxAnnualIncome,
            fatherName, fatherOccupation, motherName, motherOccupation,
            businessName, companyName,
            states: selectedStates.map(s => s.value).join(','),
            cityText, createdBy, address, adminComments, nri,
            profileStatus: selectedProfileStatuses.map(ps => ps.value).join(','),
            deleteStatus: selectedDeleteStatuses.map(ds => ds.value).join(','),
            secondaryDeleteStatus,
            selectedMaritalStatus: selectedMaritalStatus.join(","),
            selectedBirthStars: selectedBirthStars.join(","),
            selectedMembership: selectedMembership.map((m) => m.value).join(","),
            highestEducation: selectedEducation,
            fieldOfStudy: selectedFieldOfStudy,
            degrees: selectedDegreeValues.map(d => d.value).join(','),
            otherDegree: otherDegree,
            adminDetails, // Ensure this state is used
            marriageFromDate,
            marriageToDate,
            engagementFromDate,
            engagementToDate,
        };
        onFilterSubmit(filters);
    };


    return (
        <form onSubmit={handleSubmit} className="container mx-auto p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-8 pb-4">
                <h1 className="text-3xl font-bold text-black">Advance Search</h1>
                <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{ minWidth: '180px', height: '45px', fontWeight: 'bold' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Search Profiles'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex flex-col">
                    <FilterInput label="Profile ID" value={profileID} onChange={setProfileID} />
                    <span className="text-xs text-black mt-1">Note: Must start with <b>VF</b> or <b>VM</b></span>
                </div>
                <FilterInput label="Name" value={name} onChange={setName} />
                <FilterInput label="Date of Birth" type="date" value={dob} onChange={setDob} />
            </div>

            <CollapsibleSection title="Contact Details">
                {/* <CollapsibleSection title="Contact Details"> */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex flex-col">
                        <FilterInput label="Mobile / Phone / WhatsApp" value={combinedContact} onChange={handleMobileChange} />
                        <span className="text-xs text-black mt-1">Note: Minimum <b>5 digits</b></span>
                    </div>
                    <FilterInput label="Email ID" value={emailId} onChange={setEmailId} />
                    <div className="flex flex-col">
                        <FilterInput label="Address" value={address} onChange={setAddress} />
                    </div>
                </div>
            </CollapsibleSection>


            <CollapsibleSection title="Demographics">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex gap-4 w-full">
                        <div className="w-40">
                            <FilterInput label="Age From" type="number" value={ageFrom} onChange={setAgeFrom} />
                        </div>
                        <div className="w-40">
                            <FilterInput label="Age To" type="number" value={ageTo} onChange={setAgeTo} />
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">Gender</label>
                        <Select
                            isMulti
                            styles={customSelectStyles}
                            options={[
                                { value: 'male', label: 'Male' },
                                { value: 'female', label: 'Female' }
                            ]}
                            value={selectedGenders}
                            onChange={(val) => setSelectedGenders(val || [])}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">NRI</label>
                        <select
                            className="border p-2 rounded border-black"
                            value={nri}
                            onChange={(e) => setNri(e.target.value)}
                        >
                            <option value="">Select Option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                            {/* <option value="Both">Both</option> */}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-8 pt-6">
                    <div className="bg-white rounded">
                        <h3 className="font-bold text-lg mb-4 text-black pb-2">Marital Status</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
                            {maritalStatuses.map(m => (
                                <FormControlLabel key={m.marital_sts_id} className="m-0"
                                    control={<Checkbox size="small" checked={selectedMaritalStatus.includes(m.marital_sts_id.toString())} onChange={() => handleMultiSelect(m.marital_sts_id.toString(), selectedMaritalStatus, setSelectedMaritalStatus)} />}
                                    label={<span className="text-sm text-gray-700">{m.marital_sts_name}</span>}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Location">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">State</label>
                        <Select
                            isMulti
                            styles={customSelectStyles}
                            options={states.map(s => ({ value: s.State_Pref_id.toString(), label: s.State_name }))}
                            value={selectedStates}
                            onChange={(val) => setSelectedStates(val || [])}
                        />
                    </div>
                    <FilterInput label="City" value={cityText} onChange={setCityText} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Family Details">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    <FilterInput label="Father Name" value={fatherName} onChange={setFatherName} />
                    <FilterInput label="Father Occupation" value={fatherOccupation} onChange={setFatherOccupation} />
                    <FilterInput label="Mother Name" value={motherName} onChange={setMotherName} />
                    <FilterInput label="Mother Occupation" value={motherOccupation} onChange={setMotherOccupation} />
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">Family Status</label>
                        <select className="border p-2 rounded border-black" onChange={(e) => { /* Handle change if needed */ }}>
                            <option value="">Select Status</option>
                            {familyStatuses.map(fam => <option key={fam.family_status_id} value={fam.family_status_id}>{fam.family_status_name}</option>)}
                        </select>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Education & Profession">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">Highest Education</label>
                        <select className="border p-2 rounded border-black" value={selectedEducation} onChange={(e) => { setSelectedEducation(e.target.value); setSelectedFieldOfStudy(''); setSelectedDegreeValues([]); }}>
                            <option value="">Select Education</option>
                            {educations.map(edu => <option key={edu.education_id} value={edu.education_id}>{edu.education_description}</option>)}
                        </select>
                    </div>

                    {['1', '2', '3', '4'].includes(selectedEducation) && (
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1 text-black">Field of Study</label>
                            <select className="border p-2 rounded border-black" value={selectedFieldOfStudy} onChange={(e) => { setSelectedFieldOfStudy(e.target.value); setSelectedDegreeValues([]); }}>
                                <option value="">Select Field</option>
                                {fieldOfStudyOptions.map(field => <option key={field.study_id} value={field.study_id}>{field.study_description}</option>)}
                            </select>
                        </div>
                    )}

                    {selectedFieldOfStudy && (
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1 text-black">Degree</label>
                            <Select
                                isMulti
                                options={degreeOptions.map(d => ({ value: d.degeree_id.toString(), label: d.degeree_description }))}
                                value={selectedDegreeValues}
                                onChange={handleDegreeChange}
                                styles={{ control: (base) => ({ ...base, borderColor: 'black', '&:hover': { borderColor: 'black' } }) }}
                            />
                        </div>
                    )}
                    <FilterInput label="Company Name" value={companyName} onChange={setCompanyName} />
                    <FilterInput label="Business Name (Groom / Bride)" value={businessName} onChange={setBusinessName} />
                    <div className="flex gap-2 w-full max-w-md">
                        <div className="w-1/2 flex flex-col">
                            <label className="font-semibold mb-1 text-black">Min Annual Income</label>
                            <select className="border p-2 rounded border-black" value={minAnnualIncome} onChange={(e) => setMinAnnualIncome(e.target.value)}>
                                <option value="">Select Min</option>
                                {annualIncomes.map(inc => <option key={inc.income_id} value={inc.income_id}>{inc.income_description}</option>)}
                            </select>
                        </div>
                        <div className="w-1/2 flex flex-col">
                            <label className="font-semibold mb-1 text-black">Max Annual Income</label>
                            <select className="border p-2 rounded border-black" value={maxAnnualIncome} onChange={(e) => setMaxAnnualIncome(e.target.value)}>
                                <option value="">Select Max</option>
                                {annualIncomes.map(inc => <option key={inc.income_id} value={inc.income_id}>{inc.income_description}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Horoscope / Astro Details">
                <div className="bg-white rounded">
                    <h3 className="font-bold text-lg mb-4 text-black pb-2">Birth Stars</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-1">
                        {birthStars.map(s => (
                            <FormControlLabel key={s.id} className="m-0"
                                control={<Checkbox size="small" checked={selectedBirthStars.includes(s.id.toString())} onChange={() => handleMultiSelect(s.id.toString(), selectedBirthStars, setSelectedBirthStars)} />}
                                label={<span className="text-sm text-gray-700 whitespace-nowrap">{s.star}</span>}
                            />
                        ))}
                    </div>
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Membership & Status">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">Membership Plan</label>

                        <Select
                            isMulti
                            options={membershipPlanOptions}
                            value={selectedMembership}
                            onChange={(selected) => setSelectedMembership(selected || [])}
                            placeholder="Select Plans"
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: "black",
                                    "&:hover": { borderColor: "black" },
                                }),
                            }}
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">Profile Status</label>
                        <Select
                            isMulti
                            styles={customSelectStyles}
                            options={profileStatuses.map(ps => ({ value: ps.status_code.toString(), label: ps.status_name }))}
                            value={selectedProfileStatuses}
                            onChange={(val) => {
                                setSelectedProfileStatuses(val || []);
                                // Reset delete status if 'Deleted' (4) is not selected
                                if (!val?.some(v => v.value === '4')) setSelectedDeleteStatuses([]);
                            }}
                        />
                    </div>

                    {selectedProfileStatuses.some(v => v.value === '4') && (
                        <div className="flex flex-col">
                            <label className="font-semibold mb-1 text-black">Secondary Status</label>
                            <Select
                                isMulti
                                styles={customSelectStyles}
                                options={[
                                    { value: "18", label: "Got Married" },
                                    { value: "19", label: "Marriage settled" },
                                    { value: "20", label: "Duplicate" },
                                    { value: "21", label: "Fake Profile" },
                                    { value: "22", label: "Others" }
                                ]}
                                value={selectedDeleteStatuses}
                                onChange={(val) => setSelectedDeleteStatuses(val || [])}
                            />
                        </div>
                    )}
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Dates & Activity">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                    <FilterInput label="Reg From Date" type="date" value={regFromDate} onChange={setRegFromDate} />
                    <FilterInput label="Reg To Date" type="date" value={regToDate} onChange={setRegToDate} />
                    <FilterInput label="Last Action From Date" type="date" value={lastActionDate} onChange={setLastActionDate} />
                    <FilterInput label="Last Action To Date" type="date" value={lastActionToDate} onChange={setLastActionToDate} />
                    <FilterInput label="Marriage From Date" type="date" value={marriageFromDate} onChange={setMarriageFromDate} />
                    <FilterInput label="Marriage To Date" type="date" value={marriageToDate} onChange={setMarriageToDate} />
                    <FilterInput label="Engagement From Date" type="date" value={engagementFromDate} onChange={setEngagementFromDate} />
                    <FilterInput label="Engagement To Date" type="date" value={engagementToDate} onChange={setEngagementToDate} />
                </div>
            </CollapsibleSection>

            <CollapsibleSection title="Admin Controls">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">Created By</label>
                        <select className="border p-2 rounded border-black" value={createdBy} onChange={(e) => setCreatedBy(e.target.value)}>
                            <option value="">Select Created By</option>
                            {createdHolderOptions.map((holder) => (
                                <option key={holder.owner_id} value={holder.owner_id}>{holder.owner_description}</option>
                            ))}
                        </select>
                    </div>
                    <FilterInput
                        label="Admin Details"
                        value={adminDetails}
                        onChange={setAdminDetails}
                    />
                    <FilterInput label="Admin Comments" value={adminComments} onChange={handleAdminCommentsChange} />
                </div>
            </CollapsibleSection>
        </form >
    );
};

const CollapsibleSection = ({ title, children }: { title: string, children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="mt-8 bg-white rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-center cursor-pointer select-none" onClick={() => setIsOpen(!isOpen)}>
                <h2 className="text-xl font-bold text-black pb-2">{title}</h2>
                <span className="text-2xl font-bold">
                    {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
                </span>
            </div>
            {isOpen && <div className="mt-4">{children}</div>}
        </div>
    );
};

const FilterInput = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
    <div className="flex flex-col">
        <label className="font-semibold mb-1 text-black">{label}</label>
        <input type={type} placeholder={placeholder} className="border p-2 rounded border-gray-400 focus:border-black outline-none" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
);

export default AdvanceSearchFilters;
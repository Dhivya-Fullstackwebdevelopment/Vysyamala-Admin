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
} from '../../api/apiConfig';
import { getBirthStars } from '../../services/api';
import { getEditProfileViewStatus } from '../../action';
import { Button, CircularProgress, Checkbox, FormControlLabel } from '@mui/material';
import { fetchFieldOfStudy, fetchDegree } from '../../action'; // Ensure these are imported
import Select from 'react-select';

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

interface AdvanceSearchFiltersProps {
    onFilterSubmit: (filters: any) => void;
    loading: boolean;
}

const AdvanceSearchFilters = ({ onFilterSubmit, loading }: AdvanceSearchFiltersProps) => {
    // New State declarations for Advance Search
    const [profileID, setProfileID] = useState('');
    const [name, setName] = useState('');
    const [dob, setDob] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [combinedContact, setCombinedContact] = useState(''); // Combined Mobile, Phone, WhatsApp
    const [emailId, setEmailId] = useState('');
    const [fatherName, setFatherName] = useState('');
    const [fatherOccupation, setFatherOccupation] = useState('');
    const [motherName, setMotherName] = useState('');
    const [motherOccupation, setMotherOccupation] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [lastActionDate, setLastActionDate] = useState('');
    const [regFromDate, setRegFromDate] = useState('');
    const [regToDate, setRegToDate] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [cityText, setCityText] = useState(''); // Open text box for city mapping
    const [createdBy, setCreatedBy] = useState('');
    const [address, setAddress] = useState('');
    const [adminComments, setAdminComments] = useState('');
    const [nri, setNri] = useState('');
    const [deleteStatus, setDeleteStatus] = useState('');
    const [secondaryDeleteStatus, setSecondaryDeleteStatus] = useState('');

    // Dropdown Data States
    const [annualIncomes, setAnnualIncomes] = useState<AnnualIncome[]>([]);
    const [educations, setEducations] = useState<HighestEducation[]>([]);
    const [maritalStatuses, setMaritalStatuses] = useState<MaritalStatus[]>([]);
    const [states, setStates] = useState<State[]>([]);
    const [memberships, setMemberships] = useState<Membership[]>([]);
    const [plans, setPlans] = useState<{ id: number, plan_name: string }[]>([]);
    const [familyStatuses, setFamilyStatuses] = useState<FamilyStatus[]>([]);
    const [birthStars, setBirthStars] = useState<any[]>([]);
    const [profileStatuses, setProfileStatuses] = useState<ProfileStatus[]>([]);

    // Multi-select States
    const [selectedMaritalStatus, setSelectedMaritalStatus] = useState<string[]>([]);
    const [selectedBirthStars, setSelectedBirthStars] = useState<string[]>([]);
    const [selectedMembership, setSelectedMembership] = useState('');
    const [selectedEducation, setSelectedEducation] = useState<string>('');
    const [selectedFieldOfStudy, setSelectedFieldOfStudy] = useState<string>('');
    const [fieldOfStudyOptions, setFieldOfStudyOptions] = useState<getFieldOfStudy[]>([]);
    const [degreeOptions, setDegreeOptions] = useState<GetDegree[]>([]);
    const [selectedDegreeValues, setSelectedDegreeValues] = useState<any[]>([]); // For Multi-select
    const [otherDegree, setOtherDegree] = useState('');
    const [showOtherInput, setShowOtherInput] = useState(false);

    useEffect(() => {
        const fetchSearchData = async () => {
            try {
                const [inc, mar, edu, st, mem, fam, star, status, plansData] = await Promise.all([
                    userAnnualIncome(), userMaritalStatus(), userEducation(),
                    userState(), userMembership(), userFamilyStatus(),
                    getBirthStars(), getEditProfileViewStatus(), getMembershipPlans(),
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
                // ... your existing Promise.all logic ...
                const fields = await fetchFieldOfStudy();
                setFieldOfStudyOptions(fields);
            } catch (error) {
                console.error("Error loading education data", error);
            }
        };
        fetchInitialData();
    }, []);

    // Fetch Degrees when Education or Field changes
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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const filters = {
            profileID, name, dob, age, gender, combinedContact, emailId,
            fatherName, fatherOccupation, motherName, motherOccupation,
            businessName, companyName, lastActionDate, regFromDate, regToDate,
            selectedState, cityText, createdBy, address, adminComments, nri,
            deleteStatus, secondaryDeleteStatus,
            selectedMaritalStatus: selectedMaritalStatus.join(","),
            selectedBirthStars: selectedBirthStars.join(","),
            selectedMembership,
            highestEducation: selectedEducation,
            fieldOfStudy: selectedFieldOfStudy,
            degrees: selectedDegreeValues.map(d => d.value).join(','),
            otherDegree: otherDegree,
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
                {/* Basic Info */}
                <FilterInput label="Profile ID" value={profileID} onChange={setProfileID} />
                <FilterInput label="Name" value={name} onChange={setName} />
                <FilterInput label="Date of Birth" type="date" value={dob} onChange={setDob} />
                <FilterInput label="Age" type="number" value={age} onChange={setAge} />

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">Gender</label>
                    <select className="border p-2 rounded border-black" value={gender} onChange={(e) => setGender(e.target.value)}>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>

                {/* Contact Info Combined */}
                <FilterInput
                    label="Mobile / Phone / WhatsApp"
                    value={combinedContact}
                    onChange={setCombinedContact}
                />
                <FilterInput label="Email ID" value={emailId} onChange={setEmailId} />
                <FilterInput label="Created By" value={createdBy} onChange={setCreatedBy} />

                {/* Family Info */}
                <FilterInput label="Father Name" value={fatherName} onChange={setFatherName} />
                <FilterInput label="Father Occupation" value={fatherOccupation} onChange={setFatherOccupation} />
                <FilterInput label="Mother Name" value={motherName} onChange={setMotherName} />
                <FilterInput label="Mother Occupation" value={motherOccupation} onChange={setMotherOccupation} />

                {/* Professional Info */}
                <FilterInput label="Business Name (Groom / Bride)" value={businessName} onChange={setBusinessName} />
                <FilterInput label="Company Name" value={companyName} onChange={setCompanyName} />

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">Annual Income</label>
                    <select className="border p-2 rounded  border-black">
                        <option value="">Select Annual Income</option>
                        {annualIncomes.map(inc => <option key={inc.income_id} value={inc.income_id}>{inc.income_description}</option>)}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">Family Status</label>
                    <select className="border p-2 rounded  border-black">
                        <option value="">Select Status</option>
                        {familyStatuses.map(fam => <option key={fam.family_status_id} value={fam.family_status_id}>{fam.family_status_name}</option>)}
                    </select>
                </div>

                {/* Dates */}
                <FilterInput label="Last Action Date" type="date" value={lastActionDate} onChange={setLastActionDate} />
                <FilterInput label="Reg From Date" type="date" value={regFromDate} onChange={setRegFromDate} />
                <FilterInput label="Reg To Date" type="date" value={regToDate} onChange={setRegToDate} />

                {/* Location */}
                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">State</label>
                    <select className="border p-2 rounded  border-black" value={selectedState} onChange={(e) => setSelectedState(e.target.value)}>
                        <option value="">Select State</option>
                        {states.map(s => <option key={s.State_Pref_id} value={s.State_Pref_id}>{s.State_name}</option>)}
                    </select>
                </div>

                <FilterInput
                    label="City"
                    value={cityText}
                    onChange={(val) => setCityText(val)}
                />

                {/* Statuses */}
                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">Profile Status</label>
                    <select className="border p-2 rounded border-black">
                        <option value="">Select Status</option>
                        {profileStatuses.map(s => <option key={s.status_code} value={s.status_code}>{s.status_name}</option>)}
                    </select>
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">Delete Status</label>
                    <select className="border p-2 rounded border-black" value={deleteStatus} onChange={(e) => setDeleteStatus(e.target.value)}>
                        <option value="">Select Reason</option>
                        <option value="Got Married">Got Married</option>
                        <option value="Marriage settled">Marriage settled</option>
                        <option value="Duplicate">Duplicate</option>
                        <option value="Fake Profile">Fake Profile</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                {/* Secondary Status Logic */}
                {(deleteStatus === 'Got Married' || deleteStatus === 'Marriage settled') && (
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">Secondary Status </label>
                        <select className="border-2 border-black p-2 rounded" value={secondaryDeleteStatus} onChange={(e) => setSecondaryDeleteStatus(e.target.value)}>
                            <option value="">Select Option</option>
                            <option value="Vysyamala">Vysyamala</option>
                            <option value="Others">Others</option>
                        </select>
                    </div>
                )}

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">NRI</label>
                    <input
                        type="text"
                        className="border p-2 rounded border-black outline-none focus:border-blue-500"
                        value={nri}
                        onChange={(e) => setNri(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">Membership Plan</label>
                    <select
                        className="border p-2 rounded border-black"
                        value={selectedMembership}
                        onChange={(e) => setSelectedMembership(e.target.value)}
                    >
                        <option value="">Select Plan</option>
                        {plans.map(plan => (
                            <option key={plan.id} value={plan.id}>
                                {plan.plan_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">Highest Education</label>
                    <select
                        className="border p-2 rounded border-black"
                        value={selectedEducation}
                        onChange={(e) => {
                            setSelectedEducation(e.target.value);
                            setSelectedFieldOfStudy(''); // Reset dependents
                            setSelectedDegreeValues([]);
                        }}
                    >
                        <option value="">Select Education</option>
                        {educations.map(edu => (
                            <option key={edu.education_id} value={edu.education_id}>{edu.education_description}</option>
                        ))}
                    </select>
                </div>

                {/* Field of Study - Conditional */}
                {['1', '2', '3', '4'].includes(selectedEducation) && (
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">Field of Study</label>
                        <select
                            className="border p-2 rounded border-black"
                            value={selectedFieldOfStudy}
                            onChange={(e) => {
                                setSelectedFieldOfStudy(e.target.value);
                                setSelectedDegreeValues([]);
                            }}
                        >
                            <option value="">Select Field</option>
                            {fieldOfStudyOptions.map(field => (
                                <option key={field.study_id} value={field.study_id}>{field.study_description}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Degree Multi-select - Conditional */}
                {selectedFieldOfStudy && (
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">Degree</label>
                        <Select
                            isMulti
                            options={degreeOptions.map(d => ({ value: d.degeree_id.toString(), label: d.degeree_description }))}
                            value={selectedDegreeValues}
                            onChange={handleDegreeChange}
                            styles={{
                                control: (base) => ({
                                    ...base,
                                    borderColor: 'black',
                                    '&:hover': { borderColor: 'black' }
                                })
                            }}
                        />
                    </div>
                )}

                {/* Other Degree Specific Field - Conditional */}
                {/* {showOtherInput && (
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1 text-black">Specific Degree Field</label>
                        <input
                            type="text"
                            className="border p-2 rounded border-black outline-none"
                            value={otherDegree}
                            onChange={(e) => setOtherDegree(e.target.value)}
                        />
                    </div>
                )} */}
            </div>

            {/* Multi-Select Sections */}
            {/* Multi-Select Sections */}
            <div className="flex flex-col gap-8 mt-8  pt-6">

                {/* Marital Status Section */}
                <div className="bg-white rounded ">
                    <h3 className="font-bold text-lg mb-4 text-black pb-2">Marital Status</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-2">
                        {maritalStatuses.map(m => (
                            <FormControlLabel
                                key={m.marital_sts_id}
                                className="m-0"
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={selectedMaritalStatus.includes(m.marital_sts_id.toString())}
                                        onChange={() => handleMultiSelect(m.marital_sts_id.toString(), selectedMaritalStatus, setSelectedMaritalStatus)}
                                    />
                                }
                                label={<span className="text-sm text-gray-700">{m.marital_sts_name}</span>}
                            />
                        ))}
                    </div>
                </div>

                {/* Birth Stars Section - Horizontal Grid Layout */}
                <div className="bg-white rounded ">
                    <h3 className="font-bold text-lg mb-4 text-black pb-2">Birth Stars</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-x-4 gap-y-1">
                        {birthStars.map(s => (
                            <FormControlLabel
                                key={s.id}
                                className="m-0"
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={selectedBirthStars.includes(s.id.toString())}
                                        onChange={() => handleMultiSelect(s.id.toString(), selectedBirthStars, setSelectedBirthStars)}
                                    />
                                }
                                label={<span className="text-sm text-gray-700 whitespace-nowrap">{s.star}</span>}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Text Area Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">Address</label>
                    <textarea className="border p-2 rounded border-black h-24" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="flex flex-col">
                    <label className="font-semibold mb-1 text-black">Admin Comments</label>
                    <textarea className="border p-2 rounded border-black h-24" value={adminComments} onChange={(e) => setAdminComments(e.target.value)} />
                </div>
            </div>
        </form>
    );
};

// Helper Input Component
const FilterInput = ({ label, value, onChange, type = "text", placeholder = "" }: any) => (
    <div className="flex flex-col">
        <label className="font-semibold mb-1 text-black">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            className="border p-2 rounded border-gray-400 focus:border-black outline-none"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

export default AdvanceSearchFilters;
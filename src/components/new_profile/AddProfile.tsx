import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { parentSchema } from '../../scema';
import AddProfileForm from './profile_form_components/AddProfileForm';
import FamilyDetailsForm from './profile_form_components/FamilyDetailsForm';
import EducationalDetails from './profile_form_components/EducationalDetails';
import HororScopeDetails from './profile_form_components/HororScopeDetails';
import Partner_preference from './profile_form_components/Partner_preference';
import UpLoadImages from './profile_form_components/UpLoadImages';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { notify, notifyDelete } from '../TostNotification';
import { addProfileApi } from '../../services/api';
import AddonPackeges from './profile_form_components/util/addonPackeges';
import SuggestedProfileForm from './profile_form_components/SuggestedProfile';
// type ParentFormValues = z.infer<typeof parentSchema>;
export interface FormValues {

  AddProfileForm: {
    Profile_name?: string;
    Gender?: 'Male' | 'Female';
    Mobile_no?: string;
    Alt_Mobile_Number?: string;
    Password?: string;
    Profile_address?: string;
    EmailId?: string;
    Profile_country?: string;
    Profile_dob?: string;
    Profile_marital_status?: string;
    Profile_state?: string;
    Profile_city?: string;
    Profile_complexion?: string;
    Profile_district?: string;
    Profile_pincode?: string;
    status?: string;
    Profile_height: string;
    WhatsAppNumber?: string;
    facebook: string;
    linkedin: string;
    Video_url: string;
    Profile_emailid: string;
    Profile_mobile_no: string;
    // Notifcation_enabled?: string; // Optional, as it's not in the original form
    // Addon_package?: string; // Optional field for the plan package
    //Plan_id?: string; // Optional, for tracking plan subscription
    //Last_login_date?: string; // Optional, for user tracking
  }

  FamilyDetailsForm: {
    AboutMyFamily: string;
    UncleGothram: string;
    SuyaGothram: string;
    PropertyWorth: string;
    weight: string;
    MyHobbies: string;
    EyeWear: string;

    // Add the fields relevant to FamilyDetailsForm here
    family_name: string;
    fathername: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    aboutMyself: string;
    FamilyType: string;
    bloodGroup: string;
    PropertyDetails: string;
    FamilyValue: string;
    PhysicallyChallenged: string;
    FamilyStatus: string;
    selectedBrother: string;
    marriedBrother: string;
    selectedSister: string;
    marriedSisters: string;
    physicallyChalanged: 'yes' | 'no';
    Pysically_changed: string;
    physicallyChallengedDetails?: string;
    no_of_children?: number;
    fatherAlive: string;
    motherAlive: string;
    suyaGothramAdmin: string;
    uncleGothramAdmin: string;
  };
  EducationDetails: {
    //ug_degeree: any;
    workCountry: string;
    work_district: string;
    work_city: string;
    work_state: string;
    heighestEducation: string;
    AboutEducation: string;
    workdistrict: string;
    degree: string;
    other_degree: string;
    WorkState: string;
    profession: string;
    company_name: string;
    designation: string;
    profession_details: string;
    business_name: string;
    business_address: string;
    nature_of_business: string;
    AnnualIncome: string;
    ActualIncome: string;
    pincode: string;
    field_ofstudy: string;
    ug_degeree: string;
    CareerPlans: string;
    work_place: string;

  };
  HororScopeDetails: {
    dasa_name: string;
    timeOfBirth: string;
    PlaceofBirth: string;
    BirthStar: string;
    Rasi: string;
    lagnam: string;
    nalikai: string;
    ChevvaiDhosam: string;
    SarpaDhosham: string;
    dhasaBalanceYear: string;
    dhasaBalanceMonth: string;
    dhasaBalanceDay: string;
    didi: string;
    padham?: string;
  };
  PartnerPreference: {
    pref_state: any;
    pref_family_status: any;
    heightFrom: string;
    toHeight: string;
    agePreference: string;
    heightPreference: string;
    ragukethu: string;
    ChevvaiDhosam: string;
    foreignInterest: string;
  };


  SuggestedProfileForm: {
    pref_porutham_star_rasi: string;
    pref_porutham_star: string;
    pref_state: string;
    pref_family_status: string;
    heightFrom: string;
    heightTo: string;
    agePreference: string;
    // heightPreference: string;
    ragukethu: string;
    ChevvaiDhosam: string;
    foreignInterest: string;
    pref_fieldof_study: string;
  };


}

const AddProfile = () => {
  const methods = useForm<FormValues>({
    resolver: zodResolver(parentSchema),
    defaultValues: {
      FamilyDetailsForm: {
        physicallyChalanged: 'no',
        marriedBrother: '0',
        marriedSisters: '0',
        motherAlive: "yes",
        fatherAlive: "yes"

      },
      EducationDetails: {
        work_place: '',
      },
    },

    mode: 'onSubmit', // Validate as the user types/selects
    // reValidateMode: 'onChange', // Revalidate on every change
  });
  const { reset } = methods;
  const [birthStarId, setBirthStarId] = useState<string>('');
  const [gender, setGender] = useState<string>('');
  const [rasiid, setRasiId] = useState<string>('');
  //familyDetail
  const [familyName, setFamilyName] = useState<string>('');
  const [aboutMyFamily, setAboutMyFamily] = useState<string>('');
  const [selectedFamilyType, setSelectedFamilyType] = useState<string>('');
  const [selectedFamilyValues, setSelectedFamilyValues] = useState<string>('');
  const [selectedFamilyStatus, setSelectedFamilyStatus] = useState<string>('');
  const [propertydetail, setPropertyDetail] = useState<string>('');
  const [propertyWorth, setPropertyWorth] = useState<string>('');
  const [suyaGothram, setSuyaGothram] = useState<string>('');
  const [uncleGothram, setUncleGothram] = useState<string>('');
  const [anchesterOrgin, setAnchesterOrgin] = useState('');

  const [profession, setProfession] = useState<number>(0);
  //education details

  //partnerPreference
  const [prefProf, setPrefProf] = useState<number[]>([]);
  const [setMariedStatus, selectSetMaridStatus] = useState<string[]>([]);
  const [AnnualIncomesVal, setAnnualIncomesVal] = useState<string[]>([]);
  const [AnnualIncomesValmax, setAnnualIncomesValMax] = useState<string[]>([]);
  const [prefEducation, setprefEducation] = useState<string[]>();
  const [prefFieldOfStudy, setPrefFieldOfStudy] = useState<string[]>();
  const [prefDegree, setPrefDegree] = useState<string[]>();
  const [prefporuthamstar, setPoruthamstar] = useState<string>('');
  const [preforuthamStarRasi, setPreforuthamStarRasi] = useState<string>('');
  const [preforuthamStarRasiSuggested, setPreforuthamStarRasiSuggested] = useState<string>('');
  const [prefMaritalStatus, setMaritalStaus] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  //hororscope
  const [dasaName, setDasaName] = useState<string>('');
  const [dasabalance, setDasaBalance] = useState<string>('');
  const [horoHint, setHoroHint] = useState<string>('');
  const [rasiKattam, setRasiKattam] = useState<string>('');
  const [amsaKattam, setAmsaKattam] = useState<string>('');
  const [isFamilyDetailsOpen, setIsFamilyDetailsOpen] = useState(true);
  const [isBasicDetailsOpen, setIsBasicDetailsOpen] = useState(true);
  const [isHoroscopeDetailsOpen, setIsHoroscopeDetailsOpen] = useState(true);
  const [isEducationDetailsOpen, setIsEducationDetailsOpen] = useState(true);
  const [isPartnerPreferenceOpen, setIsPartnerPreferenceOpen] = useState(true);
  const [isUploadImagesOpen, setIsUploadImagesOpen] = useState(true);
  const [addonOpen, setAddOnOpen] = useState(true);
  const [error, setError] = useState<any>([]);
  const [isProfileAdded, setIsProfileAdded] = useState(false);
  const [alretSettings, setAlretSetting] = useState('');

  const [AdditionAddOn, setAdditionalAddOn] = useState('');
  const topRef = useRef<HTMLDivElement>(null);
  ////////
  const [multipleImage, setMultipleImage] = useState<(File | null)[]>([]);
  const [horoImage, setHoroImage] = useState<(File | null)[]>([]);
  const [idProof, setIdProof] = useState<(File | null)[]>([]);
  const [divorceProfe, setDevorceProof] = useState<(File | null)[]>([]);
  console.log(horoImage, 'horoImagehoroImagehoroImagehoroImage');
  const [isSuggestedProfileOpen, setIsSuggestedProfileOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileStatus, setProfileStatus] = useState(0)
  const [maritalStatusProbs, setMariedStatusProbs] = useState<boolean | number>(false)
  const [prefFamilyStatusSuggested, setPrefFamilyStatusSuggested] = useState('');
  const [prefStateSuggested, setPrefStateSuggested] = useState('');
  // ADD THESE NEW STATE VARIABLES FOR PARTNER PREFERENCE:
  const [prefFamilyStatusPartner, setPrefFamilyStatusPartner] = useState('');
  const [prefStatePartner, setPrefStatePartner] = useState('');
  const [sugPrefFieldOfStudy, setSugPrefFieldOfStudy] = useState<string[]>();
  const [sugPrefDegree, setSugPrefDegree] = useState<string[]>();
  console.log("sugPrefFieldOfStudy add sugested", sugPrefFieldOfStudy)

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isProfileAdded]);
  const onSubmit = async (data: FormValues) => {
    const isValid = await methods.trigger();
    console.log("Validation Passed?", isValid);
    if (!isValid) {
      console.log("Validation Errors:", methods.formState.errors);
      return;
    }
    console.log("Submitting Data:", data);


    const dasaDay = data.HororScopeDetails.dhasaBalanceDay;
    const dasaMonth = data.HororScopeDetails.dhasaBalanceMonth;
    const dasaYear = data.HororScopeDetails.dhasaBalanceYear;

    // --- CORRECTED LINE ---
    // This creates the desired format "15 Years, 11 Months, 16 Days"
    // It also ensures an empty string is used if any value is missing.
    const dasaBalance = (dasaYear && dasaMonth && dasaDay)
      ? `${dasaYear} Years, ${dasaMonth} Months, ${dasaDay} Days`
      : "";

    const today = new Date();
    const DateOfJoinToday = today.toISOString().split('T')[0];
    //console.log("today",DateOfJoinToday)
    const ownerID = localStorage.getItem('role_id');
    const adminUserID = sessionStorage.getItem('id') || localStorage.getItem('id');
    const add_profile = {
      // owner_id: {
      //   owner_id:ownerID
      // },
      admin_user_id: adminUserID,
      login_details: {
        owner_id: ownerID,
        Mobile_no: data.AddProfileForm.Mobile_no,
        EmailId: data.AddProfileForm.EmailId,
        Profile_alternate_mobile: data.AddProfileForm.Alt_Mobile_Number,
        Profile_whatsapp: data.AddProfileForm.WhatsAppNumber,
        Password: data.AddProfileForm.Password,
        Profile_name: data.AddProfileForm.Profile_name,
        Profile_marital_status: data.AddProfileForm.Profile_marital_status,
        Profile_dob: data.AddProfileForm.Profile_dob,
        Profile_complexion: data.AddProfileForm.Profile_complexion || "",
        Profile_address: data.AddProfileForm.Profile_address,
        Profile_country: data.AddProfileForm.Profile_country,
        Profile_district: data.AddProfileForm.Profile_district,
        Profile_state: data.AddProfileForm.Profile_state,
        Profile_city: data.AddProfileForm.Profile_city,
        Gender: data.AddProfileForm.Gender,
        Profile_pincode: data.AddProfileForm.Profile_pincode,
        status: data.AddProfileForm.status,
        Notifcation_enabled: alretSettings,
        Profile_height: data.AddProfileForm.Profile_height,

        Addon_package: AdditionAddOn,
        DateOfJoin: DateOfJoinToday,
        // DateOfJoin: '2024-11-11',
        Last_login_date: null,
        linkedin: data.AddProfileForm.linkedin,
        facebook: data.AddProfileForm.facebook,
        Video_url: data.AddProfileForm.Video_url,
        Profile_emailid: data.AddProfileForm.Profile_emailid,
        Profile_mobile_no: data.AddProfileForm.Profile_mobile_no,
      },

      family_details: {
        owner_id: ownerID,
        father_name: data.FamilyDetailsForm.fathername,
        father_occupation: data.FamilyDetailsForm.fatherOccupation,
        mother_name: data.FamilyDetailsForm.motherName,
        mother_occupation: data.FamilyDetailsForm.motherOccupation,
        about_self: data.FamilyDetailsForm.aboutMyself,
        weight: data.FamilyDetailsForm.weight,
        eye_wear: data.FamilyDetailsForm.EyeWear,
        family_name: data.FamilyDetailsForm.family_name,
        hobbies: data.FamilyDetailsForm.MyHobbies,
        blood_group: data.FamilyDetailsForm.bloodGroup,
        Pysically_changed: data.FamilyDetailsForm.physicallyChalanged,
        Physically_challenged_details:
          data.FamilyDetailsForm.physicallyChalanged === 'yes'
            ? data.FamilyDetailsForm.physicallyChallengedDetails
            : null,
        no_of_brother: data.FamilyDetailsForm.selectedBrother,
        no_of_sister: data.FamilyDetailsForm.selectedSister,
        no_of_bro_married: data.FamilyDetailsForm.marriedBrother,
        no_of_sis_married: data.FamilyDetailsForm.marriedSisters,
        family_type: data.FamilyDetailsForm.FamilyType,
        family_value: data.FamilyDetailsForm.FamilyValue,
        family_status: data.FamilyDetailsForm.FamilyStatus,
        property_details: data.FamilyDetailsForm.PropertyDetails,
        property_worth: data.FamilyDetailsForm.PropertyWorth,
        suya_gothram: data.FamilyDetailsForm.SuyaGothram,
        uncle_gothram: data.FamilyDetailsForm.UncleGothram,
        ancestor_origin: anchesterOrgin,
        about_family: data.FamilyDetailsForm.AboutMyFamily,
        no_of_children: maritalStatusProbs ? data.FamilyDetailsForm.no_of_children : null,
        father_alive: data.FamilyDetailsForm.fatherAlive,
        mother_alive: data.FamilyDetailsForm.motherAlive,
        suya_gothram_admin: data.FamilyDetailsForm.suyaGothramAdmin || '0',
        uncle_gothram_admin: data.FamilyDetailsForm.uncleGothramAdmin || '0',
      },
      education_details: {
        owner_id: ownerID,
        work_country: data.EducationDetails.workCountry,
        work_district: data.EducationDetails.work_district,
        work_state: data.EducationDetails.work_state,
        work_city: data.EducationDetails.work_city,
        work_place: data.EducationDetails.work_place,
        highest_education: data.EducationDetails.heighestEducation,
        about_edu: data.EducationDetails.AboutEducation,
        field_ofstudy: data.EducationDetails.field_ofstudy,
        degree: data.EducationDetails.degree,
        other_degree: data.EducationDetails.other_degree,
        profession: data.EducationDetails.profession,
        company_name: data.EducationDetails.company_name,
        designation: data.EducationDetails.designation,
        profession_details: data.EducationDetails.profession_details,
        business_name: data.EducationDetails.business_name,
        business_address: data.EducationDetails.business_address,
        nature_of_business: data.EducationDetails.nature_of_business,
        anual_income: data.EducationDetails.AnnualIncome,
        actual_income: data.EducationDetails.ActualIncome,
        work_pincode: data.EducationDetails.pincode,
        // ug_degeree: data.EducationDetails.ug_degeree,
        career_plans: data.EducationDetails.CareerPlans,
      },
      partner_pref_details: {
        owner_id: ownerID,
        pref_marital_status: setMariedStatus.join(','),
        pref_education: prefEducation?.join(','),
        pref_fieldof_study: prefFieldOfStudy?.join(','),
        degree: prefDegree?.join(','),
        pref_anual_income: AnnualIncomesVal.join(','),
        pref_anual_income_max: AnnualIncomesValmax.join(','),
        pref_profession: prefProf.join(','),
        pref_age_differences: data.PartnerPreference.agePreference,
        pref_height_from: data.PartnerPreference.heightFrom,
        pref_height_to: data.PartnerPreference.toHeight,
        pref_chevvai: data.PartnerPreference.ChevvaiDhosam,
        pref_ragukethu: data.PartnerPreference.ragukethu,
        pref_foreign_intrest: data.PartnerPreference.foreignInterest,
        pref_porutham_star: prefporuthamstar,
        pref_porutham_star_rasi: preforuthamStarRasi,
        // pref_family_status: data.PartnerPreference.pref_family_status,
        // pref_state: data.PartnerPreference.pref_state,
        pref_family_status: prefFamilyStatusPartner,
        pref_state: prefStatePartner
      },

      horoscope_details: {
        owner_id: ownerID,
        time_of_birth: data.HororScopeDetails.timeOfBirth,
        place_of_birth: data.HororScopeDetails.PlaceofBirth,
        birthstar_name: data.HororScopeDetails.BirthStar,
        birth_rasi_name: data.HororScopeDetails.Rasi,
        lagnam_didi: data.HororScopeDetails.lagnam,
        chevvai_dosaham: data.HororScopeDetails.ChevvaiDhosam,
        ragu_dosham: data.HororScopeDetails.SarpaDhosham,
        nalikai: data.HororScopeDetails.nalikai,
        dasa_name: data.HororScopeDetails.dasa_name,
        dasa_balance: dasaBalance,
        horoscope_hints: horoHint,
        rasi_kattam: rasiKattam,
        amsa_kattam: amsaKattam,
        didi: data.HororScopeDetails.didi,
        // horoscope_file: horoImage[0],
        padham: data.HororScopeDetails.padham
      },
      suggested_pref_details: {
        owner_id: ownerID,
        pref_marital_status: setMariedStatus.join(','),
        pref_education: prefEducation?.join(','),
        pref_fieldof_study: sugPrefFieldOfStudy?.join(','),
        degree: sugPrefDegree?.join(','),
        pref_anual_income: AnnualIncomesVal.join(','),
        pref_anual_income_max: AnnualIncomesValmax.join(','),
        pref_profession: prefProf.join(','),
        pref_age_differences: data.SuggestedProfileForm.agePreference,
        pref_height_from: data.SuggestedProfileForm.heightFrom,
        pref_height_to: data.SuggestedProfileForm.heightTo,
        pref_chevvai: data.SuggestedProfileForm.ChevvaiDhosam,
        pref_ragukethu: data.SuggestedProfileForm.ragukethu,
        pref_foreign_intrest: data.SuggestedProfileForm.foreignInterest,
        pref_porutham_star: prefporuthamstar || data.SuggestedProfileForm.pref_porutham_star,
        pref_porutham_star_rasi: preforuthamStarRasiSuggested || data.SuggestedProfileForm.pref_porutham_star_rasi,
        pref_family_status: prefFamilyStatusSuggested,
        pref_state: prefStateSuggested
      },
      images: multipleImage,
      Profile_idproof: idProof[0],
      Profile_divorceproof: divorceProfe[0],
      horoscope_file: horoImage[0],
    };

    const clearValue = () => {
      selectSetMaridStatus([]);
      setAnnualIncomesVal([]);
      setAnnualIncomesValMax([]);
      setprefEducation([]);
      setPrefFieldOfStudy([]);
      setSugPrefFieldOfStudy([]);
      setPrefProf([]);
      setMaritalStaus('');
      setPreforuthamStarRasi('');
      setPoruthamstar('');

      setAmsaKattam('');
      setRasiKattam('');
      setHoroHint('');
      setDasaBalance('');
      setBirthStarId('');

      setProfession(0);

      setFamilyName('');
      setAboutMyFamily('');
      setSelectedFamilyValues('');
      setSelectedFamilyType('');
      setSelectedFamilyStatus('');
      setPropertyDetail('');
      setPropertyWorth('');
      setSuyaGothram('');
      setUncleGothram('');
      setAnchesterOrgin('');
      setWeight('');
      setGender('');
      setMultipleImage([]);
      setHoroImage([]);
      setIdProof([]);
      setDevorceProof([]);
    };

    const addProfile = async (add_profile: any) => {
      try {
        const {
          login_details,
          family_details,
          education_details,
          partner_pref_details,
          horoscope_details,
          suggested_pref_details,
          images,
          Profile_idproof,
          Profile_divorceproof,
          horoscope_file,
          owner_id,
        } = add_profile;

        // Create a FormData object
        const formData = new FormData();
        if (owner_id) {
          formData.append('owner_id', owner_id);
        }
        // Append nested JSON objects as strings
        formData.append('login_details', JSON.stringify(login_details));
        formData.append('family_details', JSON.stringify(family_details));
        formData.append('education_details', JSON.stringify(education_details));
        formData.append(
          'partner_pref_details',
          JSON.stringify(partner_pref_details),
        );
        formData.append('suggested_pref_details', JSON.stringify(suggested_pref_details));
        formData.append('horoscope_details', JSON.stringify(horoscope_details));

        // Append file fields (if they exist)
        // Append file fields
        if (horoscope_file instanceof File) {
          formData.append('horoscope_file', horoscope_file);
          console.log(
            'horoscope_file is not a valid File object,horoscope_file is not a valid File objecthoroscope_file is not a valid File objecthoroscope_file is not a valid File object',
          );
        } else {
          console.error('horoscope_file is not a valid File object');
        }
        if (Profile_idproof) {
          formData.append('Profile_idproof', Profile_idproof);
        }

        if (Profile_divorceproof) {
          formData.append('Profile_divorceproof', Profile_divorceproof);
        }

        // Append images
        images.forEach((image: File | string | null) => {
          if (image && typeof image !== 'string') {
            formData.append('images', image);
          }
        });

        const response = await axios.post(addProfileApi, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // This is technically not required, but it can be added.
          },
        });
        let profileStatus = response?.status
        setProfileStatus(profileStatus)
        console.log("kkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk", response.status)
        console.log("API Response:", response.data);


        if (response.status === 201) {
          notify('Profile added successfully');
          navigate('/NewlyRegistered'); // Navigate here directly
          return true; // Return success status
        }
        if (response.status === 201) {
          setIsProfileAdded(!isProfileAdded);
          reset();
          clearValue();
          notify('Profile added successfully');
          sessionStorage.setItem('responseStatus', String(response.status));

          notify('Profile added successfully');
        }
        if (response.status === 200 || response.status === 201) {
          // alert(response.status);

          notify('Profile added successfully');
        } else {
          console.error('Unexpected response:', response.status);
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          // Axios-specific error handling
          console.error('Axios error response:', error.response?.data);
          const errerValue = Object.values(error.response?.data);
          setError(errerValue);
        } else {
          console.error('Unknown error:', error);

          alert(
            'An unknown error occurred. Please check the console for more details.',
          );
        }
      }
    };

    addProfile(add_profile);
  };
  const FamilySetailsRef = useRef<HTMLDivElement | null>(null);
  const AddFormRef = useRef<HTMLDivElement | null>(null);
  const EducationalFormRef = useRef<HTMLDivElement | null>(null);
  const HoroscopeRef = useRef<HTMLDivElement | null>(null);
  const partnerSettingspeRef = useRef<HTMLDivElement | null>(null);
  const suggestedProfileRef = useRef<HTMLDivElement | null>(null);
  const imageUploadRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();


  const formHandleSubmit = async () => {
    const scrollToAndFocus = (ref: React.RefObject<HTMLElement>) => {
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      ref.current?.focus();
    };

    // First ensure all sections are expanded
    if (!isBasicDetailsOpen) {
      setIsBasicDetailsOpen(true);
      scrollToAndFocus(AddFormRef);
      return;
    }
    if (!isFamilyDetailsOpen) {
      setIsFamilyDetailsOpen(true);
      scrollToAndFocus(FamilySetailsRef);
      return;
    }
    if (!isEducationDetailsOpen) {
      setIsEducationDetailsOpen(true);
      scrollToAndFocus(EducationalFormRef);
      return;
    }
    if (!isHoroscopeDetailsOpen) {
      setIsHoroscopeDetailsOpen(true);
      scrollToAndFocus(HoroscopeRef);
      return;
    }
    if (!isPartnerPreferenceOpen) {
      setIsPartnerPreferenceOpen(true);
      scrollToAndFocus(partnerSettingspeRef);
      return;
    }
    if (!isSuggestedProfileOpen) {
      setIsSuggestedProfileOpen(true);
      scrollToAndFocus(suggestedProfileRef);
      return;
    }
    if (!isUploadImagesOpen) {
      setIsUploadImagesOpen(true);
      scrollToAndFocus(imageUploadRef);
      return;
    }

    try {
      setIsSubmitting(true); // Set submitting state to true
      await methods.handleSubmit(onSubmit)(); // Wait for form submission to complete

      // Check if the submission was successful (status 201)
      if (profileStatus === 201) {
        notify("Successfully registered");
        setTimeout(() => {
          navigate('/NewlyRegistered');
        }, 1000);
      }
    } catch (error) {
      console.error("Form submission failed:", error);
      notify("Failed to submit form. Please check your inputs.");
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  useEffect(() => {
    console.log("Form errors:", methods.formState.errors);
  }, [methods.formState.errors]);

  return (
    <div ref={topRef}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className=" p-5 mb-10 max-md:p-0">

          <div ref={AddFormRef}>
            <AddProfileForm
              setAlretSetting={setAlretSetting}
              isBasicDetailsOpen={isBasicDetailsOpen}
              setIsBasicDetailsOpen={setIsBasicDetailsOpen}
              error={error}
              setGender={setGender}
              setMariedStatusProbs={setMariedStatusProbs}
            />
          </div>
          <div ref={FamilySetailsRef}>
            <FamilyDetailsForm
              isFamilyDetailsOpen={isFamilyDetailsOpen}
              setIsFamilyDetailsOpen={setIsFamilyDetailsOpen}
              setFamilyName={setFamilyName}
              setAboutMyFamily={setAboutMyFamily}
              setSelectedFamilyValues={setSelectedFamilyValues}
              selectedFamilyValues={selectedFamilyValues}
              setSelectedFamilyType={setSelectedFamilyType}
              selectedFamilyType={selectedFamilyType}
              setSelectedFamilyStatus={setSelectedFamilyStatus}
              selectedFamilyStatus={selectedFamilyStatus}
              setPropertyDetail={setPropertyDetail}
              setPropertyWorth={setPropertyWorth}
              setSuyaGothram={setSuyaGothram}
              setUncleGothram={setUncleGothram}
              setAnchesterOrgin={setAnchesterOrgin}
              setWeight={setWeight}
              weight={weight}
              maritalStatusProbs={maritalStatusProbs}
            />
          </div>
          <div ref={EducationalFormRef}>
            <EducationalDetails
              isEducationDetailsOpen={isEducationDetailsOpen}
              setIsEducationDetailsOpen={setIsEducationDetailsOpen}
              profession={profession}
              setProfession={setProfession}
            />
          </div>
          <div ref={HoroscopeRef}>
            <HororScopeDetails
              isHoroscopeDetailsOpen={isHoroscopeDetailsOpen}
              setIsHoroscopeDetailsOpen={setIsHoroscopeDetailsOpen}
              setAmsaKattam={setAmsaKattam}
              setRasiKattam={setRasiKattam}
              setHoroHint={setHoroHint}
              setDasaName={setDasaName}
              setBirthStarId={setBirthStarId}
              setRasiId={setRasiId}
            />
          </div>
          <div ref={partnerSettingspeRef}>
            <Partner_preference
              setIsPartnerPreferenceOpen={setIsPartnerPreferenceOpen}
              isPartnerPreferenceOpen={isPartnerPreferenceOpen}
              selectSetMaridStatus={selectSetMaridStatus}
              setAnnualIncomesVal={setAnnualIncomesVal}
              setAnnualIncomesValmax={setAnnualIncomesValMax}
              setPrefEducation={setprefEducation}
              setPrefFieldOfStudy={setPrefFieldOfStudy}
              setPrefDegree={setPrefDegree}
              setPrefProf={setPrefProf}
              setMaritalStaus={setMaritalStaus}
              setPreforuthamStarRasi={setPreforuthamStarRasi}
              setPoruthamstar={setPoruthamstar}
              gender={gender}
              birthStarId={birthStarId}
              rasiid={rasiid}
              setFamilyStatus={setPrefFamilyStatusPartner}
              setPrefState={setPrefStatePartner}
            />
          </div>


          {/* Suggested Profile Form */}
          <div ref={suggestedProfileRef}>
            <SuggestedProfileForm
              setPreforuthamStarRasi={setPreforuthamStarRasiSuggested}
              setPoruthamstar={setPoruthamstar}
              gender={gender}
              birthStarId={birthStarId}
              selectSetMaridStatus={selectSetMaridStatus}
              setPrefEducation={setprefEducation}
              setPrefFieldOfStudy={setSugPrefFieldOfStudy}
              setPrefDegree={setSugPrefDegree}
              setPrefProf={setPrefProf}
              setMaritalStaus={setMaritalStaus}
              setIsSuggestedProfileOpen={setIsSuggestedProfileOpen}
              isSuggestedProfileOpen={isSuggestedProfileOpen}
              setAnnualIncomesVal={setAnnualIncomesVal}
              setAnnualIncomesValmax={setAnnualIncomesValMax}
              rasiid={rasiid}
              setFamilyStatus={setPrefFamilyStatusSuggested}
              setPrefState={setPrefStateSuggested}
            // setPrefState={setPrefState}
            // setFamilyStatus={setFamilyStatus}
            />
          </div>


          <div>
            <UpLoadImages
              error={error}
              setIdProof={setIdProof}
              setHoroImage={setHoroImage}
              setDevorceProof={setDevorceProof}
              setMultipleImage={setMultipleImage}
              isUploadImagesOpen={isUploadImagesOpen}
              setIsUploadImagesOpen={setIsUploadImagesOpen}
            />
          </div>
          {/* <AddonPackeges
            setAdditionalAddOn={setAdditionalAddOn}
            setAddOnOpen={setAddOnOpen}
            addonOpen={addonOpen}
          /> */}
        </form>
      </FormProvider>

      <div className='flex justify-end mt-10'>
        <button
          type="submit"
          onClick={formHandleSubmit}
          disabled={isSubmitting}
          className={`btn btn-primary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            'Save  Profiles'
          )}
        </button>
      </div>
    </div>
  );
};

export default AddProfile;

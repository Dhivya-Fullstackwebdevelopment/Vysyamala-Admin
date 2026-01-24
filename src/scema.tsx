import { z } from 'zod';
export const bloodGroups = [
  { type: 'A+', abbreviation: 'A positive' },
  { type: 'A-', abbreviation: 'A negative' },
  { type: 'B+', abbreviation: 'B positive' },
  { type: 'B-', abbreviation: 'B negative' },
  { type: 'AB+', abbreviation: 'AB positive' },
  { type: 'AB-', abbreviation: 'AB negative' },
  { type: 'O+', abbreviation: 'O positive' },
  { type: 'O-', abbreviation: 'O negative' },
];

const getMinDOB = () => {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today.toISOString().split('T')[0];
};

const genderSchema = z.preprocess(
  (val) => {
    if (typeof val === "string") {
      // Convert to lowercase for validation, then capitalize for storage
      const lowerVal = val.toLowerCase();
      if (lowerVal === "male") return "Male";
      if (lowerVal === "female") return "Female";
      return lowerVal;
    }
    return val;
  },
  z.enum(["Male", "Female"], {
    errorMap: () => ({ message: "Please select a gender" }),
  })
);

export const parentSchema = z.object({
  AddProfileForm: z.object({
    // EmailId: z.string().email("Email address is required"),
    //     EmailId: z
    //   .string()
    //   .email("Invalid email address")
    //   .nullable()
    //   .optional()
    // ,
    EmailId: z
      .string()
      .email("Invalid email address")
      .optional()
      .or(z.literal("")), // allow empty string too

    //  EmailId: z
    //       .string()
    //       .email("Invalid email address")
    //       .regex(
    //         /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    //         "Invalid email format"
    //       ),
    Password: z
      .string()
      .min(
        8,
        "Password must be at least 8 characters with an uppercase letter and special character"
      )
      .regex(
        /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
        "Password must be at least 8 characters with an uppercase letter and special character"
      ),

    //Password: z.string().optional(),
    Profile_name: z.string().min(1, "Name is required"),
    // Gender: z.enum(["male", "female"], {
    //   errorMap: () => ({ message: "Please select a gender" }),
    // }),
    Gender: genderSchema,
    Mobile_no: z
      .string().min(1, 'Mobile Number is required'),
    Alt_Mobile_Number: z.string().optional(),
    WhatsAppNumber: z.string().optional(),
    // Mobile_no: z
    //   .string()
    //   .length(10, 'Mobile number must be exactly 10 digits long')
    //   .regex(/^[0-9]+$/, 'Mobile number must contain only numbers'),
    // ... other fields

    Profile_marital_status: z.string().min(1, "Please select your marital status"),
    Profile_dob: z
      .string()
      .min(1, "Date of Birth is required")
      .refine((val) => new Date(val) <= new Date(getMinDOB()), {
        message: "You must be at least 18 years old",
      }),
    Profile_address: z.string().optional(),
    Profile_country: z.string().min(1, "Country is required"),
    Profile_state: z.string().optional(),
    Profile_district: z.string().optional(),
    Profile_city: z.string().optional(),
    Profile_pincode: z.string().optional(),
    Profile_complexion: z.string().optional(),
    Notifcation_enabled: z.string().optional(),
    Profile_height: z.string().optional(),
    Addon_package: z.string().optional(),
    // Plan_id: z.string().optional(),
    //Last_login_date: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    Video_url: z.string().optional(),
    Profile_emailid: z.string().optional(),
    Profile_mobile_no: z.string().optional(),
  }),

  FamilyDetailsForm: z.object({
    fathername: z.string().min(1, "Father Name is required"),
    fatherOccupation: z.string().optional(),
    motherOccupation: z.string().optional(),
    aboutMyself: z.string().optional(),
    motherName: z.string().optional(),
    bloodGroup: z.string().optional(),
    family_name: z.string().optional(),
    MyHobbies: z.string().optional(),
    weight: z.string().optional(),
    EyeWear: z.string().optional(),
    PropertyDetails: z.string().optional(),
    PropertyWorth: z.string().optional(),
    SuyaGothram: z.string().min(1, "Suya Gothram is required"),
    UncleGothram: z.string().optional(),
    AncestorOrigin: z.string().optional(),
    AboutMyFamily: z.string().optional(),
    FamilyValue: z.string().nullable().optional(),
    FamilyType: z.string().nullable().optional(),
    FamilyStatus: z.string().nullable().optional(),
    selectedBrother: z.string().nullable().optional(),
    marriedBrother: z.string().optional(),
    selectedSister: z.string().nullable().optional(),
    marriedSisters: z.string().optional(),
    physicallyChalanged: z.enum(['yes', 'no']).optional(),
    physicallyChallengedDetails: z.string().optional(),
    // no_of_children: z.number().optional(),
    no_of_children: z.number().int().min(0).max(5).optional().nullable(),
    fatherAlive: z.enum(['yes', 'no']).optional(),
    motherAlive: z.enum(['yes', 'no']).optional(),
    suyaGothramAdmin: z.string().optional(),
    uncleGothramAdmin: z.string().optional(),
  }),

  EducationDetails: z.object({
    workCountry: z.string().optional(),
    work_district: z.string().optional(),
    work_state: z.string().optional(),
    work_city: z.string().optional(),
    heighestEducation: z.string().min(1, "Highest Education Level is required"),
    degree: z.string().optional(),
    other_degree: z.string().optional(),
    field_ofstudy: z.string().optional(),
    AboutEducation: z.string().optional(),
    AnnualIncome: z.string().optional(),
    ActualIncome: z.string().optional(),
    pincode: z.string().optional(),
    CareerPlans: z.string().optional(),
    ///ug_degeree: z.string().min(1, "UG Degree is required").optional(),
    //ug_degeree: z.string().optional(),
    profession: z.string().optional(),
    company_name: z.string().optional(),
    designation: z.string().optional(),
    profession_details: z.string().optional(),
    business_name: z.string().optional(),
    business_address: z.string().optional(),
    nature_of_business: z.string().optional(),
    work_place: z.string().optional(),
  }),

  HororScopeDetails: z.object({
    timeOfBirth: z.string().optional(),
    PlaceofBirth: z.string().min(1, 'Place of birth is required'),
    BirthStar: z.string().min(1, 'BirthStar is required'),
    Rasi: z.string().min(1, 'Birth rasi is required'),
    nalikai: z.string().optional(),
    didi: z.string().optional(),
    lagnam: z.string().optional(),
    ChevvaiDhosam: z.string().optional(),
    SarpaDhosham: z.string().optional(),
    dasa_name: z.string().optional(),
    dhasaBalanceYear: z.string().optional(),
    dhasaBalanceMonth: z.string().optional(),
    dhasaBalanceDay: z.string().optional(),
    padham: z.preprocess(
      (val) => (val === "" || val === undefined ? null : Number(val)),
      z.number().min(1).max(4).optional().nullable()
    ),
  }),
  PartnerPreference: z.object({
    heightFrom: z.string().min(3, 'Height is required'),
    toHeight: z.string().min(3, 'Height is required'),
    agePreference: z.string().min(1, 'Age difference is required'),
    ChevvaiDhosam: z.string().optional(),
    ragukethu: z.string().optional(),

    foreignInterest: z.string().optional(),
    // pref_family_status: z.string().optional(),
    //  pref_state: z.string().optional(),
    pref_porutham_star_rasi: z.string().optional(),
    pref_porutham_star: z.string().optional(),
    pref_family_status: z.string().optional().nullable(), // If you allow null
    pref_state: z.string().optional().nullable(),
  }),

  SuggestedProfileForm: z.object({
    heightFrom: z.string().optional(),
    heightTo: z.string().optional(),
    agePreference: z.string().optional(),
    // agePreference: z.string().min(3,"Age difference is required"),

    heightPreference: z.string().optional(),
    ragukethu: z.string().optional(),
    ChevvaiDhosam: z.string().optional(),
    foreignInterest: z.string().optional(),
    //  pref_family_status: z.string().optional(),
    //  pref_state: z.string().nullable().optional(),
    //  pref_porutham_star_rasi:z.string().min(1, 'Please select Porutham'),
    //  pref_porutham_star:z.string().min(1, 'Please select Porutham'),
    pref_porutham_star_rasi: z.string().optional(),
    pref_porutham_star: z.string().optional(),
    pref_family_status: z.string().optional().nullable(), // If you allow null
    pref_state: z.string().optional().nullable(),
  }),



});

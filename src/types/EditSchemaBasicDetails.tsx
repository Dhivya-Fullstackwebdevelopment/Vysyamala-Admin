import { z } from 'zod';

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

export const EditScheemaBasicDetails = z.object({
  BasicDetail: z.object({
    Name: z.string().min(1, 'Name is required'),
    Profile_height: z.string().optional(),
    // Gender: z.enum(['male', 'female'], {
    //   errorMap: () => ({ message: 'Please select a gender' }),
    // }),
    Gender: genderSchema,
    //  Gender: z.string().min(1, 'Gender is required'),
    Mobile_no: z
      .string().min(1, 'Mobile Number is required'),
    // .min(10, { message: 'Must be a valid mobile number' })
    // .max(14, { message: 'Must be a valid mobile number' }),
    Email: z.string().email('Invalid email address').optional().or(z.literal('')),
    //  Email: z
    //   .string()
    //   .email("Invalid email address")
    //   .regex(
    //     /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    //     "Invalid email format"
    //   ),
    marital_status: z.string().min(1, 'Please select your marital status'),
    dob: z.string()
      .min(1, 'Date of Birth is required')
      .refine(val => new Date(val) <= new Date(getMinDOB()), {
        message: 'You must be at least 18 years old',
      }),
    address: z.string().optional().nullable(),
    country: z.string().min(1, 'Country is required'),
    // Make state and district optional by default
    state: z.string().optional().nullable(),
    district: z.string().optional().nullable(),

    City: z.string().optional().nullable(),
    pincode: z.string().optional().nullable(),
    Alt_Mobile_Number: z.string().optional(),
    // .min(10, 'This field is required')
    // .max(14, 'This field is required'),
    AddOnPackage: z.string().optional(),
    complexion: z.string().optional(),
    status: z.string().min(1, 'Status is required'),
    WhatsAppNumber: z.string().optional(),
    linkedin: z.string().optional(),
    facebook: z.string().optional(),
    Video_url: z.string().optional(),
    Profile_emailid: z.string().optional(),
    Profile_mobile_no: z.string().optional(),
  })
    .refine(
      (data) => {
        // If country = 1, then state is required
        if (data.country === '1') {
          return !!data.state && data.state.trim().length > 0;
        }
        return true;
      },
      {
        message: 'State is required for the selected country.',
        path: ['state'],
      }
    )
    .refine(
      (data) => {
        // If country = 1, then district is required
        if (data.country === '1') {
          return !!data.district && data.district.trim().length > 0;
        }
        return true;
      },
      {
        message: 'District is required for the selected country.',
        path: ['district'],
      }
    ),
})

export interface BasicDetailss {
  BasicDetail: {
    Name: string;
    Gender: 'male' | 'female';
    Mobile_no: string;
    Alt_Mobile_Number: string;
    WhatsAppNumber: string;
    address: string;
    Email: string;
    country: string;
    dob: string;
    marital_status: string;
    state?: string | null;
    City: string;
    complexion: string;
    district?: string | null;
    pincode: string;
    status: string;
    AddOnPackage?: string | null;
    Profile_height: string
    facebook: string;
    linkedin: string;
    Video_url: string;
    Profile_emailid: string;
    Profile_mobile_no: string;
  };
}


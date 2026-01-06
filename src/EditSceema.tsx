import { z } from 'zod';


export const EditScheema = z.object({

  FamilyDetails: z.object({
    fathername: z.string().min(1, 'Father Name is required'),
    father_alive: z.string().optional(),
    mother_alive: z.string().optional(),
    fatherOccupation: z.string().optional(),
    motherOccupation: z.string().optional(),
    AboutMyself: z.string().optional(),
    motherName: z.string().optional(),
    bloodGroup: z.string().optional(),
    // FamilyName: z.string().nullable().transform(val => val || '').pipe(
    //   z.string().min(1, 'Family Name is required')
    // ),

    FamilyName: z.string().nullable(),
    MyHobbies: z.string().optional(),
    EyeWear: z.string().optional(),
    PropertyDetails: z.string().optional(),
    SuyaGothram: z.string().min(1, 'SuyaGothram is required'),
    // UncleGothram: z.string().nullable().transform(val => val || '').pipe(
    //   z.string().min(1, 'Uncle Gothram is required')
    // ),
    UncleGothram: z.string().nullable().optional(),
    AncestorOrigin: z.string().optional(),
    AboutMyFamily: z.string().optional(),
    FamilyValue: z.string().optional(),
    FamilyType: z.string().optional(),
    FamilyStatus: z.string().optional(),
    // PropertyWorth: z.string().nullable().transform(val => val || '').pipe(
    //   z.string().min(1, 'Property Worth is required')
    // ),
    PropertyWorth: z.string().nullable().optional(),
    //kg: z.string().optional(),
    weight: z.string().optional(),
    Physically_challenged_details: z.string().optional(),
    selectedBrother: z.string().optional(),
    marriedBrother: z.string().optional(),
    selectedSister: z.string().optional(),
    marriedSisters: z.string().optional(),
    physicallyChalanged: z.string().optional(),
    no_of_children: z.union([
      z.number().int().min(0).max(5),
      z.undefined()
    ]).optional().transform(val => val === undefined ? null : val),
    // no_of_children:z.number().optional(),
    // suya_gothram_admin:z.number().optional(),
    // uncle_gothram_admin:z.number().optional()
    suya_gothram_admin: z.union([
      z.number(),
      z.string().transform(val => Number(val))
    ]).optional(),
    uncle_gothram_admin: z.union([
      z.number(),
      z.string().transform(val => Number(val))
    ]).optional()
  }),
});



export interface FamilyDetailsValues {
  FamilyDetails: {
    MyHobbies: string;
    EyeWear: string;
    fathername: string;
    fatherOccupation: string;
    motherName: string;
    motherOccupation: string;
    AboutMyself: string;
    FamilyName: string;
    FamilyType: string;
    bloodGroup: string;
    PropertyDetails: string;
    //kg: string;
    weight: string;
    UncleGothram: string;
    FamilyValue: string;
    PhysicallyChallenged: string;
    FamilyStatus: string;
    PropertyWorth: string;
    selectedBrother: string;
    marriedBrother: string | null | undefined | "";
    selectedSister: string;
    marriedSisters: string | null | undefined | "";
    physicallyChalanged: 'yes' | 'no';
    Pysically_changed: string;
    Physically_challenged_details: string;
    SuyaGothram: string;
    AncestorOrigin: string;
    AboutMyFamily: string;
    no_of_children?: number | null;
    suya_gothram_admin: string;
    uncle_gothram_admin: string;
    father_alive: string;
    mother_alive: string
  };
}

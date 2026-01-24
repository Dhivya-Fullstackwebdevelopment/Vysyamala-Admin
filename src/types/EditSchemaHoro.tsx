import { z } from 'zod';

export const EditScheema2 = z.object({
  HororScopeDetails: z.object({
    timeOfBirth: z.string().optional().nullable(),
    PlaceofBirth: z.string().min(1, 'place of birth is required'),
    BirthStar: z.string().min(1, 'BirthStar is required'),
    Rasi: z.string().min(1, 'Birth rasi is required'),
    nalikai: z.string().optional().nullable(),
    lagnam: z.string().optional().nullable(),
    ChevvaiDhosam: z.string().optional().nullable(),
    SarpaDhosham: z.string().optional().nullable(),
    dasaName: z.string().optional().nullable(),
    DasaBalanceDay: z.string().optional(),
    DasaBalanceMonth: z.string().optional(),
    DasaBalanceYear: z.string().optional(),
    horoscopeHints: z.string().optional(),
    rasiKattam: z.string().optional(),
    amsaKattam: z.string().optional(),
    didi: z.string().optional(),
    padham: z.string().optional().nullable(), // We keep it as string for the UI/Form state
  }),

});




export interface HoroScopeDetails {

  HororScopeDetails: {
    timeOfBirth: string;
    PlaceofBirth: string;
    BirthStar: string;
    Rasi: string;
    lagnam: string;
    nalikai: string;
    ChevvaiDhosam: string;
    SarpaDhosham: string;
    dasaName: string;
    DasaBalanceDay: string;
    horoscopeHints: string;
    DasaBalanceMonth: string;
    DasaBalanceYear: string;
    rasiKattam: string;
    amsaKattam: string;
    didi: string;
    padham?: string;
  };
}
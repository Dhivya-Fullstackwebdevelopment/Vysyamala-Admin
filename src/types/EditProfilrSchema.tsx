import { z } from "zod";

const shouldShowMembershipDates =
    (localStorage.getItem("shouldShowMembershipDates") === "true") ||
    (sessionStorage.getItem("shouldShowMembershipDates") === "true");

export const EditSchemaProfileView = z.object({


    profileView: z.object({
        // Addon_package: z.boolean().refine((val) => val === true, {
        //     message: "Addon_package must be selected.",
        //   }),

        Addon_package: z.string().optional(),
        Notifcation_enabled: z.string().optional(),
        //         PaymentExpire:z.string().optional(),
        //         Package_name:z.string().optional(),
        status: z.number().optional(),
        //         DateOfJoin:z.string().optional(),
        //         ProfileId: z.string().optional(),
        Profile_name: z.string().optional(),
        //         Gender:z.string().optional(),
        //         Mobile_no:z.string().optional(),
        //         Profile_for:z.string().optional(),
        //         calc_chevvai_dhosham:z.string().optional(),
        //         calc_raguketu_dhosham:z.string().optional(),
        horoscope_hints: z.string().optional(),
        //         family_status:z.string().optional(),
        //         Admin_comments: z.string().min(3,"minimum three chrecter are required"),
        //         suya_gothram: z.string().optional(),
        //         profile_completion: z.number().optional(),
        //         plan_status: z.number().optional(), // ✅ Change from `string` to `number`



        secondary_status: z.number().optional(), // ✅ Change from `string` to `number`
        primary_status: z.number().optional(),
        profile_image: z.string().optional(),
        // membership_fromdate: z.string().refine((val) => {
        //     if (!val || val.trim() === '') {
        //         return false;
        //     }
        //     return true;
        // }, {
        //     message: "Membership from date is required"
        // }),
        // membership_todate: z.string().refine((val) => {
        //     if (!val || val.trim() === '') {
        //         return false;
        //     }
        //     return true;
        // }, {
        //     message: "Membership to date is required"
        // }),
        membership_fromdate: shouldShowMembershipDates
            ? z.string().min(1, "Membership from date is required")
            : z.string().optional(),

        membership_todate: shouldShowMembershipDates
            ? z.string().min(1, "Membership to date is required")
            : z.string().optional(),

        // membership_fromdate: z.string().optional(),
        // membership_todate: z.string().optional(),
        membership_status: z.string().optional(),
        visit_count: z.number().optional(),
        exp_int_count: z.number().optional(),
        exp_int_lock: z.number().optional(),



        //           mobile_otp_verify:z.object({
        //   Otp_verify: z
        //     .string()
        //     .min(1, { message: "OTP is required" })
        //     .regex(/^\d{6}$/, { message: "OTP must be a 6-digit number" }),
        // })

        mobile_otp_verify: z.union([
            z.string().refine((val) => ["0", "1"].includes(val), {
                message: "Mobile verification is required. Please select Yes or No."
            }),
            z.number().refine((val) => [0, 1].includes(val), {
                message: "Mobile verification is required. Please select Yes or No."
            })
        ]).nullable(),

        admin_user_id: z.number().nullable().optional(), // Add this field
        others: z.string().optional(),
        // mobile_otp_verify: z.union([z.string(), z.number()]).optional()
        // profile_image: z
        // .instanceof(File, { message: "File must be selected" }) // Ensures it's a file
        // .refine((file) => ["image/jpeg", "image/png"].includes(file.type), {
        //   message: "Only JPG or PNG files are allowed",
        // })
        // .refine((file) => file.size <= 2 * 1024 * 1024, {
        //   message: "File size must be less than 2MB",
        // }),
    })
})


export interface profileView {
    age: any;
    valid_till: any;
    profile_image: any;


    profileView: {
        admin_user_id: any;
        Addon_package: string,
        Notifcation_enabled: string,
        PaymentExpire: string,
        Package_name: string,
        status: number,
        DateOfJoin: string,
        ProfileId: string,
        Profile_name: string,
        Gender: string,
        Mobile_no: string,
        Profile_for: string,
        calc_chevvai_dhosham: string | null,
        calc_raguketu_dhosham: string | null,
        horoscope_hints: string,
        family_status: string,
        Admin_comments: string,
        suya_gothram: string,
        profile_completion: number,
        primary_status: string,
        secondary_status: string,
        plan_status: string,
        profile_image: string,
        age: number;
        valid_till: any;
        created_date: string;
        idle_days: string;
        visit_count: number | null;
        exp_int_count: number;
        exp_int_lock: number;
        payment_date: string;
        payment_mode: string;
        add_on_pack_name: string;
        mobile_otp_verify: string | null;
        membership_todate: string | null;
        membership_fromdate: string | null;
        membership_status: string;
        others: string;
    }

}
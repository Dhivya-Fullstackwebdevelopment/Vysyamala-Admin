import { Box, Button, Checkbox, CircularProgress, Dialog, DialogTitle, Divider, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createMarriageSettleDetails, fetchMarriageSettleDetails, fetchPaymentTransactions, updatePaymentDetails } from "../../../../api/apiConfig";
import { useLocation } from "react-router-dom";
import { NotifyError, NotifySuccess } from "../../../../common/Toast/ToastMessage";
interface AdminDetaisProps {
  open: boolean;
  onClose: () => void;
}

//Schema --> MArriageSettled Details
const marriageSettleDetailsSchema = z.object({
  marriage_date: z.string().min(1, "Marriage date is required"),
  groom_bride_name: z.string().optional(),
  groombridefathername: z.string().optional(),
  groombridecity: z.string().optional(),
  groom_bride_vysyamala_id: z.string().optional(),
  settled_thru: z.string().optional(),
  admin_settled_thru: z.string().optional(),
  engagement_date: z.string().optional(),
  marriage_comments: z.string().optional(),
  marriage_photo_details: z.string().optional(),
  marriage_invitation_details: z.string().optional(),
  engagement_photo_details: z.string().optional(),
  engagement_invitation_details: z.string().optional(),
  admin_marriage_comments: z.string().optional(),
  others: z.string().optional(),
  admin_others: z.string().optional(),
  marriage_location: z.string().optional(),
  wish_card_accept: z.string().optional(),
  instagram_accept: z.string().optional(),
});
type MarriageDetailsFormData = z.infer<typeof marriageSettleDetailsSchema>;

//Schema --> Payment details
const paymentDetailsSchema = z.object({
  payment_type: z.string().min(1, "Payment type is required"),
  payment_details: z.string().min(1, "Payment details are required"),
  payment_refno: z.string().min(1, "Payment reference number is required"),
  balance_amount: z.string().optional(),
  discount_amont: z.string().optional(),
});
type PaymentDetailsFormData = z.infer<typeof paymentDetailsSchema>;

export const AdminDetailsPopup: React.FC<AdminDetaisProps> = ({ open, onClose }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const profileId = queryParams.get('profileId');
  // Inside the AdminDetailsPopup component, add state for payment data
  const [paymentData, setPaymentData] = useState<any>(null);
  const [Marriagedetailsdata, setMarriagedetailsdata] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  //Marriage SettledDetails
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MarriageDetailsFormData>({
    resolver: zodResolver(marriageSettleDetailsSchema),
  });

  //payment details
  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    setValue: paymentsetValue,
    watch: paymentwatch,
    formState: { errors: paymentErrors },
  } = useForm<PaymentDetailsFormData>({
    resolver: zodResolver(paymentDetailsSchema),
  });
  const settledThru = watch("settled_thru");
  const adminSettledThru = watch("admin_settled_thru");


  //Marriga Settle Details submit
  const onSubmit = async (data: MarriageDetailsFormData) => {
    try {
      // You'll need to get these values from somewhere (props or context)
      const roleId = localStorage.getItem('id') || sessionStorage.getItem('id');
      const response = await createMarriageSettleDetails(
        String(profileId),
        String(roleId),
        data.marriage_date,
        data.groombridefathername || "",
        data.groom_bride_vysyamala_id || "",
        data.engagement_date || "",
        data.marriage_photo_details || "",
        data.engagement_photo_details || "",
        data.admin_marriage_comments || "",
        data.groom_bride_name || "",
        data.groombridecity || "",
        data.settled_thru || "",
        data.others || "",
        data.marriage_comments || "",
        data.marriage_invitation_details || "",
        data.engagement_invitation_details || "",
        data.admin_settled_thru || "",
        data.admin_others || "",
        data.marriage_location || "",
        data.wish_card_accept || "",
        data.instagram_accept || "",
      );
      NotifySuccess(response.message || "Marriage settle details created successfully")
      console.log("Marriage settle details created successfully", response);
    } catch (error: any) {
      NotifyError("Error creating marriage settle details", error)
      console.error("Error creating marriage settle details", error);
    }
  };

  // Payment Details submit handler
  const onPaymentSubmit = async (data: PaymentDetailsFormData) => {
    try {
      // You'll need to get these values from somewhere (props or context)
      const roleId = sessionStorage.getItem('role_id');
      const response = await updatePaymentDetails(
        String(profileId) || "",
        data.payment_type || "",
        String(roleId) || "",
        "3",
        data.payment_refno || "",
        data.discount_amont || ""
      );
      // Handle payment details submission here
      console.log("Payment details submitted:", response);
      NotifySuccess(response.message || "Payment details updated successfully");
    } catch (error: any) {
      NotifyError("Error saving payment details", error);
      console.error("Error saving payment details", error);
    }
  };



  useEffect(() => {
    if (profileId) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const Paymentdata = await fetchPaymentTransactions(profileId);
          setPaymentData(Paymentdata);
          console.log("Paymentdata", Paymentdata);

          if (Paymentdata?.length > 0) {
            const payment = Paymentdata[0];
            paymentsetValue("payment_type", payment.payment_type || "");
            paymentsetValue("payment_details", payment.payment_details || "");
            paymentsetValue("payment_refno", payment.payment_refno || "");
            paymentsetValue("discount_amont", payment.discount_amont || "");
            paymentsetValue("balance_amount", payment.balance_amount || "");
          }

          const Marriagedetailsdata = await fetchMarriageSettleDetails(profileId);
          setMarriagedetailsdata(Marriagedetailsdata);
          console.log("Marriagedetailsdata", Marriagedetailsdata);

          if (Marriagedetailsdata.length > 0) {
            const marriage = Marriagedetailsdata[0];
            const options = { shouldValidate: true, shouldDirty: true };

            setValue("marriage_date", marriage.marriage_date ?? "", options);
            setValue("groom_bride_name", marriage.groom_bride_name ?? "", options);
            setValue("groombridefathername", marriage.groombridefathername ?? "", options);
            setValue("groombridecity", marriage.groombridecity ?? "", options);
            setValue("groom_bride_vysyamala_id", marriage.groom_bride_vysyamala_id ?? "", options);

            setValue("settled_thru", marriage.settled_thru ?? "", options);
            setValue("others", marriage.others ?? "", options);

            setValue("admin_settled_thru", marriage.admin_settled_thru ?? "", options);
            setValue("admin_others", marriage.admin_others ?? "", options);

            setValue("engagement_date", marriage.engagement_date ?? "", options);
            setValue("marriage_comments", marriage.marriage_comments ?? "", options);

            setValue("marriage_photo_details", marriage.marriage_photo_details ?? "", options);
            setValue("marriage_invitation_details", marriage.marriage_invitation_details ?? "", options);
            setValue("engagement_photo_details", marriage.engagement_photo_details ?? "", options);
            setValue("engagement_invitation_details", marriage.engagement_invitation_details ?? "", options);

            setValue("admin_marriage_comments", marriage.admin_marriage_comments ?? "", options);
            setValue("marriage_location", marriage.marriage_location ?? "", options);
            setValue("wish_card_accept", marriage.wish_card_accept ?? "", options);
            setValue("instagram_accept", marriage.instagram_accept ?? "", options);
          }

        } catch (error) {
          console.error("Error fetching payment data:", error);
          NotifyError("Failed to load payment data");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [profileId, setValue, paymentsetValue]);

  useEffect(() => {
    if (settledThru !== "Others") {
      setValue("others", "");
    }
  }, [settledThru, setValue]);

  useEffect(() => {
    if (adminSettledThru !== "Others") {
      setValue("admin_others", "");
    }
  }, [adminSettledThru, setValue]);


  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
      <DialogTitle>
        <Box >Admin Details</Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 5,
            right: 5,
            background: "white",
            color: "#d50000"
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ borderWidth: "3px" }} />


      {/* <Box
        className="flex flex-wrap items-center gap-4 p-4 bg-gray-100 rounded-lg"
        sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}
      >
       
        <TextField
          label="Course No"
          variant="outlined"
          placeholder=""
          sx={{ width: '100%', maxWidth: '400px' }}
        />
       
        <FormControlLabel
          control={
            <Checkbox
            />
          }
          label="is Verified"
        />
        <TextField
          label="Source"
          variant="outlined"
          placeholder="Source"
          sx={{ width: '100%', maxWidth: '400px' }}
        />
        <Button variant="contained" color="success"
       
        >
          Submit
        </Button>
        <Button variant="contained" color="error"
      
        >
          Cancel
        </Button>
      </Box> */}

      {/* <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "start", alignItems: "start", color: "red" }}>Payment Details</Box>
      </DialogTitle>

      <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>

        <FormControl
          sx={{ marginBottom: "10px", width: 375 }}

          error={!!paymentErrors.payment_type} // This makes the helper text red
        >
          <InputLabel required
            shrink={true}
            sx={{ backgroundColor: "#fff", "& .MuiFormLabel-asterisk": { color: "red" }, }}>Payment Type</InputLabel>
          <Select
          value={paymentwatch("payment_type") || ""}
        
          displayEmpty
          variant="outlined"
          {...registerPayment("payment_type")}
        >
            <MenuItem value="" disabled>
              Select Payment Type
            </MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Online">Online</MenuItem>
            <MenuItem value="Others">Others</MenuItem>
          </Select>
          <FormHelperText sx={{ marginLeft: "0px" }}>{paymentErrors.payment_type?.message}</FormHelperText>
        </FormControl>

        <Grid container spacing={2}>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Payment Details"
              multiline
              fullWidth
              minRows={1}  // Starts with 1 row
              maxRows={10}  // Expands up to 6 rows
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: "red", // Makes only the asterisk red
                },
                "& .MuiFormHelperText-root": {
                  marginLeft: "0px", // Move the error text slightly to the left
                },
              }}
              {...registerPayment("payment_details")}
              error={!!paymentErrors.payment_details}
              helperText={paymentErrors.payment_details?.message}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Payment Reference No"
              multiline
              fullWidth
              minRows={1}  // Starts with 1 row
              maxRows={10}  // Expands up to 6 rows
              InputLabelProps={{ shrink: true }}
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: "red", // Makes only the asterisk red
                },
                "& .MuiFormHelperText-root": {
                  marginLeft: "0px", // Move the error text slightly to the left
                },
              }}
              {...registerPayment("payment_refno")}
              error={!!paymentErrors.payment_refno}
              helperText={paymentErrors.payment_refno?.message}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={10}
              label="Balance Amount Payment"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...registerPayment("balance_amount")}
              error={!!paymentErrors.balance_amount}
              helperText={paymentErrors.balance_amount?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Discount (out of 100)"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...registerPayment("discount_amont")}
              error={!!paymentErrors.discount_amont}
              helperText={paymentErrors.discount_amont?.message}
            />
          </Grid>
        
          <div className="w-full py-2 flex justify-end">
            <Button variant="contained" color="primary"
              onClick={handlePaymentSubmit(onPaymentSubmit)}
            >
              Save
            </Button>
          </div>
        </Grid>

      </Box> */}
      <DialogTitle>
        <Box sx={{ display: "flex", justifyContent: "start", alignItems: "start", color: "red" }}>Marriage Settled Details</Box>
      </DialogTitle>
      <Box sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
        <Grid container spacing={2}>
          {/* Name Field */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Marriage Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                "& .MuiInputLabel-asterisk": {
                  color: "red", // Makes only the asterisk red
                },
                "& .MuiFormHelperText-root": {
                  marginLeft: "0px", // Move the error text slightly to the left
                },
              }}
              {...register("marriage_date")}
              error={!!errors.marriage_date}
              helperText={errors.marriage_date?.message}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Groom Bride Name"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...register("groom_bride_name")}
              error={!!errors.groom_bride_name}
              helperText={errors.groom_bride_name?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={10}
              label="Groom Bride Name Father Name"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...register("groombridefathername")}
              error={!!errors.groombridefathername}
              helperText={errors.groombridefathername?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Groom Bride City"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...register("groombridecity")}
              error={!!errors.groombridecity}
              helperText={errors.groombridecity?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Groom Bride VysyaMala ID"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...register("groom_bride_vysyamala_id")}
              error={!!errors.groom_bride_vysyamala_id}
              helperText={errors.groom_bride_vysyamala_id?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }}>
              <InputLabel
                shrink={true}
                sx={{ backgroundColor: "#fff" }}
              >Settle Thru</InputLabel>
              {/* <Select
                label="Settle Thru"
                {...register("settled_thru")}
                error={!!errors.settled_thru}
              > */}
              <Select
                value={watch("settled_thru") || ""}
                //onChange={(e) => setValue("settled_thru", e.target.value)}
                displayEmpty
                variant="outlined"
                {...register("settled_thru")}
              >
                <MenuItem value="">
                  Select Settle Thru
                </MenuItem>
                {/* <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="Others">Others</MenuItem> */}
                <MenuItem value="Vysyamala">Vysyamala</MenuItem>
                <MenuItem value="Relatives">Relatives</MenuItem>
                <MenuItem value="Whatsapp Group">Whatsapp Group</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
              <FormHelperText>{errors.settled_thru?.message}</FormHelperText>
            </FormControl>
          </Grid>

          {settledThru === "Others" && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specify Settle Thru"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                {...register("others", {
                  required: "Please specify the other option"
                })}
                error={!!errors.others}
                helperText={errors.others?.message}
              />
            </Grid>
          )}

          {/* <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              multiline
              minRows={1}
              maxRows={10}
              label="Engagement Date"
              variant="outlined"
              {...register("engagement_date")}
              error={!!errors.engagement_date}
              helperText={errors.engagement_date?.message}
            />
          </Grid> */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Engagement Date"
              type="date"
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}

              {...register("engagement_date")}
              error={!!errors.engagement_date}
              helperText={errors.engagement_date?.message}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={10}
              label="Marriage Comments"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...register("marriage_comments")}
              error={!!errors.marriage_comments}
              helperText={errors.marriage_comments?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }} error={!!errors.marriage_photo_details}>
              <InputLabel shrink sx={{ backgroundColor: "#fff" }}>
                Marriage Photo Details
              </InputLabel>

              <Select
                value={watch("marriage_photo_details") || ""}
                displayEmpty
                variant="outlined"
                {...register("marriage_photo_details")}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>

              <FormHelperText>{errors.marriage_photo_details?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }} error={!!errors.marriage_invitation_details}>
              <InputLabel shrink sx={{ backgroundColor: "#fff" }}>
                Marriage Invitation Details
              </InputLabel>

              <Select
                value={watch("marriage_invitation_details") || ""}
                displayEmpty
                variant="outlined"
                {...register("marriage_invitation_details")}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>

              <FormHelperText>{errors.marriage_invitation_details?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }} error={!!errors.engagement_photo_details}>
              <InputLabel shrink sx={{ backgroundColor: "#fff" }}>
                Engagement Photo Details
              </InputLabel>

              <Select
                value={watch("engagement_photo_details") || ""}
                displayEmpty
                variant="outlined"
                {...register("engagement_photo_details")}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>

              <FormHelperText>{errors.engagement_photo_details?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }} error={!!errors.engagement_invitation_details}>
              <InputLabel shrink sx={{ backgroundColor: "#fff" }}>
                Engagement Invitation Details
              </InputLabel>

              <Select
                value={watch("engagement_invitation_details") || ""}
                displayEmpty
                variant="outlined"
                {...register("engagement_invitation_details")}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
              <FormHelperText>{errors.engagement_invitation_details?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Admin Marriage Comments"
              multiline
              fullWidth
              minRows={1}  // Starts with 1 row
              maxRows={10}  // Expands up to 6 rows
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...register("admin_marriage_comments")}
              error={!!errors.admin_marriage_comments}
              helperText={errors.admin_marriage_comments?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }}>

              <InputLabel shrink={true} sx={{ backgroundColor: "#fff" }}>Admin Settle Thru</InputLabel>
              <Select
                value={watch("admin_settled_thru") || ""}
                // onChange={(e) => setValue("admin_settled_thru ", e.target.value)}
                displayEmpty
                variant="outlined"
                {...register("admin_settled_thru")}
              >
                <MenuItem value="">
                  Select Admin Settle Thru
                </MenuItem>
                {/* <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Online">Online</MenuItem>
                <MenuItem value="Others">Others</MenuItem> */}
                <MenuItem value="Vysyamala">Vysyamala</MenuItem>
                <MenuItem value="Relatives">Relatives</MenuItem>
                <MenuItem value="Whatsapp Group">Whatsapp Group</MenuItem>
                <MenuItem value="Others">Others</MenuItem>
              </Select>
              <FormHelperText>{errors.admin_settled_thru?.message}</FormHelperText>
            </FormControl>
          </Grid>
          {adminSettledThru === "Others" && (
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specify Admin Settle Thru"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                {...register("admin_others", {
                  required: "Please specify the admin settle thru"
                })}
                error={!!errors.admin_others}
                helperText={errors.admin_others?.message}
              />
            </Grid>
          )}

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Marriage Location"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...register("marriage_location")}
              error={!!errors.groombridecity}
              helperText={errors.groombridecity?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }}
              error={!!errors.wish_card_accept}
            >
              <InputLabel shrink sx={{ backgroundColor: "#fff" }}>
                Wishes card accept
              </InputLabel>

              <Select
                value={watch("wish_card_accept") || ""}
                displayEmpty
                variant="outlined"
                {...register("wish_card_accept")}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
              <FormHelperText>{errors.wish_card_accept?.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }}
              error={!!errors.instagram_accept}
            >
              <InputLabel shrink sx={{ backgroundColor: "#fff" }}>
                Instagram accept
              </InputLabel>

              <Select
                value={watch("instagram_accept") || ""}
                displayEmpty
                variant="outlined"
                {...register("instagram_accept")}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
              <FormHelperText>{errors.instagram_accept?.message}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <div className="w-full flex justify-end">
          <Button variant="contained" color="primary"
            onClick={handleSubmit(onSubmit)}  // Wrap with handleSubmit
          >
            Save
          </Button>
        </div>

      </Box>
    </Dialog>

  )
}

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
  marriagedate: z.string().min(1, "Marriage date is required"),
  groombridename: z.string().optional(),
  groombridefathername: z.string().optional(),
  groombridecity: z.string().optional(),
  groombridevysysaid: z.string().optional(),
  settledthru: z.string().optional(),
  adminsettledthru: z.string().optional(),
  engagementdate: z.string().optional(),
  marriagecomments: z.string().optional(),
  marriagephotodetails: z.string().optional(),
  marriageinvitationdetails: z.string().optional(),
  engagementphotodetails: z.string().optional(),
  engagementinvitationdetails: z.string().optional(),
  adminmarriagecomments: z.string().optional(),
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

  //Marriga Settle Details submit
  const onSubmit = async (data: MarriageDetailsFormData) => {
    try {
      // You'll need to get these values from somewhere (props or context)
      const roleId = sessionStorage.getItem('role_id');
      const response = await createMarriageSettleDetails(
        String(profileId),
        String(roleId),
        data.marriagedate,
        data.groombridefathername || "",
        data.groombridevysysaid || "",
        data.engagementdate || "",
        data.marriagephotodetails || "",
        data.engagementphotodetails || "",
        data.adminmarriagecomments || "",
        data.groombridename || "",
        data.groombridecity || "",
        data.settledthru || "",
        data.marriagecomments || "",
        data.marriageinvitationdetails || "",
        data.engagementinvitationdetails || "",
        data.adminsettledthru || ""
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
            const Marriage = Marriagedetailsdata[0];
            setValue("marriagedate", Marriage.marriagedate || "");
            setValue("groombridefathername", Marriage.groombridefathername || "");
            setValue("groombridevysysaid", Marriage.groombridevysysaid || "");
            setValue("engagementdate", Marriage.engagementdate || "");
            setValue("marriagephotodetails", Marriage.marriagephotodetails || "");
            setValue("engagementphotodetails", Marriage.engagementphotodetails || "");
            setValue("adminmarriagecomments", Marriage.adminmarriagecomments || "");
            setValue("groombridename", Marriage.groombridename || "");
            setValue("groombridecity", Marriage.groombridecity || "");
            setValue("settledthru", Marriage.settledthru || "");
            setValue("marriagecomments", Marriage.marriagecomments || "");
            setValue("marriageinvitationdetails", Marriage.marriageinvitationdetails || "");
            setValue("engagementinvitationdetails", Marriage.engagementinvitationdetails || "");
            setValue("adminsettledthru", Marriage.adminsettledthru || "");
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
              {...register("marriagedate")}
              error={!!errors.marriagedate}
              helperText={errors.marriagedate?.message}
              required
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Groom Bride Name"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...register("groombridename")}
              error={!!errors.groombridename}
              helperText={errors.groombridename?.message}
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
              {...register("groombridevysysaid")}
              error={!!errors.groombridevysysaid}
              helperText={errors.groombridevysysaid?.message}
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
                {...register("settledthru")}
                error={!!errors.settledthru}
              > */}
              <Select
                value={watch("settledthru") || ""}
                //onChange={(e) => setValue("settledthru", e.target.value)}
                displayEmpty
                variant="outlined"
                {...register("settledthru")}
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
              <FormHelperText>{errors.settledthru?.message}</FormHelperText>
            </FormControl>
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              multiline
              minRows={1}
              maxRows={10}
              label="Engagement Date"
              variant="outlined"
              {...register("engagementdate")}
              error={!!errors.engagementdate}
              helperText={errors.engagementdate?.message}
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

              {...register("engagementdate")}
              error={!!errors.engagementdate}
              helperText={errors.engagementdate?.message}
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
              {...register("marriagecomments")}
              error={!!errors.marriagecomments}
              helperText={errors.marriagecomments?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }} error={!!errors.marriagephotodetails}>
              <InputLabel shrink sx={{ backgroundColor: "#fff" }}>
                Marriage Photo Details
              </InputLabel>

              <Select
                value={watch("marriagephotodetails") || ""}
                displayEmpty
                variant="outlined"
                {...register("marriagephotodetails")}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>

              <FormHelperText>{errors.marriagephotodetails?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }} error={!!errors.marriageinvitationdetails}>
              <InputLabel shrink sx={{ backgroundColor: "#fff" }}>
                Marriage Invitation Details
              </InputLabel>

              <Select
                value={watch("marriageinvitationdetails") || ""}
                displayEmpty
                variant="outlined"
                {...register("marriageinvitationdetails")}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>

              <FormHelperText>{errors.marriageinvitationdetails?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }} error={!!errors.engagementphotodetails}>
              <InputLabel shrink sx={{ backgroundColor: "#fff" }}>
                Engagement Photo Details
              </InputLabel>

              <Select
                value={watch("engagementphotodetails") || ""}
                displayEmpty
                variant="outlined"
                {...register("engagementphotodetails")}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>

              <FormHelperText>{errors.engagementphotodetails?.message}</FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }} error={!!errors.engagementinvitationdetails}>
              <InputLabel shrink sx={{ backgroundColor: "#fff" }}>
                Engagement Invitation Details
              </InputLabel>

              <Select
                value={watch("engagementinvitationdetails") || ""}
                displayEmpty
                variant="outlined"
                {...register("engagementinvitationdetails")}
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
              <FormHelperText>{errors.engagementinvitationdetails?.message}</FormHelperText>
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
              {...register("adminmarriagecomments")}
              error={!!errors.adminmarriagecomments}
              helperText={errors.adminmarriagecomments?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl sx={{ marginBottom: "10px", width: 375 }}>

              <InputLabel shrink={true} sx={{ backgroundColor: "#fff" }}>Admin Settle Thru</InputLabel>
              <Select
                value={watch("adminsettledthru") || ""}
                // onChange={(e) => setValue("adminsettledthru", e.target.value)}
                displayEmpty
                variant="outlined"
                {...register("adminsettledthru")}
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
              <FormHelperText>{errors.adminsettledthru?.message}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Marriage Location"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              // {...register("groombridecity")}
              error={!!errors.groombridecity}
              helperText={errors.groombridecity?.message}
            />
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

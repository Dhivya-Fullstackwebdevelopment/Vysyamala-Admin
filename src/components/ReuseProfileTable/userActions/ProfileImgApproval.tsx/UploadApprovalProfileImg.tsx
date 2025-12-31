import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box, Button, CircularProgress, Typography, Dialog as ConfirmationDialog,
    DialogTitle as ConfirmationDialogTitle,
    DialogContent as ConfirmationDialogContent,
    DialogActions as ConfirmationDialogActions,
    IconButton,
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import profileImg from "../../../../assets/images/defaultprofileImg.jpg"
import { fetchPhotoProofDetails, getPhotoProofDetails, getProfileDetails, uploadNewProfileImages, uploadProofFiles, deleteFile } from '../../../../api/apiConfig';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NotifyError, NotifySuccess } from '../../../../common/Toast/ToastMessage';
import { IoEye, IoEyeOff } from "react-icons/io5";
import { FileInput } from '../../../ReusableFile/FileInput';
import { hasPermission } from '../../../utils/auth';
import { FaTrashAlt } from 'react-icons/fa';

interface ProfileImage {
    id: number;
    image_url: string;
    image_approved: boolean;
    uploaded_at: string;
    is_deleted: boolean;
}

interface PhotoProofDetails {
    photo_password: string;
    id_proof: string;
    divorce_certificate: string | null;
    horoscope_file: string;
    profile_images: ProfileImage[];
    profile_martial_status: string;
    horoscope_file_admin: string;
    Profile_name: string;
    photo_protection: boolean;
}


const CombinedPhotoProofDetailsSchema = z.object({
    photo_password: z.string().optional(),
    photo_protection: z.string().optional(),
    id_proof: z.string().optional(),
    divorce_certificate: z.string().nullable().optional(),
    horoscope_file: z.string().optional(),
    image_url: z.string().optional(),
    image_approved: z.boolean().optional(),
    lad: z.string().optional(),
    is_deleted: z.boolean().optional(),
});
type PhotoProofDetailsFormData = z.infer<typeof CombinedPhotoProofDetailsSchema>;

export const UploadApprovalProfileImg = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const profileId = queryParams.get('profileId');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [photoProofDetails, setPhotoProofDetails] = useState<PhotoProofDetails | null>(null);
    const [password, setPassword] = useState<string>('');
    console.log("password", password)
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [profileData, setProfileData] = useState<any | null>(null);
    const [newProfileImages, setNewProfileImages] = useState<File[]>([]);
    const [horoscopeFiles, setHoroscopeFiles] = useState<File[]>([]);
    const [idProofFiles, setIdProofFiles] = useState<File[]>([]);
    const [divorceProofFiles, setDivorceProofFiles] = useState<File[]>([]);
    const [horoscopeAdminFiles, setHoroscopeAdminFiles] = useState<File[]>([]);
    const [photoProtection, setPhotoProtection] = useState<boolean>(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<{
        modelType: string;
        fieldName: string;
    } | null>(null);


    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useForm<PhotoProofDetailsFormData>({
        resolver: zodResolver(CombinedPhotoProofDetailsSchema),
    });

    const fetchPhotoProof = async () => {
        if (!profileId) return;
        try {
            setLoading(true);
            const data = await fetchPhotoProofDetails(profileId);
            console.log("fetchPhotoProof", data)
            setValue("photo_password", data.photo_password); // ✅ Correct position
            setPhotoProofDetails(data);
            setPassword(data.photo_password);
            setPhotoProtection(data.photo_protection)
            setLoading(false);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setLoading(false);
        }
    };

    //fetch ProfileDetails
    // const fetchDetails = async () => {
    //     try {
    //         const profileData = await getProfileDetails(String(profileId));
    //         setProfileData(profileData); // ✅ Store in state
    //         console.log("profileData", profileData)
    //     } catch (err) {
    //         console.error(err);
    //     }
    // };


    useEffect(() => {
        // fetchDetails();
        fetchPhotoProof();
    }, [profileId, setValue]);

    const getFileNameFromUrl = (url: string) => {
        if (!url) return "";
        return url.substring(url.lastIndexOf('/') + 1);
    };

    const handleDeleteConfirm = async () => {
        if (!profileId || !itemToDelete) return;

        setDeleteLoading(true);

        try {
            await deleteFile(profileId, itemToDelete.modelType, itemToDelete.fieldName);
            NotifySuccess(`${itemToDelete.fieldName} deleted successfully!`);

            // Refresh UI
            await fetchPhotoProof();

        } catch (error) {
            NotifyError("Error deleting file");
            console.error(error);
        } finally {
            setDeleteLoading(false);
            setDeleteDialogOpen(false);
            setItemToDelete(null);
        }
    };


    const openDeleteDialog = (modelType: string, fieldName: string) => {
        setItemToDelete({ modelType, fieldName });
        setDeleteDialogOpen(true);
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setItemToDelete(null);
    };

    const ImageStatusSubmit = async () => {
        if (!profileId || !photoProofDetails) {
            NotifyError("Profile ID not found.");
            return;
        }

        setLoading(true);

        try {
            const apiTasks = [];

            if (newProfileImages.length > 0 && hasPermission('new_photo_update')) {
                // Add the new profile image upload task to our list
                apiTasks.push(
                    uploadNewProfileImages(profileId, newProfileImages)
                );
            }

            // Task for other proof file uploads (ID, Horoscope, etc.)
            const hasProofFilesToUpload =
                horoscopeFiles.length > 0 ||
                idProofFiles.length > 0 ||
                divorceProofFiles.length > 0 ||
                horoscopeAdminFiles.length > 0; // ✅ Corrected this line

            if (hasProofFilesToUpload && hasPermission('new_photo_update')) {
                apiTasks.push(
                    uploadProofFiles(
                        profileId,
                        horoscopeFiles[0] || null,
                        idProofFiles[0] || null,
                        divorceProofFiles[0] || null,
                        horoscopeAdminFiles[0] || null,
                        photoProtection
                    )
                );
            }

            // Task for updating image status and password
            if (hasPermission('edit_horo_photo')) {
                const passwordValue = watch("photo_password");
                const imageIds = photoProofDetails.profile_images.map(img => img.id).join(",");
                const imageApprovedStatuses = photoProofDetails.profile_images.map(img => (img.image_approved ? "1" : "0")).join(",");
                const isDeleted = photoProofDetails.profile_images.map(img => (img.is_deleted ? "1" : "0")).join(",");

                apiTasks.push(
                    getPhotoProofDetails(
                        profileId,
                        imageIds,
                        isDeleted,
                        imageApprovedStatuses,
                        passwordValue || "",
                        photoProtection ? "1" : "0",
                    )
                );
            }
            // --- Run all tasks concurrently ---
            // await Promise.all(apiTasks);
            // NotifySuccess("Profile updated successfully!");
            if (apiTasks.length > 0) {
                await Promise.all(apiTasks);
                NotifySuccess("Profile updated successfully!");
            } else {
                NotifyError("No changes detected");
            }

            // ✅ Clear the file input states on success
            setNewProfileImages([]);
            setHoroscopeFiles([]);
            setIdProofFiles([]);
            setDivorceProofFiles([]);
            setHoroscopeAdminFiles([]);
            // Refresh all data from the server to show new images
            fetchPhotoProof();

        } catch (error) {
            NotifyError("An error occurred while updating the profile.");
            console.error("Update Error:", error);
        } finally {
            setLoading(false);
        }
    };

    //Image Approval
    const handleImageApprovalChange = (imageId: number) => {
        if (!photoProofDetails) return;

        const updatedImages = photoProofDetails.profile_images.map(img => {
            if (img.id === imageId) {
                const newApprovalState = !img.image_approved; // Toggle approval
                return {
                    ...img,
                    image_approved: newApprovalState,
                    // If we are approving the image, automatically un-delete it.
                    is_deleted: newApprovalState ? false : img.is_deleted,
                };
            }
            return img;
        });

        setPhotoProofDetails({
            ...photoProofDetails,
            profile_images: updatedImages,
        });
    };

    //handle Delete
    const handleDelete = (imageId: number) => {
        if (!photoProofDetails) return;

        const updatedImages = photoProofDetails.profile_images.map(img => {
            if (img.id === imageId) {
                const newDeletedState = !img.is_deleted; // Toggle deletion
                return {
                    ...img,
                    is_deleted: newDeletedState,
                    // If we are deleting the image, automatically un-approve it.
                    image_approved: newDeletedState ? false : img.image_approved,
                };
            }
            return img;
        });

        setPhotoProofDetails({
            ...photoProofDetails,
            profile_images: updatedImages,
        });
    };
    //download horoscope file
    const handleDownloadHoroscopeFile = (fileUrl: string | null) => {
        if (!fileUrl) return;
        window.open(fileUrl, '_blank');
    };
    //Download ID proof
    const handleDownloadIDProof = (fileUrl: string | null) => {
        if (!fileUrl) return;
        window.open(fileUrl, '_blank');
    };
    //Download divorce proof
    const handleDownloadDivorceProof = (fileUrl: string | null) => {
        if (!fileUrl) return;
        window.open(fileUrl, '_blank');
    };

    const handleProtectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setPhotoProtection(isChecked);

        // If the checkbox is unchecked, clear the photo_password value
        if (!isChecked) {
            setValue("photo_password", "");
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)', // optional: light overlay
                    zIndex: 9999,
                }}
            >
                <CircularProgress />
            </Box>
        );
    }


    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!photoProofDetails) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography>No data found for profile {profileId}</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Typography sx={{
                marginBottom: '20px',
                color: 'black',
                fontSize: '1.5rem',
                fontWeight: 'bold',
            }}>
                Upload Profile Images: {profileId}
            </Typography>

            {/* User Info */}
            <div className="flex items-start gap-2">
                <div>
                    <div className="flex">
                        <span className="w-50 font-semibold text-black">Profile ID</span>
                        <span>{profileId}</span>
                    </div>
                    <div className="flex">
                        <span className="w-50 font-semibold text-black">Name</span>
                        <span>{photoProofDetails.Profile_name || 'Loading name...'}</span>
                    </div>
                </div>
            </div>


            {/* Upload Images */}
            <div className="mt-4 ml-50">
                {photoProofDetails.profile_images.map((image, index) => (
                    <div key={image.id} className="flex flex-col gap-2 mb-4">
                        <img
                            src={image.image_url || profileImg}
                            alt={`profileImg-${index}`}
                            className="w-30 h-30 object-cover rounded-md"
                            onError={(e) => {
                                e.currentTarget.src = profileImg;
                            }}
                        />

                        <div className="flex items-center gap-4 mt-2">
                            {/* Approve Controls - Fixed */}
                            {hasPermission('edit_horo_photo') && (
                                <div className="flex items-center space-x-2">
                                    <input
                                        id={`approve-${image.id}`}
                                        type="checkbox"
                                        checked={image.image_approved}
                                        onChange={() => handleImageApprovalChange(image.id)}
                                        style={{
                                            accentColor: image.image_approved ? 'green' : undefined,
                                            width: '18px',
                                            height: '18px',
                                        }}
                                    />
                                    <label
                                        htmlFor={`approve-${image.id}`}
                                        className="cursor-pointer select-none"
                                    >
                                        Approve Image
                                    </label>
                                </div>
                            )}

                            {/* Delete Controls - Fixed */}
                            {hasPermission('edit_horo_photo') && (
                                <div className="flex items-center space-x-2">
                                    <input
                                        id={`delete-${image.id}`}
                                        type="checkbox"
                                        checked={image.is_deleted}
                                        onChange={() => handleDelete(image.id)}
                                        style={{
                                            accentColor: image.is_deleted ? 'red' : undefined,
                                            width: '18px',
                                            height: '18px',
                                        }}
                                    />
                                    <label
                                        htmlFor={`delete-${image.id}`}
                                        className="cursor-pointer select-none text-red-500 ml-2"
                                    >
                                        Delete Photo
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Password */}
            <div className="flex items-start gap-2">
                <div className="flex flex-col space-y-3">
                    {hasPermission('edit_horo_photo') && (
                        <div className="flex items-center relative">
                            <span className="w-50 font-semibold text-black">Password</span>
                            <div className="relative flex items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    {...register("photo_password")}
                                    className="mt-1 px-2 py-1 pr-10 border border-gray-300 rounded-md focus:outline-none"
                                    placeholder="Enter password"
                                />
                                <span
                                    onClick={() => setShowPassword(prev => !prev)}
                                    // Position the icon absolutely within the new relative container
                                    className="absolute right-3 cursor-pointer text-gray-600"
                                >
                                    {showPassword ? <IoEyeOff size={18} /> : <IoEye size={18} />}
                                </span>
                            </div>

                            {errors.photo_password && (
                                <span className="text-red-500 text-sm">{errors.photo_password.message}</span>
                            )}
                        </div>
                    )}
                    {/* Permission */}
                    {hasPermission('edit_horo_photo') && (
                        <div className="flex">
                            <span className="w-50 font-semibold text-black">Photo Lock</span>
                            <input
                                type="checkbox"
                                className="mr-2p"
                                checked={photoProtection} // ✅ Directly use the boolean state
                                onChange={handleProtectionChange} // ✅ Set boolean directly 
                            />
                        </div>
                    )}

                    {/* <div className="flex">
                        <span className="w-50 font-semibold text-black">LAD</span>
                        <span>04/04/25 11:56:25 AM</span>
                    </div> */}

                    {hasPermission('new_photo_update') && (
                        <div className="flex">
                            {/* <span className="w-100 font-semibold text-black">Upload Profile Images</span> */}
                            <FileInput
                                label="Profile Images"
                                files={newProfileImages}
                                onFilesChange={setNewProfileImages}
                                accept="image/*"
                                multiple={true}
                            />
                        </div>
                    )}

                    {/* ✅ Step 4: Add this block to display selected file names */}
                    {hasPermission('new_photo_update') && (
                        <div className="flex">
                            {/* <span className="w-100 font-semibold text-black">Upload Horoscope</span> */}
                            <FileInput
                                label="Horoscope Original"
                                files={horoscopeFiles}
                                onFilesChange={setHoroscopeFiles}
                                accept="image/*,.pdf,.doc,.docx"
                                multiple={false}
                            />
                        </div>
                    )}
                    {/* Horoscope upload */}
                    {/* Example for Horoscope File */}

                    {photoProofDetails?.horoscope_file && (
                        <div className="flex items-center mb-4">
                            <span className="w-48 font-semibold text-black shrink-0">Original Horoscope File</span>

                            {/* Fixed width container for the file info pushes the trash icon to a specific line */}
                            <div className="flex items-center w-96 shrink-0 ml-4">
                                <a href="#" onClick={(e) => { e.preventDefault(); handleDownloadHoroscopeFile(photoProofDetails.horoscope_file); }} className="text-blue-500 underline shrink-0">
                                    View File
                                </a>
                                <span className="text-gray-500 ml-2 truncate">
                                    ({getFileNameFromUrl(photoProofDetails.horoscope_file)})
                                </span>
                            </div>

                            {hasPermission('edit_horo_photo') && (
                                <button onClick={() => openDeleteDialog('horoscope', 'horoscope_file')} className="text-red-500 hover:text-red-700">
                                    <FaTrashAlt size={16} />
                                </button>
                            )}
                        </div>
                    )}

                    {hasPermission('new_photo_update') && (
                        <div className="flex">
                            <FileInput
                                label="Horoscope Admin"
                                // ▼ USE THE NEW STATE HERE ▼
                                files={horoscopeAdminFiles}
                                onFilesChange={setHoroscopeAdminFiles}
                                accept="image/*,.pdf,.doc,.docx"
                                multiple={false}
                            />
                        </div>
                    )}
                    {/* Horoscope upload */}
                    {photoProofDetails?.horoscope_file_admin && (
                        <div className="flex items-center mb-4">
                            <span className="w-48 font-semibold text-black shrink-0">Horoscope Admin File</span>
                            <div className="flex items-center w-96 shrink-0 ml-4">
                                <a href="#" onClick={(e) => { e.preventDefault(); handleDownloadHoroscopeFile(photoProofDetails.horoscope_file_admin); }} className="text-blue-500 underline shrink-0">
                                    View File
                                </a>
                                <span className="text-gray-500 ml-2 truncate">
                                    ({getFileNameFromUrl(photoProofDetails.horoscope_file_admin)})
                                </span>
                            </div>
                            {hasPermission('edit_horo_photo') && (
                                <button onClick={() => openDeleteDialog('horoscope', 'horoscope_file_admin')} className="text-red-500 hover:text-red-700">
                                    <FaTrashAlt size={16} />
                                </button>
                            )}
                        </div>
                    )}

                    {hasPermission('new_photo_update') && (
                        <div className="flex">
                            {/* <span className="w-100 font-semibold text-black">Upload ID Proof</span> */}
                            <FileInput
                                label="ID Proof"
                                files={idProofFiles}
                                onFilesChange={setIdProofFiles}
                                accept="image/*,.pdf,.doc,.docx"
                                multiple={false}
                            />
                        </div>
                    )}

                    {photoProofDetails?.id_proof && (
                        <div className="flex items-center mb-4">
                            <span className="w-48 font-semibold text-black shrink-0">ID Proof</span>
                            <div className="flex items-center w-96 shrink-0 ml-4">
                                <a href="#" onClick={(e) => { e.preventDefault(); handleDownloadIDProof(photoProofDetails.id_proof); }} className="text-blue-500 underline shrink-0">
                                    View File
                                </a>
                                <span className="text-gray-500 ml-2 truncate">
                                    ({getFileNameFromUrl(photoProofDetails.id_proof)})
                                </span>
                            </div>
                            {hasPermission('edit_horo_photo') && (
                                <button onClick={() => openDeleteDialog('registration', 'Profile_idproof')} className="text-red-500 hover:text-red-700">
                                    <FaTrashAlt size={16} />
                                </button>
                            )}
                        </div>
                    )}
                    {['2', '4', '5'].includes(photoProofDetails?.profile_martial_status) && (
                        <>
                            {hasPermission('new_photo_update') && (
                                <div className="flex">
                                    <FileInput
                                        label="Upload Divorce Proof"
                                        files={divorceProofFiles}
                                        onFilesChange={setDivorceProofFiles}
                                        accept="image/*,.pdf,.doc,.docx"
                                        multiple={false}
                                    />
                                </div>
                            )}
                        </>
                    )}
                    {photoProofDetails?.divorce_certificate && (
                        <div className="flex items-center mb-4">
                            <span className="w-48 font-semibold text-black shrink-0">Divorce Proof</span>
                            <div className="flex items-center w-96 shrink-0 ml-4">
                                <a href="#" onClick={(e) => { e.preventDefault(); handleDownloadDivorceProof(photoProofDetails.divorce_certificate); }} className="text-blue-500 underline shrink-0">
                                    View File
                                </a>
                                <span className="text-gray-500 ml-2 truncate">
                                    ({getFileNameFromUrl(photoProofDetails.divorce_certificate)})
                                </span>
                            </div>
                            {hasPermission('edit_horo_photo') && (
                                <button onClick={() => openDeleteDialog('registration', 'Profile_divorceproof')} className="text-red-500 hover:text-red-700">
                                    <FaTrashAlt size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {/* ✅ Submit Button */}
            {(hasPermission('edit_horo_photo') || hasPermission('new_photo_update')) && (
                <div className="w-full flex justify-center mt-6 ml-60">
                    <button
                        onClick={ImageStatusSubmit} // ✅ no need for handleSubmit

                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-2"
                    >
                        Submit
                    </button>
                </div>
            )}
            <ConfirmationDialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
                maxWidth="sm"
                fullWidth
            >
                <ConfirmationDialogTitle>
                    Confirm Delete
                    <IconButton
                        aria-label="close"
                        onClick={handleDeleteCancel}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </ConfirmationDialogTitle>

                <ConfirmationDialogContent>
                    <Typography>
                        Are you sure you want to delete{" "}
                        <strong>{itemToDelete?.fieldName}</strong>
                    </Typography>
                </ConfirmationDialogContent>

                <ConfirmationDialogActions>
                    <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
                        Cancel
                    </Button>

                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        disabled={deleteLoading}
                        startIcon={deleteLoading ? <CircularProgress size={16} /> : null}
                    >
                        {deleteLoading ? "Deleting..." : "Delete"}
                    </Button>
                </ConfirmationDialogActions>
            </ConfirmationDialog>
        </Box>

    );
};

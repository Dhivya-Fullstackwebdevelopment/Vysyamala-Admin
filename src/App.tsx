import { SetStateAction, useEffect, useState } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Loader from './common/Loader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DataTable from './components/new_profile/DataTable';
import DefaultLayout from './layout/DefaultLayout';
import CountryTable from './components/CountryTable';
import StateTable from './components/StateTable';
import DistrictTable from './components/DistrictTable';
import SignIn from './pages/Authentication/SignIn';
import PlaceOfBirthList from './components/PlaceOfBirthList';
import DasaBalanceList from './components/DasaBalanceList';
import LagnamList from './components/LagnamList';
import RasiList from './components/RasiList';
import CasteTable from './components/CasteTable';
import ReligionTable from './components/ReligionTable';
import BirthStarList from './components/BirthStarList';
import ProfileholderTable from './components/ProfileholderTable';
import ParentsoccupationTable from './components/ParentsoccupationTable';
import HighesteducationsTable from './components/HighesteducationsTable';
import UgdegreeTable from './components/UgdegreeTable';
import AnnualincomesTable from './components/AnnualincomesTable';
import ProfileForm from './components/new_profile/AddProfile';
import Feature_profile from './components/new_profile/feature_profile';
import AddProfile from './components/new_profile/AddProfile';
import Datatablel from './components/DataTablel';
import AdminPage from './components/new_profile/DataTable';
import EditProfilePage from './components/EditProfilePage';
import PaidProfile from './components/new_profile/profiles/Paidprofiles';
import Approvedprofile from './components/new_profile/profiles/Approved profile';
import Featuredprofile from './components/new_profile/profiles/Featured profile';
import Deletedprofile from './components/new_profile/profiles/Deleted profile';
import NewProfile from './components/new_profile/profiles/New profile';
import PageList from './components/CsmPage/CsmTableData';
import CsmManagementComponent from './components/CsmPage/CsmManagementComponent';
import CKEditorComponent from './components/CsmPage/AddCsmData';
import CsmEditorComponent from './components/CsmPage/EditCsmData';
import SiteDetailsForm from './components/submenue/Sidebar/AdminSettings/AdminSetting';
import EditAdminUserForm from './components/submenue/AdminUsers/EditAdminUsers';
import AdminUserForm from './components/submenue/AdminUsers/AdminUsers';
import AdminTable from './components/submenue/AdminUsers/AdminTable';
import FamilyTypeTable from './components/FamilytypeTable';
import FamilyStatusTable from './components/FamilystatusTable';
import MatchingProfiles from './components/MatchingProfiles';
import Add from './components/new_profile/Addddd';
import Forming from './components/new_profile/profiles/AddProf';
import Award from './components/Awardgallery';
import SuccessStories from './components/SuccessStory/SuccessStories';
import AddSuccessStory from './components/SuccessStory/AddSuccessStories';
import EditSuccessStory from './components/SuccessStory/EditSucessStory';
import ProtectedRoutes from './components/utils/ProtectedRoutes';

import FamilyValueTable from './components/FamilyValueTable';
import GothramList from './components/Gothrams';
import PropertyTable from './components/PropertyWorth';
import ComplectionTable from './components/ComplexionTable';
import HeightTable from './components/ProfileMasterHeight';
import MaritalStatusTable from './components/MaritalStatuses';
import HomePageTable from './components/HomePage/HomePageTable';
import AddHomepageForm from './components/HomePage/AddHomePage';
import EditHomepageForm from './components/HomePage/UpdateHomePage';
import DashBoard from './pages/Dashboard/DashBoard';
import StatePreferences from './components/StatePreferences';
import NewlyRegisteredProfiles from './components/ReuseProfileTable/Profiles/ZeroProfiles';
import ApprovedProfilee from './components/ReuseProfileTable/Profiles/FirstProfile';
import PendingProfiles from './components/ReuseProfileTable/Profiles/SecondProfile';
import PaidProfileProfiles from './components/ReuseProfileTable/Profiles/ThirdProfile';
import ProspectProfilesProfiles from './components/ReuseProfileTable/Profiles/FourthProfile';
import PaidProfilesProfiles from './components/ReuseProfileTable/Profiles/FifthProfile';
import HiddenProfilesProfiles from './components/ReuseProfileTable/Profiles/SixthProfile';
import DeletedProfilesProfiles from './components/ReuseProfileTable/Profiles/SeventhProfile';
import CityTable from './components/City';
import ModesTable from './components/ProfileMasterOwner';
import AwardsTable from './components/AwardGallery/AwardGalleryTable';
import EditAward from './components/AwardGallery/EditAwards';
import AddAward from './components/AwardGallery/AddNewAwards';
import EditProfile from './components/new_profile/editProfile';
import QuickUploadProfiles from './components/ReuseProfileTable/Profiles/QuickUploadProfiles';
import PhotoRequestProfiles from './components/ReuseProfileTable/userActions/PhotoRequestProfiles';
import PageTitle from './components/PageTitle';
import ViewedProfiles from './components/ReuseProfileTable/userActions/ViewedProfiles';
import WishlistsProfile from './components/ReuseProfileTable/userActions/WishlistsProfile';
import ProfileImageApproval from './components/ReuseProfileTable/userActions/ProfileImageApproval';
import ExpressIntrest from './components/ReuseProfileTable/userActions/ExpressInterests';
import ViewProfileForm from './components/new_profile/viewProfileForm';
import MatchingProfile from './matchingProfile/matchingProfile';
import VysAssist from './components/vysAssistTabel';
import MailerTool from './components/utils/MailerTool';
import ViewedProfilesById from './components/ViewProfiles/ViewProfiles';
import GetPhotoRequestProfile from './components/ViewProfiles/GetPhotoRequestProfile';
import VysaAssistProfile from './components/ViewProfiles/VysaAssist';
import PersonalNotes from './components/ViewProfiles/PersonalNotes';
import ExpressInterestProfiles from './components/ViewProfiles/ExpressInterestProfiles';
import LoginDetails from './components/ViewProfiles/LoginDetails';
import ProfileSentTo from './components/ViewProfiles/ProfileSentTo';
import EditFamilyProfile from './EditProfileForms/FamilyProfileFormEdit';
import FamilyDetails from './components/new_profile/EditFormComponents/familyDetails';
import VisitorProfile from './components/ViewProfiles/VisitorProfile';
import SuggestedProfile from './matchingProfile/SuggestedProfile';
import CToCReceivedProfile from './matchingProfile/CToCReceived';
import CToCSentProfile from './matchingProfile/CToCSentProfiles';
import ExpressInterestMutualProfiles from './matchingProfile/ExpressIntrestMutual';
import ExpressInterestReceivedProfiles from './matchingProfile/ExpressIntrestReceived';
// import { UserMatchingProfiles } from './matchingProfile/UserMatchingProfiles';
import { UploadApprovalProfileImg } from './components/ReuseProfileTable/userActions/ProfileImgApproval.tsx/UploadApprovalProfileImg';
import SearchProfile from './pages/SearchProfile';
import RenewalProfiles from './components/ReuseProfileTable/Profiles/RenewalProfiles';
import UserMatchingProfiles from './matchingProfile/UserMatchingProfiles';
import LoginProfiles from './components/ReuseProfileTable/userActions/LoginProfiles';
import TransactionHistory from './components/ReuseProfileTable/userActions/TransactionHistory';
import { ProfilesPage } from './matchingProfile/MatchingFilterAndTable/ProfilesPage';
import { MatchingProfilesResultsPage } from './matchingProfile/MatchingFilterAndTable/MatchingProfilesResultsPage';
import { NewMatchingTable } from './matchingProfile/MatchingFilterAndTable/NewMatchingTable';
import { UserProfileVisibilityFilter } from './matchingProfile/ProfileVisibilityFilterAndTable/ProfileVisibilityFilter';
import { ProfileVisibilityTable } from './matchingProfile/ProfileVisibilityFilterAndTable/ProfileVisibilityTable';
import TransactionHistoryNew from './components/ReuseProfileTable/userActions/TransactionHistoryNew';
import FeaturedProfiles from './components/ReuseProfileTable/Profiles/FeaturedProfiles';
import StaffDetails from './components/StaffDetails/StaffDetails';
import CallManagementPage from './components/CallManagement/CallManagementPage';
import GeneralCallManagementPage from './components/CallManagement/GeneralCallMangement';
import RenewalDashboard from './components/RenewalDashboard/RenewalDahboardPage';
import RegistrationDashboard from './components/RegistrationDashboard/RegistrationDashboard';
import ProspectDashboard from './components/ProspectDashboard/ProspectDashboard';
import PremiumDashboard from './components/new_profile/EditFormComponents/PremiumDashboard/PremiumDashboard';
import DailyWorkDashboard from './components/DailyWorkDashboard/DailyWorkDashboard';
import MarriageDashboard from './components/MarriageDashboard/MarriageDashboard';
import DeleteDashboard from './components/DeleteDashboard/DeleteDashboard';
import AdvanceSearchFilters from './pages/AdvanceSearch/AdvanceSearchFilters';
import AdvanceSearchDashboard from './pages/AdvanceSearch/AdvanceSearchDashboard';
import CallManagementSearchFilters from './pages/CallManagementSearch/CallManagementFilters';
import CallManagementDashboard from './pages/CallManagementSearch/CallManagementDashboard';
import ClickToCallProfiles from './components/ReuseProfileTable/userActions/ClicktoCall';

function App() {
  const { pathname } = useLocation();


  // const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const [loading, setLoading] = useState<boolean>(true);

  sessionStorage.removeItem('districtError');
  sessionStorage.removeItem('stateError');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // useEffect(() => {
  //   setIsAuthenticated(localStorage.getItem('isAuthenticated') === 'true');
  // }, []);

  // Sync authentication state with localStorage in case of tab refresh
  useEffect(() => {
    const checkAuthStatus = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    };

    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!isAuthenticated && pathname !== '/') {
    return <Navigate to="/" />;
  }

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path="/"
          element={<SignIn setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="*"
          element={
            <DefaultLayout>
              <Routes>
                <Route element={<ProtectedRoutes />}>
                  <Route
                    path="/ProfileForm"
                    element={
                      <>
                        <PageTitle title="" />
                        <AddProfile />
                      </>
                    }
                  />
                  <Route
                    path="/ProfileSentTo"
                    element={
                      <>
                        <PageTitle title="" />
                        <ProfileSentTo />
                      </>
                    }
                  />
                  <Route
                    path="/VysAssist"
                    element={
                      <>
                        <PageTitle title="" />
                        <VysAssist />
                      </>
                    }
                  />

                  <Route
                    path="/LoginDetails"
                    element={
                      <>
                        <PageTitle title="" />
                        <LoginDetails />
                      </>
                    }
                  />
                  <Route
                    path="/editProfile"
                    element={
                      <>
                        <PageTitle title="editProfile" />
                        <EditProfile />
                      </>
                    }
                  />
                  <Route path='/FamilyDetails' element={
                    <>
                      <PageTitle title='FamilyDetails' />
                      <FamilyDetails EditData={undefined} isFamilyDetailsOpen={false} setIsFamilyDetailsOpen={function (value: SetStateAction<boolean>): void {
                        throw new Error('Function not implemented.');
                      }} />
                    </>
                  } />
                  <Route
                    path="/mailerTool"
                    element={
                      <>
                        <PageTitle title="mailerTool" />
                        <MailerTool />
                      </>
                    }
                  />
                  {/* <Route
                    path="/matchingProfiles"
                    element={
                      <>
                        <PageTitle title="matchingProfiles" />
                        <MatchingProfile />
                      </>
                    }
                  /> */}
                  <Route
                    path="/UserMatchingProfiles"
                    element={
                      <>
                        <PageTitle title="UserMatchingProfiles" />
                        <UserMatchingProfiles />
                      </>
                    }
                  />
                  <Route
                    path="/suggestedProfiles"
                    element={
                      <>
                        <PageTitle title="suggestedProfiles" />
                        <SuggestedProfile />
                      </>
                    }
                  />
                  <Route
                    path="/CToCReceivedProfiles"
                    element={
                      <>
                        <PageTitle title="CToCReceivedProfiles" />
                        <CToCReceivedProfile />
                      </>
                    }
                  />

                  <Route
                    path="/CToCSentProfiles"
                    element={
                      <>
                        <PageTitle title="CToCSentProfiles" />
                        <CToCSentProfile />
                      </>
                    }
                  />
                  <Route
                    path="/ExpressInterestMutualProfiles"
                    element={
                      <>
                        <PageTitle title="ExpressInterestMutualProfiles" />
                        <ExpressInterestMutualProfiles />
                      </>
                    }
                  />
                  <Route
                    path="/ExpressInterestReceivedProfiles"
                    element={
                      <>
                        <PageTitle title="Express Interest Received Profiles" />
                        <ExpressInterestReceivedProfiles />
                      </>
                    }
                  />
                  <Route
                    path="/ViewedProfilesById"
                    element={
                      <>
                        <PageTitle title="ViewedProfilesById" />
                        <ViewedProfilesById />
                      </>
                    }
                  />
                  <Route
                    path="/VisitorProfilesById"
                    element={
                      <>
                        <PageTitle title="VisitorProfilesById" />
                        <VisitorProfile />
                      </>
                    }
                  />
                  <Route
                    path="/GetPhotoRequestProfile"
                    element={
                      <>
                        <PageTitle title="GetPhotoRequestProfile" />
                        <GetPhotoRequestProfile />
                      </>
                    }
                  />
                  <Route
                    path="/VysaAssist"
                    element={
                      <>
                        <PageTitle title="VysaAssist" />
                        <VysaAssistProfile />
                      </>
                    }
                  />
                  <Route
                    path="/PersonalNotes"
                    element={
                      <>
                        <PageTitle title="PersonalNotes" />
                        <PersonalNotes />
                      </>
                    }
                  />
                  <Route
                    path="/ExpressInterestProfiles"
                    element={
                      <>
                        <PageTitle title="ExpressInterestProfiles" />
                        <ExpressInterestProfiles />
                      </>
                    }
                  />
                  <Route
                    path="/viewProfile"
                    element={
                      <>
                        <PageTitle title="viewProfile" />
                        <ViewProfileForm />
                      </>
                    }
                  />
                  <Route
                    path="/DashBoard"
                    element={
                      <>
                        <PageTitle title="DashBoard" />
                        <DashBoard />
                      </>
                    }
                  />
                  <Route
                    path="/family-master/family-value-options"
                    element={
                      <>
                        <PageTitle title="FamilyValueTable" />
                        <FamilyValueTable />
                      </>
                    }
                  />
                  <Route
                    path="/DataTable"
                    element={
                      <>
                        <PageTitle title="DataTable" />
                        <DataTable />
                      </>
                    }
                  />

                  <Route
                    path="/CountryTable"
                    element={
                      <>
                        <PageTitle title="CountryTable" />
                        <CountryTable />
                      </>
                    }
                  />
                  <Route
                    path="/StateTable"
                    element={
                      <>
                        <PageTitle title="StateTable" />
                        <StateTable />
                      </>
                    }
                  />
                  <Route
                    path="/DistrictTable"
                    element={
                      <>
                        <PageTitle title="DistrictTable" />
                        <DistrictTable />
                      </>
                    }
                  />
                  <Route
                    path="/CasteTable"
                    element={
                      <>
                        <PageTitle title="CasteTable" />
                        <CasteTable />
                      </>
                    }
                  />
                  <Route
                    path="/ReligionTable"
                    element={
                      <>
                        <PageTitle title="ReligionTable" />
                        <ReligionTable />
                      </>
                    }
                  />
                  <Route
                    path="/PlaceOfBirthList"
                    element={
                      <>
                        <PageTitle title="PlaceOfBirthList" />
                        <PlaceOfBirthList />
                      </>
                    }
                  />
                  <Route
                    path="/DasaBalanceList"
                    element={
                      <>
                        <PageTitle title="DasaBalanceList" />
                        <DasaBalanceList />
                      </>
                    }
                  />
                  <Route
                    path="/LagnamList"
                    element={
                      <>
                        <PageTitle title="LagnamList" />
                        <LagnamList />
                      </>
                    }
                  />
                  <Route
                    path="/RasiList"
                    element={
                      <>
                        <PageTitle title="RasiList" />
                        <RasiList />
                      </>
                    }
                  />
                  <Route
                    path="/BirthStarList"
                    element={
                      <>
                        <PageTitle title="BirthStarList" />
                        <BirthStarList />
                      </>
                    }
                  />
                  <Route
                    path="/ProfileholderTable"
                    element={
                      <>
                        <PageTitle title="ProfileholderTable" />
                        <ProfileholderTable />
                      </>
                    }
                  />
                  <Route
                    path="/ParentsoccupationTable"
                    element={
                      <>
                        <PageTitle title="ParentsoccupationTable" />
                        <ParentsoccupationTable />
                      </>
                    }
                  />
                  <Route
                    path="/HighesteducationsTable"
                    element={
                      <>
                        <PageTitle title="HighesteducationsTable" />
                        <HighesteducationsTable />
                      </>
                    }
                  />
                  <Route
                    path="/UgdegreeTable"
                    element={
                      <>
                        <PageTitle title="UgdegreeTable" />
                        <UgdegreeTable />
                      </>
                    }
                  />
                  <Route
                    path="/AnnualincomesTable"
                    element={
                      <>
                        <PageTitle title="AnnualincomesTable" />
                        <AnnualincomesTable />
                      </>
                    }
                  />

                  <Route
                    path="/ProfileForm"
                    element={
                      <>
                        <PageTitle title="ProfileForm" />
                        <ProfileForm />
                      </>
                    }
                  />
                  <Route
                    path="/RenewalProfiles"
                    element={
                      <>
                        <PageTitle title="RenewalProfiles" />
                        <RenewalProfiles />
                      </>
                    }
                  />
                  <Route
                    path="/FeaturedProfiles"
                    element={
                      <>
                        <PageTitle title="FeaturedProfiles" />
                        <FeaturedProfiles />
                      </>
                    }
                  />
                  <Route
                    path="/StaffDetails"
                    element={
                      <>
                        <PageTitle title="StaffDetails" />
                        <StaffDetails />
                      </>
                    }
                  />

                  <Route
                    path="/feature_profile"
                    element={
                      <>
                        <PageTitle title="feature_profile" />
                        <Feature_profile />
                      </>
                    }
                  />

                  <Route
                    path="/DataTablel"
                    element={
                      <>
                        <PageTitle title="DataTablel" />
                        <Datatablel columns={[]} apiEndpoint={''} />
                      </>
                    }
                  />
                  <Route
                    path="/Approvedprofile"
                    element={
                      <>
                        <PageTitle title="Approvedprofile" />
                        <Approvedprofile />
                      </>
                    }
                  />

                  <Route
                    path="/Featuredprofile"
                    element={
                      <>
                        <PageTitle title="Featuredprofile" />
                        <Featuredprofile />
                      </>
                    }
                  />

                  <Route
                    path="/Deletedprofile"
                    element={
                      <>
                        <PageTitle title="Deletedprofile" />
                        <Deletedprofile />
                      </>
                    }
                  />

                  <Route
                    path="/PaidProfile"
                    element={
                      <>
                        <PageTitle title="PaidProfile" />
                        <PaidProfile />
                      </>
                    }
                  />

                  <Route
                    path="/NewProfile"
                    element={
                      <>
                        <PageTitle title="NewProfile" />
                        <NewProfile />
                      </>
                    }
                  />

                  <Route path="/admin" element={<AdminPage />} />
                  <Route
                    path="/admin/edit/:ContentId"
                    element={<EditProfilePage />}
                  />
                  <Route
                    path="/CsmDataTable"
                    element={
                      <>
                        <PageTitle title="CsmDataTable" />
                        <PageList />
                      </>
                    }
                  />

                  <Route
                    path="/AddCsmData"
                    element={
                      <>
                        <PageTitle title="AddCsmData" />
                        <CKEditorComponent />
                      </>
                    }
                  />
                  <Route
                    path="/EditCsmData/:id"
                    element={
                      <>
                        <PageTitle title="EditCsmData" />
                        <CsmEditorComponent />
                      </>
                    }
                  />
                  <Route
                    path="/SiteDetailsForm"
                    element={
                      <>
                        <PageTitle title="SiteDetailsForm" />
                        <SiteDetailsForm />
                      </>
                    }
                  />

                  <Route
                    path="/AdminUsers"
                    element={
                      <>
                        <PageTitle title="AdminUsers" />
                        <AdminUserForm />
                      </>
                    }
                  />

                  <Route path="/AdminList"
                    element={
                      <>
                        <PageTitle title="AdminList" />
                        <AdminTable />
                      </>
                    }
                  />
                  <Route
                    path="/EditAdminUserForm/:id"
                    element={
                      <>
                        <PageTitle title="EditAdminUserForm" />
                        <EditAdminUserForm />
                      </>
                    }
                  />

                  <Route
                    path="/family-master/family-type"
                    element={
                      <>
                        <PageTitle title="FamilyTypeTable" />
                        <FamilyTypeTable />
                      </>
                    }
                  />

                  <Route
                    path="/family-master/family-status-options"
                    element={
                      <>
                        <PageTitle title="FamilyStatusTable" />
                        <FamilyStatusTable />
                      </>
                    }
                  />
                  <Route
                    path="/Matching-Profiles"
                    element={
                      <>
                        <PageTitle title="MatchingProfiles" />
                        <MatchingProfiles />
                      </>
                    }
                  />
                  <Route
                    path="/Add"
                    element={
                      <>
                        <PageTitle title="Add" />
                        <Add />
                      </>
                    }
                  />
                  <Route
                    path="/Award"
                    element={
                      <>
                        <PageTitle title="Award" />
                        <Award />
                      </>
                    }
                  />
                  <Route
                    path="/CsmManagementComponent"
                    element={
                      <>
                        <PageTitle title="CsmManagementComponent" />
                        <CsmManagementComponent />
                      </>
                    }
                  />
                  <Route
                    path="/Adding"
                    element={
                      <>
                        <PageTitle title="Adding" />
                        <Forming />
                      </>
                    }
                  />

                  <Route
                    path="/SuccessStories"
                    element={
                      <>
                        <PageTitle title="SuccessStories" />
                        <SuccessStories />
                      </>
                    }
                  />

                  <Route
                    path="/AddSuccessStories"
                    element={
                      <>
                        <PageTitle title="AddSuccessStories" />
                        <AddSuccessStory />
                      </>
                    }
                  />

                  <Route
                    path="/EditSuccessStory/:id"
                    element={
                      <>
                        <PageTitle title="EditSuccessStory" />
                        <EditSuccessStory />
                      </>
                    }
                  />
                </Route>

                <Route
                  path="/family-master/family-Property-Worth"
                  element={
                    <>
                      <PageTitle title="PropertyTable" />
                      <PropertyTable />
                    </>
                  }
                />
                <Route
                  path="/family-master/gothrams"
                  element={
                    <>
                      <PageTitle title="GothramTable" />
                      <GothramList />
                    </>
                  }
                />
                <Route
                  path="/profile-master/complexion"
                  element={
                    <>
                      <PageTitle title="ComplectionTable" />
                      <ComplectionTable />
                    </>
                  }
                />
                <Route
                  path="/profile-master/height"
                  element={
                    <>
                      <PageTitle title="HeightTable" />
                      <HeightTable />
                    </>
                  }
                />

                <Route
                  path="/profile-master/marital-status"
                  element={
                    <>
                      <PageTitle title="MaritalStatus" />
                      <MaritalStatusTable />
                    </>
                  }
                />
                <Route
                  path="/HomePageTable"
                  element={
                    <>
                      <PageTitle title="HomePageTable" />
                      <HomePageTable />
                    </>
                  }
                />
                <Route
                  path="/AddHomepageForm"
                  element={
                    <>
                      <PageTitle title="AddHomepageForm" />
                      <AddHomepageForm />
                    </>
                  }
                />
                <Route
                  path="/HomepageForm"
                  element={
                    <>
                      <PageTitle title="HomepageForm" />
                      <EditHomepageForm />
                    </>
                  }
                />
                <Route
                  path="/StatePreferences"
                  element={
                    <>
                      <PageTitle title="StatePreferences" />
                      <StatePreferences />
                    </>
                  }
                />
                <Route
                  path="/NewlyRegistered"
                  element={
                    <>
                      <PageTitle title="NewlyRegistered" />
                      <NewlyRegisteredProfiles />
                    </>
                  }
                />
                <Route
                  path="/ApprovedProfilee"
                  element={
                    <>
                      <PageTitle title="ApprovedProfilee" />
                      <ApprovedProfilee />
                    </>
                  }
                />
                <Route
                  path="/PendingProfiles"
                  element={
                    <>
                      <PageTitle title="PendingProfiles" />
                      <PendingProfiles />
                    </>
                  }
                />
                <Route
                  path="/PaidProfileProfiles"
                  element={
                    <>
                      <PageTitle title="PaidProfileProfiles" />
                      <PaidProfileProfiles />
                    </>
                  }
                />
                <Route
                  path="/ProspectProfilesProfiles"
                  element={
                    <>
                      <PageTitle title="ProspectProfilesProfiles" />
                      <ProspectProfilesProfiles />
                    </>
                  }
                />
                <Route
                  path="/PaidProfilesProfiles"
                  element={
                    <>
                      <PageTitle title="PaidProfilesProfiles" />
                      <PaidProfilesProfiles />
                    </>
                  }
                />
                <Route
                  path="/HiddenProfilesProfiles"
                  element={
                    <>
                      <PageTitle title="HiddenProfilesProfiles" />
                      <HiddenProfilesProfiles />
                    </>
                  }
                />
                <Route
                  path="/DeletedProfilesProfiles"
                  element={
                    <>
                      <PageTitle title="DeletedProfilesProfiles" />
                      <DeletedProfilesProfiles />
                    </>
                  }
                />
                <Route
                  path="/CityTable"
                  element={
                    <>
                      <PageTitle title="CityTable" />
                      <CityTable />
                    </>
                  }
                />

                <Route
                  path="/profile-master/modes"
                  element={
                    <>
                      <PageTitle title="ModesTable" />
                      <ModesTable />
                    </>
                  }
                />

                <Route
                  path="/AwardsTable"
                  element={
                    <>
                      <PageTitle title="AwardsTable" />
                      <AwardsTable />
                    </>
                  }
                />
                <Route
                  path="/AddAward"
                  element={
                    <>
                      <PageTitle title="AddAward" />
                      <AddAward />
                    </>
                  }
                />
                <Route
                  path="/EditAward/:id"
                  element={
                    <>
                      <PageTitle title="EditAward" />
                      <EditAward />
                    </>
                  }
                />
                <Route
                  path="/QuickUploadProfiles"
                  element={
                    <>
                      <PageTitle title="QuickUploadProfiles" />
                      <QuickUploadProfiles />
                    </>
                  }
                />
                <Route
                  path="ExpressIntrest"
                  element={
                    <>
                      <PageTitle title="ExpressIntrest" />
                      <ExpressIntrest />
                    </>
                  }
                />
                <Route
                  path="/ViewedProfiles"
                  element={
                    <>
                      <PageTitle title="ViewedProfiles" />
                      <ViewedProfiles />
                    </>
                  }
                />
                <Route
                  path="/WishlistsProfile"
                  element={
                    <>
                      <PageTitle title="WishlistsProfile" />
                      <WishlistsProfile />
                    </>
                  }
                />
                <Route
                  path="/TransactionHistory"
                  element={
                    <>
                      <PageTitle title="TransactionHistory" />
                      <TransactionHistory />
                    </>
                  }
                />
                <Route
                  path="/TransactionHistoryNew"
                  element={
                    <>
                      <PageTitle title="TransactionHistoryNew" />
                      <TransactionHistoryNew />
                    </>
                  }
                />
                <Route
                  path="/PhotoRequestProfiles"
                  element={
                    <>
                      <PageTitle title="PhotoRequestProfiles" />
                      <PhotoRequestProfiles />
                    </>
                  }
                />
                <Route
                  path="/EditFamilyProfile"
                  element={
                    <>
                      <PageTitle title="EditFamilyProfile" />
                      <EditFamilyProfile />
                    </>
                  }
                />
                <Route
                  path="/ProfileImageApproval"
                  element={
                    <>
                      <PageTitle title="ProfileImageApproval" />
                      <ProfileImageApproval />
                    </>
                  }
                />
                <Route
                  path="/LoginProfiles"
                  element={
                    <>
                      <PageTitle title="LoginProfiles" />
                      <LoginProfiles />
                    </>
                  }
                />
                <Route
                  path="/UploadApprovalProfileImg"
                  element={
                    <>
                      <PageTitle title="Upload Approval Profile Image" />
                      <UploadApprovalProfileImg />
                    </>
                  }
                />
                <Route
                  path="/SearchProfile"
                  element={
                    <>
                      <PageTitle title="SearchProfile" />
                      <SearchProfile />
                    </>
                  }
                />

                <Route
                  path="/Profiles"
                  element={<ProfilesPage profileType={'matching'} No_Image_Available={undefined} Name={''} /* pass necessary props here */ />}
                />
                <Route
                  path="/MatchingProfileResults"
                  element={<MatchingProfilesResultsPage />}
                />

                <Route
                  path="/UserProfileVisibilityFilter"
                  element={<UserProfileVisibilityFilter />}
                />

                <Route
                  path="/ProfileVisibilityTable"
                  element={<ProfileVisibilityTable />}
                />
                <Route path="/CallManagement" element={<CallManagementPage />} />
                <Route path="/GeneralCallManagement" element={<GeneralCallManagementPage />} />
                <Route path="/RenewalDashboard" element={<RenewalDashboard />} />
                <Route path="/RegistrationDashboard" element={<RegistrationDashboard />} />
                <Route path="/ProspectDashboard" element={<ProspectDashboard />} />
                <Route path="/PremiumDashboard" element={<PremiumDashboard />} />
                <Route path="/DailyWorkDashboard" element={<DailyWorkDashboard />} />
                <Route path="/MarriageDashboard" element={<MarriageDashboard />} />
                <Route path="/DeleteDashboard" element={<DeleteDashboard />} />
                {/* <Route path="/AdvancedSearch" element={<AdvanceSearchFilters />} /> */}
                <Route path="/AdvancedSearch" element={<AdvanceSearchDashboard />} />
                <Route path="/CallManagementSearch" element={<CallManagementDashboard />} />
                <Route path="/ClicktoCall" element={<ClickToCallProfiles />} />
              </Routes>
            </DefaultLayout>
          }
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;

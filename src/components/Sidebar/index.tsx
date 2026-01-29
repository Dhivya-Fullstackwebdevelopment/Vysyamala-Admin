import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../../public/Vysyamala.svg';
import { CgProfile } from 'react-icons/cg';
import { FaUser, FaUserCog, FaSearch, FaSearchPlus } from 'react-icons/fa';
import { GiBigDiamondRing } from "react-icons/gi";
import { MdAddLocationAlt, MdAppRegistration, MdAutorenew, MdDashboard, MdDelete } from 'react-icons/md';
import { FaRegStar } from 'react-icons/fa';
import { MdFamilyRestroom } from 'react-icons/md';
import { ImProfile } from 'react-icons/im';
import { GoDot } from 'react-icons/go';
import { IoCall, IoDocumentTextOutline, IoSettings } from 'react-icons/io5';
import { FaClipboardUser } from "react-icons/fa6";
import { RxDashboard } from 'react-icons/rx';
import { hasPermission } from '../utils/auth';
import { BsListTask } from 'react-icons/bs';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-50 flex h-screen w-72.5 flex-col overflow-y-hidden bg-yellow duration-300 ease-linear dark:bg-boxdark ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/">
          <img src={Logo} alt="Logo" />
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto hover:text-PrimaryRed duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className=" py-4 px-4   lg:px-6">
          {/* <!-- Menu Group --> */}
          <div>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* <!-- Menu Item Dashboard --> */}

              <li>
                {/* <NavLink
                  to="/"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black hover:text-PrimaryRed hover:text-PrimaryRed duration-300 ease-in-out ${pathname.includes('profile') && 'bg-graydark dark:bg-meta-4'
                    }`}
                >
                  <svg
                    className="fill-current"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.0002 7.79065C11.0814 7.79065 12.7689 6.1594 12.7689 4.1344C12.7689 2.1094 11.0814 0.478149 9.0002 0.478149C6.91895 0.478149 5.23145 2.1094 5.23145 4.1344C5.23145 6.1594 6.91895 7.79065 9.0002 7.79065ZM9.0002 1.7719C10.3783 1.7719 11.5033 2.84065 11.5033 4.16252C11.5033 5.4844 10.3783 6.55315 9.0002 6.55315C7.62207 6.55315 6.49707 5.4844 6.49707 4.16252C6.49707 2.84065 7.62207 1.7719 9.0002 1.7719Z"
                      fill=""
                    />
                    <path
                      d="M10.8283 9.05627H7.17207C4.16269 9.05627 1.71582 11.5313 1.71582 14.5406V16.875C1.71582 17.2125 1.99707 17.5219 2.3627 17.5219C2.72832 17.5219 3.00957 17.2407 3.00957 16.875V14.5406C3.00957 12.2344 4.89394 10.3219 7.22832 10.3219H10.8564C13.1627 10.3219 15.0752 12.2063 15.0752 14.5406V16.875C15.0752 17.2125 15.3564 17.5219 15.7221 17.5219C16.0877 17.5219 16.3689 17.2407 16.3689 16.875V14.5406C16.2846 11.5313 13.8377 9.05627 10.8283 9.05627Z"
                      fill=""
                    />
                  </svg>
                  Profile
                </NavLink> */}
              </li>
              <SidebarLinkGroup
                activeCondition={
                  pathname === "/SearchProfile" ||
                  pathname === "/AdvancedSearch" ||
                  pathname === "/CallManagementSearch"
                }
              >
                {(handleClick, open) => {
                  return (
                    <>
                      {/* MAIN MENU */}
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out ${(pathname === "/SearchProfile" ||
                          pathname === "/AdvancedSearch" ||
                          pathname === "/CallManagementSearch")
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      >
                        <FaSearch />
                        Search

                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && "rotate-180"
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>

                      {/* DROPDOWN MENU */}
                      <div className={`translate transform overflow-hidden ${!open && "hidden"}`}>
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          {hasPermission("search_profile") && (
                            <li>
                              <NavLink
                                to="/SearchProfile"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out " +
                                  (isActive && "!text-PrimaryRed")
                                }
                              >
                                <FaSearch />
                                Basic Search
                              </NavLink>
                            </li>
                          )}

                          {hasPermission("advanced_profiles") && (
                            <li>
                              <NavLink
                                to="/AdvancedSearch"
                                className={({ isActive }) =>
                                  "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out " +
                                  (isActive && "!text-PrimaryRed")
                                }
                              >
                                <FaSearchPlus />
                                Advanced Search
                              </NavLink>
                            </li>
                          )}

                          <li>
                            <NavLink
                              to="/CallManagementSearch"
                              className={({ isActive }) =>
                                "group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out " +
                                (isActive && "!text-PrimaryRed")
                              }
                            >
                              <IoCall />
                              Call Management Search
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </>
                  );
                }}
              </SidebarLinkGroup>

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out ${(pathname === '/forms' ||
                          pathname.includes('forms')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <ImProfile />
                        Profile
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'}`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      {/* <!-- Dropdown Menu Start --> */}
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          {/* <li>
                            <NavLink
                              to="/SearchProfile"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Search Profile
                            </NavLink>
                          </li> */}
                          <li>
                            <NavLink
                              to="DataTable"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Profile
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="/QuickUploadProfiles"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Quick Upload
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="NewlyRegistered"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              New Profiles
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="ApprovedProfilee"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Approved Profiles
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="PendingProfiles"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Pending Profiles
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="PaidProfileProfiles"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Paid Profiles
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="ProspectProfilesProfiles"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Prospect Profiles
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="HiddenProfilesProfiles"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Hidden Profiles
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="DeletedProfilesProfiles"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Deleted Profiles
                            </NavLink>
                          </li>

                          {hasPermission('add_profile') && (
                            <li>
                              <NavLink
                                to="ProfileForm"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Add New Profile
                              </NavLink>
                            </li>
                          )}

                          <li>
                            <NavLink
                              to="RenewalProfiles"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Renewal Profiles
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="FeaturedProfiles"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Featured Profiles
                            </NavLink>
                          </li>
                          {/* <li>
                            <NavLink
                              to="StaffDetails"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Staff Details
                            </NavLink>
                          </li> */}
                          {/* <li>
                            <NavLink
                              to="viewProfile"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-black')
                              }
                            >
                              <GoDot />
                              viewProfile
                            </NavLink>
                          </li> */}
                        </ul>
                      </div>
                      {/* <!-- Dropdown Menu End --> */}
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              <SidebarLinkGroup
                activeCondition={
                  pathname === '/forms' || pathname.includes('forms')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out ${(pathname === '/forms' ||
                          pathname.includes('forms')) &&
                          'bg-graydark dark:bg-meta-4'
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <FaUserCog />
                        User Actions
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>

                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink
                              to="ExpressIntrest"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Express Interests
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="ViewedProfiles"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Viewed Profiles
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="WishlistsProfile"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Wishlist Profiles
                            </NavLink>
                          </li>
                          {/* <li>
                            <NavLink
                              to="TransactionHistory"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Transaction History
                            </NavLink> 
                          </li> */}
                          <li>
                            <NavLink
                              to="TransactionHistoryNew"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Transaction History
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="PhotoRequestProfiles"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Photo Request Profiles
                            </NavLink>
                          </li>

                          <li>
                            <NavLink
                              to="ProfileImageApproval"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Profile Image Approval
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="LoginProfiles"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Login Profiles
                            </NavLink>
                          </li>
                          <li>
                            <NavLink
                              to="ClicktoCall"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Click to Call
                            </NavLink>
                          </li>
                        </ul>
                      </div>

                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              {hasPermission('online_changes_tool') && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/master-location' ||
                    pathname.includes('master-location')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        {/* Main Menu Item */}
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out ${(pathname === '/master-location' ||
                            pathname.includes('master-location')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          {/* Location Icon */}
                          <MdAddLocationAlt />
                          {/* Menu Item Text */}
                          Master Location
                          {/* Arrow Icon for Dropdown */}
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>

                        {/* Dropdown Menu Start */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            {/* Submenu Items */}
                            <li>
                              <NavLink
                                to="CountryTable"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Countries
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="StateTable"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                States
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="DistrictTable"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Districts
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/CityTable"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Cities
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/StatePreferences"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                State Preferences
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* Dropdown Menu End */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {/* <!-- Menu Item Master Location End --> */}

              {/* <!-- Menu Item Religions and Community --> */}
              {/* <SidebarLinkGroup
                activeCondition={
                  pathname === '/religions-community' ||
                  pathname.includes('religions-community')
                }
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment> */}
              {/* Main Menu Item */}
              {/* <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out ${
                          (pathname === '/religions-community' ||
                            pathname.includes('religions-community')) &&
                          'bg-graydark dark:bg-meta-4'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      > */}
              {/* Earth Icon */}
              {/* <FaGlobe /> */}
              {/* Menu Item Text */}
              {/* Religions and Community */}
              {/* Arrow Icon for Dropdown */}
              {/* <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${
                            open && 'rotate-180'
                          }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        > */}
              {/* <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink> */}

              {/* Dropdown Menu Start */}
              {/* <div
                        className={`translate transform overflow-hidden ${
                          !open && 'hidden'
                        }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6"> */}
              {/* Submenu Items */}
              {/* <li>
                            <NavLink
                              to="/ReligionTable"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-black')
                              }
                            >
                              <GoDot />
                              Religion
                            </NavLink>
                          </li> */}
              {/* <li>
                            <NavLink
                              to="/CasteTable"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-black')
                              }
                            >
                              <GoDot />
                              Caste
                            </NavLink>
                          </li>
                        </ul>
                      </div> */}
              {/* Dropdown Menu End */}
              {/* </React.Fragment>
                  );
                }}
              </SidebarLinkGroup> */}
              {/* <!-- Menu Item Religions and Community End --> */}
              {hasPermission('online_changes_tool') && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/profile-master' ||
                    pathname.includes('profile-master')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        {/* Main Menu Item */}
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out ${pathname === '/profile-master' ||
                            pathname.includes('profile-master')
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          {/* Icon (You can add your own icon here) */}
                          <CgProfile />
                          Profile Master
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>

                        {/* Dropdown Menu Start */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            {/* Submenu Items */}
                            <li>
                              <NavLink
                                to="/ProfileholderTable"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Profile Holder
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/profile-master/marital-status"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Marital Statuses
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/profile-master/height"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Height
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/profile-master/complexion"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Complexion
                              </NavLink>
                            </li>
                            {/* <li>
                            <NavLink
                              to="ParentsoccupationTable"
                              className={({ isActive }) =>
                                `group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ${
                                  isActive && '!text-black'
                                }`
                              }
                            >
                              <GoDot />
                              Parents Occupation
                            </NavLink>
                          </li> */}
                            <li>
                              <NavLink
                                to="/profile-master/modes"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                On behalf of
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/HighesteducationsTable"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Highest Education
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/UgdegreeTable"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Ug Degrees
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/AnnualincomesTable"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Annual Incomes
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* Dropdown Menu End */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}

              {/* <!-- Menu Item Horoscope Master --> */}
              {hasPermission('online_changes_tool') && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/horoscope-master' ||
                    pathname.includes('horoscope-master')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        {/* Main Menu Item */}
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out ${(pathname === '/horoscope-master' ||
                            pathname.includes('horoscope-master')) &&
                            'bg-graydark dark:bg-meta-4'
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          {/* Star Icon */}
                          <FaRegStar />
                          {/* Menu Item Text */}
                          Horoscope Master
                          {/* Arrow Icon for Dropdown */}
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>

                        {/* Dropdown Menu Start */}
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            {/* Submenu Items */}
                            {/* <li>
                            <NavLink
                              to="PlaceOfBirthList"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-black')
                              }
                            >
                              <GoDot />
                              Place of Birth
                            </NavLink>
                          </li> */}
                            <li>
                              <NavLink
                                to="BirthStarList"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                BirthStar
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/RasiList"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Rasi
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/LagnamList"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Lagnam/Didi
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/DasaBalanceList"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Dasa Balance
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* Dropdown Menu End */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}
              {hasPermission('online_changes_tool') && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/family-master' ||
                    pathname.includes('family-master')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out ${pathname === '/family-master' ||
                            pathname.includes('family-master')
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <MdFamilyRestroom />
                          Family Master
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            {/* Submenu Items */}
                            <li>
                              <NavLink
                                to="/family-master/family-type"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Family Type
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/family-master/family-status-options"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Family Status
                              </NavLink>
                            </li>
                            <li>
                              <NavLink
                                to="/family-master/family-value-options"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Family Value
                              </NavLink>
                            </li>
                            {/* <li>
                            <NavLink
                              to="/family-master/family-Property-Worth"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-black')
                              }
                            >
                              <GoDot />
                            Property Worth
                            </NavLink>
                          </li> */}
                            <li>
                              <NavLink
                                to="/family-master/gothrams"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                  (isActive && '!text-PrimaryRed')
                                }
                              >
                                <GoDot />
                                Gotharams
                              </NavLink>
                            </li>
                          </ul>
                        </div>
                        {/* Dropdown Menu End */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}


              {(hasPermission('online_changes_tool') || hasPermission('marriage_photo_upload')) && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/CSM page' || pathname.includes('CSM page')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 success rounded-sm px-4 py-2 text-black font-medium text-PrimaryRed hover:text-PrimaryRed hover:text-PrimaryRed duration-300 ease-in-out ${pathname === '/' || pathname.includes('dashboard')
                            }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <svg
                            className="fill-current"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M12 2L2 10.5858V21H6V14H12V21H16V10.5858L12 2ZM9 13V19H7V13H9ZM17 13V19H15V13H17Z"
                              fill=""
                            />
                          </svg>
                          CMS Page
                          <svg
                            className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                              }`}
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                              fill=""
                            />
                          </svg>
                        </NavLink>
                        <div
                          className={`translate transform overflow-hidden ${!open && 'hidden'
                            }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">

                            {hasPermission('online_changes_tool') && (
                              <>
                                <li>
                                  <NavLink
                                    to="/CsmDataTable"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                      (isActive && '!text-PrimaryRed')
                                    }
                                  >
                                    <GoDot />
                                    CMS List
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/AwardsTable"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                      (isActive && '!text-PrimaryRed')
                                    }
                                  >
                                    <GoDot />
                                    Award Gallery
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/HomepageForm"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                      (isActive && '!text-PrimaryRed')
                                    }
                                  >
                                    <GoDot />
                                    Home Page
                                  </NavLink>
                                </li>
                              </>
                            )}


                            {hasPermission('marriage_photo_upload') && (
                              <li>
                                <NavLink
                                  to="/SuccessStories"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                    (isActive && '!text-PrimaryRed')
                                  }
                                >
                                  <GoDot />
                                  Success Stories
                                </NavLink>
                              </li>
                            )}
                          </ul>
                        </div>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              )}

              <div
                className={`translate transform overflow-hidden ${!open && 'hidden'
                  }`}
              >
                <ul className="mt-4 mb-5.5 flex flex-col">
                  {/* Submenu Items */}
                  <li>
                    <NavLink
                      to="/SiteDetailsForm"
                      className={({ isActive }) =>
                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                        (isActive && '!text-PrimaryRed')
                      }
                    >
                      <IoSettings />
                      Admin Setting
                    </NavLink>
                  </li>
                </ul>
              </div>
              {/* */}
              <SidebarLinkGroup
                activeCondition={pathname.includes('Dashboard')}
              >
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded ? handleClick() : setSidebarExpanded(true);
                        }}
                      >
                        <RxDashboard size={18} />
                        Dashboards
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'}`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>

                      <div className={`translate transform overflow-hidden ${!open && 'hidden'}`}>
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          <li>
                            <NavLink to="/RenewalDashboard" className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ' + (isActive && '!text-PrimaryRed')}>
                              <MdAutorenew /> Renewal Dashboard
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/RegistrationDashboard" className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ' + (isActive && '!text-PrimaryRed')}>
                              <MdAppRegistration /> Reg Dashboard
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/ProspectDashboard" className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ' + (isActive && '!text-PrimaryRed')}>
                              <RxDashboard /> Prospect Dashboard
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/PremiumDashboard" className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ' + (isActive && '!text-PrimaryRed')}>
                              <MdDashboard /> Premium Dashboard
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/DailyWorkDashboard" className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ' + (isActive && '!text-PrimaryRed')}>
                              <BsListTask /> DW Dashboard
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/MarriageDashboard" className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ' + (isActive && '!text-PrimaryRed')}>
                              <GiBigDiamondRing /> Marriage Dashboard
                            </NavLink>
                          </li>
                          <li>
                            <NavLink to="/DeleteDashboard" className={({ isActive }) => 'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ' + (isActive && '!text-PrimaryRed')}>
                              <MdDelete /> Delete Dashboard
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
              </SidebarLinkGroup>
              <div
                className={`translate transform overflow-hidden ${!open && 'hidden'
                  }`}
              >
                <ul className="mt-4 mb-5.5 flex flex-col">
                  <li>
                    <NavLink
                      to="/GeneralCallManagement"
                      className={({ isActive }) =>
                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                        (isActive && '!text-PrimaryRed')
                      }
                    >
                      <IoCall />
                      General Call Management
                    </NavLink>
                  </li>
                </ul>
              </div>

              {hasPermission('add_new_staff') && (
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/AdminList' || pathname.includes('AdminList')
                  }
                >
                  {(handleClick, open) => (
                    <React.Fragment>
                      <NavLink
                        to="#"
                        className={`group relative flex items-center gap-2.5 success rounded-sm px-4 py-2 text-black font-medium text-PrimaryRed hover:text-PrimaryRed duration-300 ease-in-out ${pathname === '/' || pathname.includes('dashboard')
                          ? 'bg-gray-100'
                          : ''
                          }`}
                        onClick={(e) => {
                          e.preventDefault();
                          sidebarExpanded
                            ? handleClick()
                            : setSidebarExpanded(true);
                        }}
                      >
                        <FaUser size={18} /> {/* Replace with user icon */}
                        Admin Users
                        <svg
                          className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                            }`}
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                            fill=""
                          />
                        </svg>
                      </NavLink>
                      <div
                        className={`translate transform overflow-hidden ${!open && 'hidden'
                          }`}
                      >
                        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                          {/* Submenu Items */}
                          {/* <li>
                          <NavLink
                            to="/AdminList"
                            className={({ isActive }) =>
                              'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                              (isActive && '!text-PrimaryRed')
                            }
                          >
                            <GoDot />
                            User Details
                          </NavLink>
                        </li> */}
                          <li>
                            <NavLink
                              to="StaffDetails"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              User Details
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                      {/* Dropdown Menu End */}
                    </React.Fragment>
                  )}
                </SidebarLinkGroup>
              )}

              <SidebarLinkGroup
                activeCondition={
                  pathname === '/AdminList' || pathname.includes('AdminList')
                }
              >
                {(handleClick, open) => (
                  <React.Fragment>
                    <NavLink
                      to="#"
                      className={`group relative flex items-center gap-2.5 success rounded-sm px-4 py-2 text-black font-medium text-PrimaryRed hover:text-PrimaryRed duration-300 ease-in-out ${pathname === '/' || pathname.includes('dashboard')
                        ? 'bg-gray-100'
                        : ''
                        }`}
                      onClick={(e) => {
                        e.preventDefault();
                        sidebarExpanded
                          ? handleClick()
                          : setSidebarExpanded(true);
                      }}
                    >
                      <FaClipboardUser size={18} /> {/* Replace with user icon */}
                      User Requests
                      <svg
                        className={`absolute right-4 top-1/2 -translate-y-1/2 fill-current ${open && 'rotate-180'
                          }`}
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M4.41107 6.9107C4.73651 6.58527 5.26414 6.58527 5.58958 6.9107L10.0003 11.3214L14.4111 6.91071C14.7365 6.58527 15.2641 6.58527 15.5896 6.91071C15.915 7.23614 15.915 7.76378 15.5896 8.08922L10.5896 13.0892C10.2641 13.4147 9.73651 13.4147 9.41107 13.0892L4.41107 8.08922C4.08563 7.76378 4.08563 7.23614 4.41107 6.9107Z"
                          fill=""
                        />
                      </svg>
                    </NavLink>
                    <div
                      className={`translate transform overflow-hidden ${!open && 'hidden'
                        }`}
                    >
                      <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                        {/* Submenu Items */}
                        <li>
                          <NavLink
                            to="/VysAssist"
                            className={({ isActive }) =>
                              'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                              (isActive && '!text-PrimaryRed')
                            }
                          >
                            <GoDot />
                            Vys Assist
                          </NavLink>
                        </li>
                      </ul>
                      <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                        {/* Submenu Items */}
                        {hasPermission('email_send') && (
                          <li>
                            <NavLink
                              to="/mailerTool"
                              className={({ isActive }) =>
                                'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                                (isActive && '!text-PrimaryRed')
                              }
                            >
                              <GoDot />
                              Mailer Tool
                            </NavLink>
                          </li>
                        )}
                      </ul>
                    </div>
                    {/* Dropdown Menu End */}
                  </React.Fragment>
                )}
              </SidebarLinkGroup>
              {hasPermission('report_all') && (
                <div
                  className={`translate transform overflow-hidden ${!open && 'hidden'
                    }`}
                >
                  <ul className="mt-4 mb-5.5 flex flex-col">
                    {/* Submenu Items */}
                    <li>
                      <NavLink
                        to="/Reports"
                        className={({ isActive }) =>
                          'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-black hover:text-PrimaryRed duration-300 ease-in-out hover:text-PrimaryRed ' +
                          (isActive && '!text-PrimaryRed')
                        }
                      >
                        <IoDocumentTextOutline />
                        Reports
                      </NavLink>
                    </li>
                  </ul>
                </div>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

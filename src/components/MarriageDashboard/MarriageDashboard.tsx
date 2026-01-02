import React, { useState } from 'react';
import {
    CircularProgress,
    Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import { RiArrowDropDownLine } from 'react-icons/ri';

// --- Styles & Constants ---
const DASHBOARD_CONTAINER = "bg-white rounded-xl border border-[#E3E6EE] p-7 shadow-sm mb-8";
const HEADER_TEXT = "text-base font-semibold text-[#0A1735] mb-4 flex items-center gap-2";
const BTN_DARK = "bg-[#0A1735] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-[#1f2d50] transition shadow-sm border-none cursor-pointer";
const BTN_OUTLINE = "bg-white border border-gray-300 text-[#0A1735] px-6 py-2 rounded-full font-semibold text-sm hover:bg-gray-50 transition shadow-sm cursor-pointer";

const MarriageDashboard: React.FC = () => {
    const [tableLoading] = useState(false);

    const KPICard = ({ label, value, colorClass }: { label: string, value: string | number, colorClass: string }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className={`${colorClass} p-5 rounded-2xl min-h-[140px] border border-[#E3E6EE] flex flex-col justify-center cursor-pointer transition shadow-sm`}
        >
            <h6 className="text-[10px] font-bold mb-1 tracking-wider uppercase opacity-80 text-start">{label}</h6>
            <h2 className="text-3xl text-start font-bold mb-1">{value}</h2>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#F5F7FB] font-inter text-black p-4 md:p-8">

            {/* --- Header Section --- */}
            <header className="flex flex-wrap justify-between items-start mb-6 gap-4">
                <div className="text-left">
                    <h2 className="text-2xl font-bold mb-1 text-[#0A1735]">Marriage Dashboard</h2>
                </div>
            </header>

            {/* --- Filters Section (NON-STICKY) --- */}
            <section className="mb-8"> {/* Removed sticky top-0 z-30 */}
                <div className="bg-white rounded-xl border border-[#E3E6EE] p-7 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-start flex-1 min-w-[200px]">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Particulars</label>
                            <div className="relative">
                                <select className="w-full h-12 px-3 pr-10 border border-gray-300 rounded-lg text-sm cursor-pointer appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-black">
                                    <option>Select Particulars</option>
                                    {/* <option>Marriage Date</option>
                                    <option>Engagement Date</option> */}
                                    <option value="1">Delete Date</option>
                                </select>
                                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                    <RiArrowDropDownLine size={30} className="text-gray-500" />
                                </div>
                            </div>
                        </div>

                        <div className="text-start">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">From Date</label>
                            <input type="date" className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="text-start">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">To Date</label>
                            <input type="date" className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        <div className="text-start flex-1 min-w-[200px]">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Owner</label>
                            <div className="relative">
                                <select className="w-full h-12 px-3 pr-10 border border-gray-300 rounded-lg text-sm cursor-pointer appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-black">
                                    <option>Select Owner</option>
                                </select>
                                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                    <RiArrowDropDownLine size={30} className="text-gray-500" />
                                </div>
                            </div>
                        </div>
                        <div className="text-start">
                            <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Profile ID</label>
                            <input type="text" className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                        </div>
                        
                    </div>
                    <div className="flex justify-end gap-3 mt-6">

                            <button className={BTN_OUTLINE}>Reset</button>
                            <button className={BTN_DARK}>Apply Filters</button>
                        </div>
                </div>
            </section>

            <div className="space-y-8 ">
                <div className="bg-white rounded-xl border border-[#E3E6EE] p-7 shadow-sm mb-8">

                    {/* 🔢 OVERALL SUMMARY WITH INSTRUCTIONAL NOTE */}
                    <div className={DASHBOARD_CONTAINER}>
                        {/* <h3 className={HEADER_TEXT}>Overall Today Summary</h3> */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                            <KPICard label="Total" value="38" colorClass="bg-white" />
                            <KPICard label="Premium - TN/OTH" value="12" colorClass="bg-white" />
                            <KPICard label="Free + Offer - TN/OTH" value="26" colorClass="bg-white" />
                            <KPICard label="Prospect - TN/OTH" value="9" colorClass="bg-white" />
                            {/* <KPICard label="Total Assigned Work" value="44" colorClass="bg-white" />
                        <KPICard label="Total Other Assigned Work" value="7" colorClass="bg-white" /> */}
                        </div>
                        {/* Added the requested line below */}
                        {/* <p className="text-[11px] text-gray-400 mt-3">
                        Click any total KPI → Shows ALL dashboard records together
                    </p> */}
                    </div>

                    {/* 🔁 RENEWAL DASHBOARD */}
                    <div className={DASHBOARD_CONTAINER}>
                        {/* <h3 className={HEADER_TEXT}>🔁 Renewal Dashboard</h3> */}
                        <h3 className={HEADER_TEXT}> Premium - Settlement Type</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            <KPICard label="Thru Vysyamala" value="12" colorClass="bg-[#F0FDF4]" />
                            <KPICard label="Others" value="6" colorClass="bg-[#F0FDF4]" />
                            <KPICard label="Both IDS" value="8" colorClass="bg-[#F0FDF4]" />
                            <KPICard label="Single ID" value="5" colorClass="bg-[#F0FDF4]" />
                            {/* <KPICard label="Ren-AW" value="9" colorClass="bg-[#F0FDF4]" /> */}
                        </div>
                    </div>

                    {/* 📝 REGISTRATION DASHBOARD */}
                    <div className={DASHBOARD_CONTAINER}>
                        <h3 className={HEADER_TEXT}>Total - FOP(Free + Offer + Prospect)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            <KPICard label="Thru Vysyamala" value="12" colorClass="bg-[#F1F7FF]" />
                            <KPICard label="Others" value="6" colorClass="bg-[#F1F7FF]" />
                            <KPICard label="Both IDS" value="8" colorClass="bg-[#F1F7FF]" />
                            <KPICard label="Single ID" value="5" colorClass="bg-[#F1F7FF]" />
                            {/* <KPICard label="Reg-AW" value="6" colorClass="bg-[#F0FDF4]" /> */}
                        </div>
                    </div>

                    <div className={DASHBOARD_CONTAINER}>
                        <h3 className={HEADER_TEXT}>Status</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            <KPICard label="Upcoming Marriage" value="14" colorClass="bg-orange-50" />
                            <KPICard label="Present Month Marriage" value="9" colorClass="bg-orange-50" />
                        </div>
                    </div>

                    <div className={DASHBOARD_CONTAINER}>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">

                            <KPICard
                                label="M.Date Not Entered"
                                value="5"
                                colorClass="bg-purple-50 border-purple-200"
                            />

                            <KPICard
                                label="E.Date Not Entered"
                                value="2"
                                colorClass="bg-red-50 border-red-200"
                            />

                            <KPICard
                                label="M.Photo / E.Photo Not Received"
                                value="4"
                                colorClass="bg-[#F5F3FF]"
                            />

                            <KPICard
                                label="Card Accepted / Rejected"
                                value="1"
                                colorClass="bg-blue-50 border-blue-200"
                            />

                            <KPICard
                                label="Instagram Interested"
                                value="3"
                                colorClass="bg-pink-50 border-pink-200"
                            />

                            <KPICard
                                label="Today’s Work"
                                value="5"
                                colorClass="bg-green-50 border-green-200"
                            />

                            <KPICard
                                label="Pending Work"
                                value="2"
                                colorClass="bg-orange-50 border-orange-200"
                            />

                            <KPICard
                                label="Today’s Action"
                                value="4"
                                colorClass="bg-indigo-50 border-indigo-200"
                            />

                            <KPICard
                                label="Pending Action"
                                value="1"
                                colorClass="bg-rose-50 border-rose-200"
                            />

                            <KPICard
                                label="Assigned Work"
                                value="3"
                                colorClass="bg-teal-50 border-teal-200"
                            />

                        </div>
                    </div>

                </div>

                {/* 📋 TABLE SECTION */}
                <section className="bg-white rounded-xl border border-[#e6ecf2] shadow-md p-6 mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h5 className="text-lg font-semibold text-[#0A1735]">📋List View (1)</h5>
                    </div>

                    <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                        <table className="min-w-full border-separate border-spacing-0 table-auto">
                            <thead className="sticky top-0 z-20 bg-gray-50">
                                <tr>
                                    {[
                                        "Profile ID",
                                        "Deleted Date",
                                        "Name",
                                        "Age",
                                        "Mode",
                                        "State",
                                        "City",
                                        "Owner",
                                        "Marriage Date",
                                        "Engagement Date",
                                        "Groom/Bride ID",
                                        "Groom/Bride Name",
                                        "Groom/Bride City",
                                        "Groom/Bride Father Name",
                                        "Marriage Settled Thru",
                                        "Marriage Photo",
                                        "Engagement Photo",
                                        "Marriage Invitation",
                                        "Marriage Location",
                                        "Marriage Comments",
                                        "Admin Marriage Comments",
                                        "LCD (Last Call Date)",
                                        "Last Call Comments",
                                        "NCD (Next Call Date)",
                                    ].map((col) => (
                                        <th
                                            key={col}
                                            className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1] whitespace-nowrap"
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="hover:bg-gray-50">
                                    <td className="px-3 py-3 text-sm font-bold text-blue-600 border border-[#e5ebf1]">VYS12345</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">12-08-2025</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">John Doe</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">28</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Online</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Tamil Nadu</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Chennai</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Admin</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">20-08-2025</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">18-08-2025</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">VYS54321</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Jane Doe</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Madurai</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Mr. Kumar</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Office</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Yes</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Yes</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Yes</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Chennai</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">All confirmed</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Approved by admin</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">10-08-2025</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Spoke to family</td>
                                    <td className="px-3 py-3 text-sm border border-[#e5ebf1]">25-08-2025</td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                </section>
            </div>
        </div >
    );
};

export default MarriageDashboard;
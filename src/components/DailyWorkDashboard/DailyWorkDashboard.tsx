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

const DailyWorkDashboard: React.FC = () => {
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
                    <h2 className="text-2xl font-bold mb-1 text-[#0A1735]">Daily Work Dashboard</h2>
                </div>
            </header>

            {/* --- Filters Section (NON-STICKY) --- */}
            <section className="mb-8"> {/* Removed sticky top-0 z-30 */}
                <div className="bg-white rounded-xl border border-[#E3E6EE] p-7 shadow-sm flex flex-wrap gap-4 items-end">
                    <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">Staff</label>
                        <div className="relative">
                            <select className="w-[300px] h-12 px-3 pr-10 border border-gray-300 rounded-lg text-sm cursor-pointer appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-black">
                                <option>All Staff (Admin)</option>
                                <option>Logged-in Staff</option>
                            </select>
                            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                                <RiArrowDropDownLine size={30} className="text-gray-500" />
                            </div>
                        </div>
                    </div>
                    {/* <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">From Date</label>
                        <input type="date" className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                    </div>
                    <div className="text-start">
                        <label className="block text-sm font-semibold text-[#3A3E47] mb-1">To Date</label>
                        <input type="date" className="w-full h-12 px-3 border border-gray-300 rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500" />
                    </div> */}
                    {/* <div className="flex gap-3 h-12">
                        <button className={BTN_OUTLINE}>Reset</button>
                        <button className={BTN_DARK}>Apply Filters</button>
                    </div> */}
                </div>
            </section>

            {/* 📊 PERFORMANCE HEADER */}
            {/* <div className={DASHBOARD_CONTAINER}>
                <div className="flex justify-between items-center mb-2">
                    <h2 className="font-bold text-lg text-[#0A1735]">Today’s Performance</h2>
                    <span className="text-[#129f46] font-bold text-xl">72%</span>
                </div>
                <div className="w-full bg-[#F1F5F9] rounded-full h-3 overflow-hidden">
                    <div className="bg-[#129f46] h-3 rounded-full" style={{ width: '72%' }}></div>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 italic">
                    (Completed Work + Completed Actions) ÷ Total Assigned × 100
                </p>
            </div> */}

            <div className="space-y-8">

                {/* 🔢 OVERALL SUMMARY WITH INSTRUCTIONAL NOTE */}
                <div className={DASHBOARD_CONTAINER}>
                    <h3 className={HEADER_TEXT}>Overall Today Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                        <KPICard label="Total Today Call Work" value="38" colorClass="bg-white" />
                        <KPICard label="Total Today Pending Work" value="12" colorClass="bg-white" />
                        <KPICard label="Total Action Work" value="26" colorClass="bg-white" />
                        <KPICard label="Total Pending Action" value="9" colorClass="bg-white" />
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
                    <h3 className={HEADER_TEXT}>🔁 Renewal Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <KPICard label="Ren-TW" value="12" colorClass="bg-[#F1F7FF]" />
                        <KPICard label="Ren-PW" value="6" colorClass="bg-[#F1F7FF]" />
                        <KPICard label="Ren-TA" value="8" colorClass="bg-[#F1F7FF]" />
                        <KPICard label="Ren-PA" value="5" colorClass="bg-[#F1F7FF]" />
                        {/* <KPICard label="Ren-AW" value="9" colorClass="bg-[#F1F7FF]" /> */}
                    </div>
                </div>

                {/* 📝 REGISTRATION DASHBOARD */}
                <div className={DASHBOARD_CONTAINER}>
                    <h3 className={HEADER_TEXT}>📝 Registration Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <KPICard label="Reg-TW" value="10" colorClass="bg-[#F0FDF4]" />
                        <KPICard label="Reg-PW" value="4" colorClass="bg-[#F0FDF4]" />
                        <KPICard label="Reg-TA" value="7" colorClass="bg-[#F0FDF4]" />
                        <KPICard label="Reg-PA" value="3" colorClass="bg-[#F0FDF4]" />
                        {/* <KPICard label="Reg-AW" value="6" colorClass="bg-[#F0FDF4]" /> */}
                    </div>
                </div>

                {/* 🔎 PROSPECT DASHBOARD */}
                <div className={DASHBOARD_CONTAINER}>
                    <h3 className={HEADER_TEXT}>🔎 Prospect Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <KPICard label="Pro-TW" value="14" colorClass="bg-orange-50" />
                        <KPICard label="Pro-PW" value="9" colorClass="bg-orange-50" />
                        <KPICard label="Pro-TA" value="11" colorClass="bg-orange-50" />
                        <KPICard label="Pro-PA" value="6" colorClass="bg-orange-50" />
                        {/* <KPICard label="Pro-AW" value="8" colorClass="bg-orange-50" /> */}
                    </div>
                </div>

                {/* 💎 PREMIUM DASHBOARD */}
                <div className={DASHBOARD_CONTAINER}>
                    <h3 className={HEADER_TEXT}>💎 Premium Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        <KPICard label="Pre-TW" value="5" colorClass="bg-purple-50" />
                        <KPICard label="Pre-PW" value="2" colorClass="bg-purple-50" />
                        <KPICard label="Pre-TA" value="4" colorClass="bg-purple-50" />
                        <KPICard label="Pre-PA" value="1" colorClass="bg-purple-50" />
                        {/* <KPICard label="Pre-AW" value="3" colorClass="bg-purple-50" /> */}
                    </div>
                </div>

                {/* 🗑 DELETE DASHBOARD */}
                {/* <div className={DASHBOARD_CONTAINER}>
                    <h3 className="text-base font-semibold text-[#ef4444] mb-4 flex items-center gap-2">🗑 Delete Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <KPICard label="Today Deleted" value="3" colorClass="bg-[#FFECEC]" />
                        <KPICard label="Pending Deleted" value="5" colorClass="bg-[#FFECEC]" />
                    </div>
                </div> */}

                {/* 💍 MARRIAGE SETTLED DASHBOARD */}
                {/* <div className={DASHBOARD_CONTAINER}>
                    <h3 className="text-base font-semibold text-[#db2777] mb-4 flex items-center gap-2">💍 Marriage Settled Dashboard</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                        <KPICard label="Today Settled" value="2" colorClass="bg-[#FFF1F2]" />                         <KPICard label="Pending Follow-ups" value="4" colorClass="bg-[#FFF1F2]" />
                        <KPICard label="Assigned Cases" value="6" colorClass="bg-[#FFF1F2]" />
                    </div>
                </div> */}
            </div>

            {/* 📋 TABLE SECTION */}
            <section className="bg-white rounded-xl border border-[#e6ecf2] shadow-md p-6 mt-8">
                <div className="flex justify-between items-center mb-6">
                    <h5 className="text-lg font-semibold text-[#0A1735] flex items-center gap-2">
                        📋 All Work List
                    </h5>
                    <button className="border border-[#b3b5b7] hover:bg-[#dfe0e1] text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-gray-50 transition shadow-sm">
                        Export
                    </button>
                </div>

                <div className="overflow-x-auto overflow-y-auto max-h-[500px]">
                    <table className="min-w-full border-separate border-spacing-0 table-auto">
                        <thead className="sticky top-0 z-20 bg-gray-50">
                            <tr>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Profile ID</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Name</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Dashboard</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Work Type</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Owner</th>
                                <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase border border-[#e5ebf1]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-gray-50">
                                <td className="px-3 py-3 text-sm font-bold text-blue-600 border border-[#e5ebf1]">VYS12345</td>
                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">John Doe Sample</td>
                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">
                                    <span className="px-2 py-0.5 bg-[#FFF6E4] text-[#ff8c00] rounded-full text-[10px] font-bold">PROSPECT</span>
                                </td>
                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Today Call</td>
                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">Admin</td>
                                <td className="px-3 py-3 text-sm border border-[#e5ebf1]">
                                    <span className="px-2 py-0.5 bg-[#F7F7F7] text-[#6b7280] rounded-full text-[10px] font-bold uppercase">Pending</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div >
    );
};

export default DailyWorkDashboard;
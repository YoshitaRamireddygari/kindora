import React from 'react';
import { motion } from 'framer-motion';
import { FaChartBar, FaDownload } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminReports() {
    const data = [
        { name: 'Jan', donations: 400, requests: 240 },
        { name: 'Feb', donations: 300, requests: 139 },
        { name: 'Mar', donations: 200, requests: 980 },
        { name: 'Apr', donations: 278, requests: 390 },
        { name: 'May', donations: 189, requests: 480 },
        { name: 'Jun', donations: 239, requests: 380 },
        { name: 'Jul', donations: 349, requests: 430 },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-7xl mx-auto">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Analytics & Reports</h2>
                    <p className="text-gray-500 mt-1">Detailed view of platform metrics.</p>
                </div>
                <button 
                    onClick={() => window.print()}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary transition-colors shadow-md"
                >
                    <FaDownload /> Export PDF
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-lg mb-6">Donation Trends</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip />
                                <Area type="monotone" dataKey="donations" stroke="#7c3aed" fillOpacity={1} fill="url(#colorDonations)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-lg mb-6">NGO Request Fulfillment</h3>
                    <div className="flex-1 min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <RechartsTooltip />
                                <Bar dataKey="requests" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

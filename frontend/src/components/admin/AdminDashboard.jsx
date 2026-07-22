import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/api';
import { motion } from 'framer-motion';
import { FaGift, FaUsers, FaBuilding, FaCheckCircle, FaDownload } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard({ setActiveTab }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminService.getDashboardStats();
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
        const intervalId = setInterval(fetchStats, 5000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading || !stats) return <div className="p-8">Loading dashboard...</div>;

    const COLORS = ['#7c3aed', '#3b82f6', '#f59e0b', '#10b981', '#ec4899'];

    return (
        <div className="p-2 space-y-6 max-w-[1400px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome back, Admin! 👋</h2>
                    <p className="text-gray-500 mt-1">Here's what's happening on Kindora today.</p>
                </div>
                <button 
                    onClick={() => window.print()}
                    className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold flex items-center space-x-2 hover:bg-secondary transition-colors shadow-md"
                >
                    <FaDownload /> <span>Export Report</span>
                </button>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 font-medium mb-2">Total Donations</h3>
                            <p className="text-4xl font-bold text-primary">{stats.totalDonations}</p>
                            <p className="text-green-500 text-sm mt-3 flex items-center font-medium">
                                ↑ 12.5% <span className="text-gray-400 ml-1">this month</span>
                            </p>
                        </div>
                        <div className="bg-primary/10 p-4 rounded-full text-primary">
                            <FaGift className="text-2xl" />
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 font-medium mb-2">Total Users</h3>
                            <p className="text-4xl font-bold text-blue-500">{stats.totalUsers}</p>
                            <p className="text-green-500 text-sm mt-3 flex items-center font-medium">
                                ↑ 8.2% <span className="text-gray-400 ml-1">this month</span>
                            </p>
                        </div>
                        <div className="bg-blue-500/10 p-4 rounded-full text-blue-500">
                            <FaUsers className="text-2xl" />
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 font-medium mb-2">Total NGOs</h3>
                            <p className="text-4xl font-bold text-orange-500">{stats.totalNgos}</p>
                            <p className="text-green-500 text-sm mt-3 flex items-center font-medium">
                                ↑ 4.1% <span className="text-gray-400 ml-1">this month</span>
                            </p>
                        </div>
                        <div className="bg-orange-500/10 p-4 rounded-full text-orange-500">
                            <FaBuilding className="text-2xl" />
                        </div>
                    </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-500 font-medium mb-2">Completed Donations</h3>
                            <p className="text-4xl font-bold text-green-500">{stats.completedDonations}</p>
                            <p className="text-green-500 text-sm mt-3 flex items-center font-medium">
                                ↑ 15.3% <span className="text-gray-400 ml-1">this month</span>
                            </p>
                        </div>
                        <div className="bg-green-500/10 p-4 rounded-full text-green-500">
                            <FaCheckCircle className="text-2xl" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">Donations Overview</h3>
                        <select className="bg-gray-50 border-none outline-none text-sm text-gray-500 py-1 px-3 rounded-lg font-medium cursor-pointer">
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>This Year</option>
                        </select>
                    </div>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.monthlyDonationStats} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                                <RechartsTooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="donations" stroke="#7c3aed" strokeWidth={3} fillOpacity={1} fill="url(#colorDonations)" activeDot={{ r: 6, fill: '#7c3aed', stroke: '#fff', strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Pie Chart */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 text-lg mb-2">Donations by Category</h3>
                    <div className="flex h-full flex-col justify-center pb-6">
                        <div className="h-[200px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.donationCategoryStats}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {stats.donationCategoryStats.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-gray-800">{stats.totalDonations}</span>
                                <span className="text-xs text-gray-500">Total</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-4 px-4">
                            {stats.donationCategoryStats.map((entry, index) => (
                                <div key={entry.name} className="flex items-center justify-between text-xs font-medium">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-gray-600">{entry.name}</span>
                                    </div>
                                    <span className="text-gray-400">{entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Lists Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Donations */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">Recent Donations</h3>
                        <button onClick={() => setActiveTab && setActiveTab('DONATIONS_MGMT')} className="text-primary bg-primary/5 hover:bg-primary/10 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">View All Details</button>
                    </div>
                    <div className="space-y-4">
                        {(!stats.recentDonations?.length) ? (
                            <p className="text-gray-500 text-sm">No recent donations.</p>
                        ) : stats.recentDonations.map((donation, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl">
                                        <FaGift />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{donation.category} Donation</p>
                                        <p className="text-xs text-gray-500">Donation ID: {donation.id?.substring(0, 8)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <span className="text-xs text-gray-400">Recently</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold w-20 text-center ${
                                        donation.status === 'ACCEPTED' ? 'bg-green-100 text-green-600' :
                                        donation.status === 'PENDING' ? 'bg-orange-100 text-orange-500' :
                                        'bg-blue-100 text-blue-600'
                                    }`}>
                                        {donation.status || 'Pending'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Users */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">Recent Users</h3>
                        <button className="text-primary bg-primary/5 hover:bg-primary/10 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">View All</button>
                    </div>
                    <div className="space-y-4">
                        {(!stats.recentUsers?.length) ? (
                            <p className="text-gray-500 text-sm">No recent users.</p>
                        ) : stats.recentUsers.map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold">
                                        {u.name?.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{u.name}</p>
                                        <p className="text-xs text-gray-500">{u.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <span className="text-xs text-gray-400">Recently</span>
                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-500 w-20 text-center">
                                        Active
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

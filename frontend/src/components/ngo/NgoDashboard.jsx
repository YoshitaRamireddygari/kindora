import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaBox, FaHandHoldingHeart, FaUsers, FaChartPie, FaListAlt } from 'react-icons/fa';
import { ngoService } from '../../services/api';

export default function NgoDashboard({ user, setActiveTab }) {
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        if (!user || !user.id) return;
        const fetchStats = async () => {
            try {
                const res = await ngoService.getDashboardStats(user.id);
                setDashboardData(res.data);
            } catch (err) {
                console.error("Failed to fetch NGO stats", err);
            }
        };

        fetchStats(); // Initial fetch
        const intervalId = setInterval(fetchStats, 5000); // Poll every 5s

        return () => clearInterval(intervalId);
    }, [user]);

    const stats = dashboardData ? [
        { label: 'Total Requests', value: dashboardData.totalRequests, trend: '+12% this month', color: 'text-primary' },
        { label: 'Accepted Donations', value: dashboardData.acceptedDonations, trend: '+9% this month', color: 'text-blue-500' },
        { label: 'Items Received', value: dashboardData.itemsReceived, trend: '+15% this month', color: 'text-green-500' },
        { label: 'Beneficiaries Helped', value: dashboardData.beneficiariesHelped, trend: '+18% this month', color: 'text-pink-500' },
    ] : [
        { label: 'Total Requests', value: '...', trend: '...', color: 'text-primary' },
        { label: 'Accepted Donations', value: '...', trend: '...', color: 'text-blue-500' },
        { label: 'Items Received', value: '...', trend: '...', color: 'text-green-500' },
        { label: 'Beneficiaries Helped', value: '...', trend: '...', color: 'text-pink-500' },
    ];

    const recentActivities = dashboardData?.recentActivity || [];
    const overview = dashboardData?.donationOverview || [];
    
    // For rendering overview dots
    const overviewColors = { "Pending": "bg-red-500", "Accepted": "bg-blue-500", "Completed": "bg-purple-500" };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Welcome back, {user?.name || 'Helping Hands NGO'}! 👋</h2>
                    <p className="text-gray-500 mt-1">Here's what's happening today.</p>
                </div>
                <button 
                    onClick={() => setActiveTab('DONATION_REQUESTS')}
                    className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-secondary transition-colors flex items-center gap-2 shadow-sm"
                >
                    <FaPlus /> Request Donation
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-36">
                        <p className="text-gray-500 text-sm font-semibold">{stat.label}</p>
                        <h3 className={`text-4xl font-bold ${stat.color} my-2`}>{stat.value}</h3>
                        <p className="text-green-500 text-xs font-semibold">{stat.trend}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
                {/* Recent Activity */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 lg:col-span-2 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-xl">Recent Activity</h3>
                        <button className="text-primary font-medium text-sm hover:underline">View All</button>
                    </div>
                    <div className="space-y-6 flex-1">
                        {recentActivities.map((activity, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${activity.bg || 'bg-blue-100 text-blue-500'}`}>
                                        <FaBox />
                                    </div>
                                    <p className="font-medium text-gray-700">{activity.text}</p>
                                </div>
                                <span className="text-sm text-gray-400">{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donations Overview */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-xl">Donations Overview</h3>
                        <select className="bg-gray-50 text-sm border-none rounded-lg p-2 text-gray-600 focus:outline-none">
                            <option>This Month</option>
                        </select>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        {/* Placeholder for Donut Chart */}
                        <div className="relative w-48 h-48 mb-6">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#f3f4f6" strokeWidth="15" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#ff4757" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="168" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#2ed573" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="200" transform="rotate(120 50 50)" />
                                <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e90ff" strokeWidth="15" strokeDasharray="251.2" strokeDashoffset="210" transform="rotate(220 50 50)" />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-gray-500 text-sm font-semibold">Total</span>
                                <span className="text-3xl font-bold text-gray-800">{dashboardData?.totalRequests || 0}</span>
                            </div>
                        </div>
                        
                        <div className="w-full space-y-3">
                            {overview.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2"><div className={`w-3 h-3 rounded-full ${overviewColors[item.name] || 'bg-gray-500'}`}></div><span className="text-gray-600">{item.name}</span></div>
                                    <span className="font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
